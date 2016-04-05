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
var _self,
    db = ripple('db'),
    utils = ripple('utils'),
    platform = ripple('platform'),
    event = ripple('event'),
    _devices = {};

event.on("HardwareKeyDefault", function (key) {
    if (key === 0 || key === "0") { //back button key
        ripple('emulatorBridge').window().history.back();
    }
});

function _getRequestedDevice() {
    //format is platform-version-device
    return (utils.queryString().enableripple || "").split('-')[2];
}

_self = module.exports = {
    initialize: function () {
        _devices = [
            "AcerA500",
            "FWVGA",
            "G1",
            "iPad12Mini",
            "iPad3",
            "iPhone4",
            "iPhone5",
            "iPhone6",
            "iPhone6Plus",
            "SamsungGalaxyNote3",
            "SamsungGalaxySS2W",
            "SamsungGalaxyS4",
            "Legend",
            "Nexus",
            "NexusS",
            "NexusGalaxy",
            "Nexus7",
            "Nexus4",
            "Nexus5",
            "QVGA",
            "Tattoo",
            "Wave",
            "WQVGA",
            "WVGA",
            "HVGA"
        ].reduce(function (hash, deviceID) {
            hash[deviceID.toLowerCase()] = ripple('devices/' + deviceID);
            return hash;
        }, {});

        var current = this.getCurrentDevice();
        ripple('bus').send('userAgent', current.userAgent);
    },

    getCurrentDevice: function () {
        var deviceId = _getRequestedDevice() || db.retrieve("device-key"),
            device = this.getDevice(deviceId),
            platformId = platform.current().id,
            does = function (device) {
                return {
                    include: function (platformId) {
                        return device.platforms.some(function (id) {
                            return platformId === id;
                        });
                    }
                };
            };

        if (!device || !does(device).include(platformId)) {
            deviceId = utils.reduce(_devices, function (current, device, id) {
                return does(device).include(platformId) ? id : current;
            });

            device = this.getDevice(deviceId);
        }

        return device;
    },

    getDevice: function (deviceId) {
        return utils.copy(_devices[(deviceId || "").toLowerCase()]);
    },

    getDevicesForPlatform: function (platformId) {
        return utils.filter(_devices, function (device) {
            return device.platforms.indexOf(platformId) > -1;
        });
    }
};
