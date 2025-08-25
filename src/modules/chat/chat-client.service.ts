import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateSupportRequestDto,
  ISupportRequestClientService,
  MarkMessagesAsReadDto,
} from '../../interfaces/chat';
import { ID } from 'src/common/types';
import {
  SupportRequest,
  SupportRequestDocument,
} from 'src/schemas/supportRequest.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChatClientService implements ISupportRequestClientService {
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequest>,
  ) {}
  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequestDocument> {
    const supportRequest = new this.supportRequestModel(data);
    await (await supportRequest.save()).populate('user');

    return supportRequest;
  }
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
        message.author.name !== supportRequest.userId.name
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
        !message.readAt && message.author.name !== supportRequest.userId.name,
    ).length;
  }
}
