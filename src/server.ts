import * as fastify from 'fastify';

const logLevel = process.env.LOGLEVEL || 'info';

const server = fastify({
  logger: {
    level: logLevel,
  }
});

server.get('/', async (request, reply) => {
  server.log.debug(request.headers);
  server.log.debug(request.query);

  reply.type('text/plain');

  return 'Hello world';
});

// Run the server!
const port = process.env.PORT || 3000;
const address = process.env.ADDRESS || 'localhost';

// @ts-ignore
server.listen(port, address, (err: any, address: any) => {
  if (err) throw err;
  server.log.info(`server listening on ${address}`);
});