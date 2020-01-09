import * as fastify from 'fastify';

const logLevel = process.env.LOGLEVEL || 'info';

const server = fastify({
  logger: {
    level: logLevel,
  }
});

server.get('/', async (request, reply) => {
  server.log.debug({headers: request.headers, query: request.query});
  reply.type('text/plain');

  switch (request.query.q) {
    case 'PING':
      return 'PONG';
    case 'What is your name?':
      return 'Max Runia';
    case 'What is your quest?':
      return 'coding';
    default:
      return handleSpecialCases(request.query.q);
  }
});

function handleSpecialCases(query: string): string {
  // if it looks like math, eval it
  if (query.endsWith(' = ?')) {
    const math = query.substr(0, query.length - 4);
    try {
      return eval(math) + '';
    } catch (e) {
      server.log.debug(e.message);
      return 'My attempt at solving your math failed';
    }
  }


  return 'Still working on it ;)';
}

// Run the server!
const port = process.env.PORT || 3000;
const address = process.env.ADDRESS || 'localhost';

// @ts-ignore
server.listen(port, address, (err: any, address: any) => {
  if (err) throw err;
  server.log.info(`server listening on ${address}`);
});