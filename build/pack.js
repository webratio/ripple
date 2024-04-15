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

var child_process = require('child_process'),
    colors = require('colors'),
    Q = require('q'),
    lint = require('./lint'),
    build = require('./build'),
    fs = require('fs'),
    _c = require('./conf'),
    path = require('path'),
    TAG_NAME_FILE = path.join(_c.DEPLOY, "hosted/GITTAG"),
    test = require('./test');


colors.mode = "console";

var allowPending = false,
    tagName = '',
    noTest = false,
    noLint = true,
    noBuild = false,
    noCompress = false;

module.exports = function (options) {
    if (options.length === 1 && options[0].toLowerCase() === "help") {
        usage(true);
        return;
    }

    processOptions(options);
    verifyTagName()
        .then(checkPendingChanges)
        .then(checkoutTag)
        .then(runTests)
        .then(runLint)
        .then(runBuild)
        .then(tagNameFile)
        .then(buildPackage)
        .then(done)
        .catch(handleError);
};

var currentTask;
function handleError(error) {
    var code = 1;

    if (typeof error === "number") {
        // This should only come from test, lint or build
        code = error;
        error = 'Error: Task \'' + currentTask + '\' failed.';
    } else {
        error = '' + (error.message || error);
    }

    console.log(error.red);
    process.exit(code);
}

var warnings;
function registerWarning(msg) {
    warnings = warnings || [];
    warnings.push(msg);
}

function outputStep(msg) {
    console.log(msg.blue);
}

function runTests() {
    return runTask(test, "Test", noTest);
}

function runLint() {
    return runTask(lint, "Lint", noLint);
}

function runBuild() {
    var args;
    if (noCompress) {
        registerWarning('Did not compress built files.');
    } else {
        args = [null, {compress: true}];
    }
    return runTask(build, "Build", noBuild, args);
}

function runTask(task, taskName, skip, args) {
    if (skip) {
        registerWarning('Didn\'t run task \'' + taskName + '\'');
        return Q.when();
    }
    outputStep('Running task \'' + taskName + '\'...');
    currentTask = taskName;
    return task.promise.apply(task, args);
}

function done(result) {
    if (result) {
        console.log('Package created: ' + result);
        if (warnings && warnings.length) {
            console.log(('Warning: Use this package for testing only.\n  ' + warnings.join('\n  ')).yellow);
        }
        console.log();
        process.exit(0);
    }
    process.exit(1);
}

function processOptions(options) {
    options.forEach(function (option) {
        var lowerCaseOption = option.toLowerCase();
        switch (lowerCaseOption) {
            case 'allow-pending':
                allowPending = true;
                break;

            case 'no-test':
                noTest = true;
                break;

            case 'no-lint':
                noLint = true;
                break;

            case 'no-build':
                noBuild = true;
                break;

            case 'no-compress':
                noCompress = true;
                break;

            default:
                if (tagName) {
                    handleError("Error: Can't set tag name to '" + option + "' when it is already set to '" + tagName + "'.");
                }
                tagName = option;
        }
    });
}

function verifyTagName() {
    if (tagName) {
        return Q.when();
    }

    // Determine the most recent tag in the repository
    outputStep('Looking for most recent tag...');
    return exec('git tag --list').then(function (allTags) {
        tagName = allTags.split(/\s+/).reduce(function (currentBest, value) {
            if (!currentBest) {
                return value;
            }
            var modifiedValue = value.replace(/^v/, '');
            if (compareVersions(modifiedValue, currentBest.replace(/^v/)) > 0) {
                return modifiedValue;
            }
            return currentBest;
        });

        console.log('- found: ' + tagName);
    });
}

function compareVersions(v1, v2) {
    
    /* Function for splitting version strings into parts */
    function splitVersion(v) {
        var parts = [];
        if (v) {
            var PARTS_RE = /([0-9]+)|([^\\.\\s0-9]+)/g, m;
            while (!!(m = PARTS_RE.exec(String(v)))) {
                if (m[1]) {
                    parts.push(Number(m[1]));
                } else {
                    parts.push(m[2]);
                }
            }
        }
        return parts;
    }
    
    /* Split the two versions */
    var parts1 = splitVersion(v1);
    var parts2 = splitVersion(v2);
    
    /* Iterate over parts and compare */
    for ( var i = 0, len = Math.max(parts1.length, parts2.length); i < len; i++) {
        var p1 = parts1[i];
        var p2 = parts2[i];
        
        /* Normalize missing parts to 0 or empty string */
        if (p1 === undefined) {
            p1 = (typeof p2 === "number" ? 0 : "");
        }
        if (p2 === undefined) {
            p2 = (typeof p1 === "number" ? 0 : "");
        }
        
        /* Compare (always number-number or string-string) */
        if (p1 > p2) {
            return 1;
        } else if (p1 < p2) {
            return -1;
        }
    }
    
    /* Versions are equal */
    return 0;
}

function checkoutTag() {
    if (!tagName) {
        throw "Error: Couldn't find the most recent tag name - please specify a tag or branch explicitly.";
    }

    if (tagName === 'current') {
        registerWarning('The package was built from currently checked out files, which may not correctly reflect the package version.');
        return Q.when();
    }

    outputStep('Checking out tag ' + tagName + '...');
    return exec('git symbolic-ref -q --short HEAD || git describe --tags --exact-match').then(function (currentBranch) {
        // Don't checkout the tag if its already checked out
        if (currentBranch === tagName) {
            console.log('- tag is already checked out.');
        } else {
            return exec('git checkout -q ' + tagName).then(function () {
                console.log('- success.');
            });
        }
    });
}

function checkPendingChanges() {
    outputStep('Checking for pending local changes...');
    return exec('git status --porcelain').then(function (result) {
        if (result) {
            if (allowPending) {
                registerWarning('There are pending local changes.');
            } else {
                throw 'Error: Aborting because there are pending changes. Specify \'allow-pending\' option to ignore.';
            }
        }
    });
}

function tagNameFile() {
    outputStep('Creating tag name file...');
    fs.writeFileSync(TAG_NAME_FILE, tagName);
}


function buildPackage() {
    outputStep('Creating package...');
    return exec('npm pack');
}

function exec(cmdLine) {
    var d = Q.defer();

    child_process.exec(cmdLine, function (err, stdout, stderr) {
        err = err || stderr;

        if (err || stderr) {
            d.reject(err || stderr);
        } else {
            d.resolve((stdout || '').trim());
        }
    });

    return d.promise;
}

function usage(includeIntro) {
    if (includeIntro) {
        console.log('');
        console.log('Creates an npm package (tgz file) for a tag or branch.');
    }

    console.log('');
    console.log('Usage:');
    console.log('');
    console.log('jake pack[allow-pending,no-test,no-lint,no-build,no-compress,<tagname>]');
    console.log('');
    console.log('  allow-pending: If specified, allow uncommitted changes to exist when\n' +
        '                 packaging.');
    console.log('  no-test:       If specified, don\'t run tests before packaging.');
    console.log('  no-lint:       If specified, don\'t run lint before packaging');
    console.log('  no-build:      If specified, don\'t run build before packaging (use currently\n' +
        '                 built files).');
    console.log('  no-compress:   If specified, don\'t compress (uglify) built files.');
    console.log('  <tagname>:     If specified, an existing tag or branch to package. Otherwise\n' +
        '                 defaults to the most recent tag. Specify \'current\' to use whatever\n' +
        '                 is currently on your local machine (only use this for testing).');
}

