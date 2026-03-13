import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import appConfig from "./config/app.config";
import databaseConfig from "./config/database.config";
import enviromentValidation from "./config/enviroment.validation";
import { MetaOptionsModule } from "./meta-options/meta-options.module";
import { PostsModule } from "./posts/posts.module";
import { TagsModule } from "./tags/tags.module";
import { UsersModule } from "./users/users.module";
const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    UsersModule,
    PostsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: [".env.development"],
      envFilePath: !ENV ? ".env" : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: enviromentValidation,
    }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        autoLoadEntities: configService.get("database.autoLoadEntities"),
        synchronize: configService.get("database.synchronize"),
        port: +configService.get("database.port"),
        username: configService.get("database.user"),
        password: configService.get("database.password"),
        host: configService.get("database.host"),
        database: configService.get("database.name"),
      }),
    }),
    TagsModule,
    MetaOptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
