import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createAsset, listAssets } from "../../lib/api/assets";
import { AssetAssignmentSection } from "./AssetAssignmentSection";
import { AssetRow } from "./AssetRow";

const ASSET_CATEGORIES = ["Laptop", "Phone", "Monitor", "SimCard", "IdCard", "Peripheral", "PPE", "Other"];

/** Shares the ["assets"] query cache with AssetsHubPage's own useQuery call — react-query dedupes the fetch. */
export function AssetCatalogAndAssignments() {
  const queryClient = useQueryClient();
  const assets = useQuery({ queryKey: ["assets"], queryFn: listAssets });

  const [assetTag, setAssetTag] = useState("");
  const [category, setCategory] = useState("Laptop");
  const [name, setName] = useState("");

  const createAssetMutation = useMutation({
    mutationFn: () => createAsset({ assetTag: assetTag || undefined, category, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      setAssetTag("");
      setName("");
    },
  });

  const createError = createAssetMutation.error instanceof ApiError ? createAssetMutation.error.message : undefined;

  return (
    <>
      <Card title="Asset Catalog">
        {createError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createError}</p>}
        <form
          className="mb-4 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createAssetMutation.mutate();
          }}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Asset Tag</span>
            <input
              placeholder="Auto-generated if blank"
              value={assetTag}
              onChange={(e) => setAssetTag(e.target.value)}
              className="input w-36"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-36">
              {ASSET_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block flex-1 basis-52">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </label>
          <button
            type="submit"
            disabled={createAssetMutation.isPending}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {createAssetMutation.isPending ? "Adding…" : "Add Asset"}
          </button>
        </form>
        <ul className="space-y-2">
          {assets.data?.map((asset) => (
            <AssetRow key={asset.id} asset={asset} />
          ))}
        </ul>
      </Card>

      <AssetAssignmentSection assets={assets.data ?? []} />
    </>
  );
}
