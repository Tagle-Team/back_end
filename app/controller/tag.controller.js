const db = require('../models');
const Tag = db.tag;
const {generateExampleCards, getRandomEmoji} = require('../helpers');
const shortid = require('shortid');

exports.createTag = (req, res) => {
  const newTag = new Tag();
  newTag.title = req.body;
  newTag.lists = [];
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

exports.deleteTag = (req, res) => {
  const { tagId } = req.body;
  Tag.destroy({
    where: { _id: tagId }
  })
    .then(result => {
      return res.send({
        message: 'Success',
      });
    })
    .catch(err => {
      return res.send({
        message: 'Fail',
      });
    });
}

exports.reorderTag = (req, res) => {
  const {listId, sourceId, sourceIndex, destinationIndex} = req.body;

  Tag.findOneAndUpdate({
    _id: sourceId
  }, {
    $pull: {lists: {_id: listId}}
  })
    .then(result => {
      const list = result.lists[sourceIndex];
      Tag.updateOne(
        {_id: sourceId}
      ), {
        $push: {
          lists: {$each: [list], $position: destinationIndex}
        }
      }
      return res.send({ result });
    })
    .catch(err => {
      console.error(err);
      return res.send({
        message: 'Fail'
      });
    });
}

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
