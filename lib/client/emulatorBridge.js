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

function _overrideXHR(targetWindow) {
    var OriginalXHR = targetWindow.XMLHttpRequest;
    
    function MyXHR(params) {
        var _xhr = new OriginalXHR(params);
        
        var _open = _xhr.open;
        var openedUrl;
        _xhr.open = function(method, url) {
            openedUrl = url;
            return _open.apply(this, arguments);
        };
        
        var _send = _xhr.send;
        _xhr.send = function() {
            /* jshint shadow: true*/
            if (MyXHR.simulateOffline && openedUrl.startsWith("http")) {
                overrideProperty(this, "status", 0);
                if (this.onreadystatechange) {
                    var ev = new Event("readystatechange");
                    overrideProperty(this, "readyState", 4);
                    overrideProperty(ev, "currentTarget", this);
                    overrideProperty(ev, "srcElement", this);
                    overrideProperty(ev, "target", this);
                    this.onreadystatechange(ev);
                }
                if (this.onloadstart) {
                    var ev = createEvent(this, "loadstart", Date.now());
                    overrideProperty(this, "readyState", 1);
                    this.onloadstart(ev);
                }
                
                if (this.onerror) {
                    var ev = createEvent(this, "error", Date.now());
                    overrideProperty(this, "readyState", 4);
                    this.onerror(ev);
                }
                if (this.onloadend) {
                    var ev = createEvent(this, "loadend", Date.now());
                    overrideProperty(this, "readyState", 4);
                    this.onloadend(ev);
                }
                return;
            }
            return _send.apply(this, arguments);
        };
        
        function overrideProperty(object, propertyName, value) {
            Object.defineProperty(object, propertyName, {
                get: function() {
                    return value;
                }
            });
        }
        
        function createEvent(context, propertyName, timestamp) {
            var ev = {};
            ev.bubbles = false;
            ev.cancelBubble = false;
            ev.cancelable = true;
            ev.currentTarget = context;
            ev.defaultPrevented = false;
            ev.defaultPrevented = 0;
            ev.lengthComputable = false;
            ev.loaded = 0;
            ev.position = 0;
            ev.returnValue = true;
            ev.srcElement = context;
            ev.target = context;
            ev.timestamp = timestamp;
            ev.total = 0;
            ev.totalSize = 0;
            ev.type = propertyName;
            return ev;
        }
        return _xhr;
    }
    MyXHR.simulateOffline = false;
    targetWindow.XMLHttpRequest = MyXHR;
}

function _suppressRightClick(targetWindow) {
    
    targetWindow.addEventListener("mouseup", function(event) {
        if (event.which !== 1) {
            event.stopPropagation();
        } 
    }, true);
    
    targetWindow.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });
    
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
                configurable: existingDescriptor ? existingDescriptor.configurable : true,
                enumerable: existingDescriptor ? existingDescriptor.enumerable : true
            });

            existingDescriptor = Object.getOwnPropertyDescriptor(win, key);
            Object.defineProperty(win, key, {
                get: function () {
                    return obj;
                },
                configurable: existingDescriptor ? existingDescriptor.configurable : true,
                enumerable: existingDescriptor ? existingDescriptor.enumerable : true
            });
        }

        var currentPlatform = platform.current(),
            sandbox         = {};

        _overrideXHR(window);
        _suppressRightClick(window);

        marshal(window.tinyHippos, "tinyHippos");
        marshal(window.XMLHttpRequest, "XMLHttpRequest");

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
