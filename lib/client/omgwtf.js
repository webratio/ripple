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
var event = ripple('event'),
    db = ripple('db'),
    _loaded = false,
    _self;

function _delay(action) {
    window.setTimeout(function () {
        if (!_loaded) {
            if (jQuery(".first-run-window").is(":visible")) {
                _delay(action);
            } else {
                action();
            }
        }
    }, 30000);
}

function _hide() {
    jQuery(".error-window").css({display: 'none'});
    jQuery(".error-dialog").css({display: 'none'});
}

function _show() {
    jQuery(".error-window").css({display: 'block'});

    jQuery(".error-dialog").css({
        display: 'block',
        left: (jQuery(document).width() / 2) - 277 + "px"
    });

    jQuery("#error-wait").click(function () {
        _hide();
        _delay(_show);
    });

    jQuery("#error-panic").click(function () {
        db.removeAll(function () {
            localStorage.clear();
            location.reload();
        });
    });
}

_delay(_show);

_self = {
    initialize: function () {
        event.on("TinyHipposLoaded", function () {
            _loaded = true;
        });
    },
    show: _show,
    hide: _hide
};

module.exports = _self;
