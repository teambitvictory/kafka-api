import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaHelmet from 'koa-helmet';
import cors from '@koa/cors';
import errorHandler from './middleware/errorHandler.mjs';
import getMessagingRouter from './routing/MessagingRouter.mjs';
import { initKafkaProducer } from '../kafka/KafkaClient.mjs';

const startServer = () => {
  const app = new Koa();

  initKafkaProducer()

  app.use(errorHandler());
  app.use(bodyParser());
  app.use(koaHelmet());
  app.use(cors());

  const messagingRouter = getMessagingRouter();
  app.use(messagingRouter.routes());
  app.use(messagingRouter.allowedMethods());

  const port = process.env.PORT || 3000;
  app.listen(port);
  // eslint-disable-next-line
  console.log(`kafka-api listening on port ${port}`);
};

export default startServer;
