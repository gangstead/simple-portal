'use strict';

const _ = require('lodash');
const B = require('bluebird');
const Hapi = require('hapi');
const hapiCrudPromise = require('hapi-crud-promise');
const Joi = require('joi');
const uuid = require('node-uuid').v4;

const port = process.env.PORT || /* istanbul ignore next*/ '3000';
const server = new Hapi.Server();

server.connection({ port: parseInt(port) });

const init = () => {
  return B.resolve()
  .then(() => {
    const memoryDb = [{
      id: '123',
      firstName: 'Steven'
    }];
    const find = (id) => _.find(memoryDb, (t) => t.id === id);

    return hapiCrudPromise(server, {
      path: '/api/things/{thingId}',
      config: {
        auth: false,
        validate: {
          params: {
            thingId: Joi.string().required()
          }
        }
      },
      crudRead(req) {
        return { thing: find(req.params.thingId) };
      },
      crudReadAll() {
        return { things: memoryDb };
      },
      crudCreate(req) {
        const newThing = _.merge({ id: uuid() }, req.payload.thing);
        memoryDb.push(newThing);
        return { thing: newThing };
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
