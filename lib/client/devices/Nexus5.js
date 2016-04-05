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
module.exports = {

    "id": "Nexus5",
    "name": "Nexus 5",
    "model": "Nexus",
    "osName": "Android",
    "uuid": "",
    "osVersion": "4.4.4",
    "manufacturer": "Google",

    "screen": {
        "width": 1080,
        "height": 1920
    },
    "viewPort": {
        "portrait": {
            "width": 1080,
            "height": 1920,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 1920,
            "height": 1080,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "ppi": 445,
    "userAgent": "Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19",
    "platforms": [ "web", "cordova" ],
    "mediaQueryEmulation": {
        "-webkit-device-pixel-ratio": 3
    }
};
