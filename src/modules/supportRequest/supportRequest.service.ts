import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from 'src/schemas/supportRequest.schema';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import {
  GetChatListParams,
  ISupportRequestService,
  SendMessageDto,
} from '../../interfaces/supportRequest';
import { Id } from '../../interfaces/common';
import { EventEmitter } from 'node:events';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  public eventEmitter: EventEmitter;

  constructor(
    @InjectModel(SupportRequest.name)
    private readonly SupportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private readonly MessageModel: Model<MessageDocument>,
  ) {
    this.eventEmitter = new EventEmitter();
  }

  public async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequest[]> {
    const query: {
      user?: Id;
      isActive?: boolean;
    } = {};

    if (params.user) {
      query.user = params.user;
    }

    if (params.isActive) {
      query.isActive = params.isActive;
    }

    return await this.SupportRequestModel.find(query)
      .populate('user')
      .limit(params.limit)
      .skip(params.offset)
      .exec();
  }

  public async sendMessage(data: SendMessageDto): Promise<Message> {
    const supportRequest = await this.SupportRequestModel.findOne({
      _id: data.supportRequest,
    });

    if (!supportRequest) {
      throw new NotFoundException('Support request not found');
    }

    const message = new this.MessageModel({
      ...data,
      sentAt: new Date(),
    });
    await (await message.save()).populate('author');

    supportRequest.messages.push(message);
    await supportRequest.save();

    this.eventEmitter.emit('message', {
      supportRequest,
      message,
    });

    return message;
  }

  public async getMessages(supportRequestId: Id): Promise<Message[]> {
    const supportRequest = await this.SupportRequestModel.findOne({
      _id: supportRequestId,
    });

    if (!supportRequest) {
      throw new NotFoundException('Support request not found');
    }

    return await this.MessageModel.find({
      _id: { $in: supportRequest.messages },
    })
      .populate('author')
      .exec();
  }

  public subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    this.eventEmitter.on('message', ({ supportRequest, message }) => {
      handler(supportRequest, message);
    });

    return;
  }
}
