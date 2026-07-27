import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PeopleModule } from "../people/people.module";
import { EmergencyResponseContactController } from "./emergency-contact/emergency-response-contact.controller";
import { EmergencyResponseContactRepository } from "./emergency-contact/emergency-response-contact.repository";
import { EmergencyResponseContactService } from "./emergency-contact/emergency-response-contact.service";
import { HealthRecordController } from "./health-record/health-record.controller";
import { HealthRecordRepository } from "./health-record/health-record.repository";
import { HealthRecordService } from "./health-record/health-record.service";
import { SafetyAssessmentController } from "./safety-assessment/safety-assessment.controller";
import { SafetyAssessmentRepository } from "./safety-assessment/safety-assessment.repository";
import { SafetyAssessmentService } from "./safety-assessment/safety-assessment.service";
import { SafetyIncidentController } from "./safety-incident/safety-incident.controller";
import { SafetyIncidentRepository } from "./safety-incident/safety-incident.repository";
import { SafetyIncidentService } from "./safety-incident/safety-incident.service";

/**
 * Wave 4 W4·E22 Health Safety and Wellness, built from scratch —
 * docs/03-module-specifications/22-health-safety-wellness.md. Incident
 * reporting (real 4-state machine, collapsed from spec's 5), safety
 * assessments (type-tagged Audit|RiskAssessment|Drill), health records
 * (type-tagged, mirrors CertificationRecord), and an admin-managed
 * emergency-response directory. Wellness programs/EAP, ergonomic
 * assessments, and any real alert-broadcast channel stay deliberately
 * deferred — no vendor/hardware integration in this environment to justify
 * them. PPE tracking reuses Asset Management's category field (see
 * asset/dto/create-asset.dto.ts) rather than a new entity.
 */
@Module({
  imports: [AuthModule, PeopleModule],
  controllers: [
    SafetyIncidentController,
    SafetyAssessmentController,
    HealthRecordController,
    EmergencyResponseContactController,
  ],
  providers: [
    SafetyIncidentRepository,
    SafetyIncidentService,
    SafetyAssessmentRepository,
    SafetyAssessmentService,
    HealthRecordRepository,
    HealthRecordService,
    EmergencyResponseContactRepository,
    EmergencyResponseContactService,
  ],
})
export class HealthSafetyModule {}
