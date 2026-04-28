import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import type { JobFilters } from '@/models/jobs';
import { JobCard } from '@/components/jobs/JobCard';
import JobDetailView from '@/components/jobs/JobDetailView';
import { CreateJobModal } from '@/components/jobs/modals/CreateJobModal';
import { MyJobsModal } from '@/components/jobs/modals/MyJobsModal';
import { useJobs } from '@/hooks/jobs';
import { ScrollArea } from '@/components/ui/scroll-area';
import JobsSearchFilter from '@/components/jobs/JobsSearchFilter';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth';
import { companiesService } from '@/services/companiesService';

export const Route = createFileRoute('/(private)/jobs')({
  component: RouteComponent,
})

function RouteComponent() {
  const [filters, setFilters] = useState<JobFilters>({})
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useJobs({ ...filters, page, pageSize: 10 })

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeJob = data?.data.jobs.find(job => job.id === selectedId);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMyJobsModalOpen, setIsMyJobsModalOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const userId = session?.user.id;

  console.log(session);

  const { data: companiesData } = useQuery({
    queryKey: ['companies', { userId }],
    queryFn: () => companiesService.getCompanies({ userId }),
    enabled: Boolean(userId),
  })
  

  const companies = companiesData?.data?.data ?? [];
  const hasCompany = companies.length > 0;

  useEffect(() => {
    if (data?.data.jobs.length) {
      setSelectedId(data.data.jobs[0]?.id || null);
    }
  }, [data])

  const actionButtons = useMemo(() => (
    <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between pb-4">
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!hasCompany}
        >
          Publicar Empleo
        </Button>
        <Button
          variant="secondary"
          onClick={() => setIsMyJobsModalOpen(true)}
        >
          Mis Publicaciones
        </Button>
      </div>
      {!hasCompany && (
        <p className="text-xs text-gray-500">
          Necesitas tener una empresa asociada para publicar empleos.
        </p>
      )}
    </div>
  ), [hasCompany])

  return (
    <div className="bg-linear-to-br from-[#FFF3E6] to-[#F3E8FF] h-[calc(100vh-64px)] p-4 md:p-8 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col gap-4">
        <JobsSearchFilter jobFilters={filters} onChange={(newFiltes) => {
          setFilters(newFiltes);
          setPage(1);
        }}
        />

        {actionButtons}

        <div className="flex w-full flex-1 rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
          {data?.data.jobs.length ? (<>
          <div className="h-[calc(100%-64px)]">
            <ScrollArea className="h-full border-r border-[#E5E7EB]">
              <div className="flex flex-col gap-px bg-[#E5E7EB]">
                {data.data.jobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSelect={setSelectedId}
                    selected={job.id === selectedId}
                  />
                ))}
              </div>
            </ScrollArea>
            <div className="h-16 border-t border-[#E5E7EB] flex items-center p-2 gap-2">
              <Button className="flex-1 cursor-pointer" variant="secondary" disabled={page === 1} onClick={() => setPage(prev => Math.max(prev - 1, 1))}>
                Anterior
              </Button>
              <div className="flex-2 text-center text-sm text-gray-500">
                Página {page} de {data.data.totalPages}
              </div>
              <Button className="flex-1 cursor-pointer" variant="secondary" disabled={page === data.data.totalPages} onClick={() => setPage(prev => Math.min(prev + 1, data.data.totalPages))}>
                Siguiente
              </Button>
            </div>
          </div>
          <JobDetailView job={activeJob} />
        </>
        ) :
          <div className="flex-1 bg-white flex items-center justify-center">
            <p className="text-gray-500">
              {isLoading ? 'Loading...' : isError ? 'Error loading jobs' : 'No jobs found'}
            </p>
          </div>
        }
      </div>
      </div>

      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        companies={companies}
      />

      <MyJobsModal
        isOpen={isMyJobsModalOpen}
        onClose={() => setIsMyJobsModalOpen(false)}
      />
    </div>)
}
