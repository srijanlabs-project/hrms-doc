import { Injectable } from "@nestjs/common";
import { AiDataService } from "./ai-data.service";
import type { AiAnswer, AiProvider } from "./ai-provider.interface";

const DEFAULT_SUGGESTIONS = [
  "What's my leave balance?",
  "Did I mark attendance today?",
  "What's my latest payslip?",
  "How many employees do we have?",
  "What's our attrition trend?",
  "What's pending my approval?",
  "How's our recruiting pipeline?",
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

    if (text.includes("attrition") || text.includes("workforce trend") || text.includes("headcount trend")) {
      const trend = await this.data.getWorkforceTrendSummary();
      if (!trend) {
        return this.reply("No workforce trend data is available yet.");
      }
      return this.reply(
        `This month's headcount is ${trend.headcount}, with ${trend.separations} separation(s) and a ${trend.attritionRate}% attrition rate.`,
      );
    }

    if (text.includes("approval") || (text.includes("pending") && text.includes("me"))) {
      const summary = await this.data.getPendingApprovalsSummary();
      if (summary === null) {
        return this.reply("Your account isn't linked to an employee record, so there's no approval queue to check.");
      }
      if (summary.count === 0) {
        return this.reply("You have no pending approvals right now.");
      }
      return this.reply(
        `You have ${summary.count} pending approval(s), the oldest waiting ${summary.oldestDays} day(s). Check the Team Dashboard for details.`,
      );
    }

    if (text.includes("succession") || text.includes("critical role")) {
      const summary = await this.data.getSuccessionCoverageSummary();
      if (summary === "restricted") {
        return this.reply("Succession planning is restricted to HR Operations and Org Admin roles.");
      }
      if (summary.total === 0) {
        return this.reply("No critical roles are configured yet.");
      }
      const uncoveredLine = summary.uncoveredTitles.length
        ? ` Uncovered: ${summary.uncoveredTitles.join(", ")}.`
        : "";
      return this.reply(`${summary.covered} of ${summary.total} critical role(s) have ready successor coverage.${uncoveredLine}`);
    }

    if (text.includes("recognition") || text.includes("kudos")) {
      const summary = await this.data.getRecognitionSummary();
      if (summary === null) {
        return this.reply("Your account isn't linked to an employee record, so there's no recognition activity to show.");
      }
      return this.reply(`You've received ${summary.received} recognition(s) and given ${summary.given}.`);
    }

    if (text.includes("team") && (text.includes("training") || text.includes("learning") || text.includes("compliance"))) {
      const summary = await this.data.getTeamLearningGapSummary();
      if (summary === null) {
        return this.reply("You don't have any direct reports to show training completion for.");
      }
      if (summary.incomplete.length === 0) {
        return this.reply("Your team has no overdue mandatory training.");
      }
      const lines = summary.incomplete.map((i) => `${i.employeeName}: ${i.courseTitle}`);
      return this.reply(`Mandatory training not yet complete:\n${lines.join("\n")}`);
    }

    if (text.includes("requisition") || text.includes("pipeline") || text.includes("recruiting") || text.includes("open roles")) {
      const summary = await this.data.getRecruitingPipelineSummary();
      if (summary === "restricted") {
        return this.reply("Recruiting pipeline details are restricted to HR Operations and Org Admin roles.");
      }
      return this.reply(
        `${summary.openRequisitions} open requisition(s), ${summary.activePipelineCandidates} candidate(s) active in the pipeline, and ${summary.offersPendingDecision} offer(s) pending a decision.`,
      );
    }

    if (text.includes("holiday")) {
      return this.reply("The holiday calendar isn't available yet — check with HR for upcoming holidays.");
    }

    if (text.includes("task")) {
      return this.reply("Task and workflow tracking isn't available yet — this is planned for a future release.");
    }

    return this.reply(
      "I can help with your leave balance, today's attendance, your latest payslip, company headcount, attrition trends, your pending approvals, succession coverage, recognition, your team's training completion, or the recruiting pipeline. Try one of the suggestions below.",
    );
  }

  private reply(reply: string): AiAnswer {
    return { reply, suggestions: DEFAULT_SUGGESTIONS };
  }
}
