import { Id } from 'src/interfaces/common';
import { Message } from '../../schemas/message.schema';
import { SupportRequest } from '../../schemas/supportRequest.schema';

export interface CreateSupportRequestDto {
  user: Id;
  text: string;
}

export interface SendMessageDto {
  author: Id;
  supportRequest: Id;
  text: string;
}

export interface MarkMessagesAsReadDto {
  user: Id;
  supportRequest: Id;
  createdBefore: Date;
}

export interface GetChatListParams extends SearchRequestsParams {
  user?: Id;
}

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: Id): Promise<Message[]>;
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void;
}

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: Id): Promise<number>;
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: Id): Promise<number>;
  closeRequest(supportRequest: Id): Promise<void>;
}

export interface SearchRequestsParams {
  limit?: number;
  offset?: number;
  isActive?: boolean;
}
