// Third-Party Imports:
import { Router } from 'express';

// Local Imports:
import UsersController from '../Controllers/UsersController.js';
import { checkValidUserIdMiddleware } from '../Middlewares/checkValidUserIdMiddleware.js';
import { imageUploadMiddleware } from '../Middlewares/imageUploadMiddleware.js';
import { imagesValidationMiddleware } from '../Middlewares/imagesValidationMiddleware.js';
import { removeImageOnFailureMiddleware } from '../Middlewares/removeImageOnFailureMiddleware.js';

export default class UsersRouter {
    static createRouter() {
        const router = Router();

        // GET:
        router.get('/', UsersController.getAllUsers);
        router.get('/:username', UsersController.getUserProfile);
        router.get('/:id/profile-picture', UsersController.getProfilePicture);
        router.get('/:id/images/:imageId', UsersController.getImage);

        // POST:
        router.post(
            '/:id/images',
            checkValidUserIdMiddleware(),
            imageUploadMiddleware(),
            imagesValidationMiddleware(),
            UsersController.uploadImages,
            removeImageOnFailureMiddleware
        );

        // DELETE:
        router.delete('/:id/images/:imageId', checkValidUserIdMiddleware(), UsersController.deleteImage);

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
            imageUploadMiddleware(),
            imagesValidationMiddleware(),
            UsersController.changeProfilePicture,
            removeImageOnFailureMiddleware
        );

        return router;
    }
}
