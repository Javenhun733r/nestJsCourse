import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

export async function dropDatabase(config: ConfigService): Promise<void> {
  const AppDataSource = new DataSource({
    type: "postgres",
    host: config.get<string>("database.host"),
    port: config.get<number>("database.port"),
    username: config.get<string>("database.user"),
    password: config.get<string>("database.password"),
    database: config.get<string>("database.name"),
    synchronize: config.get<boolean>("database.synchronize"),
  });

  await AppDataSource.initialize();
  await AppDataSource.dropDatabase();
  await AppDataSource.destroy();
}
