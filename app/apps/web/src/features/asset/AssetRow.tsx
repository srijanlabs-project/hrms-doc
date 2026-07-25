import { Badge } from "../../components/ui/Badge";
import type { Asset } from "../../lib/api/types";
import { assetStatusTone } from "./status-tone";

export function AssetRow({ asset }: { asset: Asset }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-border p-3">
      <div>
        <span className="font-medium">
          {asset.category}: {asset.name}
        </span>{" "}
        <Badge tone={assetStatusTone(asset.status)}>{asset.status}</Badge>
        <p className="mt-1 text-xs text-ink-faint">Tag: {asset.assetTag}</p>
      </div>
    </li>
  );
}
