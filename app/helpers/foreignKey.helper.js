module.exports = (model, id) => {
  return new Promise((resolve, reject) => {
    /* 외래키로 사용할 모델에 해당 object id 가 있는지 확인 */
    model.findOne({ _id: id }, (err, result) => {
      if (result) {
        return resolve(true);
      } else
        return reject(
          new Error(
            `FK Constraint 'checkObjectsExists' for '${id.toString()}' failed`
          )
        );
    });
  });
};
