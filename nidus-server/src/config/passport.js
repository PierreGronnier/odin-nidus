import passport from "passport";
import prisma from "../config/prisma.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  findUserByGoogleId,
  findUserByEmail,
} from "../services/user.service.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await findUserByGoogleId(profile.id);
        if (user) return done(null, user);

        const email = profile.emails[0].value;

        user = await findUserByEmail(email);
        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: profile.id },
          });
          return done(null, user);
        }

        const newUser = await prisma.user.create({
          data: {
            email,
            username: profile.displayName,
            avatarUrl: profile.photos[0].value,
            googleId: profile.id,
          },
        });
        return done(null, newUser);
      } catch (error) {
        done(error);
      }
    },
  ),
);

export default passport;
