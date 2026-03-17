import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { fileTypes } from "../enums/file-types.enum";
import { UploadFile } from "../interfaces/upload-file.interface";
import { Upload } from "../upload.entity";
import { UploadToAwsProvider } from "./upload-to-aws.provider";

@Injectable()
export class UploadsService {
  constructor(
    /**
     * Inject uploadToAwsProvider
     */
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    /**
     * Inject configService
     */
    private readonly configService: ConfigService,
    /**
     * Inject uploadsRepository
     */
    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,
  ) {}
  public async uploadFile(file: Express.Multer.File) {
    if (
      !["image/gif", "image/jpeg", "image/jpg", "image/png"].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException("MIME type not supported");
    }
    try {
      const name = await this.uploadToAwsProvider.fileUpload(file);
      const uploadFile: UploadFile = {
        name: name,
        path: `https://${this.configService.get<string>("appConfig.awsCloudfrontUrl")}/${name}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };
      const upload = this.uploadsRepository.create(uploadFile);
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
