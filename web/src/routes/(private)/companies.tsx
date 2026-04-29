import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth'
import { companiesService } from '@/services/companiesService'
import type { CompanyResponse } from '@/models/companies'
import { EditCompanyModal } from '@/components/companies/EditCompanyModal'
import { CreateCompanyModal } from '@/components/companies/CreateCompanyModal'
import { Button } from '@/components/ui/button'
import { Building2, Globe, Pencil } from 'lucide-react'

export const Route = createFileRoute('/(private)/companies')({
  component: RouteComponent,
})

const GUEST_EMAIL = 'invitado@inmijobs.com'

function RouteComponent() {
  const { data: session } = authClient.useSession()
  const userId = session?.user.id
  const isGuest = session?.user.email === GUEST_EMAIL

  const { data, isLoading, isError } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companiesService.getCompanies(),
  })

  const companies: CompanyResponse[] = data?.data?.data ?? []

  const [editingCompany, setEditingCompany] = useState<CompanyResponse | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div className="bg-linear-to-br from-[#FFF3E6] to-[#F3E8FF] min-h-[calc(100vh-64px)] p-8">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1F2937]">Compañías</h1>
          {!isGuest && (
            <Button
              className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold"
              onClick={() => setIsCreateOpen(true)}
            >
              Nueva Compañía
            </Button>
          )}
        </div>

        {isLoading && (
          <p className="text-gray-500 text-sm">Cargando compañías...</p>
        )}

        {isError && (
          <p className="text-red-500 text-sm">Error al cargar las compañías.</p>
        )}

        {!isLoading && !isError && companies.length === 0 && (
          <p className="text-gray-500 text-sm">No hay compañías registradas.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Building2 size={20} className="text-[#F97316]" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[#1F2937] leading-tight">{company.name}</p>
                    {company.sector && (
                      <p className="text-xs text-gray-500">{company.sector}</p>
                    )}
                  </div>
                </div>
                {!isGuest && company.userId === userId && (
                  <button
                    onClick={() => setEditingCompany(company)}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                    aria-label="Editar compañía"
                  >
                    <Pencil size={15} />
                  </button>
                )}
              </div>

              {company.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{company.description}</p>
              )}

              <div className="flex flex-wrap gap-2 mt-auto">
                {company.weblink && (
                  <a
                    href={company.weblink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#F97316] hover:underline"
                  >
                    <Globe size={12} />
                    Sitio web
                  </a>
                )}
                {company.size && (
                  <span className="text-xs text-gray-400">{company.size} empleados</span>
                )}
                {company.foundation && (
                  <span className="text-xs text-gray-400">Desde {company.foundation}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditCompanyModal
        company={editingCompany}
        onClose={() => setEditingCompany(null)}
      />

      {!isGuest && (
        <CreateCompanyModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </div>
  )
}
