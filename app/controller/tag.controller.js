const db = require('../models');
const Tag = db.tag;
const {generateExampleCards, getRandomEmoji} = require('../helpers');
const shortid = require('shortid');

exports.example = (req, res) => {
  const exampleCards = generateExampleCards();
  const newTag = new Tag();
  // newTag._id = shortid.generate();
  newTag.title = `Example Tag ${getRandomEmoji()}`;
  newTag.lists = [
    {
      // _id: shortid.generate(),
      title: 'Todo',
      cards: exampleCards[0]
    },
    {
      // _id: shortid.generate(),
      title: 'In Progress',
      cards: exampleCards[1]
    },
    {
      // _id: shortid.generate(),
      title: 'Done',
      cards: exampleCards[2]
    }
  ];

  newTag.save((err, Tag) => {
    if (err) {
      return res.status(400).send({
        message: 'Failed to add tag. (' + err + ')',
      });
    } else {
      return res.send({
        message: 'Tag added successfully.',
      });
    }
  });
}
