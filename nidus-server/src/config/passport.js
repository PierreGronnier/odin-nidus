import passport from "passport";
import prisma from "../config/prisma.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findUserByGoogleId } from "../services/user.service.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findUserByGoogleId(profile.id);
        if (!user) {
          const newUser = await prisma.user.create({
            data: {
              email: profile.emails[0].value,
              username: profile.displayName,
              avatarUrl: profile.photos[0].value,
              googleId: profile.id,
            },
          });
          return done(null, newUser);
        } else {
          return done(null, user);
        }
      } catch (error) {
        done(error);
      }
    },
  ),
);

export default passport;
