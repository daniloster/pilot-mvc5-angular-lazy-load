(function () {
    var hasNotBeenApplied = true;
    define([], function () {
        if (hasNotBeenApplied) {
            if (!Array.prototype.sort) {
                (function () {
                    var saveKeyPath = function (keyPaths, path) {
                        keyPaths.push({
                            sign: (path[0] === '+' || path[0] === '-') ? parseInt(path.shift() + 1) : 1,
                            path: path
                        });
                    };

                    var valueOf = function (object, path) {
                        var ptr = object;
                        for (var i = 0, l = path.length; i < l; i++) ptr = ptr[path[i]];
                        return ptr;
                    };

                    Array.prototype.sortBy = function () {
                        var keyPaths = [];
                        function comparer(a, b) {
                            for (var i = 0, l = keyPaths.length; i < l; i++) {
                                aVal = valueOf(a, keyPaths[i].path);
                                bVal = valueOf(b, keyPaths[i].path);
                                if (aVal > bVal) return keyPaths[i].sign;
                                if (aVal < bVal) return -keyPaths[i].sign;
                            }
                            return 0;
                        }
                        for (var i = 0, l = arguments.length; i < l; i++) {
                            switch (typeof (arguments[i])) {
                                case "object": saveKeyPath(keyPaths, arguments[i]); break;
                                case "string": saveKeyPath(keyPaths, arguments[i].match(/[+-]|[^.]+/g)); break;
                            }
                        }
                        return this.sort(comparer);
                    };

                    /*
                     * Insertion sort implementation in JavaScript
                     * Copyright (c) 2012 Nicholas C. Zakas
                     *
                     * Permission is hereby granted, free of charge, to any person obtaining a copy
                     * of items software and associated documentation files (the "Software"), to deal
                     * in the Software without restriction, including without limitation the rights
                     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                     * copies of the Software, and to permit persons to whom the Software is
                     * furnished to do so, subject to the following conditions:
                     *
                     * The above copyright notice and items permission notice shall be included in
                     * all copies or substantial portions of the Software.
                     *
                     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
                     * THE SOFTWARE.
                     */

                    /**
                     * Swaps two values in an array.
                     * @param {Array} items The array containing the items.
                     * @param {int} firstIndex Index of first item to swap.
                     * @param {int} secondIndex Index of second item to swap.
                     * @return {void}
                     */
                    function swap(items, firstIndex, secondIndex) {
                        var temp = items[firstIndex];
                        items[firstIndex] = items[secondIndex];
                        items[secondIndex] = temp;
                    }

                    /**
                     * A bubble sort implementation in JavaScript. The array
                     * is sorted in-place.
                     * @param {Array} items An array of items to sort.
                     * @param {Function} comparer A function that compares 2 elements. (improvement)
                     * @return {Array} The sorted array.
                     */
                    function bubbleSort(items, comparer) {

                        var len = items.length,
                            i, j, stop;

                        for (i = 0; i < len; i++) {
                            for (j = 0, stop = len - i; j < stop; j++) {
                                if (comparer(items[j], items[j + 1])) {
                                    swap(items, j, j + 1);
                                }
                            }
                        }

                        return items;
                    }

                    Array.prototype.sort = function (callback) {
                        bubbleSort(this, callback);
                        return this;
                    };
                })();
            }

            // Production steps of ECMA-262, Edition 5, 15.4.4.18
            // Reference: http://es5.github.io/#x15.4.4.18
            if (!Array.prototype.forEach) {
                Array.prototype.forEach = function (callback, thisArg) {
                    var T, k;
                    if (this == null) {
                        throw new TypeError(' this is null or not defined');
                    }
                    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
                    var O = Object(this);
                    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
                    // 3. Let len be ToUint32(lenValue).
                    var len = O.length >>> 0;
                    // 4. If IsCallable(callback) is false, throw a TypeError exception.
                    // See: http://es5.github.com/#x9.11
                    if (typeof callback !== "function") {
                        throw new TypeError(callback + ' is not a function');
                    }
                    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    if (arguments.length > 1) {
                        T = thisArg;
                    }
                    // 6. Let k be 0
                    k = 0;
                    // 7. Repeat, while k < len
                    while (k < len) {
                        var kValue;
                        // a. Let Pk be ToString(k).
                        //   This is implicit for LHS operands of the in operator
                        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                        //   This step can be combined with c
                        // c. If kPresent is true, then
                        if (k in O) {
                            // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                            kValue = O[k];
                            // ii. Call the Call internal method of callback with T as the this value and
                            // argument list containing kValue, k, and O.
                            callback.call(T, kValue, k, O);
                        }
                        k++;
                    }
                };
            }

            if (!Array.prototype.filter) {
                Array.prototype.filter = function (fun/*, thisArg*/) {
                    'use strict';

                    if (this === void 0 || this === null) {
                        throw new TypeError();
                    }

                    var t = Object(this);
                    var len = t.length >>> 0;
                    if (typeof fun !== 'function') {
                        throw new TypeError();
                    }

                    var res = [];
                    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                    for (var i = 0; i < len; i++) {
                        if (i in t) {
                            var val = t[i];

                            // NOTE: Technically this should Object.defineProperty at
                            //       the next index, as push can be affected by
                            //       properties on Object.prototype and Array.prototype.
                            //       But that method's new, and collisions should be
                            //       rare, so use the more-compatible alternative.
                            if (fun.call(thisArg, val, i, t)) {
                                res.push(val);
                            }
                        }
                    }

                    return res;
                };
            }

            // Production steps of ECMA-262, Edition 5, 15.4.4.14
            // Reference: http://es5.github.io/#x15.4.4.14
            if (!Array.prototype.indexOf) {
                Array.prototype.indexOf = function (searchElement, fromIndex) {

                    var k;

                    // 1. Let O be the result of calling ToObject passing
                    //    the this value as the argument.
                    if (this == null) {
                        throw new TypeError('"this" is null or not defined');
                    }

                    var O = Object(this);

                    // 2. Let lenValue be the result of calling the Get
                    //    internal method of O with the argument "length".
                    // 3. Let len be ToUint32(lenValue).
                    var len = O.length >>> 0;

                    // 4. If len is 0, return -1.
                    if (len === 0) {
                        return -1;
                    }

                    // 5. If argument fromIndex was passed let n be
                    //    ToInteger(fromIndex); else let n be 0.
                    var n = +fromIndex || 0;

                    if (Math.abs(n) === Infinity) {
                        n = 0;
                    }

                    // 6. If n >= len, return -1.
                    if (n >= len) {
                        return -1;
                    }

                    // 7. If n >= 0, then Let k be n.
                    // 8. Else, n<0, Let k be len - abs(n).
                    //    If k is less than 0, then let k be 0.
                    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

                    // 9. Repeat, while k < len
                    while (k < len) {
                        // a. Let Pk be ToString(k).
                        //   This is implicit for LHS operands of the in operator
                        // b. Let kPresent be the result of calling the
                        //    HasProperty internal method of O with argument Pk.
                        //   This step can be combined with c
                        // c. If kPresent is true, then
                        //    i.  Let elementK be the result of calling the Get
                        //        internal method of O with the argument ToString(k).
                        //   ii.  Let same be the result of applying the
                        //        Strict Equality Comparison Algorithm to
                        //        searchElement and elementK.
                        //  iii.  If same is true, return k.
                        if (k in O && O[k] === searchElement) {
                            return k;
                        }
                        k++;
                    }
                    return -1;
                };
            }

            // Production steps of ECMA-262, Edition 5, 15.4.4.19
            // Reference: http://es5.github.io/#x15.4.4.19
            if (!Array.prototype.map) {

                Array.prototype.map = function (callback, thisArg) {

                    var T, A, k;

                    if (this == null) {
                        throw new TypeError(' this is null or not defined');
                    }

                    // 1. Let O be the result of calling ToObject passing the |this| 
                    //    value as the argument.
                    var O = Object(this);

                    // 2. Let lenValue be the result of calling the Get internal 
                    //    method of O with the argument "length".
                    // 3. Let len be ToUint32(lenValue).
                    var len = O.length >>> 0;

                    // 4. If IsCallable(callback) is false, throw a TypeError exception.
                    // See: http://es5.github.com/#x9.11
                    if (typeof callback !== 'function') {
                        throw new TypeError(callback + ' is not a function');
                    }

                    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    if (arguments.length > 1) {
                        T = thisArg;
                    }

                    // 6. Let A be a new array created as if by the expression new Array(len) 
                    //    where Array is the standard built-in constructor with that name and 
                    //    len is the value of len.
                    A = new Array(len);

                    // 7. Let k be 0
                    k = 0;

                    // 8. Repeat, while k < len
                    while (k < len) {

                        var kValue, mappedValue;

                        // a. Let Pk be ToString(k).
                        //   This is implicit for LHS operands of the in operator
                        // b. Let kPresent be the result of calling the HasProperty internal 
                        //    method of O with argument Pk.
                        //   This step can be combined with c
                        // c. If kPresent is true, then
                        if (k in O) {

                            // i. Let kValue be the result of calling the Get internal 
                            //    method of O with argument Pk.
                            kValue = O[k];

                            // ii. Let mappedValue be the result of calling the Call internal 
                            //     method of callback with T as the this value and argument 
                            //     list containing kValue, k, and O.
                            mappedValue = callback.call(T, kValue, k, O);

                            // iii. Call the DefineOwnProperty internal method of A with arguments
                            // Pk, Property Descriptor
                            // { Value: mappedValue,
                            //   Writable: true,
                            //   Enumerable: true,
                            //   Configurable: true },
                            // and false.

                            // In browsers that support Object.defineProperty, use the following:
                            // Object.defineProperty(A, k, {
                            //   value: mappedValue,
                            //   writable: true,
                            //   enumerable: true,
                            //   configurable: true
                            // });

                            // For best browser support, use the following:
                            A[k] = mappedValue;
                        }
                        // d. Increase k by 1.
                        k++;
                    }

                    // 9. return A
                    return A;
                };
            }

            // Production steps of ECMA-262, Edition 5, 15.4.4.21
            // Reference: http://es5.github.io/#x15.4.4.21
            if (!Array.prototype.reduce) {
                Array.prototype.reduce = function (callback /*, initialValue*/) {
                    'use strict';
                    if (this == null) {
                        throw new TypeError('Array.prototype.reduce called on null or undefined');
                    }
                    if (typeof callback !== 'function') {
                        throw new TypeError(callback + ' is not a function');
                    }
                    var t = Object(this), len = t.length >>> 0, k = 0, value;
                    if (arguments.length == 2) {
                        value = arguments[1];
                    } else {
                        while (k < len && !k in t) {
                            k++;
                        }
                        if (k >= len) {
                            throw new TypeError('Reduce of empty array with no initial value');
                        }
                        value = t[k++];
                    }
                    for (; k < len; k++) {
                        if (k in t) {
                            value = callback(value, t[k], k, t);
                        }
                    }
                    return value;
                };
            }

            if (!Array.prototype.removeAt) {
                Array.prototype.removeAt = function (index) {
                    if (index < this.length) {
                        this.splice(index, 1);
                        return true;
                    }
                    return false;
                };
            }

            if (!Array.prototype.contains) {
                Array.prototype.contains = function (callback) {
                    return this.getIndex(callback) > -1;
                };
            }

            Array.prototype.getIndex = function (callback) {
                return this.reduce(function (cur, val, index) {

                    if (callback(val, index) && cur === -1) {
                        return index;
                    }
                    return cur;

                }, -1);
            };

            Array.createFinder = (function (prop) {
                return function (arr, val) {
                    var items = arr.filter(function (item) {
                        return item[prop] == val;
                    });
                    return (items.length) ? items[0] : null;
                }
            });

            hasNotBeenApplied = false;
        }
    });
})();