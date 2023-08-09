import { IsString } from "class-validator";

export class CreateImageDto {
    @IsString()
    author: string;
    @IsString()
    info: string;
    @IsString()
    fileName: string;
}
