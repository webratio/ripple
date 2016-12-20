/*
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
 */

// HACK: fs keeps a reference to the last-used FileSystem requested via requestFileSystem
// this is a hack because if you keep switching between TEMPORARY vs. PERSISTENT file systems requested,
// and run Cordova File API methods, no parameter is passed into exec specifying the underlying File System.
// This should be fixed in Cordova!
var fs,
    topCordova = ripple('platform/cordova/2.0.0/spec'),
    rlfsu;

(function() {
	
    var win = ripple('emulatorBridge').window();
    win.document.addEventListener("deviceready", function() {
        Object.defineProperty(win.File.prototype, "localURL", {
            get: function(){
                return this._localURL;
            },
            set: function(new_value){
                this._localURL = new_value.replace(/cdvfile:\/\/localhost\//i, "filesystem:" + document.origin + "/");
            }
        });
        win.Entry.prototype.toInternalURL = (function() {
            var $original = win.Entry.prototype.toInternalURL;
            return function() {
                var result = $original.apply(this, arguments);
                if (result) {
                    result = result.replace(document.origin.replace("://","_").replace(":", "_") + ":Temporary", "temporary");    
                }
                return result;
            };
        })();
    });
    
})();

function cleanPath(path) {
    if (path.indexOf("filesystem:" + document.origin + "/") !== -1) {
        path = path.replace("filesystem:" + document.origin + "/","cdvfile://localhost/");
    }
    if (/^cdvfile:/.test(path)) {
        path = path.replace(/^cdvfile:\/\/[^\/]+\/[^\/]+(\/.*)$/, "$1");
    } else {
        path = path.replace(/^ripplefilesystem:/, "");
    }
    while (path[0] && path[0] === '/') {
        path = path.substr(1);
    }
    return path;
}

function exportArrayBuffer(buffer) {
    var win = ripple('emulatorBridge').window();
    if (buffer instanceof win.ArrayBuffer) {
        return buffer; // already exported
    }
    return win.Uint8Array.from(new Uint8Array(buffer)).buffer;
}

function _extractErrorCode(error) {
    var nameToCode = {
        "NotFoundError": /* FileError.NOT_FOUND_ERR */ 1,
        "SecurityError": /* FileError.SECURITY_ERR */ 2,
        "AbortError": /* FileError.ABORT_ERR */ 3,
        "NotReadableError": /* FileError.NOT_READABLE_ERR */ 4,
        "EncodingError": /* FileError.ENCODING_ERR */ 5,
        "NoModificationAllowedError": /* FileError.NO_MODIFICATION_ALLOWED_ERR */ 6,
        "InvalidStateError": /* FileError.INVALID_STATE_ERR */ 7,
        "SyntaxError": /* FileError.SYNTAX_ERR */ 8,
        "InvalidModificationError": /* FileError.INVALID_MODIFICATION_ERR */ 9,
        "QuotaExceededError": /* FileError.QUOTA_EXCEEDED_ERR */ 10,
        "TypeMismatchError": /* FileError.TYPE_MISMATCH_ERR */ 11,
        "PathExistsError": /* FileError.PATH_EXISTS_ERR */ 12
    };
    var code = nameToCode[error.name];
    if (!code) {
        code = error["code"];
    }
    if (!code) {
        code = /* FileError.INVALID_STATE_ERR */ 7;
    }
    return code;
}

module.exports = {
    requestFileSystem: function (win, fail, args) {
        // HACK: may not be webkit
        var rfs = window.webkitRequestFileSystem,
            type = args[0],
            size = args[1];

        // HACK: assume any FS requested over a gig in size will throw an error
        if (size > (1024 * 1024 * 1024 /* gigabyte */)) {
            if (fail) fail(10 /* FileError.QUOTA_EXCEEDED_ERR*/);
        } else {
            return rfs(type, size, function (effes) {
                fs = effes;
                win(effes);
            }, fail);
        }
    },
    requestAllFileSystems: function(win, fail, args) {
        var fss = [];
        fss.push({
            filesystem: 0, /* LocalFileSystem.TEMPORARY */
            filesystemName: "temporary",
            fullPath: "/",
            isDirectory: true,
            isFile: false,
            name: "",
            nativeURL: "/"
        });
        win(fss);
    },
    requestAllPaths: function(win, fail, args) {
        return window.webkitRequestFileSystem(0 /* LocalFileSystem.TEMPORARY */, 0, function(effes) {
            fs = effes;
            
            var expectedCount = 0;
            var successCount = 0;
            function createDir(base, name, success) {
                expectedCount++;
                base.getDirectory(name, { create: true }, function(dir) {
                    success(dir, "ripplefilesystem:" + dir.fullPath);
                    successCount++;
                    if (successCount === expectedCount) {
                        allFinished();
                    }
                }, fail);
            }
            
            var ret = {};
            
            createDir(fs.root, "ripple", function(rippleDir) {
                createDir(rippleDir, "package", function(dir, url) {
                    ret["applicationDirectory"] = url;
                });
                createDir(rippleDir, "internal", function(internalDir) {
                    createDir(internalDir, "appstore", function(dir, url) {
                        ret["applicationStorageDirectory"] = url;
                    });
                    createDir(internalDir, "data", function(dir, url) {
                        ret["dataDirectory"] = url;
                    });
                    createDir(internalDir, "cache", function(dir, url) {
                        ret["cacheDirectory"] = url;
                    });
                });
                createDir(rippleDir, "external", function(externalDir) {
                    createDir(externalDir, "appstore", function(dir, url) {
                        ret["externalApplicationStorageDirectory"] = url;
                    });
                    createDir(externalDir, "data", function(dir, url) {
                        ret["externalDataDirectory"] = url;
                    });
                    createDir(externalDir, "cache", function(dir, url) {
                        ret["externalCacheDirectory"] = url;
                    });
                });
            });
            
            function allFinished() {
                win(ret);
            }
        }, fail);
    },

    resolveLocalFileSystemURI: function (win, fail, args) {
        var uri = args[0],
            fulluri = fs.root.toURL();

        // HACK: iOS-specific bs right here. See lib/ios/plugin/ios/Entry.js in cordova.js for details
        // Cordova badly needs a unified File System abstraction.
        if (uri.indexOf("file://localhost") === 0) {
            uri = uri.substr(16);
        }
        uri = cleanPath(uri);

        fulluri += uri;

        return window.webkitResolveLocalFileSystemURL(fulluri, function (entry) {
            if (win) win(entry);
        }, function (error) {
            if (fail) fail(_extractErrorCode(error));
        });
    },
    getFile: function (win, fail, args) {
        var path = args[0],
            filename = args[1],
            options = args[2],
            file = '';

        path = cleanPath(path);
        filename = cleanPath(filename);

        if (path) {
            file = path + '/';
        }
        file += filename;

        fs.root.getFile(file, options, function (entry) {
            if (win) win(entry);
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    },
    remove: function (win, fail, args) {
        var file = args[0];
        file = cleanPath(file);
        window.webkitResolveLocalFileSystemURL(fs.root.toURL() + file, function (entry) {
            entry.remove(function () {
                if (win) win();
            }, function (err) {
                if (fail) fail(_extractErrorCode(err));
            });
        }, fail);
    },
    readEntries: function (win, fail, args) {
        var root = fs.root.toURL(),
            path = args[0],
            reader;

        path = cleanPath(path);
        path = root + path;

        window.webkitResolveLocalFileSystemURL(path, function (entry) {
            reader = entry.createReader();
            reader.readEntries(function (entries) {
                if (win) win(entries);
            }, function (err) {
                if (fail) fail(_extractErrorCode(err));
            });
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    },
    getDirectory: function (win, fail, args) {
        var path = args[0],
            filename = args[1],
            options = args[2],
            file = '';

        path = cleanPath(path);
        filename = cleanPath(filename);

        if (path) {
            file = path + '/';
        }
        file += filename;

        fs.root.getDirectory(file, options, function (entry) {
            if (win) win(entry);
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    },
    removeRecursively: function (win, fail, args) {
        var root = fs.root.toURL(),
            path = args[0];

        path = cleanPath(path);

        window.webkitResolveLocalFileSystemURL(root + path, function (dirEntry) {
            dirEntry.removeRecursively(function () {
                if (win) win();
            }, function (err) {
                if (fail) fail(_extractErrorCode(err));
            });
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    },
    getFileMetadata: function (win, fail, args) {
        var path = args[0],
            root = fs.root.toURL();

        path = cleanPath(path);

        window.webkitResolveLocalFileSystemURL(root + path, function (entry) {
            entry.file(function (file) {
                if (win) {
                    file.fullPath = path;
                    win(file);
                }
            }, function (err) {
                if (fail) fail(_extractErrorCode(err));
            });
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    },
    getMetadata: function (win, fail, args) {
        var path = args[0],
            root = fs.root.toURL();

        path = cleanPath(path);

        window.webkitResolveLocalFileSystemURL(root + path, function (entry) {
            entry.getMetadata(function (data) {
                if (win) win(data);
            }, function (err) {
                if (fail) fail(_extractErrorCode(err));
            });
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    },
    getParent: function (win, fail, args) {
        var path = args[0],
            root = fs.root.toURL();

        path = cleanPath(path);

        window.webkitResolveLocalFileSystemURL(root + path, function (entry) {
            entry.getParent(function (dirEntry) {
                if (win) win(dirEntry);
            }, function (err) {
                if (fail) fail(_extractErrorCode(err));
            });
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    },
    copyTo: function (win, fail, args) {
        var src = args[0],
            parent = args[1],
            name = args[2],
            root = fs.root.toURL();

        parent = cleanPath(parent);
        src = cleanPath(src);

        rlfsu = window.webkitResolveLocalFileSystemURL;
        // get the directoryentry that we will copy TO
        rlfsu(root + parent, function (parentDirToCopyTo) {
            rlfsu(root + src, function (sourceDir) {
                sourceDir.copyTo(parentDirToCopyTo, name, function (newEntry) {
                    if (win) win(newEntry);
                }, function (err) {
                    if (fail) fail(_extractErrorCode(err));
                });
            }, function (err) {
                if (fail) fail(_extractErrorCode(err));
            });
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    },
    moveTo: function (win, fail, args) {
        var src = args[0],
            parent = args[1],
            name = args[2],
            root = fs.root.toURL();

        parent = cleanPath(parent);
        src = cleanPath(src);

        rlfsu = window.webkitResolveLocalFileSystemURL;
        // get the directoryentry that we will move TO
        rlfsu(root + parent, function (parentDirToMoveTo) {
            rlfsu(root + src, function (sourceDir) {
                sourceDir.moveTo(parentDirToMoveTo, name, function (newEntry) {
                    if (win) win(newEntry);
                }, function (err) {
                    if (fail) fail(_extractErrorCode(err));
                });
            }, function (err) {
                if (fail) fail(_extractErrorCode(err));
            });
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    },
    write: function (win, fail, args) {
        var file = args[0],
            text = args[1],
            position = args[2],
            sourcepath,
            blob;

        // Format source path
        if (file.fullPath) { // if it is a file instead of an URL
            sourcepath = ((file.fullPath ? file.fullPath : '') + file.name);
        } else {
            sourcepath = file;
        }
        sourcepath = cleanPath(sourcepath);

        // Create a blob for the text to be written
        blob = new Blob([text], {type: "text/plain"});

        // Get the FileEntry, create if necessary
        fs.root.getFile(sourcepath, {create: true}, function (entry) {
            // Create a FileWriter for this entry
            entry.createWriter(function (writer) {
                writer.onwriteend = function (progressEvt) {
                    if (win) win(progressEvt.total);
                };
                writer.onerror = function (err) {
                    if (fail) fail(_extractErrorCode(err));
                };

                if (position && position > 0) {
                    writer.seek(position);
                }
                writer.write(blob);
            }, function (err) {
                if (fail) fail(_extractErrorCode(err));
            });
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    },
    readAsText: function (win, fail, args) {
        var path = args[0],
            encoding = args[1],
            FileReader = topCordova.nativeMethods.FileReader,
            fr = new FileReader();

        // Set up FileReader events
        fr.onerror = function (err) {
            if (fail) fail(_extractErrorCode(err));
        };
        fr.onload = function (evt) {
            if (win) win(evt.target.result);
        };

        path = cleanPath(path);

        fs.root.getFile(path, {create: false}, function (entry) {
            entry.file(function (blob) {
                fr.readAsText(blob, encoding);
            }, function (err) {
                if (fail) fail(_extractErrorCode(err));
            });
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    },
    readAsDataURL: function (win, fail, args) {
        var path = args[0],
            FileReader = topCordova.nativeMethods.FileReader,
            fr = new FileReader();

        // Set up FileReader events
        fr.onerror = function (err) {
            if (fail) fail(_extractErrorCode(err));
        };
        fr.onload = function (evt) {
            if (win) win(evt.target.result);
        };

        path = cleanPath(path);

        fs.root.getFile(path, {create: false}, function (entry) {
            entry.file(function (blob) {
                fr.readAsDataURL(blob);
            }, function (err) {
                if (fail) fail(_extractErrorCode(err));
            });
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    },
    readAsArrayBuffer: function (win, fail, args) {
        var path = args[0],
        FileReader = topCordova.nativeMethods.FileReader,
        fr = new FileReader();
        
        // Set up FileReader events
        fr.onerror = function (err) {
            if (fail) fail(_extractErrorCode(err));
        };
        fr.onload = function (evt) {
            if (win) win(exportArrayBuffer(evt.target.result));
        };
        
        path = cleanPath(path);
        
        fs.root.getFile(path, {create: false}, function (entry) {
            entry.file(function (blob) {
                fr.readAsArrayBuffer(blob);
            }, function (err) {
                if (fail) fail(_extractErrorCode(err));
            });
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    },
    truncate: function (win, fail, args) {
        var file = args[0],
            position = args[1],
            sourcepath;

        // Format source path
        sourcepath = cleanPath(file);

        // Get the FileEntry, create if necessary
        fs.root.getFile(sourcepath, {create: false}, function (entry) {
            // Create a FileWriter for this entry
            entry.createWriter(function (writer) {
                writer.onwriteend = function (progressEvt) {
                    if (win) win(progressEvt.target.length);
                };
                writer.onerror = function (err) {
                    if (fail) fail(_extractErrorCode(err));
                };

                writer.truncate(position);
            }, function (err) {
                if (fail) fail(_extractErrorCode(err));
            });
        }, function (err) {
            if (fail) fail(_extractErrorCode(err));
        });
    }
};
