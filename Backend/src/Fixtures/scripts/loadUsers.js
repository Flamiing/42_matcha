
// Third-Party Imports:
import fsExtra from 'fs-extra';

// Local Imports:
import userModel from '../../Models/UserModel.js';
import userLocationModel from '../../Models/UserLocationModel.js';
import userTagsModel from '../../Models/UserTagsModel.js';
import { hashPassword } from '../../Utils/authUtils.js'

async function getUsersFromJson() {
    try {
        console.info('Reading users from JSON file...')
        const users = await fsExtra.readFile('/backend/src/Fixtures/data/users/users.json');
        console.info('Users JSON file read.')
        return JSON.parse(users);
    } catch (error) {
        console.error('ERROR: ', error);
        return null;
    }

}

export default async function loadUsers() {
    console.info('Loading user fixtures into DB...');
    const users = await getUsersFromJson();
    if (!users) {
        console.error('ERROR: There was an error loading user fixtures.')
        process.exit();
    }

    for (const user of users) {
        const { location, tags } = user;
        delete user.location;
        delete user.tags;

        user.password = await hashPassword(user.password)

        const createdUser = await userModel.create({ input: user });
        if (!createdUser) {
            console.info('User fixtures were already loaded.');
            return;
        }
        await userTagsModel.updateUserTags(createdUser.id, tags);
        await userLocationModel.update(location, createdUser.id)
    }

    console.info('Users added to the database successfully!')
}
