import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from 'src/schemas/supportRequest.schema';
import {
  CreateSupportRequestDto,
  ISupportRequestClientService,
  MarkMessagesAsReadDto,
} from '../../interfaces/supportRequest';
import { Id } from '../../interfaces/common';

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly SupportRequestModel: Model<SupportRequestDocument>,
  ) {}

  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    const request = new this.SupportRequestModel({
      user: data.user,
      createdAt: new Date(),
      messages: [],
      isActive: true,
    });
    await request.save();

    return request;
  }

  public async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const supportRequest = await this.SupportRequestModel.findById(
      params.supportRequest,
    );

    if (!supportRequest) {
      throw new NotFoundException('Request not found');
    }

    supportRequest.messages.forEach((message) => {
      if (
        !message.readAt &&
        message.author.name !== supportRequest.user.name &&
        message.sentAt < params.createdBefore
      ) {
        message.readAt = new Date();
      }
    });

    await supportRequest.save();
  }

  public async getUnreadCount(supportRequestId: Id): Promise<number> {
    const supportRequest = await this.SupportRequestModel.findById(
      supportRequestId,
    );

    if (!supportRequest) {
      throw new NotFoundException('Request not found');
    }

    return supportRequest.messages.filter(
      (message) =>
        !message.readAt && message.author.name !== supportRequest.user.name,
    ).length;
  }
}
