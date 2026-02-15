import { MoreHorizontal, X, ThumbsUp, MessageCircle, Info } from 'lucide-react'
import { HeaderCreatePost } from './headerCreatePost'

export const Main = () => {
  return (
    <main className="flex flex-col gap-6 p-4 bg-gray-100">

      {/* 1. INPUT: ¿Qué estás pensando? */}
      <HeaderCreatePost />

      {/* 2. STORIES */}
      <section className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <section className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {/* Crear Historia */}
          <div className="min-w-[110px] w-[110px] h-[180px] flex-shrink-0 relative rounded-2xl overflow-hidden border border-gray-200 group cursor-pointer bg-gray-100">

            {/* Imagen de perfil del usuario (Fondo) */}
            <div className="h-[75%] w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop  "
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                alt="Tu perfil"
              />
              {/* Overlay oscuro suave para que resalte el botón */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            </div>

            {/* Parte inferior blanca */}
            <div className="absolute bottom-0 inset-x-0 h-[25%] bg-white flex flex-col items-center justify-end pb-2">
              {/* Botón Azul de Plus */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 p-1.5 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>

              <span className="text-[11px] font-semibold text-gray-800">Crear historia</span>
            </div>
          </div>

          {/* Aquí irían las historias de los demás... */}
        </section>
        <div className="min-w-[110px] w-[110px] h-[180px] shrink-0 relative rounded-2xl overflow-hidden cursor-pointer group bg-gray-200">

          {/* Imagen de fondo: object-cover evita la deformación */}
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=400&fit=crop"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            alt="Story"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

          {/* Avatar superior */}
          <div className="absolute top-2 left-2">
            <div className="border-2 border-blue-600 rounded-full p-[2px] bg-white">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=400&fit=crop"
                className="w-8 h-8 rounded-full object-cover"
                alt="Avatar"
              />
            </div>
          </div>

          <span className="absolute bottom-2 left-2 right-2 text-white text-[10px] font-bold leading-tight drop-shadow-md">
            No soy una multicuentas
          </span>
        </div>

      </section>

      {/* 3. POST: Ejemplo de la casa en Mérida */}
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        {/* Header del Post */}
        <div className="p-4 flex justify-between items-center"> {/* Cambiado items-start a center para mejor alineación */}
          <div className="flex gap-3 items-center">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=400&fit=crop"
              className="w-10 h-10 rounded-full object-cover border border-gray-100"
              alt="Logo"
            />
            <div>
              <h4 className="font-bold text-gray-800 text-sm leading-none mb-1">¿Qué hay Venezolana?</h4>
              <p className="text-[10px] text-gray-400">Vereshodloak · 🌎</p>
            </div>
          </div>
          <div className="flex gap-2 text-gray-400">
            <MoreHorizontal size={20} className="cursor-pointer hover:text-gray-600 transition-colors" />
            <X size={20} className="cursor-pointer hover:text-gray-600 transition-colors" />
          </div>
        </div>

        {/* Imágenes del Post: Grid Blindada */}
        <div className="grid grid-cols-3 gap-0.5 bg-gray-200 w-full">
          {/* Usamos w-full h-full para que llenen su celda de la grid */}
          <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/612539413.jpg?k=694c6b6a195695d8a7c92c6ba197401ff1505769d97c9d7844dde8154bfb32f7&o=" className="w-full aspect-square object-cover bg-gray-300" alt="Casa 1" />
          <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/405785137.jpg?k=185cdd5402bf9e37423490236ae3f5e350577a4a563d2a40d33aeefe7b4d634c&o=" className="w-full aspect-square object-cover bg-gray-300" alt="Casa 2" />
          <img src="https://www.corpovigui.com/exportacao/fotos/20210308T1814500400-261089679.jpg" className="w-full aspect-square object-cover bg-gray-300" alt="Casa 3" />
        </div>

        {/* Texto del Post */}
        <div className="p-4">
          <p className="text-sm text-gray-800 leading-relaxed">
            ¡Familia! ¿Listos para invertir? Casa en Mérida, full equipada.
            <span className="block mt-1 font-medium text-blue-600">¡Nuevo hogar, nuevas oportunidades!</span>
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-50 bg-gray-50/30">
          <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all active:scale-95">
            <div className="bg-blue-600 p-1 rounded-full shadow-sm">
              <ThumbsUp size={12} className="text-white fill-current" />
            </div>
            <span className="text-sm font-medium">Me gusta</span>
          </button>

          <div className="flex gap-2">
            <button className="p-2.5 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors rounded-full border border-blue-100 bg-white">
              <MessageCircle size={18} />
            </button>
            <button className="p-2.5 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors rounded-full border border-blue-100 bg-white">
              <Info size={18} />
            </button>
          </div>
        </div>
      </article>
    </main>
  )
}