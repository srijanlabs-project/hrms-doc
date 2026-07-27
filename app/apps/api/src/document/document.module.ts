import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PeopleModule } from "../people/people.module";
import { DocumentController } from "./document/document.controller";
import { DocumentRepository } from "./document/document.repository";
import { DocumentService } from "./document/document.service";
import { RetentionPolicyController } from "./retention-policy/retention-policy.controller";
import { RetentionPolicyRepository } from "./retention-policy/retention-policy.repository";
import { RetentionPolicyService } from "./retention-policy/retention-policy.service";

/**
 * Wave 4 W4·E24 Document Management, docs/03-module-specifications/24-document-management.md.
 * Templates and generation already existed (Foundation & Platform E00's
 * DocumentTemplate/GeneratedDocument); this module fills the remaining real
 * gap — a versioned document repository with retention. Digital signatures
 * and OCR stay deliberately deferred — no e-signature or OCR vendor exists
 * in this environment to integrate against.
 *
 * RetentionPolicyController is registered before DocumentController so its
 * literal "/documents/retention-policies" route is matched before
 * DocumentController's "/documents/:id" catch-all — route registration
 * order matters here since both are single-segment paths under "documents".
 */
@Module({
  imports: [AuthModule, PeopleModule],
  controllers: [RetentionPolicyController, DocumentController],
  providers: [RetentionPolicyRepository, RetentionPolicyService, DocumentRepository, DocumentService],
})
export class DocumentModule {}
