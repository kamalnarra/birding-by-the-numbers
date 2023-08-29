import amqp from "amqplib";

const conn = amqp.connect({
  hostname: process.env.MQ_HOST,
  port: parseInt(process.env.MQ_PORT!),
  username: process.env.MQ_USERNAME,
  password: process.env.MQ_PASSWORD,
});
const channel = conn.then((conn) => conn.createConfirmChannel());
const assert = channel.then((channel) => channel.assertQueue("users"));

export async function addUser(id: string) {
  const ch = await channel;
  await assert;
  return await new Promise<void>((resolve, reject) => {
    ch.sendToQueue(
      "users",
      Buffer.from(
        JSON.stringify({ user_id: id, date_updated: new Date().toISOString() }),
      ),
      {},
      (err, ok) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}
