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
var constants = ripple('constants'),
    event = ripple('event'),
    utils = ripple('utils'),
    db = ripple('db'),
    PUSH_OPTIONS = constants.PUSH.OPTIONS;

function _updatePushPanel(notifications) {
    
    var portsSelect = document.getElementById("notifications-select"), currentPort = portsSelect.value;
    portsSelect.innerHTML = "";
    
    notifications.sort(function(a, b){
        var nameA = a._name.toLowerCase(), nameB = b._name.toLowerCase()
        if (nameA < nameB) {
            return -1; 
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    
    notifications.forEach(function (port) {
        portsSelect.appendChild(utils.createElement("option", {
            innerHTML: port,
            value: port,
            selected: false
        }));
    });
    
    portsSelect.appendChild(utils.createElement("option", {
        innerHTML: "choose...",
        value: "default",
        selected: true
    }));
}

module.exports = {
    panel: {
        domId: "push-container",
        collapsed: true,
                pane: "right"
    },
    initialize: function () {
        
        jQuery("#notifications-select").mouseover(function () {
            var wrNotifications = document.getElementById("document").contentWindow.wr.mvc.mgmt.NotificationPoint.getAll();
            _updatePushPanel(wrNotifications);
        });
        
        jQuery("#notifications-select").change(function () {
            var selectedNotificationIndex;
            var selectedNotificationName = $("#notifications-select").val();
            var availableNotification = document.getElementById("document").contentWindow.wr.mvc.mgmt.NotificationPoint.getAll();
            for (var i = 0; i < availableNotification.length; i++) { 
                if (availableNotification[i]._name === selectedNotificationName) {
                    selectedNotificationIndex = i;
                }
            }
            
            jQuery("#push-parameters-input").empty();
            
            jQuery("#push-parameters-input").append("Title: <br/><textarea id=\"notification-parameters-title\" rows=\"1\" style=\"width: 60%;\"></textarea><br/>");
            jQuery("#push-parameters-input").append("Message: <br/><textarea id=\"notification-parameters-message\" rows=\"2\" style=\"width: 60%;\"></textarea><br/>");
            
            var selectedNotification = document.getElementById("document").contentWindow.wr.mvc.mgmt.NotificationPoint.getAll()[selectedNotificationIndex].getParameterNames();
            localStorage.setItem('selectedNotificationIndex', selectedNotificationIndex);
            
            for (var j = 0; j < selectedNotification.length; j++) {
                if (selectedNotification[j] !== "TITLE" && selectedNotification[j] !== "MESSAGE") {
                    jQuery("#push-parameters-input").append(selectedNotification[j] + ": <br/><textarea id=\"notification-parameters-" + selectedNotification[j].replace(/ /g,"_") + "\" rows=\"1\" style=\"width: 60%;\"></textarea><br/>");
                }
            }
            
            if (localStorage.getItem(selectedNotificationName) != null) {
                var storedObject = localStorage.getItem(selectedNotificationName);
                storedObject = JSON.parse(storedObject);
                
                jQuery("#notification-parameters-title").val(storedObject.TITLE);
                jQuery("#notification-parameters-message").val(storedObject.MESSAGE);
                jQuery.each(storedObject, function(i, value) {
                    if (i !== "TITLE" && i !== "MESSAGE") {
                        jQuery("#notification-parameters-" + i.replace(/ /g,"_")).val(value);
                    }
                });
            }
        });
        
        jQuery("#push-send").click(function () {
            
            var selectedNotificationIndex = localStorage.getItem('selectedNotificationIndex');
            var selectedNotification = document.getElementById("document").contentWindow.wr.mvc.mgmt.NotificationPoint.getAll()[selectedNotificationIndex];
            var selectedNotificationParameters = selectedNotification.getParameterNames();
            var notificationObject = {};
            var notificationParameters = {};
            
            notificationObject["TITLE"] = jQuery("#notification-parameters-title").val();
            notificationObject["MESSAGE"] = jQuery("#notification-parameters-message").val();
            
            for (var i = 0; i < selectedNotificationParameters.length; i++) {
                if (selectedNotificationParameters[i] === "TITLE" || selectedNotificationParameters[i] === "MESSAGE") {
                    continue;
                }
                notificationParameters[selectedNotificationParameters[i]] = jQuery("#notification-parameters-" + selectedNotificationParameters[i].replace(/ /g,"_")).val();
                notificationObject[selectedNotificationParameters[i]] = jQuery("#notification-parameters-" + selectedNotificationParameters[i].replace(/ /g,"_")).val();
            }
            
            if (localStorage.getItem(selectedNotification._name) == null) {
                localStorage.setItem(selectedNotification._name, JSON.stringify(notificationObject));
            } 
            document.getElementById("document").contentWindow.wr.mvc.mgmt.NotificationPoint.getAll()[selectedNotificationIndex].sendNotification(notificationObject.TITLE, notificationObject.MESSAGE, notificationParameters);
        });
    }
};
