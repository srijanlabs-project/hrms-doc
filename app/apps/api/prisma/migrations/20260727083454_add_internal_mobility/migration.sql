-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "employee_id" UUID;

-- AlterTable
ALTER TABLE "requisitions" ADD COLUMN     "is_internal" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
