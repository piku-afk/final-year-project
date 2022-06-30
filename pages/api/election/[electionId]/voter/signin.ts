import { ethers } from 'ethers';
import { ExtendedNextApiRequest } from 'next';
import nc from 'next-connect';
import { ZodValidators } from 'utils';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { Constants } from 'utils/constants';
import { SendBadRequest } from 'utils/errorHandlers';
import {
  LocalPassword,
  VoterLocalPassword,
  zodValidate,
} from 'utils/middlewares';
import { z } from 'zod';
import { prisma } from 'prisma/prisma';
import ElectionJSON from 'server/truffle/build/contracts/Election.json';

const handler = nc(ncOptions);

const { email, password } = ZodValidators;
const dataSchema = z.object({
  body: z.object({
    email,
    password,
  }),
});

handler
  .use(zodValidate(dataSchema))
  .use(LocalPassword.initialize())
  .use(LocalPassword.authenticate('local', { session: false }))
  .post(async (req: ExtendedNextApiRequest, res) => {
    const { electionId } = req.query;
    const { id } = req.user;
    console.log(electionId);

    const election = await prisma.election.findFirst({
      where: { id: +electionId },
    });

    if (!election) return SendBadRequest(res, 'Invalid election id');

    const { address: electionAddress } = election;

    if (!electionAddress)
      return SendBadRequest(res, 'Election is not launched');

    const ethersProvider = new ethers.providers.JsonRpcProvider(
      'http://localhost:7545'
    );
    const signer = ethersProvider.getSigner(Constants.ganacheAccountNumber);
    const electionContract = new ethers.Contract(
      electionAddress,
      ElectionJSON.abi,
      signer
    );

    const isEligible = await electionContract.getVoterStatus(id);
    if (!isEligible) {
      console.log('eligible');
      req.session.voter = { id: id };
      await req.session.save();
    }

    res.json({ status: 'success', isEligible: !isEligible, id });
  });

export default withSessionRoute(handler);
