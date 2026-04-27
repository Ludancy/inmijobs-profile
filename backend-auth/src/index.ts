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
    origin: "http://localhost:3001",
    allowHeaders: [
      "Content-Type",
      "X-User-Agent",
    ],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);


app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

const getToken = async (headers: Headers) => {
  
  try {
    const { token } = await auth.api.getToken({ headers });
    console.log(" Token  con éxito:", token);
    return token;
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

  const token = await getToken(headers);
    console.log(" Token  con éxito:", token);
  if (token) {

    headers.append("Authorization", `Bearer ${token}`);
   
  }

  headers.delete("content-length");
  const fetchOptions: any = {
    method: c.req.method,
    headers: headers,
    body: c.req.method !== "GET" && c.req.method !== "HEAD" ? c.req.raw.body : undefined,
    duplex: 'half'
  };

  //if (c.req.method !== "GET" && c.req.method !== "HEAD") {
  //  fetchOptions.body = await c.req.text();
  //}

  const targetUrl = `${env.BACKEND_CORE_URL}${c.req.path}`;
  const res = await fetch(targetUrl, fetchOptions);

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
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
