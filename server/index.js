const { createApp } = require('./src/app');
const { env } = require('./src/config/env');

const app = createApp();

app.listen(env.port, () => {
  console.log(`server listening on ${env.port}`);
});
