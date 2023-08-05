import { Test, TestingModule } from '@nestjs/testing';
import { McommentController } from './mcomment.controller';
import { McommentService } from './mcomment.service';

describe('McommentController', () => {
  let controller: McommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McommentController],
      providers: [McommentService],
    }).compile();

    controller = module.get<McommentController>(McommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
