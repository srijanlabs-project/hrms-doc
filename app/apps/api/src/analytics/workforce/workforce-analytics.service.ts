import { Injectable } from "@nestjs/common";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { PrismaService } from "../../platform/prisma/prisma.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError } from "../../platform/errors/errors";

export interface MonthPoint {
  month: string; // "YYYY-MM"
  headcount: number;
  separations: number;
  attritionRate: number;
}

export interface DistributionSlice {
  label: string;
  count: number;
}

export interface ExecutiveSummary {
  activeHeadcount: number;
  latestAttritionRate: number;
  averageTenureYears: number;
  departmentDistribution: DistributionSlice[];
  genderDistribution: DistributionSlice[];
}

function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthEnd(year: number, monthIndex0: number): Date {
  return new Date(Date.UTC(year, monthIndex0 + 1, 0, 23, 59, 59, 999));
}

/**
 * W5·E25 Analytics and BI — headcount/attrition trend, computed live from
 * Employee.joiningDate/lastWorkingDay/status for the trailing N months. No
 * new analytics_snapshot batch-job table: this tenant's employee count is
 * small enough that recomputing from source rows on every request is
 * correct and cheap, matching this build's live-computation discipline
 * (Reports v1, Number Series, Backup all avoided persisted-snapshot
 * machinery where it wasn't needed).
 */
@Injectable()
export class WorkforceAnalyticsService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  async getTrend(monthsBack: number): Promise<MonthPoint[]> {
    const { tenantId } = this.requireAuthenticated();
    const employees = await this.employeeRepository.findAll(tenantId);

    const now = new Date();
    const points: MonthPoint[] = [];
    const span = Math.min(Math.max(monthsBack, 1), 24);

    for (let i = span - 1; i >= 0; i--) {
      const cursor = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      const year = cursor.getUTCFullYear();
      const monthIndex0 = cursor.getUTCMonth();
      const end = monthEnd(year, monthIndex0);

      let headcount = 0;
      let separations = 0;
      for (const employee of employees) {
        const joined = employee.joiningDate ? new Date(employee.joiningDate) <= end : false;
        const stillActiveAtEnd = !employee.lastWorkingDay || new Date(employee.lastWorkingDay) > end;
        if (joined && stillActiveAtEnd) {
          headcount++;
        }
        if (employee.lastWorkingDay) {
          const left = new Date(employee.lastWorkingDay);
          if (monthKey(left) === monthKey(cursor)) {
            separations++;
          }
        }
      }

      const attritionRate = headcount > 0 ? Number(((separations / headcount) * 100).toFixed(2)) : 0;
      points.push({ month: monthKey(cursor), headcount, separations, attritionRate });
    }

    return points;
  }

  /**
   * Executive dashboard + diversity analytics (W5·E25 gap closure, Batch C).
   * Folds diversity breakdowns directly into the executive summary rather
   * than a separate module — both are just distribution slices over the
   * same active-employee population, not two different dashboard concepts.
   * The spec's Strategic Command Centre (recommendation-led insights on
   * attrition risk/succession/leadership pipeline) stays deferred — no
   * defined KPI/recommendation model exists to build against yet.
   */
  async getExecutiveSummary(): Promise<ExecutiveSummary> {
    const { tenantId } = this.requireAuthenticated();
    const active = await this.employeeRepository.findActive(tenantId);
    const trend = await this.getTrend(1);
    const latestAttritionRate = trend.at(-1)?.attritionRate ?? 0;

    const now = Date.now();
    const tenures = active
      .filter((e) => e.joiningDate)
      .map((e) => (now - new Date(e.joiningDate!).getTime()) / (365.25 * 86_400_000));
    const averageTenureYears = tenures.length > 0 ? Number((tenures.reduce((a, b) => a + b, 0) / tenures.length).toFixed(1)) : 0;

    const departmentDistribution = this.tally(active.map((e) => e.department?.name ?? "Unassigned"));

    const personalDetails = await this.prisma.withTenant(tenantId, (tx) =>
      tx.personalDetail.findMany({ where: { tenantId, employeeId: { in: active.map((e) => e.id) } }, select: { employeeId: true, gender: true } }),
    );
    const genderByEmployeeId = new Map(personalDetails.map((p) => [p.employeeId, p.gender]));
    const genderDistribution = this.tally(active.map((e) => genderByEmployeeId.get(e.id) || "Not specified"));

    return {
      activeHeadcount: active.length,
      latestAttritionRate,
      averageTenureYears,
      departmentDistribution,
      genderDistribution,
    };
  }

  private tally(values: string[]): DistributionSlice[] {
    const counts = new Map<string, number>();
    for (const value of values) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
