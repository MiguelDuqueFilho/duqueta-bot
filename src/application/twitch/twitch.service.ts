// twitch.service.ts
import { Injectable, Logger } from '@nestjs/common';
import {
  Client,
  ChatUserstate,
  AnonSubGiftUpgradeUserstate,
  SubMethods,
  AnonSubMysteryGiftUserstate,
  AnonSubGiftUserstate,
  BanUserstate,
  EmoteObj,
  SubGiftUpgradeUserstate,
  DeleteUserstate,
  PrimeUpgradeUserstate,
  SubUserstate,
  RoomState,
  SubGiftUserstate,
  SubMysteryGiftUserstate,
  TimeoutUserstate,
} from 'tmi.js';
import { catchConnectError } from './error/catchConnectError';

@Injectable()
export class TwitchService {
  private logger = new Logger('TwitchService');
  private readonly twitchClient: Client;

  constructor() {
    this.twitchClient = new Client({
      options: { debug: true },
      identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN,
      },
      connection: {
        secure: true,
        reconnect: true,
      },
      channels: [process.env.TWITCH_CHANNEL_NAME],
    });

    //! event about connection
    this.twitchClient.on('connected', this.connect.bind(this));
    this.twitchClient.on('connecting', this.connecting.bind(this));
    this.twitchClient.on('reconnect', this.reconnect.bind(this));
    this.twitchClient.on('disconnected', this.disconnected.bind(this));
    this.twitchClient.on('ping', this.ping.bind(this));
    this.twitchClient.on('pong', this.pong.bind(this));

    //! event about handle events
    this.twitchClient.on('action', this.action.bind(this));
    this.twitchClient.on(
      'anongiftpaidupgrade',
      this.anongiftpaidupgrade.bind(this),
    );
    this.twitchClient.on('ban', this.ban.bind(this));
    this.twitchClient.on('cheer', this.cheer.bind(this));
    this.twitchClient.on('messagedeleted', this.messagedeleted.bind(this));
    this.twitchClient.on('mod', this.mod.bind(this));
    this.twitchClient.on('mods', this.mods.bind(this));
    this.twitchClient.on('clearchat', this.clearchat.bind(this));
    this.twitchClient.on('emoteonly', this.emoteonly.bind(this));
    this.twitchClient.on('emotesets', this.emotesets.bind(this));
    this.twitchClient.on('followersonly', this.followersonly.bind(this));
    this.twitchClient.on('giftpaidupgrade', this.giftpaidupgrade.bind(this));

    this.twitchClient.on(
      'anonsubmysterygift',
      this.anonsubmysterygift.bind(this),
    );
    this.twitchClient.on('anonsubgift', this.anonsubgift.bind(this));
    this.twitchClient.on('automod', this.automod.bind(this));
    this.twitchClient.on('chat', this.chat.bind(this));
    this.twitchClient.on('logon', this.logon.bind(this));
    this.twitchClient.on('primepaidupgrade', this.primepaidupgrade.bind(this));
    this.twitchClient.on('redeem', this.redeem.bind(this));
    this.twitchClient.on('serverchange', this.serverchange.bind(this));
    this.twitchClient.on('submysterygift', this.submysterygift.bind(this));

    this.twitchClient.on('raw_message', this.raw_message.bind(this));

    this.twitchClient.on('subgift', this.subgift.bind(this));
    this.twitchClient.on('resub', this.resub.bind(this));
    this.twitchClient.on('roomstate', this.roomstate.bind(this));
    this.twitchClient.on('hosting', this.hosting.bind(this));
    this.twitchClient.on('hosted', this.hosted.bind(this));
    this.twitchClient.on('raided', this.raided.bind(this));
    this.twitchClient.on('part', this.part.bind(this));
    this.twitchClient.on('r9kbeta', this.r9kbeta.bind(this));
    this.twitchClient.on('slowmode', this.slowmode.bind(this));
    this.twitchClient.on('subscribers', this.subscribers.bind(this));
    this.twitchClient.on('vips', this.vips.bind(this));
    this.twitchClient.on('whisper', this.whisper.bind(this));
    this.twitchClient.on('unhost', this.unhost.bind(this));
    this.twitchClient.on('unmod', this.unmod.bind(this));
    this.twitchClient.on('join', this.join.bind(this));
    this.twitchClient.on('subscription', this.subscription.bind(this));
    this.twitchClient.on('timeout', this.timeout.bind(this));

    this.twitchClient.on('notice', this.notice.bind(this));
    this.twitchClient.on('message', this.message.bind(this));

    this.twitchClient.connect().catch(catchConnectError);
  }

  private sayTwitch(channel: string, message: string) {
    // Regular
    this.twitchClient.say(channel, message);
  }

  private actionTwitch(channel: string, message: string) {
    // Action
    this.twitchClient.action(channel, message);
  }

  //! functions of events about connection
  private connect(address: string, port: number) {
    this.logger.log(`twitch connected to ${address}:${port}`);
  }

  private connecting(address: string, port: number) {
    this.logger.log(`twitch connecting address=${address}, port=${port}`);
  }

  private disconnected(reason: string) {
    this.logger.log(`twitch disconnected, reason: ${reason}`);
  }

  private reconnect() {
    this.logger.debug(`twitch reconnect`);
  }

  private ping() {
    this.logger.debug(`twitch ping...`);
  }

  private pong(latency: number) {
    this.logger.debug(`twitch pong... latency: ${latency}`);
  }

  //! functions of events about events of twitch
  private raw_message(
    messageCloned: { [property: string]: any },
    message: { [property: string]: any },
  ) {
    const command = message['command'];

    switch (command) {
      case 'PING':
      case 'PONG':
      case 'ROOMSTATE': {
        return;
      }
      case 'JOIN': {
        this.logger.debug(`twitch raw_message -  command: ${command}`);
      }
      default: {
        this.logger.verbose(
          `twitch raw_message -  messageCloned: ${messageCloned}, message: ${message}`,
          message,
        );
      }
    }
  }

  private notice(
    channel: string,
    userstate: ChatUserstate,
    message: string,
    self: boolean,
  ) {
    if (self) return;

    this.logger.log(
      `twitch Notice - channel:${channel} ${userstate['display-name']}: ${message}`,
    );
  }

  private action(
    channel: string,
    userstate: ChatUserstate,
    message: string,
    self: boolean,
  ) {
    if (self) return;
    this.logger.debug(
      `twitch action - channel:${channel}, userstate: ${userstate}, userstate['display-name']: ${userstate['display-name']}, message: ${message}`,
    );
  }

  private anongiftpaidupgrade(
    channel: string,
    username: string,
    userstate: AnonSubGiftUpgradeUserstate,
  ) {
    this.logger.debug(
      `twitch anongiftpaidupgrade - channel:${channel}, username: ${username}, userstate: ${userstate}, userstate['display-name']: ${userstate['display-name']}`,
    );
  }

  private anonsubmysterygift(
    channel: string,
    numbOfSubs: number,
    methods: SubMethods,
    userstate: AnonSubMysteryGiftUserstate,
  ) {
    this.logger.debug(
      `twitch anonsubmysterygift - channel: ${channel}, numbOfSubs: ${numbOfSubs}, methods: ${methods}, userstate: ${userstate}`,
    );
  }

  private anonsubgift(
    channel: string,
    streakMonths: number,
    recipient: string,
    methods: SubMethods,
    userstate: AnonSubGiftUserstate,
  ) {
    this.logger.debug(
      `twitch anonsubgift - channel: ${channel}, streakMonths: ${streakMonths}, recipient: ${recipient}, methods: ${methods}, userstate: ${userstate}`,
    );
  }

  private automod(
    channel: string,
    msgID: 'msg_rejected' | 'msg_rejected_mandatory',
    message: string,
  ) {
    this.logger.debug(
      `twitch automod - channel: ${channel}, msgID: ${msgID}, message: ${message}`,
    );
  }

  private ban(
    channel: string,
    username: string,
    reason: string,
    userstate: BanUserstate,
  ) {
    this.logger.debug(
      `twitch ban - channel: ${channel}, username: ${username}, reason: ${reason}, userstate: ${userstate}`,
    );
  }

  private chat(
    channel: string,
    userstate: ChatUserstate,
    message: string,
    self: boolean,
  ) {
    if (self) return;

    this.logger.debug(
      `twitch chat - channel: ${channel}, userstate: ${userstate}, message: ${message}`,
      userstate,
    );
  }

  private cheer(channel: string, userstate: ChatUserstate, message: string) {
    this.logger.debug(
      `twitch cheer channel: ${channel}, userstate: ${userstate}, message: ${message}`,
    );
  }

  private clearchat(channel: string) {
    this.logger.debug(`twitch clearchat - channel ${channel} `);
  }

  private emoteonly(channel: string, enabled: boolean) {
    this.logger.debug(
      `twitch emoteonly - channel: ${channel}, enabled: ${enabled}`,
    );
  }
  private emotesets(sets: string, obj: EmoteObj) {
    this.logger.debug(`twitch emotesets sets: ${sets}, EmoteObj: ${obj}`);
  }

  private followersonly(channel: string, enabled: boolean, length: number) {
    this.logger.debug(
      `twitch followersonly - channel: ${channel}, enabled: ${enabled}, lenght: ${length}`,
    );
  }
  private giftpaidupgrade(
    channel: string,
    username: string,
    sender: string,
    userstate: SubGiftUpgradeUserstate,
  ) {
    this.logger.debug(
      `twitch giftpaidupgrade - channel: ${channel}, username: ${username}, sender: ${sender}, userstate: ${userstate}`,
    );
  }

  private hosted(
    channel: string,
    username: string,
    viewers: number,
    autohost: boolean,
  ) {
    this.logger.debug(
      `twitch hosted - channel: ${channel}, username: ${username}, viewers: ${viewers}, autohost: ${autohost}`,
    );
  }

  private hosting(channel: string, target: string, viewers: number) {
    this.logger.debug(
      `twitch hosting - channel: ${channel}, target: ${target}, viewers: ${viewers}`,
    );
  }

  private join(channel: string, username: string, self: boolean) {
    if (self) return;
    this.logger.debug(
      `twitch join - channel: ${channel}, username: ${username}`,
    );
  }

  private logon() {
    this.logger.debug(`twitch logon`);
  }

  private message(
    channel: string,
    userstate: ChatUserstate,
    message: string,
    self: boolean,
  ) {
    if (self) return;

    this.logger.debug(
      `twitch message -  channel: ${channel}, userstate: ${userstate}, message: ${message}`,
    );

    this.logger.log(`${userstate['display-name']}: ${message}`);

    // Aqui você pode adicionar a lógica para responder a mensagens específicas do chat
    // Por exemplo:
    if (message === '!ola') {
      this.sayTwitch(channel, `Olá, ${userstate.username}!`);
      // this.twitchClient.say(channel, `Olá, ${userstate.username}!`);
    }
  }

  private messagedeleted(
    channel: string,
    username: string,
    deletedMessage: string,
    userstate: DeleteUserstate,
  ) {
    this.logger.debug(
      `twitch messagedeleted -  channel: ${channel}, username: ${username}, deletedMessage: ${deletedMessage}, userstate: ${userstate}`,
    );
  }

  private mod(channel: string, username: string) {
    this.logger.debug(
      `twitch mod - channel: ${channel}, username: ${username}`,
    );
  }

  private mods(channel: string, mods: string[]) {
    this.logger.debug(`twitch mods - channel: ${channel}, mods: ${mods}`);
  }

  private part(channel: string, username: string, self: boolean) {
    if (self) return;

    this.logger.debug(
      `twitch part - channel: ${channel}, username: ${username}`,
    );
  }

  private primepaidupgrade(
    channel: string,
    username: string,
    methods: SubMethods,
    userstate: PrimeUpgradeUserstate,
  ) {
    this.logger.debug(
      `twitch primepaidupgrade - channel: ${channel}, username: ${username}, methods: ${methods}, userstate: ${userstate}`,
    );
  }

  private r9kbeta(channel: string, enabled: boolean) {
    this.logger.debug(
      `twitch r9kbeta - channel: ${channel}, enabled: ${enabled}`,
    );
  }

  private raided(channel: string, username: string, viewers: number) {
    this.logger.debug(
      `twitch raided - channel: ${channel}, username: ${username}, viewers: ${viewers}`,
    );
  }

  private redeem(
    channel: string,
    username: string,
    rewardType: 'highlighted-message' | 'skip-subs-mode-message' | string,
    tags: ChatUserstate,
  ) {
    this.logger.debug(
      `twitch redeem -  channel: ${channel}, username: ${username}, rewardType: ${rewardType}, tags: ${tags}`,
    );
  }

  private resub(
    channel: string,
    username: string,
    months: number,
    message: string,
    userstate: SubUserstate,
    methods: SubMethods,
  ) {
    this.logger.debug(
      `twitch resub - channel: ${channel}, username: ${username}, months: ${months}, message: ${message}, userstate: ${userstate}, methods: ${methods}`,
    );
  }

  private roomstate(channel: string, state: RoomState) {
    this.logger.debug(
      `twitch roomstate - channel: ${channel}, state: ${state}`,
      state,
    );
  }

  private serverchange(channel: string) {
    this.logger.debug(`twitch serverchange - channel: ${channel}`);
  }

  private slowmode(channel: string, enabled: boolean, length: number) {
    this.logger.debug(
      `twitch slowmode - channel: ${channel}, enabled: ${enabled}, length: ${length}`,
    );
  }

  private subgift(
    channel: string,
    username: string,
    streakMonths: number,
    recipient: string,
    methods: SubMethods,
    userstate: SubGiftUserstate,
  ) {
    this.logger.debug(
      `twitch subgift - channel: ${channel}, username: ${username}, streakMonths: ${streakMonths}, recipient: ${recipient}, methods: ${methods}, userstate: ${userstate}`,
    );
  }

  private submysterygift(
    channel: string,
    username: string,
    numbOfSubs: number,
    methods: SubMethods,
    userstate: SubMysteryGiftUserstate,
  ) {
    this.logger.debug(
      `twitch submysterygift - channel: ${channel}, username: ${username}, numbOfSubs: ${numbOfSubs}, methods: ${methods}, userstate: ${userstate}`,
    );
  }

  private subscribers(channel: string, enabled: boolean) {
    this.logger.debug(
      `twitch subscribers - channel: ${channel}, enabled: ${enabled}`,
    );
  }

  private subscription(
    channel: string,
    username: string,
    methods: SubMethods,
    message: string,
    userstate: SubUserstate,
  ) {
    this.logger.debug(
      `twitch subscription - channel: ${channel}, username: ${username}, methods: ${methods}, message: ${message}, userstate: ${userstate}`,
    );
  }

  private timeout(
    channel: string,
    username: string,
    reason: string,
    duration: number,
    userstate: TimeoutUserstate,
  ) {
    this.logger.debug(
      `twitch timeout - channel: ${channel}, username: ${username}, reason: ${reason}, duration: ${duration}, userstate: ${userstate},`,
    );
  }

  private unhost(channel: string, viewers: number) {
    this.logger.debug(
      `twitch unhost - channel: ${channel}, viewers: ${viewers}`,
    );
  }

  private unmod(channel: string, username: string) {
    this.logger.debug(
      `twitch unmod - channel: ${channel}, username: ${username}`,
    );
  }

  private vips(channel: string, vips: string[]) {
    this.logger.debug(`twitch vips - channel: ${channel}, vips: ${vips}`);
  }

  private whisper(
    from: string,
    userstate: ChatUserstate,
    message: string,
    self: boolean,
  ) {
    if (self) return;

    this.logger.debug(
      `twitch whisper - from: ${from}, userstate: ${userstate}, message: ${message}`,
    );
  }
}
