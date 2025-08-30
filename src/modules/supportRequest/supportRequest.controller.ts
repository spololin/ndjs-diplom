import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/roles.decorator';
import { SupportRequestClientService } from './supportRequestClient.service';
import { SupportRequestEmployeeService } from './supportRequestEmployee.service';
import { SupportRequestService } from './supportRequest.service';
import { Id } from '../../interfaces/common';
import {
  CreateSupportRequestDto,
  SearchRequestsParams,
} from '../../interfaces/supportRequest';
import { User } from '../../decorators/user.decorator';

@Controller()
export class SupportRequestController {
  constructor(
    private readonly supportRequestClient: SupportRequestClientService,
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @Roles('client')
  @UseGuards(RoleGuard)
  @Post('client/support-requests/')
  async create(@Body() body: { text: string }, @User() user) {
    const data: CreateSupportRequestDto = {
      user: user._id,
      text: body.text,
    };
    const supportRequest = await this.supportRequestClient.createSupportRequest(
      data,
    );

    return {
      id: supportRequest._id,
      createdAt: supportRequest.createdAt,
      isActive: supportRequest.isActive,
      hasNewMessages: false,
    };
  }

  @Roles('client')
  @UseGuards(RoleGuard)
  @Get('client/support-requests/')
  async getSupportRequestClient(
    @Query() query: SearchRequestsParams,
    @User() user,
  ) {
    const supportRequests =
      await this.supportRequestService.findSupportRequests({
        ...query,
        user: user._id,
      });

    return Promise.all(
      supportRequests.map(async (request) => {
        return {
          id: request._id.toString(),
          createdAt: request.createdAt,
          isActive: request.isActive,
          hasNewMessages:
            (await this.supportRequestClient.getUnreadCount(request._id)) > 0,
        };
      }),
    );
  }

  @Roles('manager')
  @UseGuards(RoleGuard)
  @Get('manager/support-requests/')
  async getManagerSupportRequestClient(@Query() query: SearchRequestsParams) {
    const requests = await this.supportRequestService.findSupportRequests(
      query,
    );

    return Promise.all(
      requests.map(async (request) => ({
        id: request._id,
        createdAt: request.createdAt,
        isActive: request.isActive,
        hasNewMessages:
          (await this.supportRequestEmployeeService.getUnreadCount(
            request._id,
          )) > 0,
      })),
    );
  }

  @Roles('client', 'manager')
  @UseGuards(RoleGuard)
  @Get('common/support-requests/:id/messages')
  async historyMessage(@Param('id') id: Id) {
    const messages = await this.supportRequestService.getMessages(id);

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

  @Roles('client', 'manager')
  @UseGuards(RoleGuard)
  @Post('common/support-requests/:id/messages')
  async sendMessage(
    @Param('id') id: Id,
    @Body('text') text: string,
    @User() user,
  ) {
    await this.supportRequestService.sendMessage({
      text,
      author: user._id,
      supportRequest: id,
    });

    const messages = await this.supportRequestService.getMessages(id);

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

  @Roles('client', 'manager')
  @UseGuards(RoleGuard)
  @Post('common/support-requests/:id/messages/read')
  async readMessage(
    @Param('id') id: Id,
    @Body('createdBefore') createdBefore: string,
    @User() user,
  ) {
    if (user.role === 'client') {
      await this.supportRequestClient.markMessagesAsRead({
        user: user._id,
        supportRequest: id,
        createdBefore: new Date(createdBefore),
      });
    }

    if (user.role === 'manager') {
      await this.supportRequestEmployeeService.markMessagesAsRead({
        user: user._id,
        supportRequest: id,
        createdBefore: new Date(createdBefore),
      });
    }

    return {
      success: true,
    };
  }
}
