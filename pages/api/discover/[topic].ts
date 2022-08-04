import type {NextApiRequest, NextApiResponse} from 'next';
import {client} from '../../../utils/client';
import {topicPostsQuery} from '../../../utils/queries';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const {topic} = req.query;
            const query: string = topicPostsQuery(topic);
            const data = await client.fetch(query);
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json('Getting topic failed');
        }
    }
}
