module.exports = (mongoose) => {
  let boardSchema = mongoose.Schema({
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

  boardSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Board = mongoose.model('Board', boardSchema, 'Board');

  return Board;
};
