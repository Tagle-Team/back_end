const { Schema } = require('mongoose');

/* 카드 목록을 보관하기 위한 도큐먼트 (카드와 관련한 모든 데이터를 저장 --- 카드, 리스트, 보드) */
module.exports = (mongoose) => {
  let boardSchema = mongoose.Schema({
    _id: {
      type: Schema.Types.String,
    },
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

  /* mongoose model class method로 toJSON 추가 */
  boardSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  /* MongoDB Board Collection을 모델 스키마로 매핑시키는 부분 */
  const Board = mongoose.model('Board', boardSchema, 'Board');
  return Board;
};
