import { Module } from "@nestjs/common";
import { FilesModule } from "../files/files.module";
import { DocumentGenerationController } from "./document-generation.controller";
import { DocumentGenerationService } from "./document-generation.service";
import { DocumentTemplateRepository } from "./document-template.repository";
import { GeneratedDocumentRepository } from "./generated-document.repository";

/** Foundation & Platform (E00) — Document Generation + Template engines. */
@Module({
  imports: [FilesModule],
  controllers: [DocumentGenerationController],
  providers: [DocumentGenerationService, DocumentTemplateRepository, GeneratedDocumentRepository],
  exports: [DocumentGenerationService, DocumentTemplateRepository],
})
export class DocumentGenerationModule {}
