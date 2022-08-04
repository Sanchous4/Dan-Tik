import axios from 'axios';
import jwt_decode from 'jwt-decode';

// The AuthSub interface allows a web-based application to access a Google service on behalf of a user. To maintain a high level of security, the AuthSub interface enables the application to get an authentication token without ever handling the user's account login information.

interface IDecodedResponse {
    name: string;
    picture: string;
    sub: string;
}

export const createOrGetUser = async (
    response: any,
    addUser: any,
    doLogout: any
) => {
    const decoded: IDecodedResponse = jwt_decode(response.credential);

    const {name, picture, sub} = decoded;

    const user = {
        _id: sub,
        _type: 'user',
        userName: name,
        image: picture,
    };

    addUser(user);
    // console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`);

    try {
        const result = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`,
            user
        );
        // console.log({result});
    } catch (error) {
        // console.log({error});
        doLogout();
    }
};
