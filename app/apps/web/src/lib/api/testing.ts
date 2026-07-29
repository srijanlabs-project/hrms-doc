import { apiRequest } from "./http";
import type { ImportBatch } from "./implementation";

export const TEST_SUITE_TYPES = ["Regression", "Performance", "Security", "Accessibility", "UAT"] as const;
export type TestSuiteType = (typeof TEST_SUITE_TYPES)[number];

export interface TestCase {
  id: string;
  suiteId: string;
  title: string;
  steps: string;
  expectedResult: string;
  isActive: boolean;
  createdAt: string;
}

export interface TestSuite {
  id: string;
  name: string;
  suiteType: TestSuiteType;
  description: string | null;
  status: "Active" | "Archived";
  cases: TestCase[];
  _count: { runs: number };
  createdAt: string;
}

export interface TestResult {
  id: string;
  runId: string;
  caseId: string;
  case: { id: string; title: string; steps: string; expectedResult: string };
  outcome: "Pending" | "Pass" | "Fail" | "Blocked";
  notes: string | null;
  recordedAt: string | null;
}

export interface TestRun {
  id: string;
  suiteId: string;
  suite: { id: string; name: string; suiteType: TestSuiteType };
  status: "Running" | "Passed" | "Failed" | "Blocked" | "SignedOff";
  executedByUserId: string;
  startedAt: string | null;
  completedAt: string | null;
  signoffDecision: "Approved" | "Rejected" | null;
  signoffNotes: string | null;
  signedOffAt: string | null;
  results: TestResult[];
  createdAt: string;
}

export function createTestSuite(input: { name: string; suiteType: TestSuiteType; description?: string }): Promise<TestSuite> {
  return apiRequest<TestSuite>("/testing/suites", { method: "POST", body: JSON.stringify(input) });
}

export function listTestSuites(): Promise<TestSuite[]> {
  return apiRequest<TestSuite[]>("/testing/suites");
}

export function addTestCase(
  suiteId: string,
  input: { title: string; steps: string; expectedResult: string },
): Promise<TestCase> {
  return apiRequest<TestCase>(`/testing/suites/${suiteId}/cases`, { method: "POST", body: JSON.stringify(input) });
}

export function startTestRun(suiteId: string): Promise<TestRun> {
  return apiRequest<TestRun>("/testing/runs", { method: "POST", body: JSON.stringify({ suiteId }) });
}

export function listTestRuns(): Promise<TestRun[]> {
  return apiRequest<TestRun[]>("/testing/runs");
}

export function recordTestResult(
  runId: string,
  input: { caseId: string; outcome: "Pass" | "Fail" | "Blocked"; notes?: string },
): Promise<TestRun> {
  return apiRequest<TestRun>(`/testing/runs/${runId}/results`, { method: "POST", body: JSON.stringify(input) });
}

export function signoffTestRun(
  runId: string,
  input: { decision: "Approved" | "Rejected"; notes?: string },
): Promise<TestRun> {
  return apiRequest<TestRun>(`/testing/runs/${runId}/signoff`, { method: "POST", body: JSON.stringify(input) });
}

export function generateTestData(count: number): Promise<ImportBatch> {
  return apiRequest<ImportBatch>("/testing/test-data/generate", { method: "POST", body: JSON.stringify({ count }) });
}

export function listTestDataBatches(): Promise<ImportBatch[]> {
  return apiRequest<ImportBatch[]>("/testing/test-data/batches");
}

export function purgeTestDataBatch(id: string): Promise<ImportBatch> {
  return apiRequest<ImportBatch>(`/testing/test-data/batches/${id}/purge`, { method: "POST" });
}
