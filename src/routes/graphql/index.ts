import { postgraphile } from 'postgraphile';
import config from 'config';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import { Context } from 'koa';

import { resolve } from 'path';
import { authenticateExtension } from './extensions/authenticate';
import { healthcheckExtension } from './extensions/healthcheck';
import { registerExtension } from './extensions/register';
import { createTeamExtension } from './extensions/createTeam';
import { teamInviteExtension } from './extensions/invite';

const { ONLY_BUILD_CACHE } = process.env;

export const attachGraphql = async (app) => {
  const pgql = postgraphile(config.get('postgraphileDb'), 'api_public', {
    ignoreRBAC: false,
    ignoreIndexes: false,
    dynamicJson: true,
    showErrorStack: config.get('devMode'),
    graphiql: config.get('devMode'),
    enhanceGraphiql: config.get('devMode'),
    exportJsonSchemaPath: resolve(__dirname, '../../misc/postgraphileSchema.json'),
    exportGqlSchemaPath: resolve(__dirname, '../../misc/postgraphileSchema.gql'),
    writeCache: ONLY_BUILD_CACHE && resolve(__dirname, '../../misc/postgraphileCache.json'),
    readCache: config.get('usePrebuildPostgraphileCache') && resolve(__dirname, '../../misc/postgraphileCache.json'),
    disableQueryLog: true,
    appendPlugins: [
      PgSimplifyInflectorPlugin,
      authenticateExtension,
      healthcheckExtension,
      registerExtension,
      createTeamExtension,
      teamInviteExtension,
    ],
    additionalGraphQLContextFromRequest: async (ctx) => {
      // eslint-disable-next-line no-underscore-dangle
      const koaCtx = (ctx as any)._koaCtx as Context;
      return koaCtx;
    },
    pgSettings: async (ctx) => {
      // eslint-disable-next-line no-underscore-dangle
      const koaCtx = (ctx as any)._koaCtx as Context;
      if (koaCtx.user) {
        return {
          role: 'api_connected_user',
          'api.user.id': koaCtx.user.id,
        };
      }
      return {
        role: 'api_anonymous',
      };
    },
  });
  if (ONLY_BUILD_CACHE) {
    console.log('Cache built, exiting');
    process.exit(0);
  }
  app.use(pgql);
};
