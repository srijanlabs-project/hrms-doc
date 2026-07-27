import { Injectable } from "@nestjs/common";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError } from "../../platform/errors/errors";

export interface MonthPoint {
  month: string; // "YYYY-MM"
  headcount: number;
  separations: number;
  attritionRate: number;
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

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
