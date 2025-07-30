export function parseImages(userId, imagesToParse) {
    const { API_DOMAIN, API_VERSION } = process.env;

    const images = [];
    for (const imageToParse of imagesToParse) {
        const image = {
            imageId: imageToParse.id,
            imageURL: `${API_DOMAIN}/api/v${API_VERSION}/users/${userId}/images/${imageToParse.id}`,
        };
        images.push(image);
    }
    return images;
}
