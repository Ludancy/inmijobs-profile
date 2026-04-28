import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'

export const Route = createFileRoute('/(private)/friends')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-linear-to-br from-[#FFF3E6] to-[#F3E8FF] h-[calc(100vh-64px)] flex items-center justify-center p-8">
      <div className="bg-white/80 backdrop-blur-md border border-[#E5E7EB] rounded-3xl shadow-xl p-12 max-w-lg w-full text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-6 shadow-sm ring-4 ring-white">
          <Users className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Red y Amigos</h1>
        <p className="text-gray-500 text-lg mb-8">
          La gestión de tu red de contactos está en construcción. Pronto podrás invitar amigos, aceptar solicitudes y hacer crecer tu red profesional.
        </p>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-500 to-rose-600 w-1/3 animate-pulse"></div>
        </div>
        <p className="text-sm font-semibold text-rose-600 mt-4 uppercase tracking-widest">Próximamente</p>
      </div>
    </div>
  )
}
