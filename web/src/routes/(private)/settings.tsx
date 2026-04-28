import { createFileRoute } from '@tanstack/react-router'
import { Settings } from 'lucide-react'

export const Route = createFileRoute('/(private)/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-linear-to-br from-[#FFF3E6] to-[#F3E8FF] h-[calc(100vh-64px)] flex items-center justify-center p-8">
      <div className="bg-white/80 backdrop-blur-md border border-[#E5E7EB] rounded-3xl shadow-xl p-12 max-w-lg w-full text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mb-6 shadow-sm ring-4 ring-white">
          <Settings className="w-10 h-10 animate-spin-slow" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Configuración</h1>
        <p className="text-gray-500 text-lg mb-8">
          El panel de ajustes de tu cuenta está en construcción. Aquí podrás gestionar tu privacidad, notificaciones y opciones de seguridad muy pronto.
        </p>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gray-500 to-slate-800 w-1/3 animate-pulse"></div>
        </div>
        <p className="text-sm font-semibold text-slate-800 mt-4 uppercase tracking-widest">Próximamente</p>
      </div>
    </div>
  )
}
