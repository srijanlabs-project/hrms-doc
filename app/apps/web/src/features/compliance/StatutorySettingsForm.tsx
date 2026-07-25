import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { getStatutorySettings, updateStatutorySettings } from "../../lib/api/statutory-compliance";

function useNumberField(initial: number) {
  const [value, setValue] = useState(String(initial));
  const inputProps = { value, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value) };
  return { value, setValue, inputProps };
}

/** Tenant-wide rates the three statutory checks below read from — single-tier simplification, no state-wise rate tables. */
export function StatutorySettingsForm() {
  const queryClient = useQueryClient();
  const settings = useQuery({ queryKey: ["statutory-settings"], queryFn: getStatutorySettings });

  const minWage = useNumberField(0);
  const lwfEmp = useNumberField(0);
  const lwfEmployer = useNumberField(0);
  const lwfFreq = useNumberField(6);
  const bonusCeiling = useNumberField(0);
  const bonusPercent = useNumberField(8.33);

  useEffect(() => {
    if (!settings.data) return;
    minWage.setValue(String(settings.data.minimumWageThreshold));
    lwfEmp.setValue(String(settings.data.lwfEmployeeContribution));
    lwfEmployer.setValue(String(settings.data.lwfEmployerContribution));
    lwfFreq.setValue(String(settings.data.lwfFrequencyMonths));
    bonusCeiling.setValue(String(settings.data.bonusEligibilityCeiling));
    bonusPercent.setValue(String(settings.data.bonusPercent));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      updateStatutorySettings({
        minimumWageThreshold: Number(minWage.value),
        lwfEmployeeContribution: Number(lwfEmp.value),
        lwfEmployerContribution: Number(lwfEmployer.value),
        lwfFrequencyMonths: Number(lwfFreq.value),
        bonusEligibilityCeiling: Number(bonusCeiling.value),
        bonusPercent: Number(bonusPercent.value),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statutory-settings"] });
      queryClient.invalidateQueries({ queryKey: ["minimum-wage-check"] });
      queryClient.invalidateQueries({ queryKey: ["lwf-liability"] });
      queryClient.invalidateQueries({ queryKey: ["bonus-eligibility"] });
    },
  });

  return (
    <Card title="Statutory Compliance Settings">
      <form
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Minimum wage threshold (₹/mo)</span>
          <input type="number" min="0" className="input" {...minWage.inputProps} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">LWF employee contribution (₹)</span>
          <input type="number" min="0" className="input" {...lwfEmp.inputProps} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">LWF employer contribution (₹)</span>
          <input type="number" min="0" className="input" {...lwfEmployer.inputProps} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">LWF frequency (months)</span>
          <input type="number" min="1" className="input" {...lwfFreq.inputProps} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Bonus eligibility ceiling (₹/mo basic)</span>
          <input type="number" min="0" className="input" {...bonusCeiling.inputProps} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Statutory bonus %</span>
          <input type="number" min="0" step="0.01" className="input" {...bonusPercent.inputProps} />
        </label>
        <div className="col-span-full">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {saveMutation.isPending ? "Saving…" : "Save Settings"}
          </button>
          {saveMutation.isSuccess && <span className="ml-3 text-xs text-positive">Saved.</span>}
        </div>
      </form>
    </Card>
  );
}
