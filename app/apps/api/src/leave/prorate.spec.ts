import { prorateEntitlement, round2 } from "./prorate";

describe("round2", () => {
  it("rounds to 2 decimal places", () => {
    expect(round2(1.2345)).toBe(1.23);
    expect(round2(12)).toBe(12);
  });
});

describe("prorateEntitlement", () => {
  const YEAR = 2026;

  it("gives the full entitlement when joined before the year and evaluated in December", () => {
    const joiningDate = new Date(Date.UTC(2020, 0, 1));
    const asOf = new Date(Date.UTC(YEAR, 11, 15));
    expect(prorateEntitlement(24, joiningDate, asOf)).toBe(24);
  });

  it("prorates from the joining month when someone joins mid-year", () => {
    // Joined 15 July -> July through December inclusive = 6 months of 12.
    const joiningDate = new Date(Date.UTC(YEAR, 6, 15));
    const asOf = new Date(Date.UTC(YEAR, 11, 31));
    expect(prorateEntitlement(24, joiningDate, asOf)).toBe(12); // 24 * 6/12
  });

  it("counts the joining month itself as elapsed", () => {
    const joiningDate = new Date(Date.UTC(YEAR, 0, 1));
    const asOf = new Date(Date.UTC(YEAR, 0, 31));
    expect(prorateEntitlement(12, joiningDate, asOf)).toBe(1); // January counted, 12 * 1/12
  });

  it("is zero before the joining date within the same year", () => {
    const joiningDate = new Date(Date.UTC(YEAR, 5, 1));
    const asOf = new Date(Date.UTC(YEAR, 2, 1));
    expect(prorateEntitlement(24, joiningDate, asOf)).toBe(0);
  });

  it("caps at the full annual entitlement, never exceeding it", () => {
    const joiningDate = new Date(Date.UTC(YEAR - 1, 0, 1));
    const asOf = new Date(Date.UTC(YEAR, 11, 31));
    expect(prorateEntitlement(24, joiningDate, asOf)).toBe(24);
  });

  it("treats a null joining date as the start of the year", () => {
    const asOf = new Date(Date.UTC(YEAR, 5, 15));
    // No joining date -> effective start is Jan 1 of the evaluation year -> June inclusive = 6 months.
    expect(prorateEntitlement(12, null, asOf)).toBe(6);
  });
});
