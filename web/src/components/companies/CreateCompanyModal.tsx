import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { companiesService } from '@/services/companiesService'
import { Button } from '@/components/ui/button'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const CreateCompanyModal = ({ isOpen, onClose }: Props) => {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sector, setSector] = useState('')
  const [weblink, setWeblink] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setName(''); setDescription(''); setSector(''); setWeblink(''); setError(null)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const mutation = useMutation({
    mutationFn: () =>
      companiesService.createCompany({ name, description, sector, weblink }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      onClose()
    },
    onError: () => setError('No se pudo crear la compañía. Intenta de nuevo.'),
  })

  if (!isOpen) return null

  const canCreate = name.trim().length > 0 && !mutation.isPending

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto relative flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Nueva Compañía</h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Nombre *
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: TechCorp"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Sector
            <input
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: Tecnología"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Sitio web
            <input
              value={weblink}
              onChange={(e) => setWeblink(e.target.value)}
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://..."
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Descripción
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-[80px] resize-none rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={mutation.isPending}>
            Cancelar
          </Button>
          <Button
            className="bg-[#F97316] hover:bg-[#EA580C] text-white"
            onClick={() => mutation.mutate()}
            disabled={!canCreate}
          >
            {mutation.isPending ? 'Creando...' : 'Crear Compañía'}
          </Button>
        </div>
      </div>
    </div>
  )
}
