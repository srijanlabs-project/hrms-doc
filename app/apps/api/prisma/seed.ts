import { PrismaClient, Prisma } from "@prisma/client";

const LEAVE_POLICIES: { leaveType: string; name: string; annualDays: number }[] = [
  { leaveType: "Annual", name: "Annual Leave", annualDays: 24 },
  { leaveType: "Casual", name: "Casual Leave", annualDays: 12 },
  { leaveType: "Sick", name: "Sick Leave", annualDays: 10 },
];

function seedLeavePolicies(tx: Prisma.TransactionClient, tenantId: string) {
  return Promise.all(
    LEAVE_POLICIES.map((policy) =>
      tx.leavePolicy.upsert({
        where: { tenantId_leaveType: { tenantId, leaveType: policy.leaveType } },
        update: {},
        create: { tenantId, ...policy },
      }),
    ),
  );
}

/**
 * Local dev seed: two tenants, each with a legal entity, departments,
 * employees, and login-capable users covering the RBAC v1 role set, so
 * RLS isolation and the People/Org/Auth UI can all be demonstrated with
 * realistic data. Run with `npm run db:seed`.
 *
 * Login is OTP-only (no passwords) — see apps/api/src/auth/otp/otp-provider.ts.
 * In dev, sign in to any seeded email below with verification code 123456:
 *   workspace "srijanlabs"   priya.sharma@srijanlabs.example   (org_admin)
 *   workspace "srijanlabs"   rohit.singh@srijanlabs.example    (manager)
 *   workspace "srijanlabs"   sneha.reddy@srijanlabs.example    (hr_ops)
 *   workspace "globex"       alex.carter@globex.example        (org_admin)
 */
const prisma = new PrismaClient();

async function main() {
  const srijanLabs = await prisma.tenant.upsert({
    where: { code: "srijanlabs" },
    update: {},
    create: { code: "srijanlabs", name: "Srijan Labs" },
  });

  const globex = await prisma.tenant.upsert({
    where: { code: "globex" },
    update: {},
    create: { code: "globex", name: "Globex Technology Services" },
  });

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.tenant_id', ${srijanLabs.id}, true)`;

    await tx.legalEntity.upsert({
      where: { tenantId_code: { tenantId: srijanLabs.id, code: "SRIJAN-IN" } },
      update: {},
      create: { tenantId: srijanLabs.id, code: "SRIJAN-IN", name: "Srijan Labs India", country: "IN" },
    });

    await seedLeavePolicies(tx, srijanLabs.id);

    const engineering = await tx.department.upsert({
      where: { tenantId_code: { tenantId: srijanLabs.id, code: "ENG" } },
      update: {},
      create: { tenantId: srijanLabs.id, code: "ENG", name: "Engineering" },
    });

    const peopleOps = await tx.department.upsert({
      where: { tenantId_code: { tenantId: srijanLabs.id, code: "PEOPLE" } },
      update: {},
      create: { tenantId: srijanLabs.id, code: "PEOPLE", name: "People Operations" },
    });

    const priya = await tx.employee.upsert({
      where: { tenantId_employeeCode: { tenantId: srijanLabs.id, employeeCode: "SRIJAN-0001" } },
      update: {},
      create: {
        tenantId: srijanLabs.id,
        employeeCode: "SRIJAN-0001",
        legalName: "Priya Sharma",
        preferredName: "Priya",
        dateOfBirth: new Date("1988-04-12"),
        personalEmail: "priya.sharma@srijanlabs.example",
        mobileNumber: "+919812345001",
        departmentId: engineering.id,
        status: "Active",
        joiningDate: new Date("2021-01-11"),
      },
    });

    const rohit = await tx.employee.upsert({
      where: { tenantId_employeeCode: { tenantId: srijanLabs.id, employeeCode: "SRIJAN-0002" } },
      update: {},
      create: {
        tenantId: srijanLabs.id,
        employeeCode: "SRIJAN-0002",
        legalName: "Rohit Singh",
        preferredName: "Rohit",
        dateOfBirth: new Date("1994-08-02"),
        personalEmail: "rohit.singh@srijanlabs.example",
        mobileNumber: "+919812345002",
        departmentId: engineering.id,
        managerId: priya.id,
        status: "Active",
        joiningDate: new Date("2023-03-20"),
      },
    });

    const sneha = await tx.employee.upsert({
      where: { tenantId_employeeCode: { tenantId: srijanLabs.id, employeeCode: "SRIJAN-0003" } },
      update: {},
      create: {
        tenantId: srijanLabs.id,
        employeeCode: "SRIJAN-0003",
        legalName: "Sneha Reddy",
        personalEmail: "sneha.reddy@srijanlabs.example",
        departmentId: peopleOps.id,
        status: "Draft",
      },
    });

    await tx.user.upsert({
      where: { tenantId_email: { tenantId: srijanLabs.id, email: "priya.sharma@srijanlabs.example" } },
      update: {},
      create: {
        tenantId: srijanLabs.id,
        email: "priya.sharma@srijanlabs.example",
        roles: ["org_admin"],
        employeeId: priya.id,
      },
    });

    await tx.user.upsert({
      where: { tenantId_email: { tenantId: srijanLabs.id, email: "rohit.singh@srijanlabs.example" } },
      update: {},
      create: {
        tenantId: srijanLabs.id,
        email: "rohit.singh@srijanlabs.example",
        roles: ["manager"],
        employeeId: rohit.id,
      },
    });

    await tx.user.upsert({
      where: { tenantId_email: { tenantId: srijanLabs.id, email: "sneha.reddy@srijanlabs.example" } },
      update: {},
      create: {
        tenantId: srijanLabs.id,
        email: "sneha.reddy@srijanlabs.example",
        roles: ["hr_ops"],
        employeeId: sneha.id,
      },
    });
  });

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.tenant_id', ${globex.id}, true)`;

    await tx.legalEntity.upsert({
      where: { tenantId_code: { tenantId: globex.id, code: "GLOBEX-US" } },
      update: {},
      create: { tenantId: globex.id, code: "GLOBEX-US", name: "Globex USA", country: "US" },
    });

    await seedLeavePolicies(tx, globex.id);

    const ops = await tx.department.upsert({
      where: { tenantId_code: { tenantId: globex.id, code: "OPS" } },
      update: {},
      create: { tenantId: globex.id, code: "OPS", name: "Operations" },
    });

    const alex = await tx.employee.upsert({
      where: { tenantId_employeeCode: { tenantId: globex.id, employeeCode: "GLX-0001" } },
      update: {},
      create: {
        tenantId: globex.id,
        employeeCode: "GLX-0001",
        legalName: "Alex Carter",
        personalEmail: "alex.carter@globex.example",
        departmentId: ops.id,
        status: "Active",
        joiningDate: new Date("2022-06-01"),
      },
    });

    await tx.user.upsert({
      where: { tenantId_email: { tenantId: globex.id, email: "alex.carter@globex.example" } },
      update: {},
      create: {
        tenantId: globex.id,
        email: "alex.carter@globex.example",
        roles: ["org_admin"],
        employeeId: alex.id,
      },
    });
  });

  console.log("Seeded tenants:", { srijanLabs: srijanLabs.code, globex: globex.code });
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
