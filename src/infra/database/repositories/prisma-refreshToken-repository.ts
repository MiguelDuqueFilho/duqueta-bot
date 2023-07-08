import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AccessToken } from '@twurple/auth';

@Injectable()
export class PrismaRefreshTokenRepository {
  logger = new Logger(PrismaRefreshTokenRepository.name);
  constructor(private prisma: PrismaService) {}

  async getAccessToken(channel: string): Promise<AccessToken | null> {
    this.logger.debug(`getAccessToken(channel: ${channel})`);
    const result = await this.prisma.refreshToken.findUnique({
      where: {
        channel,
      },
      select: {
        accessToken: true,
      },
    });
    this.logger.debug(`result getAccessToken: `, result);

    if (result) {
      const accessToken = JSON.parse(result.accessToken) as AccessToken;
      return accessToken;
    }
    return null;
  }

  async updateAccessToken(channel: string, accessToken: AccessToken) {
    this.logger.debug(
      `updateAccessToken(channel: ${channel}, accessToken: `,
      accessToken,
    );

    const stringAccessToken = JSON.stringify(accessToken);

    const result = await this.prisma.refreshToken.upsert({
      where: {
        channel,
      },
      update: {
        accessToken: stringAccessToken,
      },
      create: {
        channel,
        accessToken: stringAccessToken,
      },
    });

    this.logger.debug(`result updateAccessToken: `, result);

    return result;
  }

  async deleteAccessToken(channel: string) {
    this.logger.debug(`deleteAccessToken(channel: ${channel}`);

    const result = await this.prisma.refreshToken.delete({
      where: {
        channel,
      },
    });

    this.logger.debug(`result deleteAccessToken: `, result);

    return result;
  }
}
