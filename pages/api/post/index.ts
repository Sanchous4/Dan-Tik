import type {NextApiRequest, NextApiResponse} from 'next';
import {client} from '../../../utils/client';
import {allPostsQuery} from '../../../utils/queries';

// type Data = {
//     name: string;
// };

const createNewVideo = async (document: any): Promise<[boolean, any]> => {
    let result: any = null;
    try {
        result = await client.create(document);
        return [!!result, result];
    } catch (error) {
        return [false, error];
    }
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // console.log('hey');
    switch (req.method) {
        case 'GET':
            const query = allPostsQuery();
            const data = await client.fetch(query);
            res.status(200).json(data);
            break;
        case 'POST':
            const document = req.body;
            const [isSuccess, result] = await createNewVideo(document);
            isSuccess
                ? res.status(201).json('Video uploaded successfully')
                : res.status(500).json({
                      message: 'The document cannot be uploaded',
                      error: result,
                  });
        default:
            res.status(501).json('Server cannot handle the such request :(');
            break;
    }
}
