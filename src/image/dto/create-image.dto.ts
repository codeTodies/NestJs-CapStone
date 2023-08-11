import { IsBoolean, IsString } from "class-validator";

export class CreateImageDto {
    @IsString()
    author: string;
    @IsString()
    content: string;
    @IsString()
    fileName: string;
    @IsBoolean()
    isSave: boolean;
}
