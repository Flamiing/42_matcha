import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fsExtra from 'fs-extra';

const ensureUserFolderExists = (userId) => {
    const { IMAGES_PATH } = process.env;

    const userFolderPath = path.join(IMAGES_PATH, userId);

    // Use fs-extra to create the folder recursively if it doesn't exist
    fsExtra.ensureDirSync(userFolderPath);
    return userFolderPath;
};

export const imageUploadMiddleware = () => {
    // Multer storage configuration
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const { id } = req.params;
            const userFolder = ensureUserFolderExists(id);
            cb(null, path.join(userFolder));
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        },
    });

    return multer({
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 10 }, // 10MB file size limit
        fileFilter: function (req, file, cb) {
            const fileTypes = /jpeg|jpg|png|gif/;
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
    }).single('file');
};
