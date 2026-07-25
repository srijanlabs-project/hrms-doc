import { useQuery } from "@tanstack/react-query";
import { Card } from "../../components/ui/Card";
import { getOrgTree } from "../../lib/api/org-settings";
import type { OrgTreeNode } from "../../lib/api/types";

function TreeBranch({ node }: { node: OrgTreeNode }) {
  return (
    <li>
      <span className="font-medium">{node.name}</span> <span className="text-xs text-ink-faint">({node.code})</span>
      {node.children.length > 0 && (
        <ul className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
          {node.children.map((child) => (
            <TreeBranch key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

function TreeColumn({ title, nodes }: { title: string; nodes: OrgTreeNode[] }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">{title}</h3>
      {nodes.length === 0 ? (
        <p className="text-xs text-ink-faint">None yet</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {nodes.map((n) => (
            <TreeBranch key={n.id} node={n} />
          ))}
        </ul>
      )}
    </div>
  );
}

/** Read-only, computed assembly over Company/OrgUnit/Department — see schema.prisma's OrgTree comment. Stands in for T-016 Organization Explorer (not yet designed). */
export function OrgTreeSection() {
  const tree = useQuery({ queryKey: ["org-tree"], queryFn: getOrgTree });

  if (!tree.data) return null;

  return (
    <Card title="Organization Tree">
      <div className="grid gap-6 sm:grid-cols-3">
        <TreeColumn title="Companies" nodes={tree.data.companies} />
        <TreeColumn title="Org Units" nodes={tree.data.orgUnits} />
        <TreeColumn title="Departments" nodes={tree.data.departments} />
      </div>
    </Card>
  );
}
