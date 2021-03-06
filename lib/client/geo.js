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
var db = ripple('db'),
    exception = ripple('exception'),
    event = ripple('event'),
    utils = ripple('utils'),
    _positionInfo = {
        "latitude": 43.465187,
        "longitude": -80.522372,
        "altitude": 100,
        "accuracy": 150,
        "altitudeAccuracy": 80,
        "heading": 0,
        "speed": 0,
        "cellID": 321654
    },
    self;

function _serialize(settings) {
    var tempSettings = utils.copy(settings);
    tempSettings.position.timeStamp = "new Date(" + tempSettings.position.timeStamp.getTime() + ")";
    return tempSettings;
}

function _validatePositionInfo(pInfo) {
    return (pInfo &&
        !(isNaN(pInfo.latitude) ||
        isNaN(pInfo.longitude) ||
        isNaN(pInfo.altitude) ||
        isNaN(pInfo.accuracy) ||
        isNaN(pInfo.altitudeAccuracy) ||
        isNaN(pInfo.heading) ||
        isNaN(pInfo.speed) ||
        isNaN(pInfo.cellID))) ? true : false;
}

self = module.exports = {
    initialize: function () {
        var settings = db.retrieveObject("geosettings");
        if (settings) {
            utils.forEach(_positionInfo, function (value, key) {
                _positionInfo[key] = parseFloat(settings.position[key] || value);
            });

            self.timeout = settings.timeout;
            self.delay = settings.delay || 0;

        }
    },

    getPositionInfo: function () {
        var pi = utils.copy(_positionInfo);
        pi.timeStamp = new Date();

        return pi;
    },

    updatePositionInfo: function (newPositionInfo, delay, timeout) {
        if (!_validatePositionInfo(newPositionInfo)) {
            exception.raise(exception.types.Geo, "invalid positionInfo object");
        }

        _positionInfo = utils.copy(newPositionInfo);
        _positionInfo.timeStamp = new Date();

        self.delay = delay || 0;
        self.timeout = timeout;

        db.saveObject("geosettings", _serialize({
            position: _positionInfo,
            delay: self.delay,
            timeout: self.timeout
        }));

        event.trigger("PositionInfoUpdatedEvent", [_positionInfo]);
    },

    timeout: false,
    delay: 0,
    map: {}
};
