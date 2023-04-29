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

The API Server is in development.

## Dependencies

- [X] NodeJS
- [X] ExpressJS
- [X] Java Web Tokens and Aync Key Sets
- [X] Mongoose (MongoDB Client)

## Implemented Technologies and Patterns

- [X] REST-based server.
- [X] CRUD functionality (Create and Read).
- [X] Async/Await and Promises.
- [X] Cookies.
- [X] JWT Key Sets leveraged for authorization.
- [X] Buffer for generating UUIDs.
- [X] Various ExpressJS features including middleware, Router, and error handler.

## Future Implementation

- [ ] Remaining REST Endpoint Methods (Patch and Delete).
- [ ] Remaining CRUD functionality (Update and Delete).
- [ ] Caching of GET method calls.
- [ ] Presenter can edit existing words in their own categories.
- [ ] Presenter can remove existing words in their own categories.
- [ ] Presenter can generate a new gameboard.
- [ ] Presenter can remove existing gameboard.

## Participants

Lead Developer: [Jon Rumsey](https://github.com/nojronatron).

Develoepr: [Ryan Schafer](https://github.com/schaferyan).

## References and Resources

*Note*: Specific code references have been made in-line with source code.

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
