import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateImageDto {
    @IsNumber()
    authorID: number;
    @IsString()
    content: string;
    @IsString()
    fileName: string;
    @IsBoolean()
    isSave: boolean;
}
