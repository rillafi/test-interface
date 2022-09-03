// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import _forEach from "lodash/forEach";
import _get from "lodash/get";
import _isNil from "lodash/isNil";
import _pick from "lodash/pick";
import fetchWithCache from "../../utils/fetchWithCache";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { chainId, contractName } = req.query;
    const data = await fetchWithCache(
      `https://raw.githubusercontent.com/rillafi/test-contracts/main/deployedContracts/${chainId}/${contractName}.json`,
      {},
      5 * 60 * 1000
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).send(error);
  }
}

export default handler;
