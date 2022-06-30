import { ethers } from 'ethers';
import { ExtendedNextApiRequest } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import ElectionJSON from 'server/truffle/build/contracts/Election.json';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { Constants } from 'utils/constants';
import { SendBadRequest } from 'utils/errorHandlers';
import { zodValidate, isAuthenticatedVoter } from 'utils/middlewares';
import { z } from 'zod';

const handler = nc(ncOptions);
handler.use(isAuthenticatedVoter);

const dataSchema = z.object({
  body: z.object({
    option: z.number(),
  }),
});

handler
  .use(zodValidate(dataSchema))
  .post(async (req: ExtendedNextApiRequest, res) => {
    const {
      body: { option },
      query: { electionId },
      session: {
        voter: { id: voterId },
      },
    } = req;
    const election = await prisma.election.findFirst({
      where: { id: +electionId },
    });

    if (!election) return SendBadRequest(res, 'Invalid election id');

    const { address } = election;

    if (!address) return SendBadRequest(res, 'Election is not launched');

    const ethersProvider = new ethers.providers.JsonRpcProvider(
      'http://localhost:7545'
    );
    const signer = ethersProvider.getSigner(Constants.ganacheAccountNumber);

    const electionContract = new ethers.Contract(
      address,
      ElectionJSON.abi,
      signer
    );

    const isEligible = await electionContract.getVoterStatus(voterId);
    if (!isEligible) {
      await electionContract.vote(voterId, option);

      req.session.destroy();
      res.json({
        voterId,
        message: 'vote successful',
      });
    }

    res.status(400).json({
      message: 'something went wrong',
    });
  });

export default withSessionRoute(handler);
