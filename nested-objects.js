module.exports =  {
  get: getNested,
  set: setNested,
  delete: deleteNested,
  flatten: objToPaths
};
// Extracted from https://github.com/powmedia/backbone-deep-model
// Modified to use native JS instead of underscore methods


/**
 * @param {Object}  Object to fetch attribute from
 * @param {String}  Object path e.g. 'user.name'
 * @return {Mixed}
 */
function getNested (obj, path, return_exists) {
  var fields = path ? path.split('.') : [];
  var result = obj;
  return_exists || (return_exists === false);
  for (var i = 0, n = fields.length; i < n; i++) {
    if (return_exists && !result.hasOwnProperty(fields[i])) {
      return false;
    }
    result = result[fields[i]];

    if (result == null && i < n - 1) {
      result = {};
    }

    if (typeof result === 'undefined') {
      if (return_exists)
      {
        return true;
      }
      return result;
    }
  }

  if (return_exists) {
    return true;
  }
  return result;
}

/**
 * @param {Object} obj                Object to fetch attribute from
 * @param {String} path               Object path e.g. 'user.name'
 * @param {Mixed} val                 Value to set
 * @param {Object} [options]          Options
 * @param {Boolean} [options.unset]   Whether to delete the value
 */
function setNested (obj, path, val, options) {
  options = options || {};

  var fields = path ? path.split('.') : [];
  var result = obj;
  for (var i = 0, n = fields.length; i < n && result !== undefined ; i++) {
    var field = fields[i];

    //If the last in the path, set the value
    if (i === n - 1) {
      options.unset ? delete result[field] : result[field] = val;
    } else {
      //Create the child object if it doesn't exist, or isn't an object
      if (typeof result[field] === 'undefined' || result[field] !== Object(result[field])) {
        var nextField = fields[i+1];

        // create array if next field is integer, else create object
        result[field] = /^\d+$/.test(nextField) ? [] : {};
      }

      //Move onto the next part of the path
      result = result[field];
    }
  }
}

function deleteNested (obj, path) {
  setNested(obj, path, null, { unset: true });
}

/**
 * Takes a nested object and returns a shallow object keyed with the path names
 * e.g. { "level1.level2": "value" }
 *
 * @param  {Object}      Nested object e.g. { level1: { level2: 'value' } }
 * @return {Object}      Shallow object with path names e.g. { 'level1.level2': 'value' }
 */
function objToPaths (obj) {
  var ret = {};

  for (var key in obj) {
    var val = obj[key];

    if (val && ((val.constructor === Object &&  Object.keys(val).length) || (val.constructor === Array && val.length))) {
      //Recursion for embedded objects
      var obj2 = objToPaths(val);

      for (var key2 in obj2) {
        var val2 = obj2[key2];

        ret[key + '.' + key2] = val2;
      }
    } else {
      ret[key] = val;
    }
  }

  return ret;
}