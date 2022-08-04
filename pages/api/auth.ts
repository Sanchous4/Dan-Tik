import type {NextApiRequest, NextApiResponse} from 'next';
import {client} from '../../utils/client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const user = req.body;
        try {
            const result = await client.createIfNotExists(user);
            res.status(200).json({message: 'Login success', result});
        } catch (error) {
            // await client.createIfNotExists(user);
            res.status(405).json('Login failed');
        }
    }
}
