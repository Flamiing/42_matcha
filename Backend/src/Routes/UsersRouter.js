// Third-Party Imports:
import { Router } from 'express';

// Local Imports:
import UsersController from '../Controllers/UsersController.js';
import { checkValidUserIdMiddleware } from '../Middlewares/checkValidUserIdMiddleware.js';
import { imageUploadMiddleware } from '../Middlewares/imageUploadMiddleware.js';

export default class UsersRouter {
    static createRouter() {
        const router = Router();

        // GET:
        router.get('/', UsersController.getAllUsers);
        router.get('/:username', UsersController.getUserProfile);
        router.get('/:id/profile-picture', UsersController.getProfilePicture);

        // PATCH:
        router.patch(
            '/:id',
            checkValidUserIdMiddleware(),
            UsersController.updateUser
        );

        // PUT:
        router.put(
            '/:id/profile-picture',
            checkValidUserIdMiddleware(),
            //imagesValidationMiddleware(),
            imageUploadMiddleware(),
            UsersController.changeProfilePicture
        );

        return router;
    }
}
