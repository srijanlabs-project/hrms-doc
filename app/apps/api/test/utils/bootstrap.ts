import { ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import type { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { AppModule } from "../../src/app.module";
import type { FieldError } from "../../src/platform/errors/app-error";
import { ValidationAppError } from "../../src/platform/errors/errors";

/** Mirrors main.ts's bootstrap (global prefix, cookie parser, validation pipe) minus Swagger/static-asset serving, which e2e tests don't need. */
export async function bootstrapTestApp(): Promise<NestExpressApplication> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication<NestExpressApplication>();

  app.setGlobalPrefix("api/v1");
  app.use(cookieParser());
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

  await app.init();
  return app;
}

/** Extracts the httpOnly session cookie's `name=value` pair from a Set-Cookie response header, for use in a subsequent supertest request's Cookie header. */
export function extractCookie(setCookieHeader: string | string[] | undefined, name: string): string {
  const headers = Array.isArray(setCookieHeader) ? setCookieHeader : setCookieHeader ? [setCookieHeader] : [];
  const raw = headers.find((c) => c.startsWith(`${name}=`));
  if (!raw) {
    throw new Error(`Cookie "${name}" not found in Set-Cookie header`);
  }
  return raw.split(";")[0];
}
