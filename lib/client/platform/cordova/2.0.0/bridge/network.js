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

var deviceSettings = ripple('deviceSettings'),
    event = ripple('event'),
    _success;

event.on("ConnectionChanged", function () {
    var wrConnectionType = deviceSettings.retrieve("NetworkStatus.connectionType");
    if (wrConnectionType === "none") {
        document.getElementById('platform-events-fire-offline').style.display = "none";
        document.getElementById('platform-events-fire-online').style.display = "initial";
    } else {
        document.getElementById('platform-events-fire-offline').style.display = "";
        document.getElementById('platform-events-fire-online').style.display = "none";
    }
    return _success && _success(wrConnectionType);
});

module.exports = {
    getConnectionInfo: function (success) {
        _success = success;
        success(deviceSettings.retrieve("NetworkStatus.connectionType"));
    }
};
