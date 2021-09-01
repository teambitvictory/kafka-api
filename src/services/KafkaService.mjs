import { listenToTopic, initKafkaConsumer, sendKafkaMesssage } from '../kafka/KafkaClient.mjs';

const kafkaWasInitialized = false;

const messageStorage = {};

const messageCallback = (payload) => {
  const { topic, message } = payload;
  messageStorage[topic].push({
    headers: message.headers,
    body: JSON.parse(message.value.toString()),
  });
};

const initKafka = async () => {
  if (!kafkaWasInitialized) {
    await initKafkaConsumer(messageCallback);
  }
};

const collectMessagesForToic = async (topic) => {
  messageStorage[topic] = [];
  await initKafka();
  listenToTopic(topic);
};

const getCurrentConsumerTopics = () => Object.keys(messageStorage).map((topic) => ({ topic }));

const getMessagesForTopic = (topic) => {
  const messages = messageStorage[topic];
  return {
    topic,
    messages,
  };
};

const sendMessages = ({ topic, messages, headers }) => {
  sendKafkaMesssage(topic, messages, headers);
};

export {
  collectMessagesForToic, getCurrentConsumerTopics, getMessagesForTopic, sendMessages,
};
