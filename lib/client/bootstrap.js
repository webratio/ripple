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
var _bound,
    _console = ripple('console');

function _bindObjects(win, doc) {
    if (!win.tinyHippos) {
        ripple('emulatorBridge').init(win, doc);
        ripple('touchEventEmulator').init(win, doc);
        ripple('deviceMotionEmulator').init(win, doc);
        ripple('resizer').init(win, doc);
        ripple('cssMediaQueryEmulator').init(win, doc);
        _bound = true;
    }
}

function _createFrame(src) {
    var frame = document.createElement("iframe");
    frame.setAttribute("id", "document");
    frame.src = src;
    return frame;
}

function _post(src) {
    var event = ripple('event'),
        frame = _createFrame(src);

    _console.log("Initialization Finished (Make it so.)");

    frame.onload = function () {
        var bootLoader = document.querySelector("#emulator-booting"),
            id;
        if (bootLoader) {
            document.querySelector("#ui").removeChild(bootLoader);
        }

        event.trigger("TinyHipposLoaded");

        var targetWindow = frame.contentWindow;
        _overrideXHR(targetWindow);
        _suppressRightClick(targetWindow);

        window.setTimeout(function () {
            window.clearInterval(id);
        }, 1200);
    };

    // append frame
    document.getElementById("viewport-container").appendChild(frame);

    delete tinyHippos.boot;
}

function _bootstrap() {
    if (console.clear) {
        console.clear();
    }

    _console.log("Ripple :: Environment Warming Up (Tea. Earl Grey. Hot.)");

    window.tinyHippos = ripple('index');

    tinyHippos.boot(function () {
        var uri = document.URL.replace(/enableripple=[^&]*[&]?/i, "").replace(/[\?&]*$/, "");
        _post(uri);
        delete tinyHippos.boot;
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
                    this.onreadystatechange(ev); // TODO creare event
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
    bootstrap: _bootstrap,
    inject: function (frameWindow, frameDocument) {
        _bindObjects(frameWindow, frameDocument);
    }
};
