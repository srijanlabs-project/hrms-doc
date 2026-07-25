import { Fragment } from "react";
import type { TalentAssessment } from "../../lib/api/types";
import { PERFORMANCE_COLUMNS, POTENTIAL_ROWS, performanceBand } from "./band";

export function NineBoxGrid({ assessments }: { assessments: TalentAssessment[] }) {
  const grid = new Map<string, TalentAssessment[]>();
  for (const potential of POTENTIAL_ROWS) {
    for (const column of PERFORMANCE_COLUMNS) {
      grid.set(`${potential}-${column}`, []);
    }
  }
  for (const assessment of assessments) {
    const key = `${assessment.potentialRating}-${performanceBand(assessment.performanceRating)}`;
    grid.get(key)?.push(assessment);
  }

  return (
    <div className="grid grid-cols-[auto_repeat(3,1fr)] gap-2">
      <div />
      {PERFORMANCE_COLUMNS.map((column) => (
        <div key={column} className="text-center text-xs font-semibold uppercase text-ink-faint">
          Performance: {column}
        </div>
      ))}
      {POTENTIAL_ROWS.map((row) => (
        <Fragment key={row}>
          <div className="flex items-center text-xs font-semibold uppercase text-ink-faint">Potential: {row}</div>
          {PERFORMANCE_COLUMNS.map((column) => (
            <div key={`${row}-${column}`} className="min-h-24 rounded-lg border border-border p-2">
              {grid.get(`${row}-${column}`)?.map((assessment) => (
                <div key={assessment.id} className="mb-1 rounded bg-primary-soft px-2 py-1 text-xs">
                  <span className="font-medium">{assessment.employee.legalName}</span> ({assessment.performanceRating}/5)
                </div>
              ))}
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  );
}
