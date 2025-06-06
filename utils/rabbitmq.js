 const amqp = require('amqplib');

 let channel = null;

 async function connectRabbitMQ() {
   const connection = await amqp.connect(process.env.RABBITMQ_URL);
   channel = await connection.createChannel();
   await channel.assertQueue('image_upload');
 }

 async function sendImageUploadMessage(data) {
   if (!channel) {
     await connectRabbitMQ();
   }
   channel.sendToQueue('image_upload', Buffer.from(JSON.stringify(data)));
 }
 module.exports = { sendImageUploadMessage };
