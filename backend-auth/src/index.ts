import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { auth } from "../auth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "../env";

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: (origin) => origin, // Permite cualquier origin (útil para URLs dinámicas de Vercel)
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-User-Agent",
      "Accept"
    ],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);


app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

const getValidSession = async (headers: Headers) => {
  try {
    const session = await auth.api.getSession({ headers });
    return session;
  } catch (error) {
    return null;
  }
};

app.all("*", async (c) => {
  const headers = new Headers(c.req.raw.headers);

  // 👇 LÍNEAS NUEVAS: Limpiamos los encabezados problemáticos
  headers.delete("connection");
  headers.delete("host"); // El host debe ser localhost:8080, no el original
  headers.delete("content-length"); // fetch calculará esto automáticamente si hay un body
  // 👆 FIN DE LÍNEAS NUEVAS

  const sessionData = await getValidSession(headers);
  if (sessionData && sessionData.user) {
    // Si la sesión es válida, le pasamos la identidad directamente a Go
    headers.append("X-User-Id", sessionData.user.id);
  }

  headers.delete("content-length");
  let bodyBuffer;
  if (c.req.method !== "GET" && c.req.method !== "HEAD") {
    try {
      bodyBuffer = await c.req.arrayBuffer();
    } catch (e) {
      // Ignorar si no hay body
    }
  }

  const fetchOptions: any = {
    method: c.req.method,
    headers: headers,
    body: bodyBuffer && bodyBuffer.byteLength > 0 ? bodyBuffer : undefined,
  };

  const targetUrl = `${env.BACKEND_CORE_URL}${c.req.path}`;
  const res = await fetch(targetUrl, fetchOptions);

  const responseHeaders = new Headers(res.headers);
  // Node's fetch automatically decompresses the body, so we must remove the encoding header
  // to prevent the browser from trying to decompress it again.
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
});

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
