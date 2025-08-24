import { Injectable } from '@nestjs/common';
import {
  GetChatListParams,
  ISupportRequestService,
  SendMessageDto,
} from '../../interfaces/chat';
import { ID } from 'src/common/types';
import { Message } from 'src/schemas/message.schema';
import {
  SupportRequest,
  SupportRequestDocument,
} from 'src/schemas/supportRequest.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChatService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequestDocument>,
  ) {}
  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequestDocument[]> {
    const query = {
      user: params.user,
      isActive: params.isActive,
    };
    return await this.supportRequestModel
      .find(query)
      .populate('user')
      .limit(<number>params.limit)
      .skip(<number>params.offset)
      .exec();
  }
  sendMessage(data: SendMessageDto): Promise<Message> {
    throw new Error('Method not implemented.');
  }
  getMessages(supportRequest: ID): Promise<Message[]> {
    throw new Error('Method not implemented.');
  }
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    throw new Error('Method not implemented.');
  }
}
