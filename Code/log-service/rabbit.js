//const RabbitmqServer = require('../auth-service/rabbit-server');
//
//const rabbitmq = async () => {
//    console.log("Queue started");
//    const server = new RabbitmqServer('amqp://admin:admin@rabbitmq:5672');
//    await server.start();
//    await server.consume('logExchange', (message) => console.log(message.content.toString()));
//    console.log("Queue ended successfully");
//}
//
//module.exports = {
//    rabbitmq: rabbitmq
//};