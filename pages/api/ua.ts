import { NextApiRequest, NextApiResponse } from "next";
import { UAParser } from "ua-parser-js";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const parser = new UAParser(req.headers["user-agent"]);
  res.status(200).json(parser.getResult());
};
