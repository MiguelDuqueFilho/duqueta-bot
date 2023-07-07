// import { Injectable } from '@nestjs/common';
// import { twitchChannel } from '../../config';
// import { RefreshingAuthProvider, exchangeCode } from '@twurple/auth';
// import { ChatClient } from '@twurple/chat';
// import { promises as fs } from 'node:fs';

// import {
//   twitchClientId,
//   twitchClientSecret,
//   twitchRedirectUri,
// } from '../../config';

// @Injectable()
// export class TwitchAuthService {
//   private clientId = twitchClientId;
//   private clientSecret = twitchClientSecret;
//   private redirectUri = twitchRedirectUri;
//   private channel = twitchChannel;
//   private authProvider: RefreshingAuthProvider;
//   private bot: ChatClient;

//   constructor() {
//     this.authProvider = new RefreshingAuthProvider({
//       clientId: this.clientId,
//       clientSecret: this.clientSecret,
//       onRefresh: async (userid, newTokenData) =>
//         await fs.writeFile(
//           `./tokens.${userid}.json`,
//           JSON.stringify(newTokenData, null, 4),
//           'utf-8',
//         ),
//     });
//   }

//   async tokenInitial() {
//     const code = req.query.code; // get it from wherever
//     const redirectUri = 'http://localhost'; // must match one of the URLs in the dev console exactly
//     const tokenData = await exchangeCode(
//       clientId,
//       clientSecret,
//       code,
//       redirectUri,
//     );
//   }

//   async startBot() {
//     const tokenData = JSON.parse(
//       await fs.readFile('./tokens.11111111.json', 'utf-8'),
//     );
//     await this.authProvider.addUserForToken(tokenData, ['chat']);
//   }
// }
