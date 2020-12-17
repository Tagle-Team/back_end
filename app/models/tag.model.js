module.exports = (mongoose) => {
  let tagSchema = mongoose.Schema({
    title: {
      type: String,
      trim: true,
      required: true,
    },
    lists: {
      type: Array,
      default: []
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
  });

  tagSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Tag = mongoose.model('Tag', tagSchema, 'Tag');

  return Tag;
};
