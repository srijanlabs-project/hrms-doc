import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ApiError } from "../../lib/api/http";
import { createLicense } from "../../lib/api/software-license";

export function NewLicenseForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [vendor, setVendor] = useState("");
  const [totalSeats, setTotalSeats] = useState("1");
  const [expiryDate, setExpiryDate] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      createLicense({ name, vendor: vendor || undefined, totalSeats: Number(totalSeats), expiryDate: expiryDate || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses-all"] });
      queryClient.invalidateQueries({ queryKey: ["licenses-active"] });
      setName("");
      setVendor("");
      setTotalSeats("1");
      setExpiryDate("");
    },
  });
  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <>
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block flex-1 basis-52">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Vendor</span>
          <input value={vendor} onChange={(e) => setVendor(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Total Seats</span>
          <input
            required
            type="number"
            min="1"
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
            className="input w-28"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Expiry Date</span>
          <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="input" />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
        >
          {createMutation.isPending ? "Adding…" : "Add License"}
        </button>
      </form>
    </>
  );
}
