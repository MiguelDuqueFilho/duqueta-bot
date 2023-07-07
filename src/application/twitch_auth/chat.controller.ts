// import { Controller, Get, Module } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { TwitchBotAdapter, TwitchBotModule } from 'nestjs-twurple';
// import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

// // Definir controlador para manipular mensagens do chat
// @Controller()
// export class ChatController {
//   constructor(private readonly botAdapter: TwitchBotAdapter) {}

//   @Get('chat')
//   @ApiTags('Chat')
//   @ApiBearerAuth()
//   @ApiResponse({ status: 200, description: 'OK' })
//   getChatMessages() {
//     return this.botAdapter.getChatMessages();
//   }
// }
