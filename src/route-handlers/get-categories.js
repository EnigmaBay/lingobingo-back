const LingoWord = require('../models/lingowordModel');
const { checkString } = require('../utils/validate-inputs');
const cache = require('../utils/cache');
const timeStamper = require('../utils/time-stamper');

async function getCategories(req, res) {
  // const uuid = checkString(req.cookies['useruuid']);
  const uuid = res.locals.presenterUuid;
  console.log('getCategories received uuid', uuid);

  if (!uuid) {
    return [];
  } else {
    const maxCacheLifetime = process.env.MAX_CACHE_LIFETIME;
    const key = uuid + '-method-' + req.method + '-path-' + req.path;

    if (cache[key] && Date.now() - cache[key].timestamp < maxCacheLifetime) {
      console.log('get-categories cache HIT');
    } else {
      console.log('get-categories cache MISS');
      cache[key] = {};
      cache[key].timestamp = timeStamper();
      cache[key].data = await LingoWord.find(
        {
          owner: uuid,
          deleted: false,
        },
        'category'
      )
        .exec()
        .then((response) => {
          console.log('get-categories find call then(response)->', response);
          const mySet = new Set();
          response.forEach((item) => {
            mySet.add(item['category']);
          });
          return Array.from(mySet);
        })
        .catch((error) => {
          console.log('error in getCategories', error.message);
          return [];
        });
    }

    return cache[key].data;
  }
}

module.exports = getCategories;
