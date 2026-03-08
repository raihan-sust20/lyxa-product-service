export default () => ({
  service: {
    port: parseInt(process.env.SERVICE_PORT ?? '5001', 10),
    grpcPort: parseInt(process.env.GRPC_PORT ?? '50053', 10),
    environment: process.env.ENVIRONMENT ?? 'development',
  },
  mongodb: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/auth-db',
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL ?? 'amqp://localhost:5672',
    queue: process.env.RABBITMQ_QUEUE ?? 'product_queue',
  },
});
