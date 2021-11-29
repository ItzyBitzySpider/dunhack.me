function isInt(value) {
    if (isNaN(value)) {
      return false;
    }
    var x = parseFloat(value);
    return (x | 0) === x;
  }

function isValidId(id) {
    return (typeof id !== 'undefined' && isInt(id) && id.length > 0);
}

export function validateId(id) {
    if (!isValidId(id)) {
        throw new Error('Invalid id');
    }
    return true
}