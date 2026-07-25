import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import {
  createPlan,
  getFlexBasketStatus,
  listAllEnrollments,
  listAllPlans,
  setFlexBasket,
  terminateEnrollment,
} from "../../lib/api/benefits";
import { ApiError } from "../../lib/api/http";

const CATEGORIES = ["Insurance", "Retirement", "Wellness", "FlexAllowance"] as const;
const STATUSES = ["All", "Enrolled", "Waived", "Terminated"] as const;

function PlanCatalogForm() {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Insurance");
  const [employerCost, setEmployerCost] = useState("");
  const [employeeCost, setEmployeeCost] = useState("");
  const [maxAnnualAllocation, setMaxAnnualAllocation] = useState("");

  const create = useMutation({
    mutationFn: () =>
      createPlan({
        code,
        name,
        category,
        employerCost: employerCost ? Number(employerCost) : undefined,
        employeeCost: employeeCost ? Number(employeeCost) : undefined,
        maxAnnualAllocation: maxAnnualAllocation ? Number(maxAnnualAllocation) : undefined,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["benefit-plans-admin"] });
      void queryClient.invalidateQueries({ queryKey: ["benefit-plans"] });
      setCode("");
      setName("");
      setEmployerCost("");
      setEmployeeCost("");
      setMaxAnnualAllocation("");
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;
  const isFlex = category === "FlexAllowance";

  return (
    <form
      className="mb-4 flex flex-wrap items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate();
      }}
    >
      {errorMessage && <p className="w-full rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code" className="input w-28" />
      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input w-48" />
      <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="input">
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {isFlex ? (
        <input
          type="number"
          value={maxAnnualAllocation}
          onChange={(e) => setMaxAnnualAllocation(e.target.value)}
          placeholder="Max annual allocation"
          className="input w-40"
        />
      ) : (
        <>
          <input
            type="number"
            value={employerCost}
            onChange={(e) => setEmployerCost(e.target.value)}
            placeholder="Employer cost/mo"
            className="input w-32"
          />
          <input
            type="number"
            value={employeeCost}
            onChange={(e) => setEmployeeCost(e.target.value)}
            placeholder="Employee cost/mo"
            className="input w-32"
          />
        </>
      )}
      <button
        type="submit"
        disabled={create.isPending}
        className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary disabled:opacity-60"
      >
        Add to Catalog
      </button>
    </form>
  );
}

function FlexBasketForm() {
  const queryClient = useQueryClient();
  const status = useQuery({ queryKey: ["flex-basket-status"], queryFn: getFlexBasketStatus });
  const [annualAmount, setAnnualAmount] = useState("");

  const save = useMutation({
    mutationFn: () => setFlexBasket(Number(annualAmount)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["flex-basket-status"] });
      setAnnualAmount("");
    },
  });

  return (
    <form
      className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <span className="text-sm text-ink-muted">
        Flex basket policy: {status.data?.annualAmount != null ? `₹${status.data.annualAmount.toLocaleString("en-IN")}/yr` : "not set"}
      </span>
      <input
        required
        type="number"
        value={annualAmount}
        onChange={(e) => setAnnualAmount(e.target.value)}
        placeholder="Annual amount"
        className="input w-40"
      />
      <button
        type="submit"
        disabled={save.isPending}
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
      >
        Set Basket
      </button>
    </form>
  );
}

/** Admin: benefit plan catalog, flex basket policy, and all-employee enrollment review (terminate on exit/change). */
export function BenefitsAdminPanel() {
  const queryClient = useQueryClient();
  const plans = useQuery({ queryKey: ["benefit-plans-admin"], queryFn: listAllPlans });
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("All");
  const enrollments = useQuery({
    queryKey: ["benefit-enrollments-admin", filter],
    queryFn: () => listAllEnrollments(filter === "All" ? undefined : filter),
  });
  const terminate = useMutation({
    mutationFn: (id: string) => terminateEnrollment(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["benefit-enrollments-admin"] }),
  });

  return (
    <Card title="Benefit Plan Catalog & Enrollments">
      <h3 className="mb-2 text-sm font-semibold">Catalog ({plans.data?.length ?? 0})</h3>
      <PlanCatalogForm />
      <FlexBasketForm />

      <h3 className="mb-2 mt-4 text-sm font-semibold">Employee Enrollments</h3>
      <div className="mb-3 flex gap-1 border-b border-border">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium ${filter === s ? "border-b-2 border-primary text-primary" : "text-ink-muted"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {enrollments.data?.map((e) => (
          <li key={e.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {e.employee.legalName} — {e.benefitPlan.name}
              </span>
              <Badge tone={e.status === "Enrolled" ? "positive" : "neutral"}>{e.status}</Badge>
            </div>
            {e.status === "Enrolled" && (
              <button
                type="button"
                disabled={terminate.isPending}
                onClick={() => terminate.mutate(e.id)}
                className="mt-2 rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
              >
                Terminate
              </button>
            )}
          </li>
        ))}
        {enrollments.data?.length === 0 && <p className="text-ink-muted">No enrollments match this filter.</p>}
      </ul>
    </Card>
  );
}
