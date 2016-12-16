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
var ui = ripple('ui'),
    widgetConfig = ripple('widgetConfig'),
    win = ripple('emulatorBridge').window(),
    _autoHideTimeout = null;

(function() {
    var autoHide = (widgetConfig.getPreference("AutoHideSplashScreen", "true") === true);
    var delay = Number(widgetConfig.getPreference("SplashScreenDelay", "3000"));
    
    if (delay > 0) {
        win.document.addEventListener("DOMContentLoaded", function() {
            showSplashScreen();
            if (autoHide) {
                _autoHideTimeout = win.setTimeout(hideSplashScreen, delay);
            }
        });
    }
})();

function showSplashScreen() {
    ui.showOverlay('splashscreen');
}

function hideSplashScreen() {
    ui.hideOverlay('splashscreen');
    if (_autoHideTimeout) {
        win.clearTimeout(_autoHideTimeout);
        _autoHideTimeout = null;
    }
}

module.exports = {
    show: function () {
        showSplashScreen();
    },
    hide: function () {
        hideSplashScreen();
    }
};
