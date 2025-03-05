// Third-Party Imports:
import fsExtra from 'fs-extra';
import path from 'path';

// Local Imports:
import userModel from '../../Models/UserModel.js';
import userLocationModel from '../../Models/UserLocationModel.js';
import userTagsModel from '../../Models/UserTagsModel.js';
import { hashPassword } from '../../Utils/authUtils.js';
import userStatusModel from '../../Models/UserStatusModel.js';
import { getTimestampWithTZ } from '../../Utils/timeUtils.js';

async function getUsersFromJson() {
    try {
        console.info('Reading users from JSON file...');
        const users = await fsExtra.readFile(
            '/backend/src/Fixtures/data/users/users.json'
        );
        console.info('Users JSON file read.');
        return JSON.parse(users);
    } catch (error) {
        console.error('ERROR:', error);
        return null;
    }
}

async function setupProfilePicture(userId, filePath) {
    console.info('Copying user profile picture...');

    const fileName = filePath.split('/').pop();

    try {
        await fsExtra.copy(
            `/backend/src/Fixtures/data/users/images/${fileName}`,
            filePath
        );
        console.info('Profile picture copyed successfully!');
    } catch (error) {
        console.error('ERROR:', error);
        process.exit();
    }
}

export default async function loadUsers() {
    console.info('Loading user fixtures into DB...');
    const users = await getUsersFromJson();
    if (!users) {
        console.error('ERROR: There was an error loading user fixtures.');
        process.exit();
    }

    for (const user of users) {
        const { location, tags } = user;
        delete user.location;
        delete user.tags;

        user.password = await hashPassword(user.password);

        const createdUser = await userModel.create({ input: user });
        if (!createdUser) {
            console.info('User fixtures were already loaded.');
            return;
        }
        await userTagsModel.updateUserTags(createdUser.id, tags);
        await userLocationModel.update(location, createdUser.id);
        await userStatusModel.create({
            input: {
                user_id: createdUser.id,
                socket_id: null,
                status: 'offline',
                last_online: getTimestampWithTZ(),
            },
        });

        await setupProfilePicture(createdUser.id, createdUser.profile_picture);
    }

    console.info('Users added to the database successfully!');
}
