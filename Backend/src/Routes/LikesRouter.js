// Third-Party Imports:
import { Router } from 'express';

// Local Imports:
import LikesController from '../Controllers/LikesController.js';

export default class LikesRouter {
    static createRouter() {
        const router = Router();

        // POST:
        router.post('/:userId', LikesController.saveLike);
        
        // DELETE:
        router.delete('/:userId', LikesController.removeLike);

        return router;
    }
}
