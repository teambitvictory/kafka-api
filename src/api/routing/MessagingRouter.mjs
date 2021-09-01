import Router from '@koa/router';
import {
  sendMessages, getMessagesForTopic, getCurrentConsumerTopics, collectMessagesForToic,
} from '../../services/KafkaService.mjs';

const getMessagingRouter = () => {
  const messagingRouter = new Router();

  // Consumer
  messagingRouter.post('/consumers', async (ctx) => {
    const { body } = ctx.request;
    collectMessagesForToic(body.topic);
    ctx.res.statusCode = 201;
  });

  messagingRouter.get('/consumers', async (ctx) => {
    ctx.body = getCurrentConsumerTopics();
  });

  messagingRouter.get('/consumers/:topic', async (ctx) => {
    ctx.body = getMessagesForTopic(ctx.params.topic);
  });

  // Producer
  messagingRouter.post('/producer/send', async (ctx) => {
    const { body } = ctx.request;
    sendMessages(body);
    ctx.res.statusCode = 200;
  });

  return messagingRouter;
};

export default getMessagingRouter;
