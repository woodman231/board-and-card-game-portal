import express from 'express';
import passport from 'passport';
import GitHubStrategy from 'passport-github';
import type { Profile } from 'passport-github';

declare global {
    namespace Express {
        interface User extends Profile {            
        }
    }
}

passport.use(new GitHubStrategy.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    callbackURL: process.env.GITHUB_CALLBACK_URL ?? ""
}, function (accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj: any, cb) {
    cb(null, obj);
});

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    let userName = 'Unknown';
    if (req.user && req.user.username) {
        userName = req.user.username;
    }
    res.render('home', { name: userName });
});

router.get('/auth/login', function (req, res, next) {
    res.render('login');
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/auth/login' }), function (req, res) {
    res.redirect('/');
});

router.get('/auth/me', function (req, res, next) {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

router.get('/auth/logout', function (req, res, next) {
    req.logout((error) => {
        if (error) {
            return next(error);
        }
    });
    res.redirect('/');
});

export default router;