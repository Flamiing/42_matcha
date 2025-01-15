// Third-Party Imports:
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fsExtra from 'fs-extra';

const ensureUserFolderExists = (userId) => {
    const { IMAGES_PATH } = process.env;

    const userFolderPath = path.join(IMAGES_PATH, userId);

    fsExtra.ensureDirSync(userFolderPath);
    return userFolderPath;
};

export const imageUploadMiddleware = () => {
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

    return multer();

    //return multer({
    //    storage: storage,
    //}).array('files', 4);
};
