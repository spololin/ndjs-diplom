import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ISupportRequestEmployeeService,
  MarkMessagesAsReadDto,
} from '../../interfaces/chat';
import { ID } from 'src/common/types';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../../schemas/message.schema';
import { Model } from 'mongoose';
import { SupportRequest } from '../../schemas/supportRequest.schema';

@Injectable()
export class ChatEmployeeService implements ISupportRequestEmployeeService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequest>,
  ) {}
  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const supportRequest = await this.supportRequestModel.findById(
      params.supportRequest,
    );

    if (!supportRequest) {
      throw new Error('Request not found');
    }

    supportRequest.messages.forEach((message) => {
      if (
        !message.readAt &&
        message.author.name === supportRequest.userId.name
      ) {
        message.readAt = new Date();
      }
    });

    await supportRequest.save();
  }
  async getUnreadCount(supportRequestId: ID): Promise<number> {
    const supportRequest =
      await this.supportRequestModel.findById(supportRequestId);

    if (!supportRequest) {
      throw new NotFoundException('Request not found');
    }

    return supportRequest.messages.filter(
      (message) =>
        !message.readAt && message.author.name === supportRequest.userId.name,
    ).length;
  }
  async closeRequest(supportRequest: ID): Promise<void> {
    await this.supportRequestModel.updateOne(
      { _id: supportRequest },
      { isActive: false },
    );
  }
}
