function isValidId(id) {
    return (typeof id !== 'undefined' && Number.isInteger(id) && id.length > 0);
}

export function validateId(id) {
    if (!isValidId(id)) {
        throw new Error('Invalid id');
    }
    return true
}