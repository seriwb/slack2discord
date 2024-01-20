import { App } from '@slack/bolt';
import { WebhookClient } from 'discord.js';
import { NextResponse } from 'next/server';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});
const webhookClient = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL || '' });

export async function POST(request: Request, response: Response) {
  const body = await request.json();
  const type = body.type;

  if (type === 'url_verification') {
    console.log('req body challenge is:', body.challenge);
    return NextResponse.json({ challenge: body.challenge });
  } else if (type === 'event_callback' && body.event.type === 'message') {
    // console.log(body.event);

    let username: string | undefined = 'slackbot';
    let avatarURL: string | undefined = undefined;
    if (body.event.user) {
      const result = await app.client.users.info({
        user: body.event.user,
      });
      username = result.user?.real_name;
      avatarURL = result.user?.profile?.image_512;
    }
    const fileInfo = body.files ? '（ファイル添付あり）' : '';

    webhookClient.send({
      content: (body.event.text || '') + fileInfo,
      username: username,
      avatarURL: avatarURL,
    });
  } else {
    // console.log('body:', body);
  }

  return NextResponse.json({ status: 'ok' });
}
