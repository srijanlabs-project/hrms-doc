import { PrismaClient } from "@prisma/client";

/**
 * Local dev seed: two tenants, each with a legal entity, departments, and
 * employees, so RLS isolation and the People/Org UI can be demonstrated with
 * realistic data. Run with `npm run db:seed`.
 */
const prisma = new PrismaClient();

async function main() {
  const acme = await prisma.tenant.upsert({
    where: { code: "acme" },
    update: {},
    create: { code: "acme", name: "Acme Manufacturing Pvt Ltd" },
  });

  const globex = await prisma.tenant.upsert({
    where: { code: "globex" },
    update: {},
    create: { code: "globex", name: "Globex Technology Services" },
  });

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.tenant_id', ${acme.id}, true)`;

    await tx.legalEntity.upsert({
      where: { tenantId_code: { tenantId: acme.id, code: "ACME-IN" } },
      update: {},
      create: { tenantId: acme.id, code: "ACME-IN", name: "Acme India", country: "IN" },
    });

    const engineering = await tx.department.upsert({
      where: { tenantId_code: { tenantId: acme.id, code: "ENG" } },
      update: {},
      create: { tenantId: acme.id, code: "ENG", name: "Engineering" },
    });

    const peopleOps = await tx.department.upsert({
      where: { tenantId_code: { tenantId: acme.id, code: "PEOPLE" } },
      update: {},
      create: { tenantId: acme.id, code: "PEOPLE", name: "People Operations" },
    });

    const manager = await tx.employee.upsert({
      where: { tenantId_employeeCode: { tenantId: acme.id, employeeCode: "ACME-0001" } },
      update: {},
      create: {
        tenantId: acme.id,
        employeeCode: "ACME-0001",
        legalName: "Priya Sharma",
        preferredName: "Priya",
        dateOfBirth: new Date("1988-04-12"),
        personalEmail: "priya.sharma@acme.example",
        mobileNumber: "+919812345001",
        departmentId: engineering.id,
        status: "Active",
        joiningDate: new Date("2021-01-11"),
      },
    });

    await tx.employee.upsert({
      where: { tenantId_employeeCode: { tenantId: acme.id, employeeCode: "ACME-0002" } },
      update: {},
      create: {
        tenantId: acme.id,
        employeeCode: "ACME-0002",
        legalName: "Rohit Singh",
        preferredName: "Rohit",
        dateOfBirth: new Date("1994-08-02"),
        personalEmail: "rohit.singh@acme.example",
        mobileNumber: "+919812345002",
        departmentId: engineering.id,
        managerId: manager.id,
        status: "Active",
        joiningDate: new Date("2023-03-20"),
      },
    });

    await tx.employee.upsert({
      where: { tenantId_employeeCode: { tenantId: acme.id, employeeCode: "ACME-0003" } },
      update: {},
      create: {
        tenantId: acme.id,
        employeeCode: "ACME-0003",
        legalName: "Sneha Reddy",
        personalEmail: "sneha.reddy@acme.example",
        departmentId: peopleOps.id,
        status: "Draft",
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

    const ops = await tx.department.upsert({
      where: { tenantId_code: { tenantId: globex.id, code: "OPS" } },
      update: {},
      create: { tenantId: globex.id, code: "OPS", name: "Operations" },
    });

    await tx.employee.upsert({
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
  });

  console.log("Seeded tenants:", { acme: acme.code, globex: globex.code });
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
