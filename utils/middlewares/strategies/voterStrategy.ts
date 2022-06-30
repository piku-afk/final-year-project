import bcrypt from 'bcrypt';
import passport from 'passport';
import * as LocalStrategy from 'passport-local';
import { prisma } from 'prisma/prisma';

const localStrategy = new LocalStrategy.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  },
  async (req, email: string, password: string, done: Function) => {
    try {
      const { electionId = 0 } = req.query;
      const voter = await prisma.voter.findFirst({
        where: {
          electionId: +electionId,
          email,
        },
      });
      if (voter) {
        const { password: passwordHash } = voter;

        if (!passwordHash) {
          return done(null, false, { message: 'No user password found' });
        }
        const isAuthorized = await bcrypt.compare(password, passwordHash);

        if (isAuthorized) {
          const { password, ...restUser } = voter;
          return done(null, { ...restUser, isVoter: true });
        }
      }

      done(null, false, { message: 'No user found' });
    } catch (error) {
      done(null, false, { message: 'Something went wrong.' });
    }
  }
);

passport.use('voter', localStrategy);

export { passport as VoterLocalPassword };
