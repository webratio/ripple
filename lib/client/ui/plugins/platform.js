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
var constants = ripple('constants'),
    utils = ripple('utils'),
    devices = ripple('devices'),
    platform = ripple('platform'),
    tooltip = ripple('ui/plugins/tooltip');

function _animateChangePlatformButton() {
    jQuery("#change-platform")
        .animate({opacity: 0.5}, 500)
        .animate({opacity: 1}, 500)
        .animate({opacity: 0.5}, 500)
        .animate({opacity: 1}, 500)
        .animate({opacity: 0.5}, 500)
        .animate({opacity: 1}, 500);
}

function _updatePlatformDeviceSelect(platformID, currentDeviceKey) {
    var devicesSelect = document.getElementById(constants.COMMON.DEVICE_SELECT_ID),
        listOfSortedDevices = devices.getDevicesForPlatform(platformID)
                                        .sort(function (a, b) {
                                            return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
                                        });

    devicesSelect.innerHTML = "";

    listOfSortedDevices.forEach(function (dev) {
        var deviceNode = utils.createElement("option", {
            "innerHTML": dev.name,
            "value": dev.id
        });

        if (currentDeviceKey && deviceNode.value === currentDeviceKey) {
            deviceNode.selected = true;
        }

        devicesSelect.appendChild(deviceNode);
    });
}

function changePlatformOrDevice() {
    var platformId = jQuery("#platform-select").val(),
        version = jQuery("#version-select").val(),
        device = jQuery("#device-select").val();

    platform.changeEnvironment({
        "name": platformId,
        "version": version
    }, device, function () {
        var original = utils.queryString().enableripple,
            updated = platformId + "-" + version + "-" + device;

        if (original) {
            location.href = location.href.replace(new RegExp(original, "i"), updated);
        }
        else { location.reload(); }
    });
}

module.exports = {
    panel: {
        domId: "platforms-container",
        collapsed: true,
        pane: "left"
    },
    initialize: function () {
        var currentPlatform = platform.current().id,
            currentVersion = platform.current().version,
            platformList = platform.getList(),
            platformSelect = document.getElementById(constants.COMMON.PLATFORM_SELECT_ID),
            versionSelect = document.getElementById("version-select"),
            currentDeviceKey = devices.getCurrentDevice().id,
            platformNode, versionNode;

        jQuery("#platform-select").bind("change", function () {
            var newPlatform = jQuery(this).val(),
                newDevice = jQuery("#device-select").val();

            jQuery(versionSelect).children("option").remove();

            utils.forEach(platformList, function (platform) {
                utils.forEach(platform, function (version, versionNumber) {
                    if (newPlatform === version.id) {
                        versionSelect.appendChild(utils.createElement("option", {
                            "innerHTML": versionNumber,
                            "value":  versionNumber
                        }));
                    }
                });
            });

            _updatePlatformDeviceSelect(newPlatform, newDevice);

            jQuery("#" + constants.COMMON.DEVICE_SELECT_ID).effect("highlight", {color: "#62B4C8"}, 500, function () {
                _animateChangePlatformButton();
            });
        });


        jQuery("#change-platform").bind("click", changePlatformOrDevice);
        jQuery("#device-select").bind("change", changePlatformOrDevice);

        utils.forEach(platformList, function (platform) {
            utils.forEach(platform, function (version, versionNumber) {
                platformNode = utils.createElement("option", {
                    "innerHTML": version.name,
                    "value":  version.id
                });

                if (currentPlatform && version.id === currentPlatform) {
                    platformNode.selected = true;

                    versionNode = utils.createElement("option", {
                        "innerHTML": versionNumber,
                        "value": versionNumber
                    });

                    if (currentVersion && currentVersion === versionNumber) {
                        versionNode.selected = true;
                    }

                    versionSelect.appendChild(versionNode);
                }

                if (jQuery(platformSelect).children("option").val() !== version.id) {
                    platformSelect.appendChild(platformNode);
                }
            });
        });

        _updatePlatformDeviceSelect(currentPlatform, currentDeviceKey);

        tooltip.create("#" +  constants.COMMON.CHANGE_PLATFORM_BUTTON_ID, "This action will reload your page.");
    }
};
