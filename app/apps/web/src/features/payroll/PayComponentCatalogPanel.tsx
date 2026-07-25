import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createPayComponent, listPayComponents } from "../../lib/api/payroll";

const TYPES = ["Earning", "Deduction"] as const;
const METHODS = ["FixedAmount", "PercentOfBasic"] as const;

/** Admin-only: pay component catalog. 02-pay-components.md v1 slice. */
export function PayComponentCatalogPanel() {
  const queryClient = useQueryClient();
  const components = useQuery({ queryKey: ["pay-components"], queryFn: listPayComponents });

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("Earning");
  const [calculationMethod, setCalculationMethod] = useState<(typeof METHODS)[number]>("FixedAmount");
  const [defaultValue, setDefaultValue] = useState("");

  const createMutation = useMutation({
    mutationFn: () => createPayComponent({ code, name, type, calculationMethod, defaultValue: Number(defaultValue) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pay-components"] });
      setCode("");
      setName("");
      setDefaultValue("");
    },
  });

  return (
    <Card title="Pay Component Catalog">
      {createMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createMutation.error.message}</p>
      )}
      <form
        className="mb-3 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <input required placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} className="input w-24" />
        <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input w-40" />
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="input">
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select value={calculationMethod} onChange={(e) => setCalculationMethod(e.target.value as typeof calculationMethod)} className="input">
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          required
          type="number"
          step="0.01"
          placeholder={calculationMethod === "PercentOfBasic" ? "Fraction (0.1=10%)" : "Amount"}
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
          className="input w-36"
        />
        <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
          Add Component
        </button>
      </form>

      <ul className="space-y-1">
        {components.data?.map((c) => (
          <li key={c.id} className="rounded-lg border border-border p-2 text-sm">
            <span className="font-mono text-xs text-ink-faint">{c.code}</span> {c.name} · {c.type} · {c.calculationMethod} ·{" "}
            {c.calculationMethod === "PercentOfBasic" ? `${c.defaultValue * 100}%` : `₹${c.defaultValue}`}
          </li>
        ))}
      </ul>
    </Card>
  );
}
