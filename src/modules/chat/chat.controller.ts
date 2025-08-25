import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SupportRequestDocument } from '../../schemas/supportRequest.schema';
import { ChatClientService } from './chat-client.service';
import * as chat from '../../interfaces/chat';
import { ChatService } from './chat.service';
import * as commonTypes from '../../common/types';
import { ChatEmployeeService } from './chat-employee.service';

@Controller()
export class ChatController {
  constructor(
    private readonly chatClientService: ChatClientService,
    private readonly chatManagerService: ChatEmployeeService,
    private readonly chatService: ChatService,
  ) {}

  @Post('client/support-requests')
  async createSupportRequest(
    @Body('text')
    text: string,
  ) {
    const data: chat.CreateSupportRequestDto = {
      user: '123',
      text,
    };
    const request = (await this.chatClientService.createSupportRequest(
      data,
    )) as unknown as SupportRequestDocument;

    return {
      id: request._id,
      createdAt: request.createdAt.toISOString(),
      isActive: request.isActive,
      hasNewMessages: false,
    };
  }

  @Get('client/support-requests')
  async getClientSupportRequest(@Query() query: chat.SearchRequestsParams) {
    const requests = await this.chatService.findSupportRequests({
      ...query,
      user: '123',
    });

    return requests.map(async (request) => ({
      id: request._id,
      createdAt: request.createdAt.toISOString(),
      isActive: request.isActive,
      hasNewMessages:
        (await this.chatClientService.getUnreadCount(request.id)) > 0,
    }));
  }

  @Get('manager/support-requests')
  async getManagerSupportRequest(@Query() query: chat.SearchRequestsParams) {
    const requests = await this.chatService.findSupportRequests({
      ...query,
    });

    return requests.map(async (request) => ({
      id: request._id,
      createdAt: request.createdAt.toISOString(),
      isActive: request.isActive,
      hasNewMessages:
        (await this.chatManagerService.getUnreadCount(request.id)) > 0,
    }));
  }

  @Get('common/support-requests/:id/messages')
  async historyMessage(@Param('id') id: commonTypes.ID) {
    const messages = await this.chatService.getMessages(id);

    return messages.map((message) => ({
      id: message._id,
      createdAt: message.sentAt,
      text: message.text,
      author: {
        id: message.author._id,
        name: message.author.name,
      },
    }));
  }

  @Post('common/support-requests/:id/messages')
  async sendMessage(
    @Param('id') id: commonTypes.ID,
    @Body('text') text: string,
  ) {
    await this.chatService.sendMessage({
      text,
      author: '123',
      supportRequest: id,
    });

    const messages = await this.chatService.getMessages(id);

    return messages.map((message) => ({
      id: message._id,
      createdAt: message.sentAt,
      text: message.text,
      author: {
        id: message.author._id,
        name: message.author.name,
      },
    }));
  }

  @Post('common/support-requests/:id/messages/read')
  async readMessage(
    @Param('id') id: commonTypes.ID,
    @Body('createdBefore') createdBefore: string,
  ) {
    // TODO добавить пользователя и разделить по ролям
    await this.chatClientService.markMessagesAsRead({
      user: '123',
      supportRequest: id,
      createdBefore: new Date(createdBefore),
    });

    await this.chatManagerService.markMessagesAsRead({
      user: '123',
      supportRequest: id,
      createdBefore: new Date(createdBefore),
    });

    return {
      success: true,
    };
  }
}
