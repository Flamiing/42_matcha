// Third-Party Imports:
import { Router } from 'express';

// Local Imports:
import UsersController from '../Controllers/UsersController.js';

export default class UsersRouter {
    static createRouter() {
        const router = Router();

        // GET:
        router.get('/', UsersController.getAllUsers);
        router.get('/:username', UsersController.getUserProfile);
        //router.get('/:id', UsersController.getUserById);

        // POST:
        router.post('/:id', UsersController.updateUser);

        return router;
    }
}
