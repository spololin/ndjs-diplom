import { ID } from '../../common/types';
import { Message } from '../../schemas/message.schema';
import { SupportRequest } from '../../schemas/supportRequest.schema';

export interface CreateSupportRequestDto {
  user: ID;
  text: string;
}

export interface SendMessageDto {
  author: ID;
  supportRequest: ID;
  text: string;
}

export interface MarkMessagesAsReadDto {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}

export interface GetChatListParams extends SearchRequestsParams {
  user: ID | null;
}

export interface ISupportRequestService {
  findSupportRequests(params: SearchRequestsParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: ID): Promise<Message[]>;
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void;
}

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<number>;
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<number>;
  closeRequest(supportRequest: ID): Promise<void>;
}

export interface SearchRequestsParams {
  limit?: number;
  offset?: number;
  isActive?: boolean;
}
