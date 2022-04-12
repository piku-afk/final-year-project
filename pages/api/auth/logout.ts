import nc from 'next-connect';
import { ncOptions, withSessionRoute } from 'utils/configs';

const handler = nc(ncOptions);

handler.get(async (req: ExtendedNextApiRequest, res) => {
  req.session.destroy();
  res.json({ message: 'success' });
});

export default withSessionRoute(handler);
