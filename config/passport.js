import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userModel } from '../models/usermodel.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userModel.findOne({ googleId: profile.id });

      if (!user) {
        user = await userModel.create({
          googleId: profile.id,
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          email: profile.emails[0].value,
          username: profile.displayName
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
