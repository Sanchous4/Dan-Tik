import type {NextApiRequest, NextApiResponse} from 'next';
import {client} from '../../utils/client';
import {uuid} from 'uuidv4';

const unsetLike = async (postId: string, userId: string) => {
    const result = await client
        .patch(postId)
        .unset([`likes[_ref=="${userId}"]`])
        .commit();
    return result;
};

const setLike = async (postId: string, userId: string) => {
    const result = await client
        .patch(postId)
        .setIfMissing({likes: []})
        .insert('after', 'likes[-1]', [
            {
                _key: uuid(),
                _ref: userId,
            },
        ])
        .commit();
    return result;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'PUT') {
        const {userId, postId, like} = req.body;
        try {
            const data = like
                ? await setLike(postId, userId)
                : await unsetLike(postId, userId);
            // console.log({message: 'Like added successfully'});
            res.status(200).json({message: 'Like added successfully'});
        } catch (error) {
            res.status(400).json({
                message: 'Like cannot be added',
                error,
            });
            // console.log({error});
        }
    }
}
