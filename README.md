# Zeniark Skills Test (Nest.js)

## Get Started

```bash
npm install
```

## Environment Variables

Populate .env.example and remove .example

## Usage

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Sign in to Google

Visit `localhost:3000/auth/google` and sign in to your Google account. Once done, get the **access_token** displayed.

### Authorization

Once you have your **_access_token_**, put it into your headers as `Authorization: Bearer <access_token>`. To learn more, you may visit [here](https://datatracker.ietf.org/doc/html/rfc6750).

### API references

| Action                             | HTTP Method | URL                                   |
| ---------------------------------- | ----------- | ------------------------------------- |
| View authorized user's information | GET         | <http://localhost:3000/user>          |
| Create a note                      | POST        | <http://localhost:3000/api/notes>     |
| Get all notes                      | GET         | <http://localhost:3000/api/notes>     |
| Get a specific note                | GET         | <http://localhost:3000/api/notes/:id> |
| Edit a specific note               | PUT         | <http://localhost:3000/api/notes/:id> |
| Delete a specific note             | DELETE      | <http://localhost:3000/api/notes/:id> |
