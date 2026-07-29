import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { assignGrievanceHandler, closeGrievanceCase, listAllGrievanceCases, resolveGrievanceCase } from "../../lib/api/helpdesk";
import { GrievanceAdminRow } from "./GrievanceAdminRow";

/** org_admin/hr_ops only — confidential, never visible to general helpdesk agents. */
export function GrievanceCaseAdminPanel() {
  const queryClient = useQueryClient();
  const cases = useQuery({ queryKey: ["grievance-cases-admin"], queryFn: listAllGrievanceCases });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["grievance-cases-admin"] });
  const assignMutation = useMutation({
    mutationFn: ({ id, handlerEmployeeId }: { id: string; handlerEmployeeId: string }) =>
      assignGrievanceHandler(id, handlerEmployeeId),
    onSuccess: invalidate,
  });
  const resolveMutation = useMutation({
    mutationFn: ({ id, resolutionSummary }: { id: string; resolutionSummary: string }) =>
      resolveGrievanceCase(id, resolutionSummary),
    onSuccess: invalidate,
  });
  const closeMutation = useMutation({ mutationFn: (id: string) => closeGrievanceCase(id), onSuccess: invalidate });

  return (
    <Card title="Employee Relations — All Cases (Confidential)">
      <ul className="space-y-2">
        {cases.data?.map((c) => (
          <GrievanceAdminRow
            key={c.id}
            grievanceCase={c}
            employees={employees.data}
            onAssignHandler={(id, handlerEmployeeId) => assignMutation.mutate({ id, handlerEmployeeId })}
            onResolve={(id, resolutionSummary) => resolveMutation.mutate({ id, resolutionSummary })}
            onClose={(id) => closeMutation.mutate(id)}
          />
        ))}
        {cases.data?.length === 0 && <p className="text-ink-muted">No cases on file.</p>}
      </ul>
    </Card>
  );
}
