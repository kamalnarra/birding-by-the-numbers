import amqp from "amqplib";

const users = amqp
  .connect({
    hostname: process.env.MQ_HOST,
    port: parseInt(process.env.MQ_PORT!),
    username: process.env.MQ_USERNAME,
    password: process.env.MQ_PASSWORD,
  })
  .then((conn) => conn.createChannel())
  .then((channel) => {
    channel.assertQueue("users");
    return channel;
  });

export async function addUser(id: string) {
  await (
    await users
  ).sendToQueue(
    "users",
    Buffer.from(
      JSON.stringify({ user_id: id, date_updated: new Date().toISOString() })
    )
  );
}
