import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy } from 'passport-jwt';
import { UserModel } from '../models/user.model';

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['access_token'];
    }

    return token;
};

// AUTHORIZATION
export const configJWTStrategy = () => {
    return new JWTStrategy({ jwtFromRequest: cookieExtractor, secretOrKey: process.env.SECRET }, (payload, done) => {
        UserModel.findOne({ email: payload.email }, (err, user) => {
            if (err) {
                return done(err, false);
            }

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    });
};

// AUTHENTICATED LOCAL STRATEGY USING USERNAME AND PASSWORD
export const configLocalStrategy = () => {
    return new LocalStrategy((username, password, done) => {
        console.log('[LocalStrategy]');
        UserModel.findOne({ email: username }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (!user.authenticate(password)) {
                return done(null, false);
            } else {
                return done(null, this);
            }
        });
    });
};
