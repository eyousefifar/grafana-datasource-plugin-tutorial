// @ts-nocheck
const uws = require('uWebSockets.js');
uws
  .App()
  .get('/metrics', (res, req) => {
    res.writeHeader('Access-Control-Allow-Origin', '*');
    res.end(`{ "time": ${Date.now() - Math.random() * 1e6}, "value": ${Math.random() * 1e6}}`);
  })
  .listen(1998, token => {
    if (token) {
      console.log('Listening to port ' + 1998);
    } else {
      console.log('Failed to listen to port ' + 1998);
    }
  });
