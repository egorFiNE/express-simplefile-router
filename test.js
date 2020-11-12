'use strict';

/* eslint-disable no-undef, no-invalid-this, global-require */

const assert = require('assert').strict;
const express = require('express');
const http = require('http');
const expressSimpleFileRouter = require('./index.js');

let PORT = 0;
let app = null;

function request(path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'localhost',
      port: PORT,
      path
    };

    let dataString = null;
    if (data) {
      dataString = JSON.stringify(data);
      options.method = 'POST';
      options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
      };
    }


    const req = http.request(options, res => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data: rawData }));
    });

    req.on('error', error => reject(error));

    if (data) {
      req.write(dataString);
    }

    req.end();
  });
}

describe('expressSimpleRouter test', function () {
  let server = null;

  before(() => {
    return new Promise(resolve => {
      app = express();

      app.use(express.json({ type: 'application/json' }));

      app.use(
        '/api/',
        expressSimpleFileRouter({
          prefix: '/',
          directory: 'test'
        })
      );

      server = app.listen(PORT, () => {
        PORT = server.address().port;
        resolve();
      });
    });
  });

  after(() => server.close());

  it('should properly answer GET (multiple handlers)', async () => {
    const result = await request('/api/one/two/');
    assert.strictEqual(result.statusCode, 200);
    assert.strictEqual(result.data, 'OK GET');
  });

  it('should NOT answer POST on a GET route', async () => {
    const result = await request('/api/one/two/', { something: true });
    assert.strictEqual(result.statusCode, 404);
  });

  it('should properly answer POST (a single handler)', async () => {
    const result = await request('/api/three/four/', { one: 'two' });
    assert.strictEqual(result.statusCode, 200);
    assert.strictEqual(result.data, 'OK POST');
  });

  it('should properly 404 on non-existing subroute', async () => {
    const result = await request('/api/three/five/', { one: 'two' });
    assert.strictEqual(result.statusCode, 404);
  });
});
