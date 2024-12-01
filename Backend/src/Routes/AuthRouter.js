// Third-Party Imports:
import { Router } from 'express';

// Local Imports:
import AuthController from '../Controllers/AuthController.js';
import { controllerDeciderMiddleware } from '../Middlewares/controllerDeciderMiddleware.js';

export default class AuthRouter {
    static createRouter() {
        const router = Router();

        // USE:
        router.use('/password/reset', controllerDeciderMiddleware());

        // GET:
        router.get('/status', AuthController.status);
        router.get('/confirm', AuthController.confirm);
        router.get('/password/reset', AuthController.resetPassword);

        // POST:
        router.post('/login', AuthController.login);
        router.post('/register', AuthController.register);
        router.post('/logout', AuthController.logout);
        router.post('/password/reset', AuthController.sendResetPasswordLink);
        router.post('/password/change', AuthController.changePassword);

        return router;
    }
}
