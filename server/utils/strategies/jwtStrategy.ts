import { VerifyCallback } from 'passport-jwt';
import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import { prisma } from 'prisma/prisma';

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET || '',
};

const callback: VerifyCallback = async (payload, done) => {
  const { sub } = payload as { sub: number };
  const user = await prisma.user.findFirst({
    where: { id: sub },
    select: { id: true, name: true, email: true },
  });
  if (user) {
    done(null, user);
  }
  done(null, false);
};

passport.use(new JwtStrategy(options, callback));

export default passport;
