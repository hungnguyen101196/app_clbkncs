const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const logger = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const helpers = require('./helpers/helpers');
const usersRouter = require('./routes/users/users');
const adminRouter = require('./routes/admin/admin');
const { response404} = require('./libs/httpResponse');
const app = express();

require('./configs/database');


// view engine setup
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    partialsDir: `${__dirname}/views/partials`,
    layoutsDir: `${__dirname}/views/layouts/`,
    helpers,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    next();
});

app.use(require('express-session')({
    secret: 'sale-fie',
    proxy: true,
    resave: false,
    saveUninitialized: false,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(expressValidator());
app.use(favicon(path.join(__dirname, 'public', 'logo_club.ico')));
app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({
//     extended: true
// }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {
    // maxage: '24h',
    // etag: false
}));

app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.title = 'Page not found';
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    if (err.status === 404) {
        return response404(res);
    }
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

var debug = require('debug')('nodejsapp:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '9614');
app.set('port', port);

console.log('server is running at port ' + port)
/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
