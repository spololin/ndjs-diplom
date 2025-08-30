import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/schemas/message.schema';
import {
  SupportRequest,
  SupportRequestSchema,
} from 'src/schemas/supportRequest.schema';
import { SupportRequestController } from './supportRequest.controller';
import { SupportRequestService } from './supportRequest.service';
import { SupportRequestClientService } from './supportRequestClient.service';
import { SupportRequestEmployeeService } from './supportRequestEmployee.service';
import { SupportRequestGateway } from './gateway/supportRequest.gateway';

function createProvider(provider: any) {
  return {
    provide: provider,
    useClass: provider,
  };
}

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [SupportRequestController],
  providers: [
    createProvider(SupportRequestService),
    createProvider(SupportRequestClientService),
    createProvider(SupportRequestEmployeeService),
    createProvider(SupportRequestGateway),
  ],
})
export class SupportRequestModule {}
