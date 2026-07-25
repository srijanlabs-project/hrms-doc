import { Injectable } from "@nestjs/common";
import { AiDataService } from "./ai-data.service";
import type { AiAnswer, AiProvider } from "./ai-provider.interface";

const DEFAULT_SUGGESTIONS = [
  "What's my leave balance?",
  "Did I mark attendance today?",
  "What's my latest payslip?",
  "How many employees do we have?",
];

function money(value: number | null): string {
  return value === null ? "unavailable" : `₹${value.toLocaleString("en-IN")}`;
}

/**
 * BEFORE UAT: replace with a real Claude API provider — same swap-in
 * contract as StaticDevOtpProvider (see auth/otp/otp-provider.ts). This
 * implementation is plain keyword matching over AiDataService's real
 * queries, not a language model: no free-form understanding, no
 * conversation memory, no actions taken on the tenant's behalf (per
 * docs/08-submodule-specifications/26-ai-and-copilot/01-hr-copilot.md's
 * guardrail that AI must not act without human approval — moot here since
 * this provider only reads, never writes).
 */
@Injectable()
export class StaticDevAiProvider implements AiProvider {
  constructor(private readonly data: AiDataService) {}

  async answer(message: string, tenantId: string): Promise<AiAnswer> {
    const text = message.toLowerCase();

    if (text.includes("leave") && (text.includes("balance") || text.includes("how much"))) {
      const balances = await this.data.getLeaveBalances();
      if (balances.length === 0) {
        return this.reply("No leave policies are configured for your workspace yet.");
      }
      const lines = balances.map((b) => `${b.name}: ${b.available} of ${b.prorated} day(s) available`);
      return this.reply(`Here's your leave balance:\n${lines.join("\n")}`);
    }

    if (text.includes("apply") && text.includes("leave")) {
      return this.reply("You can submit a new leave request from the Leave page → Apply Leave.");
    }

    if (text.includes("team") && text.includes("attendance")) {
      const team = await this.data.getTeamAttendanceToday();
      if (team.length === 0) {
        return this.reply("You don't have any direct reports to show attendance for.");
      }
      const lines = team.map((t) => `${t.legalName}: ${t.status}`);
      return this.reply(`Today's team attendance:\n${lines.join("\n")}`);
    }

    if (text.includes("attendance")) {
      const status = await this.data.getTodayAttendanceStatus();
      return this.reply(`Your attendance status for today is: ${status}.`);
    }

    if (text.includes("payslip") || text.includes("net pay") || text.includes("salary")) {
      const payslip = await this.data.getLatestPayslip();
      if (!payslip) {
        return this.reply("No approved payslips are available for you yet.");
      }
      return this.reply(
        `Your latest payslip (${payslip.payrollRun.periodMonth}/${payslip.payrollRun.periodYear}) has a net pay of ${money(payslip.netPay)}.`,
      );
    }

    if (text.includes("headcount") || text.includes("how many employees")) {
      const count = await this.data.getHeadcount(tenantId);
      return this.reply(`Your organization currently has ${count} employee record(s).`);
    }

    if (text.includes("holiday")) {
      return this.reply("The holiday calendar isn't available yet — check with HR for upcoming holidays.");
    }

    if (text.includes("task")) {
      return this.reply("Task and workflow tracking isn't available yet — this is planned for a future release.");
    }

    return this.reply(
      "I can help with your leave balance, today's attendance, your latest payslip, or company headcount. Try one of the suggestions below.",
    );
  }

  private reply(reply: string): AiAnswer {
    return { reply, suggestions: DEFAULT_SUGGESTIONS };
  }
}
