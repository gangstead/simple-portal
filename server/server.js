'use strict';

const _ = require('lodash');
const Hapi = require('hapi');
const hapiCrudPromise = require('hapi-crud-promise');
const Joi = require('joi');
const uuid = require('node-uuid').v4;

const port = process.env.PORT || /* istanbul ignore next*/ '3000';
const server = new Hapi.Server();

server.connection({ port: parseInt(port) });

const init = () => {
  return new Promise((res) => res())
  .then(() => {
    const memoryDb = [{
      id: '123',
      firstName: 'Steven'
    }];

    return hapiCrudPromise(server, {
      path: '/api/things/{thingId}',
      config: {
        auth: false,
        validate: {
          params: {
            thingId: Joi.string().required()
          },
          payload: {
            thing: Joi.object()
          }
        }
      },
      crudRead(req) {
        return { thing: _.find(memoryDb, (t) => t.id === req.params.thingId) };
      },
      crudReadAll() {
        return { things: memoryDb };
      },
      crudCreate(req) {
        const newThing = _.merge({ id: uuid() }, req.payload.thing);
        memoryDb.push(newThing);
        return { thing: newThing };
      },
      crudDelete(req) {
        const deleteIndex = _.findIndex(memoryDb, { id: req.params.thingId });
        if (deleteIndex > -1) {
          return memoryDb.splice(deleteIndex, 1);
        }
        return null;
      }
    });
  })
  .then(() => server.register(require('blipp')))
  .then(() => server.start())
  .then(() => console.log('Server running.'))
  .catch((err) => console.log(`Error during startup: ${err}`));
};

init();
