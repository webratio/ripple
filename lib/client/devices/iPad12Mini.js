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

    "id": "iPad12Mini",
    "name": "iPad 1 / 2 / iPadMini",
    "model": "iPad",
    "osName": "iOS",
    "uuid": "e0101010d38bde8e6740011221af335301010333",
    "osVersion": "1.6",
    "manufacturer": "Apple",

    "screen": {
        "width": 768,
        "height": 1024
    },
    "viewPort": {
        "portrait": {
            "width": 768,
            "height": 1024,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 1024,
            "height": 768,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "ppi": 163,
    "userAgent": "Mozilla/5.0 (iPad; CPU OS 4_3_5 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8L1 Safari/6533.18.5",
    "platforms": [ "web", "cordova" ],
    "mediaQueryEmulation": {
        "-webkit-device-pixel-ratio": 1
    }
};
