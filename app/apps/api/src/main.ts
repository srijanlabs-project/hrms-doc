import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // All routes live under /api/v1 per the API standards in
  // docs/06-cross-cutting-specs and appendix 28 contract conventions.
  app.setGlobalPrefix("api/v1");
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
