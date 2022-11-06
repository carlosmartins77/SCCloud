import { Connection, Channel, connect, Message } from "amqplib";

let conn;
let channel;

export default class RabbitmqServer {

  constructor(uri) {}

  async start() {
    this.conn = await connect(this.uri);
    this.channel = await this.conn.createChannel();
  }

  async publishInQueue(queue, message) {
    return this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async publishInExchange(
    exchange,
    routingKey,
    message
  ) {
    return this.channel.publish(exchange, routingKey, Buffer.from(message));
  }

  async consume(queue, callback) {
    return this.channel.consume(queue, (message) => {
      callback(message);
      this.channel.ack(message);
    });
  }
}
