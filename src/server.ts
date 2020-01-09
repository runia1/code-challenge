import * as fastify from 'fastify';

const server = fastify({
  logger: true
});

server.get('/', async (request, reply) => {
  server.log.debug(request.headers);
  server.log.debug(request.query);

  reply.type('text/plain');

  return 'Hello world';
});

// Run the server!
server.listen(3000, (err, address) => {
  if (err) throw err;
  server.log.info(`server listening on ${address}`);
});