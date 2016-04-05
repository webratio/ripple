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
var camera = ripple('ui/plugins/camera'),
    event = ripple('event');

module.exports = {
    takePicture: function (success, error, options) {
        event.once("captured-image", function (url, file) {
            if (options[1]== 1) {
                window.webkitRequestFileSystem(0, 0, function(fs) {
                    var counter = window.localStorage.getItem("tempImageCounter") || 0;
                    counter++;
                    /* MUST NOT HAVE DIRECTORIES, see function cleanPath */
                    var filePath = "image" + counter + "." + /\/(.+)/.exec(file.type)[1];
                    fs.root.getFile(filePath, { create: true }, function(fileEntry) {  
                        fileEntry.createWriter(function (fileWriter) {
                            fileWriter.onwriteend = function() {
                                window.localStorage.setItem("tempImageCounter", counter);
                                success(filePath);
                            };
                            fileWriter.onerror = function(e) {
                                error(e);
                            };
                            fileWriter.write(file);
                        },function(e){
                            error(e);
                        });
                    },function(e){
                        error(e);
                    });
                }, function(e){
                    error(e);
                });
            } else {
                success(url);
            }
        });
        camera.show();
    },
    cleanup: function (success) {
        success();
    }
};
