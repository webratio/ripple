var _instance = null;
var _simulateOffline = false;

function _wrapXhr(OriginalXhr) {

    function SimulatedXhr(params) {
        var _xhr = new OriginalXhr(params);

        var _open = _xhr.open;
        var openedUrl;
        _xhr.open = function(method, url) {
            openedUrl = url;
            return _open.apply(this, arguments);
        };

        var _send = _xhr.send;
        _xhr.send = function() {
            /* jshint shadow: true*/
            if (_simulateOffline && openedUrl.startsWith("http")) {
                overrideProperty(this, "status", 0);
                if (this.onreadystatechange) {
                    var ev = new Event("readystatechange");
                    overrideProperty(this, "readyState", 4);
                    overrideProperty(ev, "currentTarget", this);
                    overrideProperty(ev, "srcElement", this);
                    overrideProperty(ev, "target", this);
                    this.onreadystatechange(ev);
                }
                if (this.onloadstart) {
                    var ev = createEvent(this, "loadstart", Date.now());
                    overrideProperty(this, "readyState", 1);
                    this.onloadstart(ev);
                }
                
                if (this.onerror) {
                    var ev = createEvent(this, "error", Date.now());
                    overrideProperty(this, "readyState", 4);
                    this.onerror(ev);
                }
                if (this.onloadend) {
                    var ev = createEvent(this, "loadend", Date.now());
                    overrideProperty(this, "readyState", 4);
                    this.onloadend(ev);
                }
                return;
            }
            return _send.apply(this, arguments);
        };

        function overrideProperty(object, propertyName, value) {
            Object.defineProperty(object, propertyName, {
                get: function() {
                    return value;
                }
            });
        }

        function createEvent(context, propertyName, timestamp) {
            var ev = {};
            ev.bubbles = false;
            ev.cancelBubble = false;
            ev.cancelable = true;
            ev.currentTarget = context;
            ev.defaultPrevented = false;
            ev.defaultPrevented = 0;
            ev.lengthComputable = false;
            ev.loaded = 0;
            ev.position = 0;
            ev.returnValue = true;
            ev.srcElement = context;
            ev.target = context;
            ev.timestamp = timestamp;
            ev.total = 0;
            ev.totalSize = 0;
            ev.type = propertyName;
            return ev;
        }
        return _xhr;
    }

    return SimulatedXhr;
}

module.exports = {
    
    get: function() {
        if (!_instance) {
            var xhr = ripple('xhr').get();
            _instance = _wrapXhr(xhr);
        }
        return _instance;
    },
    
    simulateOffline: function(simulateOffline) {
        _simulateOffline = simulateOffline;
    }  
    
};
