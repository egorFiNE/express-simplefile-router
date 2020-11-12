const path = require('path');
const express = require('express');
const fs = require('fs');
const debug = require('debug')('express-simplefile-router');

function fullpathToRouteName(filename) {
  const basename = path.basename(filename);
  const chunks = basename.split('.');
  return chunks[0] + '/';
}

async function createRoute({ method, filename, prefix, directory, router } = {}) {
  const fullFilename = path.join(directory, filename);
  const implementation = require(fullFilename);

  const fullRouteName = path.join(prefix, fullpathToRouteName(filename));

  debug("Adding route %s %s from file %s", method, fullRouteName, fullFilename.substr(__dirname.length + 1));

  router[method.toLowerCase()](
    fullRouteName,
    implementation
  );
}

function createRoutes({ prefix, directory, router }) {
  const dirlist = fs.readdirSync(directory);

  for (const method of ['POST', 'GET', 'DELETE', 'PUT', 'PATCH']) {
    const postfix = '.' + method.toLowerCase() + '.js';

    dirlist
      .filter(filename => filename.endsWith(postfix))
      .forEach(filename => createRoute({ method, directory, prefix, filename, router }));
  }

  const folders = dirlist.filter(filename => fs.lstatSync(path.join(directory, filename)).isDirectory());

  for (const folder of folders) {
    createRoutes({
      prefix: path.join(prefix, folder),
      directory: path.join(directory, folder),
      router
    });
  }
}

module.exports = ({ prefix = '/', directory }) => {
  const resolvedDirectory = path.resolve(__dirname, directory);

  const router = express.Router();
  createRoutes({ prefix, directory: resolvedDirectory, router });
  return router;
};
