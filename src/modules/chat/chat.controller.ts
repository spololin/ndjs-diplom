import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SupportRequestDocument } from '../../schemas/supportRequest.schema';
import { ChatClientService } from './chat-client.service';
import * as chat from '../../interfaces/chat';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(
    private readonly chatClientService: ChatClientService,
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
  async getSupportRequest(@Query() query: chat.SearchRequestsParams) {
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
}
