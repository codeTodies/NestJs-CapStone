import { Test, TestingModule } from '@nestjs/testing';
import { McommentService } from './mcomment.service';

describe('McommentService', () => {
  let service: McommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McommentService],
    }).compile();

    service = module.get<McommentService>(McommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
