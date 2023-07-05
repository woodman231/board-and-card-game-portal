"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_github_1 = __importDefault(require("passport-github"));
passport_1.default.use(new passport_github_1.default.Strategy({
    clientID: (_a = process.env.GITHUB_CLIENT_ID) !== null && _a !== void 0 ? _a : "",
    clientSecret: (_b = process.env.GITHUB_CLIENT_SECRET) !== null && _b !== void 0 ? _b : "",
    callbackURL: (_c = process.env.GITHUB_CALLBACK_URL) !== null && _c !== void 0 ? _c : ""
}, function (accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
}));
passport_1.default.serializeUser(function (user, cb) {
    cb(null, user);
});
passport_1.default.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
var router = express_1.default.Router();
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
router.get('/auth/github', passport_1.default.authenticate('github'));
router.get('/auth/github/callback', passport_1.default.authenticate('github', { failureRedirect: '/auth/login' }), function (req, res) {
    res.redirect('/');
});
router.get('/auth/me', function (req, res, next) {
    if (req.user) {
        res.json(req.user);
    }
    else {
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
exports.default = router;
