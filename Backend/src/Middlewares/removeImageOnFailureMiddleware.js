// Third-Party Imports:
import fsExtra from 'fs-extra';

export async function removeImageOnFailureMiddleware(err, req, res, next) {
    for (const image of req.files) {
        try {
            await fsExtra.remove(image.path);
            console.log(
                `Image with path '${image.path}' has been removed successfully!`
            );
        } catch (error) {
            console.error(`Error deleting file ${image.path}: ${error}`);
        }
    }
    next(err);
}
