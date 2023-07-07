import { z } from 'zod';

export const enviromentSchema = z.object({
  MODE: z
    .enum(['development', 'test', 'production'])
    .default('development')
    .describe('mode default development'),
  SERVER_HOST: z.string().url(),
  DATABASE_URL: z.string().url(),
  TWITCH_BOT_USERNAME: z.string().optional(),
  TWITCH_BOT_CLIENTID: z.string().optional(),
  TWITCH_CLIENT_SECRET: z.string().optional(),
  TWITCH_CHANNEL_NAME: z.string().optional(),
  TWITCH_REDIRECT_URI: z.string().optional(),
});
