import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import csrf from 'csurf';
import passport from 'passport';
import logger from 'morgan';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

import indexRouter from './routes/index';

declare module 'express-session' {
    interface SessionData {
        messages: string[];
    }
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

let redisClient = createClient({
    url: 'redis://redis:6379',
});
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session:',
})

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: redisStore,
}));

app.use(csrf({ cookie: true }));
app.use(passport.authenticate('session'));
app.use(function (req, res, next) {
    var msgs = req.session.messages || [];
    res.locals.messages = msgs;
    res.locals.hasMessages = !!msgs.length;
    req.session.messages = [];
    next();
});
app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err: any, req: any, res: any, next: any) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export { app };