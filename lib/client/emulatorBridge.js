/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
var platform = ripple('platform'),
    builder = ripple('platform/builder'),
    xhrSimualtor = ripple('xhrSimulator'),
    utils = ripple('utils'),
    _xhr, _win, _doc;

function _getEmulatedViewportStyle(attr) {
    var vp = document.getElementById("viewport-container");
    return vp["client" + attr];
}

function _screenAvailWidth() {
    return _getEmulatedViewportStyle("Width");
}

function _screenAvailHeight() {
    return _getEmulatedViewportStyle("Height");
}

function _screenWidth() {
    return _getEmulatedViewportStyle("Width");
}

function _screenHeight() {
    return _getEmulatedViewportStyle("Height");
}

function _window_innerWidth() {
    return _getEmulatedViewportStyle("Width");
}

function _window_innerHeight() {
    return _getEmulatedViewportStyle("Height");
}

function _marshalScreen(win) {
    utils.forEach({
        "availWidth": _screenAvailWidth,
        "availHeight": _screenAvailHeight,
        "width": _screenWidth,
        "height": _screenHeight
    }, function (mappedFunc, prop) {
        win.screen.__defineGetter__(prop, mappedFunc);
    });

    utils.forEach({
        "innerWidth": _window_innerWidth,
        "innerHeight": _window_innerHeight
    }, function (mappedFunc, prop) {
        win.__defineGetter__(prop, mappedFunc);
    });
}

function _marshalGlobalConstructor(win, ctorName, SourceCtor) {
    var BaseLocalConstructor = win[ctorName];

    var RedirectingConstructor = function() {
        var _this = new BaseLocalConstructor();
        Object.setPrototypeOf(_this, proto);
        Object.defineProperty(_this, "__delegate", {
            value: new SourceCtor()
        });
        return _this;
    };

    var descriptors = {};
    _findAllPropertyDescriptors(descriptors, BaseLocalConstructor.prototype);

    var lateDelegatedFunctions = {};

    Object.keys(descriptors).forEach(function(prop) {
        var desc = descriptors[prop];
        var newDesc = {
            enumerable: desc.enumerable,
            configurable: desc.configurable,
            get: function() {
                if (this["__locals"].hasOwnProperty(prop)) {
                    return this["__locals"][prop];
                } else if (this["__delegate"]) {
                    return this["__delegate"][prop];
                } else {
                    return lateDelegatedFunctions[prop];
                }
            }
        };
        if (desc.set || desc.writable) {
            newDesc.set = function(value) {
                if (this["__delegate"]) {
                    return (this["__delegate"][prop] = value);
                }
                return (this["__locals"][prop] = value);
            };
        }
        descriptors[prop] = newDesc;

        if (typeof desc.value === "function") {
            lateDelegatedFunctions[prop] = (function makeLateDelegatedFunction(
                    prop) {
                return function() {
                    var fn = this["__delegate"][prop];
                    return fn.apply(this, arguments);
                };
            })(prop);
        }
    });
    descriptors["__locals"] = {
        value: {}
    };
    var proto = Object.create(BaseLocalConstructor.prototype, descriptors);

    RedirectingConstructor.prototype = proto;
    proto.constructor = RedirectingConstructor;

    win[ctorName] = RedirectingConstructor;
}

function _findAllPropertyDescriptors(map, obj) {
    var proto = Object.getPrototypeOf(obj);
    if (proto && proto !== Object.prototype) {
        _findAllPropertyDescriptors(map, proto); // recurse
    }
    Object.getOwnPropertyNames(obj).forEach(function(prop) {
        switch (prop) {
        case "__defineGetter__":
        case "__defineSetter__":
        case "__lookupGetter__":
        case "__lookupSetter__":
        case "__proto__":
        case "constructor":
        case "hasOwnProperty":
        case "isPrototypeOf":
        case "propertyIsEnumerable":
        case "prototype":
            return; // continue
        default:
            var desc = Object.getOwnPropertyDescriptor(obj, prop);
            map[prop] = desc;
        }
    });
}

function _suppressRightClick(targetWindow) {
    targetWindow.addEventListener("mouseup", function(event) {
        if (event.which !== 1) {
            event.stopPropagation();
        } 
    }, true);
    targetWindow.addEventListener("mousedown", function(event) {
        if (event.which !== 1) {
            event.stopPropagation();
        } 
    }, true);
}

module.exports = {
    init: function  (win, doc) {
        _win = win;
        _doc = doc;
        _xhr = win.XMLHttpRequest;

        function marshal(obj, key) {
            // Use defineProperty, otherwise we won't be able to override built-in read-only properties.
            var existingDescriptor = Object.getOwnPropertyDescriptor(window, key);
            Object.defineProperty(window, key, {
                get: function () {
                    return obj;
                },
                set: function (newValue) {
                    obj = newValue;
                },
                configurable: existingDescriptor ? existingDescriptor.configurable : true,
                enumerable: existingDescriptor ? existingDescriptor.enumerable : true
            });

            existingDescriptor = Object.getOwnPropertyDescriptor(win, key);
            Object.defineProperty(win, key, {
                get: function () {
                    return obj;
                },
                set: function (newValue) {
                    obj = newValue;
                },
                configurable: existingDescriptor ? existingDescriptor.configurable : true,
                enumerable: existingDescriptor ? existingDescriptor.enumerable : true
            });
        }

        var currentPlatform = platform.current(),
            sandbox         = {};

        marshal(window.tinyHippos, "tinyHippos");
        _marshalGlobalConstructor(win, "XMLHttpRequest", xhrSimualtor.get());
        _suppressRightClick(win);

        if (currentPlatform.initialize) {
            currentPlatform.initialize(win);
        }

        builder.build(platform.current().objects).into(sandbox);
        utils.forEach(sandbox, marshal);

        _marshalScreen(win);
        _marshalScreen(window);
    },

    document: function () {
        return _doc;
    },

    window: function () {
        return _win;
    },

    xhr: function () {
        return _xhr;
    }
};
