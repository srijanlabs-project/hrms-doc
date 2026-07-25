import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { createVendor, listVendors } from "../../lib/api/contractor";
import { ApiError } from "../../lib/api/http";

/** Vendor/agency catalog — "agency management" collapses into this, an agency is just a vendor whose workers are AgencyStaff. */
export function VendorPanel() {
  const queryClient = useQueryClient();
  const vendors = useQuery({ queryKey: ["vendors"], queryFn: listVendors });
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const create = useMutation({
    mutationFn: () => createVendor({ name, contactEmail: contactEmail || undefined, contactPhone: contactPhone || undefined }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["vendors"] });
      setName("");
      setContactEmail("");
      setContactPhone("");
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <Card title="Vendors & Agencies">
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Vendor name" className="input w-48" />
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="Contact email"
          className="input w-56"
        />
        <input
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          placeholder="Contact phone"
          className="input w-40"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          Add Vendor
        </button>
      </form>

      <ul className="space-y-2">
        {vendors.data?.map((v) => (
          <li key={v.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <span className="font-medium">{v.name}</span>
            <span className="flex items-center gap-2 text-xs text-ink-muted">
              {v.contactEmail}
              <Badge tone={v.isActive ? "positive" : "neutral"}>{v.isActive ? "Active" : "Inactive"}</Badge>
            </span>
          </li>
        ))}
        {vendors.data?.length === 0 && <p className="text-ink-muted">No vendors added yet.</p>}
      </ul>
    </Card>
  );
}
