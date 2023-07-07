import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshingAuthProvider, exchangeCode } from '@twurple/auth';
import { ChatClient, PrivateMessage } from '@twurple/chat';
import { promises as fs, existsSync } from 'node:fs';

@Injectable()
export class TwitchChatbotService implements OnModuleInit {
  private authProvider: RefreshingAuthProvider;
  private chatClient: ChatClient;

  constructor(private config: ConfigService) {
    // Configurações de autenticação
    this.authProvider = new RefreshingAuthProvider({
      clientId: this.config.get('TWITCH_BOT_CLIENTID'),
      clientSecret: this.config.get('TWITCH_CLIENT_SECRET'),

      onRefresh: async (userId, newTokenData) =>
        await fs.writeFile(
          `./src/tokens/tokens.duquetabot.json`,
          JSON.stringify(newTokenData, null, 4),
          'utf-8',
        ),
    });

    // Inicializa o cliente de chat
  }

  async onModuleInit() {
    console.log(
      `onModuleInit: TWITCH_CHANNEL_NAME: ${this.config.get(
        'TWITCH_CHANNEL_NAME',
      )}`,
    );

    const exists = existsSync(`./src/tokens/tokens.duquetabot.json`);
    if (!exists) {
      console.log(`file not exists`);
      return;
    }

    const tokenData = JSON.parse(
      await fs.readFile(`./src/tokens/tokens.duquetabot.json`, 'utf-8'),
    );

    await this.authProvider.addUserForToken(tokenData, [`chat`]);

    this.chatClient = new ChatClient({
      authProvider: this.authProvider,
      authIntents: [`chatBotFor:#${this.config.get('TWITCH_CHANNEL_NAME')}`],
      channels: [`#${this.config.get('TWITCH_CHANNEL_NAME')}`],
      logger: {
        minLevel: 'debug',
      },
    });

    // Registra um ouvinte de mensagens de chat
    this.chatClient.onMessage(this.handleOnMessage.bind(this));

    await this.startChatbot();
  }

  async startChatbot() {
    // Conecta-se ao chat da Twitch
    await this.chatClient.connect();
  }

  async stopChatbot() {
    // Desconecta-se do chat da Twitch
    this.chatClient.quit();
  }

  async handleOnMessage(
    channel: string,
    user: string,
    message: string,
    msg: PrivateMessage,
  ): Promise<void> {
    // Lógica para tratar as mensagens recebidas
    console.log(
      `handleMessage user: ${user}, channel: ${channel}, message: ${message},`,
      msg,
    );
    await this.chatClient.say(channel, `teste com #miguelduquefilho`);
  }

  async callbackGet(param: any): Promise<any> {
    console.log(`param: `, param);
    const { code } = param;

    const tokenData = await exchangeCode(
      this.config.get('TWITCH_BOT_CLIENTID'),
      this.config.get('TWITCH_CLIENT_SECRET'),
      code,
      this.config.get('TWITCH_REDIRECT_URI'),
    );

    console.log(`tokenData: `, tokenData);

    await fs.writeFile(
      `./src/tokens/tokens.duquetabot.json`,
      JSON.stringify(tokenData, null, 4),
      'utf-8',
    );

    return tokenData;
  }

  async callbackPost(body: any): Promise<any> {
    console.log(`body: `, body);

    await fs.writeFile(
      `./src/tokens/tokens.duquetabot.json`,
      JSON.stringify(body, null, 4),
      'utf-8',
    );
    console.log(`AccessToken: `, body);
    return body;
  }
}
