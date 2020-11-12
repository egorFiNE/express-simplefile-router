# express-simplefile-router

Transparent and simple filesystem-based router for Express.

Think how easy it is to create new routes in PHP and how obvious is the list of routes for a typical project? This is what I wanted in Express.

# Synopsis

0. `npm install express-simplefile-router`

1. Create `api-handlers/user/hello.get.js` in your project:

```javascript
module.exports = (req, res) => {
  res.send("Hello world");
};
```

2. Mount routes in your `server.js`:

```javascript
const expressSimpleFileRouter = require('express-simplefile-router');

const app = express();

// ...

app.use(
  '/api/',
  expressSimpleFileRouter({
    directory: 'api-handlers'
  })
);

const server = app.listen(1111);
```

3. Now you have a `GET` method handler on `/api/user/hello/`:

```bash
user:~$ curl http://localhost:1111/api/user/hello/
Hello world
```

# Documentation

## `expressSimpleFileRouter()`

Basically `expressSimpleFileRouter()` traverses a directory of files and mounts them as routes on an instance of [Express.router()](https://expressjs.com/en/4x/api.html#router). Simple as that.

It accepts two deconstructed arguments:

* `directory` (required) which directory to travel looking for files ending in `.post.js`, `.get.js`, `.delete.js`, `.put.js` or `.patch.js` and mounting them as routes;
* `prefix` (default `'/'`) string to prepend to all route paths when mounting on `Express.router()`;

## Route handler files

Every route handler file is a node module. Whatever you `module.exports` is supplied as second argument to `Express.router()` mount method (`.post()`, `.get()`, etc). So you can export either a standard handler `(req, res) => {...`, or an array of such. See `test/one/two.get.js` for the latter example.

Route handler file names are mapped to their route paths. I.e. `api/auth/user.post.js` becomes route `/api/user/` that handles `POST` methods.

# Development and maintenance

Tests: `npm run test` or `mocha test.js`.

Liner: `npm run lint` or `eslint index.js`.

Debug routes? Sure: `DEBUG=express-simplefile-router:* node server.js`

# TODO

- [ ] Imagine a simple way to handle REST arguments (`/user/123`)
- [ ] Write jsdoc for `index.js`
- [ ] Collect developers' feedback
- [ ] Publish JSONHandler and ValidateSchema and add write docs for them all

# Footer

Author: Egor Egorov me@egorfine.com.<br>
License: MIT
