import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createWorker } from "../../lib/api/contractor";
import { ApiError } from "../../lib/api/http";
import type { Vendor } from "../../lib/api/types";

const CATEGORIES = ["Contractor", "Consultant", "AgencyStaff", "Intern"] as const;

/** Create a new external worker in Draft status against a vendor. */
export function CreateWorkerForm({ vendors }: { vendors?: Vendor[] }) {
  const queryClient = useQueryClient();
  const [vendorId, setVendorId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Contractor");
  const [contractStartDate, setContractStartDate] = useState("");
  const [contractEndDate, setContractEndDate] = useState("");

  const create = useMutation({
    mutationFn: () => createWorker({ vendorId, fullName, email: email || undefined, category, contractStartDate, contractEndDate }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["workers"] });
      setFullName("");
      setEmail("");
      setContractStartDate("");
      setContractEndDate("");
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <form
      className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate();
      }}
    >
      {errorMessage && <p className="w-full rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <select required value={vendorId} onChange={(e) => setVendorId(e.target.value)} className="input w-44">
        <option value="">Vendor…</option>
        {vendors?.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
      <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="input w-44" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input w-48" />
      <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="input">
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-muted">Start</span>
        <input
          required
          type="date"
          value={contractStartDate}
          onChange={(e) => setContractStartDate(e.target.value)}
          className="input"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-muted">End</span>
        <input required type="date" value={contractEndDate} onChange={(e) => setContractEndDate(e.target.value)} className="input" />
      </label>
      <button
        type="submit"
        disabled={create.isPending}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        Add Worker
      </button>
    </form>
  );
}
