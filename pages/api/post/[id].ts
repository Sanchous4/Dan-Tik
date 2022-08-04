import type {NextApiRequest, NextApiResponse} from 'next';
import {client} from '../../../utils/client';
import {postDetailQuery} from '../../../utils/queries';
import {uuid} from 'uuidv4';

const putComment = async (postId: string, userId: string, comment: string) => {
    const result = await client
        .patch(postId)
        .setIfMissing({comments: []})
        .insert('after', 'comments[-1]', [
            {
                comment,
                _key: uuid(),
                postedBy: {
                    _type: 'postedBy',
                    _ref: userId,
                },
            },
        ])
        .commit();
    return result;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET': {
            const {id} = req.query;
            const query = postDetailQuery(id);
            const details = await client.fetch(query);
            // console.log({query});
            res.status(200).json(details[0]);
            break;
        }
        case 'PUT': {
            const {comment, userId} = req.body;
            const {id: postId} = req.query;
            const postIdAsString = Array.isArray(postId) ? postId[0] : postId;
            const data = await putComment(postIdAsString, userId, comment);
            res.status(200).json(data);
            break;
        }
        default: {
            res.status(501).json('Server cannot handle the such request :(');
            break;
        }
    }
}
