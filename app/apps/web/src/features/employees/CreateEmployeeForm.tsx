import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { listDepartments } from "../../lib/api/departments";
import { createEmployee } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import type { CreateEmployeeInput } from "../../lib/api/types";

const emptyForm: CreateEmployeeInput = {
  employeeCode: "",
  legalName: "",
  personalEmail: "",
  mobileNumber: "",
  dateOfBirth: "",
  departmentId: "",
  joiningDate: "",
};

/**
 * Minimal create form for the Phase 2 proving slice. Board T-005 (Smart Form
 * Workspace) specifies a full multi-step stepper with AI-assisted guidance
 * for guided flows like this one — deliberately deferred; this single-step
 * form exists so the T-003 workbench has a real, working "+ Add Employee"
 * action end to end.
 */
export function CreateEmployeeForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<CreateEmployeeInput>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const departments = useQuery({ queryKey: ["departments"], queryFn: listDepartments });

  const mutation = useMutation({
    mutationFn: () =>
      createEmployee({
        ...form,
        preferredName: form.preferredName || undefined,
        personalEmail: form.personalEmail || undefined,
        mobileNumber: form.mobileNumber || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        departmentId: form.departmentId || undefined,
        joiningDate: form.joiningDate || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onClose();
    },
    onError: (err) => {
      if (err instanceof ApiError && err.payload.fieldErrors) {
        setFieldErrors(
          Object.fromEntries(err.payload.fieldErrors.map((f) => [f.field, f.message])),
        );
      }
    },
  });

  function set<K extends keyof CreateEmployeeInput>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const generalError =
    mutation.error instanceof ApiError && !mutation.error.payload.fieldErrors?.length
      ? mutation.error.message
      : null;

  return (
    <Modal title="Add Employee" onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setFieldErrors({});
          mutation.mutate();
        }}
      >
        {generalError && (
          <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">{generalError}</p>
        )}

        <Field label="Employee Code" error={fieldErrors.employeeCode}>
          <input
            required
            value={form.employeeCode}
            onChange={(e) => set("employeeCode", e.target.value.toUpperCase())}
            placeholder="EMP-0001"
            className="input"
          />
        </Field>

        <Field label="Legal Name" error={fieldErrors.legalName}>
          <input
            required
            value={form.legalName}
            onChange={(e) => set("legalName", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Department" error={fieldErrors.departmentId}>
          <select
            value={form.departmentId}
            onChange={(e) => set("departmentId", e.target.value)}
            className="input"
          >
            <option value="">Unassigned</option>
            {departments.data?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Personal Email" error={fieldErrors.personalEmail}>
            <input
              type="email"
              value={form.personalEmail}
              onChange={(e) => set("personalEmail", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Mobile Number" error={fieldErrors.mobileNumber}>
            <input
              value={form.mobileNumber}
              onChange={(e) => set("mobileNumber", e.target.value)}
              placeholder="+91XXXXXXXXXX"
              className="input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Date of Birth" error={fieldErrors.dateOfBirth}>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => set("dateOfBirth", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Joining Date" error={fieldErrors.joiningDate}>
            <input
              type="date"
              value={form.joiningDate}
              onChange={(e) => set("joiningDate", e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 font-medium">
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {mutation.isPending ? "Saving…" : "Save Employee"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-muted">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-negative">{error}</span>}
    </label>
  );
}
