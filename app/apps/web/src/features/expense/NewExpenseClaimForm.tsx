import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { uploadFile } from "../../lib/api/files";
import { createExpenseClaim } from "../../lib/api/expense";

const CATEGORIES = ["Travel", "Lodging", "Meals", "Transport", "OfficeSupplies", "Other"];

export function NewExpenseClaimForm() {
  const queryClient = useQueryClient();

  const [category, setCategory] = useState("Travel");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [merchant, setMerchant] = useState("");
  const [businessPurpose, setBusinessPurpose] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      const receiptFileId = receiptFile ? (await uploadFile(receiptFile)).id : undefined;
      return createExpenseClaim({
        category,
        amount: Number(amount),
        expenseDate,
        merchant: merchant || undefined,
        businessPurpose: businessPurpose || undefined,
        receiptFileId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-claims-my"] });
      setAmount("");
      setExpenseDate("");
      setMerchant("");
      setBusinessPurpose("");
      setReceiptFile(null);
      if (receiptInputRef.current) receiptInputRef.current.value = "";
    },
  });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="New Claim">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-40">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Amount (₹)</span>
          <input required type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="input w-32" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Expense Date</span>
          <input required type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} className="input" />
        </label>
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Merchant</span>
          <input value={merchant} onChange={(e) => setMerchant(e.target.value)} className="input" />
        </label>
        <label className="block flex-1 basis-52">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Business Purpose</span>
          <input value={businessPurpose} onChange={(e) => setBusinessPurpose(e.target.value)} className="input" />
        </label>
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Receipt</span>
          <input
            ref={receiptInputRef}
            type="file"
            onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
            className="input"
          />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? "Submitting…" : "Submit Claim"}
        </button>
      </form>
    </Card>
  );
}
