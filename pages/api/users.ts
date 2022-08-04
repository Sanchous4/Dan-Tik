import type {NextApiRequest, NextApiResponse} from 'next';
import {client} from '../../utils/client';
import {allUsersQuery} from '../../utils/queries';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        // const user = req.body;
        try {
            const query = allUsersQuery();
            const result = await client.fetch(query);
            if (!result) throw 'No users';
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(
                'Fetching users failed, there can be no users'
            );
        }
    }
}
