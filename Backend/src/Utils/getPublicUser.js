// Local Imports:
import userTagsModel from '../Models/UserTagsModel.js';

export default async function getPublicUser(user) {
    const userTags = await userTagsModel.getUserTags(user.id);

    const publicUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        biography: user.biography,
        profile_picture: user.profile_picture,
        location: user.location,
        fame: user.fame,
        last_online: user.last_online,
        is_online: user.is_online,
        gender: user.gender,
        sexual_preference: user.sexual_preference,
        tags: userTags,
    };

    return publicUser;
}
