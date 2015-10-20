(function(){ 
    var hasNotBeenApplied = true;
    define(['util/string'], function () {
        if (hasNotBeenApplied) {

            // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys

            Object.isNull = function isNull(val) {
                return val === undefined || val === null;
            };

            if (!Object.prop) {
                Object.prop = function prop(target, path, val) {
                    'use strict';
                    var error = new Error('PROPERTY_PATH_NAVIGATION_ERROR'), isSetter = (val !== undefined);
                    path = path.split('.');
                    try {
                        path.forEach(function (access, idx) {
                            idx = access.indexOf(/\[[0-9]*\]/);
                            if (idx > -1) {
                                idx = parseInt(access.substring(idx).replace('[', '').replace(']', '').trim());
                                access = access.replace(/\[[0-9]*\]/, '');
                                if (path.length === idx + 1) {
                                    if (val !== undefined) {
                                        target[access][idx] = val;
                                    } else {
                                        val = target[access][idx];
                                    }
                                } else {
                                    target = target[access][idx];
                                }
                                if (isNull(target)) {
                                    throw error;
                                }
                            } else {
                                if (path.length === idx + 1) {
                                    if (val !== undefined) {
                                        target[access] = val;
                                    } else {
                                        val = target[access];
                                    }
                                } else {
                                    target = target[access];
                                }
                                if (Object.isNull(target)) {
                                    throw error;
                                }
                            }
                        });
                    } catch (e) {
                        if (e.message === error.message) {
                            return undefined;
                        }
                        throw e;
                    }
                    if (isSetter) return;
                    return val;
                };
            }

            if (!Object.removeProperty) {
                Object.removeProperty = function removeProperty(data, propertyName) {
                    delete data[propertyName];
                };
            }

            if (!Object.setReference) {
                Object.setReference = function setReference(object, property, source, isArray) {
                    if (object[property] === null || object[property] === undefined) {
                        object[property] = isArray ? [] : null;
                        return;
                    }
                    object[property] = source.filter(function (ref) {
                        return (!isArray && object[property].Id == ref.Id) || (isArray && object[property].contains(function (item) {
                            return item.Id == ref.Id;
                        }));
                    });
                    if (!isArray) {
                        object[property] = object[property].length > 0 ? object[property][0] : null;
                    }
                };
            }

            // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
            if (!Object.keys) {
                Object.keys = (function () {
                    'use strict';
                    var hasOwnProperty = Object.prototype.hasOwnProperty,
                        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                        dontEnums = [
                          'toString',
                          'toLocaleString',
                          'valueOf',
                          'hasOwnProperty',
                          'isPrototypeOf',
                          'propertyIsEnumerable',
                          'constructor',
                          'prop',
                          'setReference'
                        ],
                        dontEnumsLength = dontEnums.length;

                    return function (obj) {
                        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                            throw new TypeError('Object.keys called on non-object');
                        }

                        var result = [], prop, i;

                        for (prop in obj) {
                            if (hasOwnProperty.call(obj, prop)) {
                                result.push(prop);
                            }
                        }

                        if (hasDontEnumBug) {
                            for (i = 0; i < dontEnumsLength; i++) {
                                if (hasOwnProperty.call(obj, dontEnums[i])) {
                                    result.push(dontEnums[i]);
                                }
                            }
                        }
                        return result;
                    };
                }());
            }

            hasNotBeenApplied = false;
        }
    });
})();