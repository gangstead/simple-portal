'use strict';

const B = require('bluebird');
const Hapi = require('hapi');
const hapiCrudPromise = require('hapi-crud-promise');
const Joi = require('joi');

const port = process.env.PORT || /* istanbul ignore next*/ '3000';
const server = new Hapi.Server();

server.connection({ port: parseInt(port) });

const init = () => {
  return B.resolve()
  .then(() => {
    return hapiCrudPromise(server, {
      path: '/api/things/{thingId}',
      config: {
        auth: false,
        validate: {
          params: {
            thingId: Joi.string().guid().required()
          }
        }
      },
      crudRead() {
        return { somedata: 'something' };
      },
      crudReadAll() {
        return [{ somedata: 'something' }];
      }
    });
  })
  .then(() => server.register(require('blipp')))
  .then(() => server.start())
  .then(() => {
    server.log([ 'info', 'init' ],
      `Server (${server.settings.app.name} v.${server.settings.app.version}) running.`);
    return server;
  });
};

setTimeout(() => {
  init().catch((err) => {
    server.log([ 'error', 'init' ], `Error during startup: ${err}`);
  }).done();
}, 1);
