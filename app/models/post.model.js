const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbConfig = require('../config/db.config.js');

var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(dbConfig.url);
autoIncrement.initialize(connection);

const FKHelper = require('../helpers/foreignKey.helper');

/* 스키마 생성 */
const PostSchema = new Schema({
  seq: Number,
  tags: {
    type: [String],
    trim: true,
  },
  contents: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    validate: {
      isAsync: true,
      validator: function (v) {
        return FKHelper(mongoose.model('User'), v);
      },
      message: `Tag doesn't exist`,
    },
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isRemove: {
    type: Boolean,
    required: true,
    default: false,
  },
  isPrivate: {
    type: Boolean,
    required: true,
    default: false,
  },
});

PostSchema.plugin(autoIncrement.plugin, {
  model: 'Post',
  field: 'seq',
  startAt: 1, //시작
  increment: 1, // 증가
});

const Post = mongoose.model('Post', PostSchema);

function generateTags(contents) {
  const tagPattern = /#[^#][\S]*/g;

  let tagsArr = contents.match(tagPattern);
  let tags = null;
  if (!!tagsArr) {
    tags = tagsArr.filter((str) => str.lastIndexOf('#') === 0);
  }

  return tags;
}

function createPost({ contents, user, isRemove, isPrivate }) {
  const tags = generateTags(contents);

  const post = new Post({
    tags,
    contents,
    user,
    isRemove,
    isPrivate,
  });
  return post.save();
}

function getPostsByUserObjId({ userObjId }) {
  return Post.find({ user: userObjId, isRemove: false });
}

function updatePost({ userObjId, postObjId, updateData }) {
  if (typeof updateData.contents !== 'undefined') {
    const tags = generateTags(updateData.contents);
    updateData['tags'] = tags;
  }

  return Post.update(
    { user: userObjId, _id: postObjId },
    {
      $set: {
        ...updateData,
        updatedAt: new Date(),
      },
    }
  );
}

module.exports = {
  createPost,
  getPostsByUserObjId,
  updatePost,
};
