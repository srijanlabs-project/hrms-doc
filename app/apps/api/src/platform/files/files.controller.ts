import { Controller, Get, HttpCode, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { ValidationAppError } from "../errors/errors";
import { FilesService } from "./files.service";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** File Storage engine — HTTP only, no business logic. See files.service.ts. */
@Controller("files")
export class FilesController {
  constructor(private readonly service: FilesService) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: MAX_UPLOAD_BYTES } }))
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new ValidationAppError([{ field: "file", code: "REQUIRED", message: "A file is required." }]);
    }
    const data = await this.service.upload(file);
    return { data };
  }

  @Get(":id")
  async download(@Param("id") id: string, @Res() res: Response) {
    const { file, stream } = await this.service.getForDownload(id);
    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.originalName)}"`);
    stream.pipe(res);
  }
}
