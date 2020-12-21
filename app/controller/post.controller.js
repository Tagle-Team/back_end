const {
  createPost,
  getPostsByUserObjId,
  updatePost,
} = require('../models/post.model');

/* 게시글 등록 */
exports.addPost = async (req, res) => {
  const { contents, isRemove, isPrivate } = req.body;
  /* 로그인한 사용자 user _id */
  const { id } = res.locals.jwtPayload;

  const newPost = await createPost({
    contents,
    user: id,
    isRemove,
    isPrivate,
  });

  return res.send(newPost);
};

/* jwt에 있는 user _id => 로그인한 사용자 의 게시글들 */
exports.getPosts = async (req, res) => {
  const { id } = res.locals.jwtPayload;

  const posts = await getPostsByUserObjId({
    userObjId: id,
  });

  return res.send(posts);
};

/* 게시글 공개 여부 수정하는 api */
exports.updatePrivate = async (req, res) => {
  const { id } = res.locals.jwtPayload;
  const { id: postObjId, isPrivate } = req.body;

  const { ok } = await updatePost({
    userObjId: id,
    postObjId,
    updateData: {
      isPrivate,
    },
  });

  return res.send({ result: ok > 0 ? true : false });
};

/* 게시글 수정 (공개여부, 게시글, tag 등) */
exports.updatePost = async (req, res) => {
  const { id } = res.locals.jwtPayload;
  const { id: postObjId, isPrivate, contents } = req.body;

  const { ok } = await updatePost({
    userObjId: id,
    postObjId,
    updateData: {
      isPrivate,
      contents,
    },
  });

  return res.send({ result: ok > 0 ? true : false });
};

/* 게시글 삭제 */
exports.deletePost = async (req, res) => {
  const { id } = res.locals.jwtPayload;
  const { id: postObjId } = req.body;

  /* isRemove 필드를 변경하여 삭제 처리 */
  const { ok } = await updatePost({
    userObjId: id,
    postObjId,
    updateData: {
      isRemove: true,
    },
  });

  return res.send({ result: ok > 0 ? true : false });
};
