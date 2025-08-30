import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from 'src/schemas/supportRequest.schema';
import {
  ISupportRequestEmployeeService,
  MarkMessagesAsReadDto,
} from '../../interfaces/supportRequest';
import { NotFoundException } from '@nestjs/common';
import { Id } from '../../interfaces/common';

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly SupportRequestModel: Model<SupportRequestDocument>,
  ) {}

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
        message.author.name === supportRequest.user.name &&
        message.sentAt < params.createdBefore
      ) {
        message.readAt = new Date();
      }
    });

    await supportRequest.save();
  }

  async getUnreadCount(supportRequestId: Id): Promise<number> {
    const supportRequest = await this.SupportRequestModel.findById(
      supportRequestId,
    );

    if (!supportRequest) {
      throw new NotFoundException('Request not found');
    }

    return supportRequest.messages.filter(
      (message) =>
        !message.readAt && message.author.name === supportRequest.user.name,
    ).length;
  }

  public async closeRequest(supportRequestId: Id): Promise<void> {
    const supportRequest = await this.SupportRequestModel.findById(
      supportRequestId,
    );

    if (!supportRequest) {
      throw new NotFoundException('Request not found');
    }

    await this.SupportRequestModel.updateOne(
      { _id: supportRequest },
      { isActive: false },
    );
  }
}
