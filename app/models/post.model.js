const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const dbConfig = require('../config/db.config.js');

/* 게시글 시퀀스 자동증가 기능 추가 */
// var autoIncrement = require('mongoose-auto-increment');
// var connection = mongoose.createConnection(dbConfig.url);
// autoIncrement.initialize(connection);

/* 로그인한 사용자 object id  외래키 지정시 유효성 확이하기 위한 helper import */
const FKHelper = require('../helpers/foreignKey.helper');

/* 스키마 생성 */
const PostSchema = new Schema({
  // seq: Number,
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

/* Post 컬랙션에 seq 값 자동증가 설정  */
// PostSchema.plugin(autoIncrement.plugin, {
//   model: 'Post',
//   field: 'seq',
//   startAt: 1, //시작
//   increment: 1, // 증가
// });

const Post = mongoose.model('Post', PostSchema);

/**
 * post 내용에 # 태그 추출
 * @param {string} contents
 */
function generateTags(contents) {
  const tagPattern = /#[^#][\S]*/g;

  let tagsArr = contents.match(tagPattern);
  let tags = null;
  if (!!tagsArr) {
    tags = tagsArr.filter((str) => str.lastIndexOf('#') === 0);
  }

  return tags;
}

/**
 * post 도큐먼트 생성
 * @param {json} Post
 */
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

/**
 * user 모델의 _id 로 게심물 조회
 * @param {json} param0 { userObjId }
 */
function getPostsByUserObjId({ userObjId }) {
  return Post.find({ user: userObjId, isRemove: false });
}

/**
 * 포스트 수정
 * @param {json} param0 { userObjId, postObjId, updateData: Post }
 */
function updatePost({ userObjId, postObjId, updateData }) {
  if (typeof updateData.contents !== 'undefined') {
    const tags = generateTags(updateData.contents);
    updateData['tags'] = tags;
  }

  /* 글쓴 user _id 와 수정하고자 하는 post _id 조회 후 언하는 필드만 업데이트 */
  return Post.update(
    { user: userObjId, _id: postObjId },
    {
      $set: {
        ...updateData,
        /* 수정 시간 현재 시간으로 update */
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
