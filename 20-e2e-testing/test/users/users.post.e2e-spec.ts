import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import request from "supertest";
import { App } from "supertest/types";
import { bootstrapNestApplication } from "test/helpers/bootstrap-nest-application.helper";
import { dropDatabase } from "test/helpers/drop-database.helper";
import {
  getCompleteUser,
  missingEmail,
  missingFirstName,
  missingPassword,
} from "./users.post.e2e-spec.sample-data";
interface UserResponse {
  data: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}
describe("[Users] @Post Endpoints", () => {
  jest.setTimeout(30000);
  let app: INestApplication<App>;
  let config: ConfigService;
  let httpServer: App;

  beforeAll(async () => {
    app = await bootstrapNestApplication();
    config = app.get<ConfigService>(ConfigService);
    httpServer = app.getHttpServer();
  });
  afterAll(async () => {
    await app.close();
    await dropDatabase(config);
  });
  it("/users - Endpoint is public", () => {
    return request(httpServer).post("/users").send({}).expect(400);
  });
  it("/users - firstName is mandatory", () => {
    return request(httpServer)
      .post("/users")
      .send(missingFirstName)
      .expect(400);
  });
  it("/users - email is mandatory", () => {
    return request(httpServer).post("/users").send(missingEmail).expect(400);
  });
  it("/users - password is mandatory", () => {
    return request(httpServer).post("/users").send(missingPassword).expect(400);
  });
  it("/users - Valid request successfully creates user", async () => {
    const completeUser = getCompleteUser();
    const response = await request(httpServer)
      .post("/users")
      .send(completeUser)
      .expect(201);
    const body = response.body as UserResponse;

    expect(body.data).toBeDefined();
    expect(body.data.firstName).toBe(completeUser.firstName);
    expect(body.data.lastName).toBe(completeUser.lastName);
    expect(body.data.email).toBe(completeUser.email);
  });
  it("/users - password is not returned in response", async () => {
    const completeUser = getCompleteUser();
    const response = await request(httpServer)
      .post("/users")
      .send(completeUser)
      .expect(201);
    const body = response.body as UserResponse;

    expect(body.data).not.toHaveProperty("password");
  });
  it("/users - googleId is not returned in response", async () => {
    const completeUser = getCompleteUser();
    const response = await request(httpServer)
      .post("/users")
      .send(completeUser)
      .expect(201);
    const body = response.body as UserResponse;

    expect(body.data).not.toHaveProperty("googleId");
  });
});
