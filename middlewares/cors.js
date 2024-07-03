// const allowedCors = [
//   'http://alexsng.mesto.nomoredomainsmonster.ru',
//   'https://alexsng.mesto.nomoredomainsmonster.ru',

// ];

// const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

// module.exports = { allowedCors, DEFAULT_ALLOWED_METHODS };
// // module.exports = (req, res, next) => {
// //   const { origin } = req.headers;
// //   console.log(origin);
// //   if (allowedCors.includes(origin)) {
// //     res.header('Access-Control-Allow-Origin', origin);
// //     const { method } = req;
// //     const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
// //     const requestHeaders = req.headers['access-control-request-headers'];

// //     if (method === 'OPTIONS') {
// //       res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
// //       res.header('Access-Control-Allow-Headers', requestHeaders);
// //       return res.end();
// //     }
// //   }
// //   return next();
// // };
