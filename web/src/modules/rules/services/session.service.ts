import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../../../entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  /**
   * Fetches a session by its Shopify session ID
   * @param id
   */
  getSessionById(id: string) {
    return this.sessionRepository.findOneBy({ id });
  }
}
