import type {NextApiRequest, NextApiResponse} from 'next';
import {client} from '../../../utils/client';
import {
    singleUserQuery,
    userCreatedPostsQuery,
    userLikedPostsQuery,
} from '../../../utils/queries';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const {id} = req.query;
        try {
            const userQuery = singleUserQuery(id);
            const userVideosQuery = userCreatedPostsQuery(id);
            const userLikedVideoQuery = userLikedPostsQuery(id);

            const user = await client.fetch(userQuery);
            const videos = await client.fetch(userVideosQuery);
            const likes = await client.fetch(userLikedVideoQuery);
            res.status(200).json({user: user[0], videos, likes});
        } catch (error) {
            // await client.createIfNotExists(user);
            res.status(400).json('Fetching users failed');
        }
    }
}
