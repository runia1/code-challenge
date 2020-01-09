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
    case 'Source code for this exercise?':
      return 'https://github.com/runia1/code-challenge';
    default:
      return handleSpecialCases(request.query.q.trim());
  }
});

function handleSpecialCases(query: string): string {
  // if it looks like math, eval it as math
  if (query.endsWith(' = ?')) {
    const math = query.substr(0, query.length - 4);
    try {
      return eval(math) + '';
    } catch (e) {
      server.log.debug(e.message);
      return 'My attempt at solving your math failed';
    }
  }

  // if it's words
  const wordRegex = /^([a-z]+ *){1,4}$/g;
  if (query.match(wordRegex)) {
    const words = query.split(' ');

    const oneWord = words.join('');
    let vowels = 0;
    let nonVowels = 0;
    for (let i = 0; i < oneWord.length; i++) {
      const letter = oneWord[i];

      if ("aeiou".includes(letter)) {
        vowels++;
      } else {
        nonVowels++;
      }
    }
    return `${words.length}-${nonVowels}-${vowels}`;
  }

  // if it's one of the number ones
  const numberRegex = /^<[ \d]*>$/g;
  if (query.match(numberRegex)) {
    const noBrackets = query.slice(1, -1);
    const numbers = noBrackets.trim().split(' ');

    let odds: number[] = [];
    let evens: number[] = [];
    numbers.map(number => {
      const tmp = parseInt(number);
      if (tmp % 2) {
        odds.push(tmp);
      } else {
        evens.push(tmp);
      }
    });

    odds = odds.sort((a, b) => a - b);
    evens = evens.sort((a, b) => b - a);

    const output = odds.map((odd, index) => {
      const even = evens[index];

      return odd + even;
    });

    return output.join(' ');
  }

  // letter sorting
  const lettersRegex = /^[A-Z]{1,10}/g;
  if (query.match(lettersRegex)) {
    let matrix = query.split('\n');
    // @ts-ignore
    const columns = matrix.shift().trim().split('');
    return matrixSort(matrix, columns, []).join('');
  }

  return 'Still working on it ;)';
}

/**
 * Matrix sorting algorithm take from: https://github.com/Kelley12/question-answer/blob/667dce8e796154dee693b2b5784d3ddcca71d47c/src/utils/jeeves.js#L70
 * Modified to typescript and I changed some of the var names so they make more sense to me
 *
 * @param matrix
 * @param columnKeys
 * @param result
 */
function matrixSort(matrix: string[], columnKeys: string[], result: string[]): string[] {
  for (let i = 0; i < matrix.length; i++) {
    let row = matrix[i].split('');
    let rowKey: string = row.shift() || '';

    for (let col = 0; col < row.length; col++) {
      let columnKey = columnKeys[col];
      let rowVal = row[col];
      if (rowVal === '=') {
        if (!result.includes(rowKey)) {
          result.push(rowKey);
        }
        break;
      } else if (rowVal === '<') {
        if (result.includes(rowKey)) {
          if (result.includes(columnKey)) {
            if (result.indexOf(rowKey) > result.indexOf(columnKey)) {
              result.splice(result.indexOf(columnKey), 1);
              result.splice(result.indexOf(rowKey) + 1, 0, columnKey);
              return matrixSort(matrix, columnKeys, result);
            }
          } else {
            result.splice(result.indexOf(rowKey) + 1, 0, columnKey);
          }
        } else {
          if (result.includes(columnKey)) {
            result.splice(result.indexOf(columnKey), 0, rowKey);
          } else {
            result.push(rowKey);
            result.push(columnKey);
          }
        }
      } else if (rowVal === '>') {
        if (result.includes(rowKey)) {
          if (result.includes(columnKey)) {
            if (result.indexOf(rowKey) < result.indexOf(columnKey)) {
              result.splice(result.indexOf(rowKey), 1);
              result.splice(result.indexOf(columnKey) + 1, 0, rowKey);
              return matrixSort(matrix, columnKeys, result);
            }
          } else {
            result.splice(result.indexOf(rowKey), 0, columnKey);
          }
        } else {
          if (result.includes(columnKey)) {
            result.splice(result.indexOf(columnKey) + 1, 0, rowKey);
          } else {
            result.push(columnKey);
            result.push(rowKey);
          }
        }
      }
    }
  }
  return result;
}

const port = process.env.PORT || 3000;
const address = process.env.ADDRESS || 'localhost';

// @ts-ignore
server.listen(port, address, (err: any, address: any) => {
  if (err) throw err;
  server.log.info(`server listening on ${address}`);
});