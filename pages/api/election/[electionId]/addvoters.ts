import { ExtendedNextApiRequest } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { SendBadRequest } from 'utils/errorHandlers';
import { isAuthenticated } from 'utils/middlewares';
import multer from 'multer';
import XLSX from 'xlsx';
import { MS_EXCEL_MIME_TYPE } from '@mantine/dropzone';

const handler = nc(ncOptions);
const storage = multer.memoryStorage();
const upload = multer({ storage });
handler.use(isAuthenticated);

type Request = ExtendedNextApiRequest & { file: any };

handler.use(upload.single('file')).post(async (req: Request, res) => {
  const { file, query } = req;
  const { electionId } = query;

  if (!file) {
    return SendBadRequest(res, 'No file found.');
  }

  const isXlsxFile = MS_EXCEL_MIME_TYPE.includes(file.mimetype);
  if (file.mimetype && !isXlsxFile) {
    return SendBadRequest(res, 'File is not of type xlsx.');
  }

  const savedElection = await prisma.election.findFirst({
    where: { id: +electionId },
    select: { id: true },
  });
  if (!savedElection) {
    SendBadRequest(res, `No election found for the id ${electionId}`);
  }

  const wb = XLSX.read(file.buffer, { type: 'buffer' });
  const wsName = wb.SheetNames[0];
  const ws = wb.Sheets[wsName];
  const data = XLSX.utils.sheet_to_json(ws) as {
    Name: string;
    Email: string;
  }[];
  const userData = data.map(({ Name, Email }) => ({
    name: Name,
    email: Email,
    electionId: +electionId,
  }));
  await prisma.voter.createMany({ data: userData });

  return res.json({ message: 'success' });
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default withSessionRoute(handler);
