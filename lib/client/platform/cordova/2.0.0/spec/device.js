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
                "sq": "Albanian",
                "sq_AL": "Albanian (AL)",
                "ar": "Arabic",
                "ar_DZ": "Arabic (DZ)",
                "ar_BH": "Arabic (BH)",
                "ar_EG": "Arabic (EG)",
                "ar_IQ": "Arabic (IQ)",
                "ar_JO": "Arabic (JO)",
                "ar_KW": "Arabic (KW)",
                "ar_LB": "Arabic (LB)",
                "ar_LY": "Arabic (LY)",
                "ar_MA": "Arabic (MA)",
                "ar_OM": "Arabic (OM)",
                "ar_QA": "Arabic (QA)",
                "ar_SA": "Arabic (SA)",
                "ar_SD": "Arabic (SD)",
                "ar_SY": "Arabic (SY)",
                "ar_TN": "Arabic (TN)",
                "ar_AE": "Arabic (AE)",
                "ar_YE": "Arabic (YE)",
                "be": "Belarusian",
                "be_BY": "Belarusian (BY)",
                "bg": "Bulgarian",
                "bg_BG": "Bulgarian (BG)",
                "ca": "Catalan",
                "ca_ES": "Catalan (ES)",
                "zh": "Chinese",
                "zh_CN": "Chinese (CN)",
                "zh_HK": "Chinese (HK)",
                "zh_SG": "Chinese (SG)",
                "zh_TW": "Chinese (TW)",
                "hr": "Croatian",
                "hr_HR": "Croatian (HR)",
                "cs": "Czech",
                "cs_CZ": "Czech (CZ)",
                "da": "Danish",
                "da_DK": "Danish (DK)",
                "nl": "Dutch",
                "nl_BE": "Dutch (BE)",
                "nl_NL": "Dutch (NL)",
                "en": "English",
                "en_AU": "English (AU)",
                "en_CA": "English (CA)",
                "en_GB": "English (GB)",
                "en_IN": "English (IN)",
                "en_IE": "English (IE)",
                "en_MT": "English (MT)",
                "en_PH": "English (PH)",
                "en_SG": "English (SG)",
                "en_US": "English (US)",
                "en_ZA": "English (ZA)",
                "et": "Estonian",
                "et_EE": "Estonian (EE)",
                "fi": "Finnish",
                "fi_FI": "Finnish (FI)",
                "fr": "French",
                "fr_BE": "French (BE)",
                "fr_CA": "French (CA)",
                "fr_FR": "French (FR)",
                "fr_LU": "French (LU)",
                "fr_CH": "French (CH)",
                "de": "German",
                "de_AT": "German (AT)",
                "de_DE": "German (DE)",
                "de_CH": "German (CH)",
                "de_LU": "German (LU)",
                "el": "Greek",
                "el_CY": "Greek (CY)",
                "el_GR": "Greek (GR)",
                "iw": "Hebrew",
                "iw_IL": "Hebrew (IL)",
                "hi": "Hindi",
                "hi_IN": "Hindi (IN)",
                "hu": "Hungarian",
                "hu_HU": "Hungarian (HU)",
                "is": "Icelandic",
                "is_IS": "Icelandic (IS)",
                "in": "Indonesian",
                "in_ID": "Indonesian (ID)",
                "ga": "Irish",
                "ga_IE": "Irish (IE)",
                "it": "Italian",
                "it_IT": "Italian (IT)",
                "it_CH": "Italian (CH)",
                "ja": "Japanese",
                "ja_JP": "Japanese (JP)",
                "ko": "Korean",
                "ko_KR": "Korean (KR)",
                "lv": "Latvian",
                "lv_LV": "Latvian (LV)",
                "lt": "Lithuanian",
                "lt_LT": "Lithuanian (LT)",
                "mk": "Macedonian",
                "mk_MK": "Macedonian (MK)",
                "ms": "Malay",
                "ms_MY": "Malay (MY)",
                "mt": "Maltese",
                "mt_MT": "Maltese",
                "no": "Norwegian",
                "no_NO": "Norwegian (NO)",
                "pl": "Polish",
                "pl_PL": "Polish (PL)",
                "pt": "Portuguese",
                "pt_BR": "Portuguese (BR)",
                "pt_PT": "Portuguese (PT)",
                "ro": "Romanian",
                "ro_RO": "Romanian (RO)",
                "ru": "Russian",
                "ru_RU": "Russian (RU)",
                "sr": "Serbian",
                "sr_BA": "Serbian (BA)",
                "sr_ME": "Serbian (ME)",
                "sr_RS": "Serbian (RS)",
                "sr_CS": "Serbian (CS)",
                "sk": "Slovak",
                "sk_SK": "Slovak (SK)",
                "sl": "Slovenian",
                "sl_SI": "Slovenian (SI)",
                "es": "Spanish",
                "es_AR": "Spanish (AR)",
                "es_BO": "Spanish (BO)",
                "es_CL": "Spanish (CL)",
                "es_CO": "Spanish (CO)",
                "es_CR": "Spanish (CR)",
                "es_DO": "Spanish (DO)",
                "es_EC": "Spanish (EC)",
                "es_SV": "Spanish (SV)",
                "es_GT": "Spanish (GT)",
                "es_HN": "Spanish (HN)",
                "es_MX": "Spanish (MX)",
                "es_NI": "Spanish (NI)",
                "es_PA": "Spanish (PA)",
                "es_PY": "Spanish (PY)",
                "es_PE": "Spanish (PE)",
                "es_PR": "Spanish (PR)",
                "es_ES": "Spanish (ES)",
                "es_US": "Spanish (US)",
                "es_UY": "Spanish (UY)",
                "es_VE": "Spanish (VE)",
                "sv": "Swedish",
                "sv_SE": "Swedish (SE)",
                "th": "Thai",
                "th_TH": "Thai (TH)",
                "tr": "Turkish",
                "tr_TR": "Turkish (TR)",
                "uk": "Ukranian",
                "uk_UA": "Ukranian (UA)",
                "vi": "Vietnamese",
                "vi_VN": "Vietnamese (VN)"
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
