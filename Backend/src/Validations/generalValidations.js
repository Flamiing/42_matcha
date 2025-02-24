export function isValidUUID(uuid) {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

export function isValidBase64(str) {
    if (str === '' || str.trim() === '') return false;
    try {
        return btoa(atob(str)) == str;
    } catch (error) {
        return false;
    }
}
