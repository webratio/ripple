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
                        win.XMLHttpRequest.simulateOffline = false;
                    } else if (eventName === "offline") {
                        console.log('Pressed "Offline" button. Network has been deactivated.');
                        win.XMLHttpRequest.simulateOffline = true;
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
                "sq": "Albanian",
                "sq-AL": "Albanian (AL)",
                "ar": "Arabic",
                "ar-DZ": "Arabic (DZ)",
                "ar-BH": "Arabic (BH)",
                "ar-EG": "Arabic (EG)",
                "ar-IQ": "Arabic (IQ)",
                "ar-JO": "Arabic (JO)",
                "ar-KW": "Arabic (KW)",
                "ar-LB": "Arabic (LB)",
                "ar-LY": "Arabic (LY)",
                "ar-MA": "Arabic (MA)",
                "ar-OM": "Arabic (OM)",
                "ar-QA": "Arabic (QA)",
                "ar-SA": "Arabic (SA)",
                "ar-SD": "Arabic (SD)",
                "ar-SY": "Arabic (SY)",
                "ar-TN": "Arabic (TN)",
                "ar-AE": "Arabic (AE)",
                "ar-YE": "Arabic (YE)",
                "be": "Belarusian",
                "be-BY": "Belarusian (BY)",
                "bg": "Bulgarian",
                "bg-BG": "Bulgarian (BG)",
                "ca": "Catalan",
                "ca-ES": "Catalan (ES)",
                "zh": "Chinese",
                "zh-CN": "Chinese (CN)",
                "zh-HK": "Chinese (HK)",
                "zh-SG": "Chinese (SG)",
                "zh-TW": "Chinese (TW)",
                "hr": "Croatian",
                "hr-HR": "Croatian (HR)",
                "cs": "Czech",
                "cs-CZ": "Czech (CZ)",
                "da": "Danish",
                "da-DK": "Danish (DK)",
                "nl": "Dutch",
                "nl-BE": "Dutch (BE)",
                "nl-NL": "Dutch (NL)",
                "en": "English",
                "en-AU": "English (AU)",
                "en-CA": "English (CA)",
                "en-GB": "English (GB)",
                "en-IN": "English (IN)",
                "en-IE": "English (IE)",
                "en-MT": "English (MT)",
                "en-PH": "English (PH)",
                "en-SG": "English (SG)",
                "en-US": "English (US)",
                "en-ZA": "English (ZA)",
                "et": "Estonian",
                "et-EE": "Estonian (EE)",
                "fi": "Finnish",
                "fi-FI": "Finnish (FI)",
                "fr": "French",
                "fr-BE": "French (BE)",
                "fr-CA": "French (CA)",
                "fr-FR": "French (FR)",
                "fr-LU": "French (LU)",
                "fr-CH": "French (CH)",
                "de": "German",
                "de-AT": "German (AT)",
                "de-DE": "German (DE)",
                "de-CH": "German (CH)",
                "de-LU": "German (LU)",
                "el": "Greek",
                "el-CY": "Greek (CY)",
                "el-GR": "Greek (GR)",
                "iw": "Hebrew",
                "iw-IL": "Hebrew (IL)",
                "hi": "Hindi",
                "hi-IN": "Hindi (IN)",
                "hu": "Hungarian",
                "hu-HU": "Hungarian (HU)",
                "is": "Icelandic",
                "is-IS": "Icelandic (IS)",
                "in": "Indonesian",
                "in-ID": "Indonesian (ID)",
                "ga": "Irish",
                "ga-IE": "Irish (IE)",
                "it": "Italian",
                "it-IT": "Italian (IT)",
                "it-CH": "Italian (CH)",
                "ja": "Japanese",
                "ja-JP": "Japanese (JP)",
                "ko": "Korean",
                "ko-KR": "Korean (KR)",
                "lv": "Latvian",
                "lv-LV": "Latvian (LV)",
                "lt": "Lithuanian",
                "lt-LT": "Lithuanian (LT)",
                "mk": "Macedonian",
                "mk-MK": "Macedonian (MK)",
                "ms": "Malay",
                "ms-MY": "Malay (MY)",
                "mt": "Maltese",
                "mt-MT": "Maltese",
                "no": "Norwegian",
                "no-NO": "Norwegian (NO)",
                "pl": "Polish",
                "pl-PL": "Polish (PL)",
                "pt": "Portuguese",
                "pt-BR": "Portuguese (BR)",
                "pt-PT": "Portuguese (PT)",
                "ro": "Romanian",
                "ro-RO": "Romanian (RO)",
                "ru": "Russian",
                "ru-RU": "Russian (RU)",
                "sr": "Serbian",
                "sr-BA": "Serbian (BA)",
                "sr-ME": "Serbian (ME)",
                "sr-RS": "Serbian (RS)",
                "sr-CS": "Serbian (CS)",
                "sk": "Slovak",
                "sk-SK": "Slovak (SK)",
                "sl": "Slovenian",
                "sl-SI": "Slovenian (SI)",
                "es": "Spanish",
                "es-AR": "Spanish (AR)",
                "es-BO": "Spanish (BO)",
                "es-CL": "Spanish (CL)",
                "es-CO": "Spanish (CO)",
                "es-CR": "Spanish (CR)",
                "es-DO": "Spanish (DO)",
                "es-EC": "Spanish (EC)",
                "es-SV": "Spanish (SV)",
                "es-GT": "Spanish (GT)",
                "es-HN": "Spanish (HN)",
                "es-MX": "Spanish (MX)",
                "es-NI": "Spanish (NI)",
                "es-PA": "Spanish (PA)",
                "es-PY": "Spanish (PY)",
                "es-PE": "Spanish (PE)",
                "es-PR": "Spanish (PR)",
                "es-ES": "Spanish (ES)",
                "es-US": "Spanish (US)",
                "es-UY": "Spanish (UY)",
                "es-VE": "Spanish (VE)",
                "sv": "Swedish",
                "sv-SE": "Swedish (SE)",
                "th": "Thai",
                "th-TH": "Thai (TH)",
                "tr": "Turkish",
                "tr-TR": "Turkish (TR)",
                "uk": "Ukranian",
                "uk-UA": "Ukranian (UA)",
                "vi": "Vietnamese",
                "vi-VN": "Vietnamese (VN)"
            },
            "callback": function (setting) {
                moment.lang(setting);
                ripple('emulatorBridge').window().wr.mvc.mgmt.Locale.refreshApp();                
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
