import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestSchema,
} from '../../schemas/supportRequest.schema';
import { ChatClientService } from './chat-client.service';
import { ChatEmployeeService } from './chat-employee.service';
import { Message, MessageSchema } from '../../schemas/message.schema';

@Module({
  providers: [ChatService, ChatClientService, ChatEmployeeService],
  controllers: [ChatController],
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
})
export class ChatModule {}
