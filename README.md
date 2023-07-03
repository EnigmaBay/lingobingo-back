# lingobingo-back

Back-end API server for LingoBingoJS site.

## Overview

LingoBingoJS is a front-end ReactJS app that is the public-view into the Lingo Bingo game. In order to allow controlling word list content by a person presenting to an audience, an API Server is being developed to interface a database for individualized, secure storage.

The front-end LingoBingo website will authenticate users and manage requesting and handling authorization to the API Server on behalf of a registered user. The API Server will validate authentication headers and provide session cookies to manage access to restricted endpoints.

In everyday terms:

1. User that will present to an audience can register and login to LingoBingoJS webiste.
2. After login the user (dubbed a "Presenter") can add, edit, and remove one or more lists of words.
3. Once they have at least 1 list of 25 or more words, the Presenter can generate a "Bingo Board" to share with their audience.
4. Audience members can click on the standard web-link shared by the presenter and LingoBingoJS website will load a random selection of those words into its gameboard, providing a unique "Bingo Board" of presenter-defined terminology.

## Status

This API Server is in development.

![LingoBingo API: Azure-Deploy](https://github.com/enigmabay/lingobingo-back/actions/workflows/build-deploy-azure.yaml/badge.svg?branch=azure-deploy)

## Dependencies

- [x] NodeJS
- [x] ExpressJS
- [x] Java Web Tokens and Aync Key Sets
- [x] Mongoose (MongoDB Client) v6.8+
- [x] Cookie-parser
- [x] CORS (configure for your specific environment)
- [x] Auth0: JWT Bearer, JsonWebToken, and JWKS-RSA SDKs
- [x] Dev: DotEnv for importing local environment variables
- [x] NodeMon: Automate restarting service during development

## Implemented Technologies and Patterns

- [x] REST-based server.
- [x] CRUD functionality (Create, Read, Update, and Delete).
- [x] Async/Await and Promises.
- [x] Cookies.
- [x] JWT Keysets leveraged for authorization.
- [x] Buffer for generating UUIDs.
- [x] Various ExpressJS features including middleware, Router, and error handler.
- [x] Caching of GET method calls.
- [x] Presenter can edit existing words in their own categories.
- [x] Presenter can remove existing words in their own categories.
- [x] Presenter can generate a new gameboard.
- [x] Presenter can remove existing gameboard.
- [x] Authorization _not_ required to get a "Gameboard" given a UUID.

## Planned Work

- [ ] Refactor code to enable testing functions individually.
- [ ] Write tests!

## Participants

Lead Developer: [Jon Rumsey](https://github.com/nojronatron).

Developer: [Ryan Schafer](https://github.com/schaferyan).

## References and Resources

_Note_: Specific code references have been made in-line with source code.

- [Code Fellows Seattle](https://www.codefellows.com)
- [MDN](https://developer.mozilla.org/)
- [StackOverflow](https://stackoverflow.com/)
- [Web.Dev - Samesite Cookie Recipies](https://web.dev/samesite-cookie-recipes/)
- [Wikipedia - HTTP Status Codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
- [ExpressJS Documentation](http://expressjs.com/en/resources/middleware.html)
- [Auth0 Documentation](https://auth0.com/docs/quickstart/spa/react/02-calling-an-api)
- [GitHub - Team Repositories](https://www.github.com)
- [Trello - Project Management Board](https://www.trello.com)
- [Miro - Project Design Space](https://www.miro.com)
