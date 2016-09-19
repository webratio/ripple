/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. The ASF
 * licenses this file to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
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
            "callback": function(setting, oldSetting) {

                event.trigger("ConnectionChanged", [ {
                    oldType: oldSetting,
                    newType: setting
                } ]);

                var win = ripple('emulatorBridge').window(), connected = setting !== "none",
                        eventName = connected ? "online" : "offline";

                if (win && win.cordova) {
                    win.cordova.fireDocumentEvent(eventName);
                    if (eventName === "online") {
                        console.log('Pressed "Online" button. Network has been activated.');
                        ripple('xhrSimulator').simulateOffline(false);
                    } else if (eventName === "offline") {
                        console.log('Pressed "Offline" button. Network has been deactivated.');
                        ripple('xhrSimulator').simulateOffline(true);
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
            "callback": function(setting) {
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
                "sq-al": "Albanian (AL)",
                "ar": "Arabic",
                "ar-dz": "Arabic (DZ)",
                "ar-bh": "Arabic (BH)",
                "ar-eg": "Arabic (EG)",
                "ar-iq": "Arabic (IQ)",
                "ar-jo": "Arabic (JO)",
                "ar-kw": "Arabic (KW)",
                "ar-lb": "Arabic (LB)",
                "ar-ly": "Arabic (LY)",
                "ar-ma": "Arabic (MA)",
                "ar-om": "Arabic (OM)",
                "ar-qa": "Arabic (QA)",
                "ar-sa": "Arabic (SA)",
                "ar-sd": "Arabic (SD)",
                "ar-sy": "Arabic (SY)",
                "ar-tn": "Arabic (TN)",
                "ar-ae": "Arabic (AE)",
                "ar-ye": "Arabic (YE)",
                "be": "Belarusian",
                "be-by": "Belarusian (BY)",
                "bg": "Bulgarian",
                "bg-bg": "Bulgarian (BG)",
                "ca": "Catalan",
                "ca-es": "Catalan (ES)",
                "zh": "Chinese",
                "zh-cn": "Chinese (CN)",
                "zh-hk": "Chinese (HK)",
                "zh-sg": "Chinese (SG)",
                "zh-tw": "Chinese (TW)",
                "hr": "Croatian",
                "hr-hr": "Croatian (HR)",
                "cs": "Czech",
                "cs-cz": "Czech (CZ)",
                "da": "Danish",
                "da-dk": "Danish (DK)",
                "nl": "Dutch",
                "nl-be": "Dutch (BE)",
                "nl-nl": "Dutch (NL)",
                "en": "English",
                "en-au": "English (AU)",
                "en-ca": "English (CA)",
                "en-gb": "English (GB)",
                "en-in": "English (IN)",
                "en-ie": "English (IE)",
                "en-mt": "English (MT)",
                "en-ph": "English (PH)",
                "en-sg": "English (SG)",
                "en-us": "English (US)",
                "en-za": "English (ZA)",
                "et": "Estonian",
                "et-ee": "Estonian (EE)",
                "fi": "Finnish",
                "fi-fi": "Finnish (FI)",
                "fr": "French",
                "fr-be": "French (BE)",
                "fr-ca": "French (CA)",
                "fr-fr": "French (FR)",
                "fr-lu": "French (LU)",
                "fr-ch": "French (CH)",
                "de": "German",
                "de-at": "German (AT)",
                "de-de": "German (DE)",
                "de-ch": "German (CH)",
                "de-lu": "German (LU)",
                "el": "Greek",
                "el-cy": "Greek (CY)",
                "el-gr": "Greek (GR)",
                "iw": "Hebrew",
                "iw-il": "Hebrew (IL)",
                "hi": "Hindi",
                "hi-in": "Hindi (IN)",
                "hu": "Hungarian",
                "hu-hu": "Hungarian (HU)",
                "is": "Icelandic",
                "is-is": "Icelandic (IS)",
                "in": "Indonesian",
                "in-id": "Indonesian (ID)",
                "ga": "Irish",
                "ga-ie": "Irish (IE)",
                "it": "Italian",
                "it-it": "Italian (IT)",
                "it-ch": "Italian (CH)",
                "ja": "Japanese",
                "ja-jp": "Japanese (JP)",
                "ko": "Korean",
                "ko-kr": "Korean (KR)",
                "lv": "Latvian",
                "lv-lv": "Latvian (LV)",
                "lt": "Lithuanian",
                "lt-lt": "Lithuanian (LT)",
                "mk": "Macedonian",
                "mk-mk": "Macedonian (MK)",
                "ms": "Malay",
                "ms-my": "Malay (MY)",
                "mt": "Maltese",
                "mt-mt": "Maltese (MT)",
                "no": "Norwegian",
                "no-no": "Norwegian (NO)",
                "pl": "Polish",
                "pl-pl": "Polish (PL)",
                "pt": "Portuguese",
                "pt-br": "Portuguese (BR)",
                "pt-pt": "Portuguese (PT)",
                "ro": "Romanian",
                "ro-ro": "Romanian (RO)",
                "ru": "Russian",
                "ru-ru": "Russian (RU)",
                "sr": "Serbian",
                "sr-ba": "Serbian (BA)",
                "sr-me": "Serbian (ME)",
                "sr-rs": "Serbian (RS)",
                "sr-cs": "Serbian (CS)",
                "sk": "Slovak",
                "sk-sk": "Slovak (SK)",
                "sl": "Slovenian",
                "sl-si": "Slovenian (SI)",
                "es": "Spanish",
                "es-ar": "Spanish (AR)",
                "es-bo": "Spanish (BO)",
                "es-cl": "Spanish (CL)",
                "es-co": "Spanish (CO)",
                "es-cr": "Spanish (CR)",
                "es-do": "Spanish (DO)",
                "es-ec": "Spanish (EC)",
                "es-sv": "Spanish (SV)",
                "es-gt": "Spanish (GT)",
                "es-hn": "Spanish (HN)",
                "es-mx": "Spanish (MX)",
                "es-ni": "Spanish (NI)",
                "es-pa": "Spanish (PA)",
                "es-py": "Spanish (PY)",
                "es-pe": "Spanish (PE)",
                "es-pr": "Spanish (PR)",
                "es-es": "Spanish (ES)",
                "es-us": "Spanish (US)",
                "es-uy": "Spanish (UY)",
                "es-ve": "Spanish (VE)",
                "sv": "Swedish",
                "sv-se": "Swedish (SE)",
                "th": "Thai",
                "th-th": "Thai (TH)",
                "tr": "Turkish",
                "tr-tr": "Turkish (TR)",
                "uk": "Ukranian",
                "uk-ua": "Ukranian (UA)",
                "vi": "Vietnamese",
                "vi-vn": "Vietnamese (VN)"
            },
            "callback": function(setting) {
                var i = setting.indexOf('-');
                if (i > 0) {
                    setting = setting.substr(0, i) + setting.substr(i).toUpperCase();
                }
                moment.locale(setting, moment.localeData(setting));
                var win = ripple('emulatorBridge').window(); 
                var wr = win && win.wr;
                if (wr) {
                    wr.mvc.mgmt.Locale.refreshApp();
                }
            },
            "suggestedOptionsProvider": function() {
                var wrLocales = ripple('emulatorBridge').window().wr.mvc.mgmt
                        .Locale.getAll();
                return wrLocales.map(function(locale) {
                    return locale.getCode().replace('_', '-').toLowerCase();
                });
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
