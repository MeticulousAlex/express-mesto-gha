// const allowedCors = [
//   'http://http://alexsng.mesto.nomoredomainsmonster.ru/',
//   'https://http://alexsng.mesto.nomoredomainsmonster.ru/',
//   'http://localhost:3001',
// ];

// module.exports = (req, res, next) => {
//   const { origin } = req.headers;
//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//     res.header('Access-Control-Allow-Credentials', true);
//   }

//   const { method } = req;
//   const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
//   const requestHeaders = req.headers['access-control-request-headers'];

//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     res.header('Access-Control-Expose-Headers', '*');
//     return res.end();
//   }
//   return next();
// };
