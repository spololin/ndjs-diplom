import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GetChatListParams,
  ISupportRequestService,
  SendMessageDto,
} from '../../interfaces/chat';
import { ID } from 'src/common/types';
import { Message, MessageDocument } from 'src/schemas/message.schema';
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
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}
  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequestDocument[]> {
    const query: {
      user?: ID;
      isActive?: boolean;
    } = {};

    if (params.user) {
      query.user = params.user;
    }

    if (params.isActive) {
      query.isActive = params.isActive;
    }

    return await this.supportRequestModel
      .find(query)
      .populate('user')
      .limit(<number>params.limit)
      .skip(<number>params.offset)
      .exec();
  }
  async sendMessage(data: SendMessageDto): Promise<MessageDocument> {
    const supportRequest = await this.supportRequestModel.findOne({
      _id: data.supportRequest,
    });

    if (!supportRequest) {
      throw new Error('Support request not found');
    }

    const message = new this.messageModel(data);
    await (await message.save()).populate('author');

    supportRequest.messages.push(message);
    await supportRequest.save();

    return message;
  }
  async getMessages(supportRequestId: ID): Promise<MessageDocument[]> {
    const supportRequest = await this.supportRequestModel.findOne({
      _id: supportRequestId,
    });

    if (!supportRequest) {
      throw new NotFoundException('Support request not found');
    }

    return await this.messageModel
      .find({ _id: { $in: supportRequest.messages } })
      .populate('author')
      .exec();
  }
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    throw new Error('Method not implemented.');
  }
}
