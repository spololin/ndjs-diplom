import { Injectable } from '@nestjs/common';
import {
  ISupportRequestEmployeeService,
  MarkMessagesAsReadDto,
} from '../../interfaces/chat';
import { ID } from 'src/common/types';

@Injectable()
export class ChatEmployeeService implements ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto) {
    throw new Error('Method not implemented.');
  }
  getUnreadCount(supportRequest: ID): Promise<number> {
    throw new Error('Method not implemented.');
  }
  closeRequest(supportRequest: ID): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
