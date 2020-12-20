const {
  createPost,
  getPostsByUserObjId,
  updatePost,
} = require('../models/post.model');

exports.addPost = async (req, res) => {
  const { contents, isRemove, isPrivate } = req.body;
  const { id } = res.locals.jwtPayload;

  const newPost = await createPost({
    contents,
    user: id,
    isRemove,
    isPrivate,
  });

  return res.send(newPost);
};

exports.getPosts = async (req, res) => {
  const { id } = res.locals.jwtPayload;

  const posts = await getPostsByUserObjId({
    userObjId: id,
  });

  return res.send(posts);
};

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

exports.deletePost = async (req, res) => {
  const { id } = res.locals.jwtPayload;
  const { id: postObjId } = req.body;

  const { ok } = await updatePost({
    userObjId: id,
    postObjId,
    updateData: {
      isRemove: true,
    },
  });

  return res.send({ result: ok > 0 ? true : false });
};
