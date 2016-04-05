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

var event = ripple('event');

module.exports = {
    "NetworkStatus": {
        "connectionType": {
            "name": "Connection Type",
            "control": {
                "type": "select",
                "value": "ethernet"
            },
            "options": {
                "unknown": "UNKNOWN",
                "ethernet": "ETHERNET",
                "wifi": "WIFI",
                "2g": "CELL_2G",
                "3g": "CELL_3G",
                "4g": "CELL_4G",
                "none": "none"
            },
            "callback": function (setting, oldSetting) {
                
                event.trigger("ConnectionChanged", [{oldType: oldSetting, newType: setting}]);

                var win = ripple('emulatorBridge').window(),
                    _console = ripple('console'),
                    connected = setting !== "none",
                    eventName = connected ? "online" : "offline";

                if (win && win.cordova) {
                    win.cordova.fireDocumentEvent(eventName);
                    if (eventName === "online") {
                        console.log('Pressed "Online" button. Network has been activated.');
                        document.getElementById("document").contentWindow.XMLHttpRequest.simulateOffline = false;
                    } else if (eventName === "offline") {
                        console.log('Pressed "Offline" button. Network has been deactivated.');
                        document.getElementById("document").contentWindow.XMLHttpRequest.simulateOffline = true;
                    }
                }

                ripple('bus').send("network", connected);
            }
        },
        "lag": {
            "name": "Lag the network",
            "control": {
                type: "checkbox",
                value: false
            },
            "callback": function (setting) {
                ripple('bus').send("lag", setting);
            }
        }
    },
    "globalization": {
        "locale": {
            "name": "Locale name",
            "control": {
                "type": "select",
                "value": "en"
            },
            "options": {
                "en": "English",
                "en-ca": "English (Canadian)",
                "fr": "French",
                "fr-ca": "French (Canadian)",
                "de": "German",
                "ru": "Русский"
            },
            "callback": function (setting) {
                moment.lang(setting);
            }
        },
        "isDayLightSavingsTime": {
            "name": "Is daylight saving time",
            "control": {
                "type": "checkbox",
                value: false
            }
        },
        "firstDayOfWeek": {
            "name": "First day of the week",
            "control": {
                "type": "select",
                "value": "1"
            },
            "options": {
                "1": "Sunday",
                "2": "Monday",
                "3": "Tuesday",
                "4": "Wednesday",
                "5": "Thursday",
                "6": "Friday",
                "7": "Saturday"
            },
        }
    }
};
