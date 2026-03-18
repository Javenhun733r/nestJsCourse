import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { appCreate } from "src/app.create";
import { AppModule } from "src/app.module";
import { MailService } from "src/mail/providers/mail.service";
import { App } from "supertest/types";

export async function bootstrapNestApplication(): Promise<
  INestApplication<App>
> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MailService)
    .useValue({
      sendUserWelcome: jest.fn(() => Promise.resolve()),
    })
    .compile();

  const app = moduleFixture.createNestApplication();
  appCreate(app);
  await app.init();
  return app;
}
