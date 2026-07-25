import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import {
  enrollInPlan,
  getFlexBasketStatus,
  listActivePlans,
  listMyEnrollments,
  waiveEnrollment,
} from "../../lib/api/benefits";
import { ApiError } from "../../lib/api/http";

function enrollmentTone(status: string): "positive" | "negative" | "neutral" {
  if (status === "Enrolled") return "positive";
  if (status === "Waived" || status === "Terminated") return "neutral";
  return "neutral";
}

/** Self-service: browse active plans, enroll (allocate for flex options), waive, and track the flex basket balance. */
export function MyBenefitsPanel() {
  const queryClient = useQueryClient();
  const plans = useQuery({ queryKey: ["benefit-plans"], queryFn: listActivePlans });
  const enrollments = useQuery({ queryKey: ["benefit-enrollments-my"], queryFn: listMyEnrollments });
  const flexBasket = useQuery({ queryKey: ["flex-basket-status"], queryFn: getFlexBasketStatus });

  const [planId, setPlanId] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState("");

  const selectedPlan = plans.data?.find((p) => p.id === planId);
  const isFlex = selectedPlan?.category === "FlexAllowance";

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["benefit-enrollments-my"] });
    void queryClient.invalidateQueries({ queryKey: ["flex-basket-status"] });
  };
  const enroll = useMutation({
    mutationFn: () =>
      enrollInPlan({ benefitPlanId: planId, effectiveDate, allocatedAmount: isFlex ? Number(allocatedAmount) : undefined }),
    onSuccess: () => {
      invalidate();
      setPlanId("");
      setEffectiveDate("");
      setAllocatedAmount("");
    },
  });
  const waive = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => waiveEnrollment(id, reason),
    onSuccess: invalidate,
  });
  const errorMessage = enroll.error instanceof ApiError ? enroll.error.message : undefined;

  return (
    <>
      <Card title="My Benefits">
        {flexBasket.data?.annualAmount != null && (
          <p className="mb-3 text-sm text-ink-muted">
            Flex basket: ₹{flexBasket.data.allocated.toLocaleString("en-IN")} allocated of ₹
            {flexBasket.data.annualAmount.toLocaleString("en-IN")} (₹{flexBasket.data.remaining?.toLocaleString("en-IN")}{" "}
            remaining)
          </p>
        )}
        {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
        <form
          className="mb-4 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            enroll.mutate();
          }}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Plan</span>
            <select required value={planId} onChange={(e) => setPlanId(e.target.value)} className="input w-56">
              <option value="">Select…</option>
              {plans.data?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Effective Date</span>
            <input required type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="input" />
          </label>
          {isFlex && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-muted">Annual Allocation (₹)</span>
              <input
                required
                type="number"
                min="0"
                value={allocatedAmount}
                onChange={(e) => setAllocatedAmount(e.target.value)}
                className="input w-32"
              />
            </label>
          )}
          <button
            type="submit"
            disabled={enroll.isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {enroll.isPending ? "Enrolling…" : "Enroll"}
          </button>
        </form>

        <ul className="space-y-2">
          {enrollments.data?.map((e) => (
            <li key={e.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{e.benefitPlan.name}</span>
                <Badge tone={enrollmentTone(e.status)}>{e.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-ink-faint">
                {e.benefitPlan.category === "FlexAllowance"
                  ? `Allocated ₹${e.allocatedAmount?.toLocaleString("en-IN")}/yr`
                  : `₹${e.benefitPlan.employeeCost.toLocaleString("en-IN")}/mo employee cost`}
                {" · Effective "}
                {new Date(e.effectiveDate).toLocaleDateString("en-IN")}
              </p>
              {e.status === "Enrolled" && (
                <button
                  type="button"
                  disabled={waive.isPending}
                  onClick={() => waive.mutate({ id: e.id, reason: "Employee waived coverage" })}
                  className="mt-2 rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
                >
                  Waive
                </button>
              )}
              {e.waiverReason && <p className="mt-1 text-xs text-ink-muted">Waived: {e.waiverReason}</p>}
            </li>
          ))}
          {enrollments.data?.length === 0 && <p className="text-ink-muted">You have no benefit enrollments yet.</p>}
        </ul>
      </Card>
    </>
  );
}
