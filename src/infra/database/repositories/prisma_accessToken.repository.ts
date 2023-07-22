import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AccessToken } from '@twurple/auth';

@Injectable()
export class PrismaAccessTokenRepository {
  logger = new Logger(PrismaAccessTokenRepository.name);
  constructor(private prisma: PrismaService) {}

  async getAccessToken(user_id: string): Promise<AccessToken | null> {
    const resultAccessToken = await this.prisma.accessToken.findUnique({
      where: {
        user_id,
      },
      select: {
        access_token: true,
      },
    });

    if (!resultAccessToken) {
      this.logger.error(
        `getAccessToken(channel: ${user_id}, accessToken: not found`,
      );
      return null;
    }

    const accessToken = JSON.parse(
      resultAccessToken.access_token,
    ) as AccessToken;

    return accessToken;
  }

  async saveAccessToken(user_id: string, accessToken: AccessToken) {
    this.logger.verbose(
      `saveAccessToken(user_id: ${user_id}, accessToken: `,
      accessToken,
    );

    const stringAccessToken = JSON.stringify(accessToken);

    const result = await this.prisma.accessToken.upsert({
      where: {
        user_id,
      },
      update: {
        access_token: stringAccessToken,
      },
      create: {
        user_id,
        access_token: stringAccessToken,
      },
    });

    return result;
  }

  async deleteAccessToken(user_id: string) {
    this.logger.verbose(`deleteAccessToken(user_id: ${user_id}`);

    const result = await this.prisma.accessToken.delete({
      where: {
        user_id,
      },
    });

    return result;
  }
}
