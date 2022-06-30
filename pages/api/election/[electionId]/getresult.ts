import { ethers } from 'ethers';
import { ExtendedNextApiRequest } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import ElectionJSON from 'server/truffle/build/contracts/Election.json';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { Constants } from 'utils/constants';
import { SendBadRequest } from 'utils/errorHandlers';
import { isAuthenticated, zodValidate } from 'utils/middlewares';
import { z } from 'zod';

const handler = nc(ncOptions);
// handler.use(isAuthenticated);

const dataSchema = z.object({
  body: z.object({
    address: z.string(),
  }),
});

handler
  .use(zodValidate(dataSchema))
  .post(async (req: ExtendedNextApiRequest, res) => {
    const { address } = req.body;
    const { electionId } = req.query;

    const election = await prisma.election.findFirst({
      where: { id: +electionId },
      include: { ElectionOption: true },
    });

    if (!election) return SendBadRequest(res, 'Invalid election id');

    const { address: electionAddress, ElectionOption } = election;
    const optionIds = ElectionOption.map((option) => option.id);

    if (!electionAddress)
      return SendBadRequest(res, 'Election is not launched');

    const ethersProvider = new ethers.providers.JsonRpcProvider(
      'http://localhost:7545'
    );
    const signer = ethersProvider.getSigner(address);
    const electionContract = new ethers.Contract(
      electionAddress,
      ElectionJSON.abi,
      signer
    );

    const result = {} as { [optionId: number]: number };
    await Promise.all(
      optionIds.map(async (id) => {
        const votes = await electionContract.getVotesCount(id);
        result[id] = votes;
      })
    );

    res.json({
      electionId,
      result,
    });
  });

export default withSessionRoute(handler);
