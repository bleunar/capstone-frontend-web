// check if object or null
function isObject(object) {
  return object != null && typeof object === 'object';
}

// check if objects have the same content of key adnd value
export function antiRacismCheck(obj1, obj2) {
    // fetch keys from objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // flag as false if not equalt length
    if (keys1.length !== keys2.length) {
        return false;
    }

    // check each key
    for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        // if object, run the function recursively
        const areObjects = isObject(val1) && isObject(val2);
        if (areObjects && !areObjectsDeeplyEqual(val1, val2)) {
            return false;
        }

        // if not object, compare
        if (!areObjects && val1 !== val2) {
            return false;
        }
    }

    // equality check complete, not a racist
    return true;
}