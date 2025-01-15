// Third-Party Imports:
import path from 'path';

// Local Imports:
import StatusMessage from '../Utils/StatusMessage.js';

export const imagesValidationMiddleware = () => (req, res, next) => {
    // Validate the image
    if (!req.files || res.files.length === 0)
        return res.status(400).json({ msg: StatusMessage.NO_IMAGE_UPLOADED })
    for (image of req.files) {
        if (!validExtension(image.originalname)) return res.status(400).json({ msg: StatusMessage.INVALID_IMAGE_EXTENSION })
        if (!valid)
    }
    console.log('TEST: ', path.extname(req.files[0].originalname));
    next();
};

function validExtension(fileName) {
    const VALID_EXTENSIONS = [
        'jpeg',
        'jpg',
        'png'
    ]

    const extension = path.extname(fileName).slice(1).toLowerCase();

    if (!VALID_EXTENSIONS.includes(extension))
        return false;
    return true;
}
