import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import type { FieldError } from "./platform/errors/app-error";
import { ValidationAppError } from "./platform/errors/errors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // All routes live under /api/v1 per the API standards in
  // docs/06-cross-cutting-specs and appendix 28 contract conventions.
  app.setGlobalPrefix("api/v1");

  // Required for AuthGuard to read the httpOnly session cookie off req.cookies.
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

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
