const { generateUuid } = require('../utils/presenter-utils');
const Presenter = require('../models/presenterModel');

async function checkPresenter(req, res, next) {
  const nickname = res.locals.nickname;
  const email = res.locals.email;
  const username = res.locals.username;
  const concatenatedArgs = `${nickname}${email}${username}`;
  const presenterUuid = await generateUuid(concatenatedArgs);
  const presenter = await Presenter.findOne({ uuid: presenterUuid }).exec();
  if (presenter === null) {
    console.log('check-presenter: creating new presenter, uuid', presenterUuid);
    Presenter.create({
      uuid: presenterUuid,
    })
      .then((createResult) => (res.locals.presenterUuid = createResult.uuid))
      .catch((error) => next(error));
  } else if (presenter.isDeleted) {
    console.log('Presenter is blocked, uuid:', presenterUuid);
    next('Unauthorized.');
  } else {
    console.log(
      'checkPresenter checks passed for presenter uuid',
      presenter.uuid
    );
    res.locals.presenterUuid = presenter.uuid;
    next();
  }
}

module.exports = checkPresenter;
