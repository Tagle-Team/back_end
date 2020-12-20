const shortid = require('shortid');

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

exports.generateExampleCards = () => {
  const result = [new Array(), new Array(), new Array()];
  const shuffled = exampleCards.sort(() => Math.random() - 0.5);
  for (const card of shuffled) {
    let index = getRandomInt(3); // Randomly returns 0, 1, or 2
    result[index].push({_id: shortid.generate(), title: card});
  }
  return result;
};

const exampleCards = [
  'Hello world 01',
  'Hello world 02',
  'Hello world 03',
  'Hello world 04',
  'Hello world 05'
];

