import { IsBoolean } from 'class-validator';
import { CreateImageDto } from './create-image.dto';

export class SaveImage {
    @IsBoolean()
    isSave: boolean;
}
