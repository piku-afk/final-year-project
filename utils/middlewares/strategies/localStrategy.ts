import bcrypt from 'bcrypt';
import passport from 'passport';
import * as LocalStrategy from 'passport-local';
import { prisma } from 'prisma/prisma';

const localStrategy = new LocalStrategy.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  },
  async (email: string, password: string, done: Function) => {
    try {
      const user = await prisma.user.findFirst({ where: { email } });
      if (user) {
        const { password: passwordHash } = user;
        const isAuthorized = await bcrypt.compare(password, passwordHash);
        if (isAuthorized) {
          const { password, ...restUser } = user;
          return done(null, restUser);
        }
      }

      done(null, false, { message: 'No user found' });
    } catch (error) {
      done(null, false, { message: 'Something went wrong.' });
    }
  }
);

passport.use(localStrategy);

export { passport as LocalPassword };
