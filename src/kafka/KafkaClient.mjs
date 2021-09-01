import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'kafka-api',
  brokers: ['localhost:29092'],
});

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'kafka-api' });
const producer = kafka.producer();

let messageCallback = () => {};

const eachMessage = async (payload) => {
  messageCallback(payload);
};

const initKafkaConsumer = async (callback) => {
  await consumer.connect();
  messageCallback = callback;
};

const listenToTopic = async (topic) => {
  await consumer.stop();
  await consumer.subscribe({ topic, fromBeginning: true });
  consumer.run({ eachMessage });
};

const initKafkaProducer = async () => {
  producer.connect();
};

const sendKafkaMesssage = async (topic, messages, headers) => {
  await producer.send({
    topic,
    messages: messages.map((message) => ({
      value: JSON.stringify(message),
      headers,
    })),
  });
};

export {
  initKafkaConsumer, listenToTopic, initKafkaProducer, sendKafkaMesssage,
};
