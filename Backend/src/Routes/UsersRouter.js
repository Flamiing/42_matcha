// Third-Party Imports:
import { Router } from 'express';

// Local Imports:
import UsersController from '../Controllers/UsersController.js';
import { checkValidUserIdMiddleware } from '../Middlewares/checkValidUserIdMiddleware.js';

export default class UsersRouter {
    static createRouter() {
        const router = Router();

        // MIDDLEWARE:

        // GET:
        router.get('/', UsersController.getAllUsers);
        router.get('/:username', UsersController.getUserProfile);

        // PATCH:
        router.patch(
            '/:id',
            checkValidUserIdMiddleware(),
            UsersController.updateUser
        );
        router.patch(
            '/profile-picture/:id',
            checkValidUserIdMiddleware(),
            UsersController.updateProfilePicture
        );

        return router;
    }
}
