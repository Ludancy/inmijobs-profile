import { createFileRoute } from '@tanstack/react-router'
import { MessageSquare } from 'lucide-react'

export const Route = createFileRoute('/(private)/messages')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-linear-to-br from-[#FFF3E6] to-[#F3E8FF] h-[calc(100vh-64px)] flex items-center justify-center p-8">
      <div className="bg-white/80 backdrop-blur-md border border-[#E5E7EB] rounded-3xl shadow-xl p-12 max-w-lg w-full text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-sm ring-4 ring-white">
          <MessageSquare className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Mensajes</h1>
        <p className="text-gray-500 text-lg mb-8">
          La bandeja de entrada está en construcción. Muy pronto podrás enviar y recibir mensajes directos con tus conexiones y empresas.
        </p>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-1/3 animate-pulse"></div>
        </div>
        <p className="text-sm font-semibold text-purple-600 mt-4 uppercase tracking-widest">Próximamente</p>
      </div>
    </div>
  )
}
