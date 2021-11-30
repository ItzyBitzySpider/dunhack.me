function isValidId(id) {
    return (typeof id !== 'undefined' && Number.isInteger(id) && id> 0);
}

export function validateId(id) {
    if (!isValidId(id)) {
        throw new Error('Invalid id');
    }
    return true
}