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
    APPNAME: "Ripple Mobile Environment Emulator",
    LICENSE: "LICENSE",
    PACKAGE_JSON: __dirname + "/../package.json",
    ROOT: __dirname + "/../",
    BUILD: __dirname + "/",
    EXT: __dirname + "/../targets/",
    ASSETS: __dirname + "/../assets/",
    LIB: __dirname + "/../lib/client/",
    UI: __dirname + "/../lib/client/ui/",
    DEVICES: __dirname + "/../lib/client/devices/",
    THIRDPARTY: __dirname + "/../thirdparty/",
    DEPLOY: __dirname + "/../pkg/",
    SPACES_AND_TABS: /\n+|\s+|\t{2,}/g,
    ESCAPED_QUOTES: '\'+"\'"+\'',
    thirdpartyIncludes: [
        "ripple-require.js",
        "jquery.js",
        "jquery.ui.js",
        "jquery.tooltip.js",
        "Math.uuid.js",
        "jXHR.js",
        "3d.js",
        "draw.js",
        "../node_modules/jWorkflow/lib/jWorkflow.js",
        "OpenLayers.js",
        "../node_modules/moment/lang/bg.js",
        "../node_modules/moment/lang/ca.js",
        "../node_modules/moment/lang/cv.js",
        "../node_modules/moment/lang/da.js",
        "../node_modules/moment/lang/de.js",
        "../node_modules/moment/lang/en-ca.js",
        "../node_modules/moment/lang/en-gb.js",
        "../node_modules/moment/lang/es.js",
        "../node_modules/moment/lang/et.js",
        "../node_modules/moment/lang/eu.js",
        "../node_modules/moment/lang/fi.js",
        "../node_modules/moment/lang/fr-ca.js",
        "../node_modules/moment/lang/fr.js",
        "../node_modules/moment/lang/gl.js",
        "../node_modules/moment/lang/hu.js",
        "../node_modules/moment/lang/is.js",
        "../node_modules/moment/lang/it.js",
        "../node_modules/moment/lang/ja.js",
        "../node_modules/moment/lang/jp.js",
        "../node_modules/moment/lang/ko.js",
        "../node_modules/moment/lang/kr.js",
        "../node_modules/moment/lang/nb.js",
        "../node_modules/moment/lang/nl.js",
        "../node_modules/moment/lang/pl.js",
        "../node_modules/moment/lang/pt-br.js",
        "../node_modules/moment/lang/pt.js",
        "../node_modules/moment/lang/ro.js",
        "../node_modules/moment/lang/ru.js",
        "../node_modules/moment/lang/sv.js",
        "../node_modules/moment/lang/tr.js",
        "../node_modules/moment/lang/zh-cn.js",
        "../node_modules/moment/lang/zh-tw.js",    
        "../node_modules/accounting/accounting.js"
    ]
};
