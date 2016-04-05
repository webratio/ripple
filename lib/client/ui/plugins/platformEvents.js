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
var _console = ripple('console'),
    platform = ripple('platform'),
    utils = ripple('utils');

module.exports = {
    panel: {
        domId: "platform-events-container",
        collapsed: true,
        pane: "right"
    },
    initialize: function () {
        var eventSelect = document.getElementById("platform-events-select"),
            spec = platform.current();

        if (!spec.events) {
            return;
        }

        utils.forEach(spec.events, function (method, name) {
            eventSelect.appendChild(utils.createElement("option", {
                "innerHTML": name,
                "value": name
            }));
        });

        jQuery("#platform-events-fire").click(function () {
            var eventName = document.getElementById("platform-events-select").value,
                args = spec.events[eventName].args ? document.getElementById("platform-events-args").value : null,
                callback = spec.events[eventName].callback;

            _console.log("fired event => " + eventName);

            try {
                callback(args);
            } catch (e) {
                _console.log("Failed to raise: " + eventName);
                _console.log(e);
            }
        });

        jQuery("#settings-resetaccountmanager").click(function () {
            localStorage.removeItem("com.webratio.accountmanager.data");
            location.reload();
        });

        jQuery("#settings-resetlocaldata").click(function () {
            var promises = document.getElementById("document").contentWindow.wr.mvc.mgmt.DatabaseConfig.getAll().map(function(db){
                return db.clear();
            });         
            Promise.all(promises).then(function() {
                console.log("Clearing local storage info");
                document.getElementById("document").contentWindow.wr.mvc.mgmt.Runtime.get().clearLocalData();
                console.log("Reloading page");
                location.reload();
            });
        });

        jQuery("#platform-events-fire-back").click(function () {
            var eventName = "backbutton",
            args = spec.events[eventName].args ? document.getElementById("platform-events-args").value : null,
                    callback = spec.events[eventName].callback;
            console.log('Pressed "Back" button.');
            try {
                callback(args);
            } catch (e) {
                _console.log("Failed to raise: " + eventName);
                _console.log(e);
            }
        });
        
        jQuery("#platform-events-fire-suspend").click(function () {
            var eventName = "pause",
            args = spec.events[eventName].args ? document.getElementById("platform-events-args").value : null,
                    callback = spec.events[eventName].callback;
            console.log('Pressed "Pause" button. Application is now running in background.');
            var suspendButton = document.getElementById('platform-events-fire-suspend');
            suspendButton.style.display = "none";
            document.getElementById('platform-events-fire-resume').style.display = "initial";
            document.getElementById('viewport-container').style.opacity = 0.2;
            document.getElementById('viewport-container').style.pointerEvents = 'none';
            document.getElementById('platform-events-fire-back').style.pointerEvents = 'none';
            document.getElementById('platform-events-fire-back').style.opacity = 0.5;
            try {
                callback(args);
            } catch (e) {
                _console.log("Failed to raise: " + eventName);
                _console.log(e);
            }
        });
        
        jQuery("#platform-events-fire-resume").click(function () {
            var eventName = "resume",
            args = spec.events[eventName].args ? document.getElementById("platform-events-args").value : null,
                    callback = spec.events[eventName].callback;
            console.log('Pressed "Resume" button. Application is now running in foreground.');
            document.getElementById('platform-events-fire-suspend').style.display = "";
            document.getElementById('platform-events-fire-resume').style.display = "none";
            document.getElementById('viewport-container').style.opacity = 1;
            document.getElementById('viewport-container').style.pointerEvents = 'auto';
            document.getElementById('platform-events-fire-back').style.pointerEvents = 'initial';
            document.getElementById('platform-events-fire-back').style.opacity = 1;
            try {
                callback(args);
            } catch (e) {
                _console.log("Failed to raise: " + eventName);
                _console.log(e);
            }
        });
        
        jQuery("#platform-events-fire-offline").click(function () {
            var node = $(document.getElementById("device-settings-NetworkStatus.connectionType"));
            node.val("none");
            node.change();
            var offlineButton = document.getElementById('platform-events-fire-offline');
            offlineButton.style.display = "none";
            document.getElementById('platform-events-fire-online').style.display = "initial";
        });
        
        jQuery("#platform-events-fire-online").click(function () {
            var node = $(document.getElementById("device-settings-NetworkStatus.connectionType"));
            node.val("ethernet");
            node.change();
            document.getElementById('platform-events-fire-offline').style.display = "";
            document.getElementById('platform-events-fire-online').style.display = "none";
        });

        jQuery(eventSelect).change(function () {
            var argsSelect = jQuery("#platform-events-args"),
                args = spec.events[this.value].args;

            argsSelect.empty();

            if (args) {
                utils.forEach(spec.events[this.value].args, function (arg, index) {
                    argsSelect.append(utils.createElement("option", {
                        innerHTML: arg,
                        value: index
                    }));
                });

                argsSelect.show();
            } else {
                argsSelect.hide();
            }
        });
    }
};
