// Third-Party Imports:
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Local Imports:
import UsersController from '../Controllers/UsersController.js';
import { checkValidUserIdMiddleware } from '../Middlewares/checkValidUserIdMiddleware.js';

export default class UsersRouter {
    static createRouter() {
        const router = Router();

        // Setup Multer Middleware:
        this.#setupMulter();

        // GET:
        router.get('/', UsersController.getAllUsers);
        router.get('/:username', UsersController.getUserProfile);

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
            this.upload.single('file'),
            UsersController.changeProfilePicture
        );

        return router;
    }

    static #setupMulter() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const { IMAGES_PATH, VALID_IMAGE_FORMATS } = process.env;

        // Multer storage configuration
        this.storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, IMAGES_PATH)); // Save files to the "uploads" folder
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid name collisions
            },
        });

        this.upload = multer({
            storage: this.storage,
            limits: { fileSize: 1024 * 1024 * 10 }, // 10MB file size limit
            fileFilter: function (req, file, cb) {
                const fileTypes = VALID_IMAGE_FORMATS;
                const extName = fileTypes.test(
                    path.extname(file.originalname).toLowerCase()
                );
                const mimeType = fileTypes.test(file.mimetype);

                if (extName && mimeType) {
                    cb(null, true);
                } else {
                    cb(new Error('Only image files are allowed!'));
                }
            },
        });
    }
}
