import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Message } from '../../../schemas/message.schema';
import { SupportRequest } from '../../../schemas/supportRequest.schema';
import { SupportRequestService } from '../supportRequest.service';
import { User } from '../../../decorators/user.decorator';

@WebSocketGateway()
export class SupportRequestGateway {
  constructor(private readonly supportRequestsService: SupportRequestService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('subscribeToChat')
  async handleMessage(
    @MessageBody('chatId') chatId: string,
    @ConnectedSocket() socket: Socket,
    @User() user,
  ) {
    if (user.role === 'admin') {
      throw new WsException('Access denied');
    }

    if (user.role === 'client') {
      const supportRequests =
        await this.supportRequestsService.findSupportRequests({
          user: user._id,
        });

      if (
        !supportRequests.some((request) => request._id.toString() === chatId)
      ) {
        throw new WsException('Chat not found');
      }
    }

    this.supportRequestsService.subscribe(
      (supportRequest: SupportRequest, message: Message) => {
        if (String(supportRequest) === chatId) {
          socket.emit(chatId, message);
        }
      },
    );
  }
}
