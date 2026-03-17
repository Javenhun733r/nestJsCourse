import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { config } from "aws-sdk";
import { AppModule } from "./app.module";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle("NestJS Masterclass - Blog app API")
    .setDescription("Use the base API URL as http://localhost:3000")
    .setTermsOfService("http://localhost:3000/terms-of-service")
    .setLicense(
      "MIT License",
      "https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt",
    )
    .addServer("http://localhost:3000/")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);
  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get<string>("appConfig.awsAccessKeyId")!,
      secretAccessKey: configService.get<string>(
        "appConfig.awsSecretAccessKey",
      )!,
    },
    region: configService.get<string>("appConfig.awsRegion"),
  });
  app.enableCors();
  await app.listen(3000);
}

bootstrap().catch((err) => {
  console.error("Error starting server:", err);
});
