import { existsSync } from "node:fs";
import { join } from "node:path";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import type { Request, Response, NextFunction } from "express";
import { AppModule } from "./app.module";
import type { FieldError } from "./platform/errors/app-error";
import { ValidationAppError } from "./platform/errors/errors";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // All routes live under /api/v1 per the API standards in
  // docs/06-cross-cutting-specs and appendix 28 contract conventions.
  app.setGlobalPrefix("api/v1");

  // Required for AuthGuard to read the httpOnly session cookie off req.cookies.
  app.use(cookieParser());

  // Wave 2 W2·E27 Integration Platform gap closure: the entire real REST surface built across this
  // session is introspected automatically (nest-cli's @nestjs/swagger plugin infers DTO shapes from
  // class-validator decorators, no manual @ApiProperty annotation needed) rather than hand-documented.
  const openApiDocument = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("Staffsy API")
      .setDescription("Staffsy Enterprise HRMS REST API. Auth: sign in via /auth/login, then the httpOnly session cookie rides automatically.")
      .setVersion("1.0")
      .addCookieAuth("staffsy_session")
      .build(),
  );
  SwaggerModule.setup("api/docs", app, openApiDocument);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const fieldErrors: FieldError[] = errors.flatMap((error) =>
          Object.entries(error.constraints ?? {}).map(([code, message]) => ({
            field: error.property,
            code: code.toUpperCase(),
            message,
          })),
        );
        return new ValidationAppError(fieldErrors);
      },
    }),
  );

  // UAT/production deployment: the built web SPA is served from this same origin (see repo-root
  // Dockerfile), avoiding cross-origin cookie/CORS complexity entirely — no-op in local dev, where
  // apps/web is served by its own Vite dev server instead and this directory doesn't exist.
  const webDist = join(process.cwd(), "web-dist");
  if (existsSync(webDist)) {
    app.useStaticAssets(webDist);
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== "GET" || req.path.startsWith("/api/")) {
        next();
        return;
      }
      res.sendFile(join(webDist, "index.html"));
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
