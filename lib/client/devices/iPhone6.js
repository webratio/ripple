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

    "id": "iPhone6",
    "name": "iPhone 6",
    "model": "6",
    "osName": "iOS",
    "osVersion": "8",
    "uuid": "e0101010d38bde8e6740011221af335301010333",
    "manufacturer": "Apple",

    "screen": {
        "width": 750,
        "height": 1334
    },
    "viewPort": {
        "portrait": {
            "width": 750,
            "height": 1334,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 1334,
            "height": 750,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "ppi": 326,
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4",
    "platforms": [ "web", "cordova" ],
    "mediaQueryEmulation": {
        "-webkit-device-pixel-ratio": 2
    }
};
