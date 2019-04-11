module.exports = {
  devMode: true,
  port: 5000,
  consoleLoggerEnabled: true,
  prettyPrintErrors: false,
  testMode: false,
  webappUrl: 'http://localhost:3000',
  log: {
    level: 'debug',
    prettyPrint: false,
  },
  db: {
    // you should probably change this with the database you want to use in production
    // look at ./production.js for more info
    type: 'postgres',
    host: '127.0.0.1',
    database: 'kickstarter',
    username: 'postgres',
    user: 'postgres',
    entities: ['src/models/**/*Schema.ts'],
    migrations: ['migrations/*.ts'],
    cli: {
      migrationsDir: 'migrations',
    },
  },
  postgraphileDb: {
    host: '127.0.0.1',
    database: 'kickstarter',
    user: 'postgraphile',
  },
  usePrebuildPostgraphileCache: false,
  hashingRounds: 10,
  // you should change this by a fixed token that you should generate securely
  // By default, the secret will always be changed and so the server will not be stateless
  // But I don't want to provide a fixed secret for people that will forget to change it
  jwtSecret: require('crypto').randomBytes(48).toString('hex'), // eslint-disable-line
  apiAddress: 'https://api.example.com', // replace this with the address where your api is hosted
  activateCallbackUrl: 'https://app.exmaple.com/after_activation', // new users will be redirected to this address after activating their account
  uuidTestNamespace: 'e50b0ca8-d1e4-40cd-f10f-a49e8b7cc4de', // this is used to create deterministic uuid for our tests
};
