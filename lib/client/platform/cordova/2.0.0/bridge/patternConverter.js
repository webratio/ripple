/*
 * WebRatio Pattern converter
 * Used to convert moment.js pattern to Unicode Technical Standard 35
 */

var patternConverter = function (patternSymbols, rules) {
    
    this._tokenExpr = null;
    this._rules = null;
    
    function buildTokenExpr(symbols, escapeChar) {
        
        function esc(s) {
            return s.replace(/([\]\^])/g, "\\$1");
        }
        
        var escapedEscapeChar = esc(escapeChar);
        
        var parts = [];
        parts.push("(");
        parts.push(escapedEscapeChar);
        parts.push("[^");
        parts.push(escapedEscapeChar);
        parts.push("]+");
        parts.push(escapedEscapeChar);
        parts.push(")|(");
        for (var i = 0; i < symbols.length; i++) {
            parts.push("[" + esc(symbols[i]) + "]+");
            if (i < symbols.length - 1) {
                parts.push("|");
            }
        }
        parts.push(")|(.)");
        
        return new RegExp(parts.join(""), "g");
    }
    
    var internalRules = {};
    var symbols = patternSymbols;
    var thisPatternConverter = this;
    this._iterate(rules || {}, function (symbol, translation) {
        if (symbol.length != 1) {
            throw new Error("Symbols must be single characters");
        } else if (symbols.indexOf(symbol) < 0) {
            symbols += symbol;
        }
        internalRules[symbol] = thisPatternConverter._makeTranslationArray(translation);
    });
    // this._tokenExpr = new RegExp([ "([", symbols.replace(/([\]\^])/g, "\\$1"), "]+)|(.)" ].join(""), "g");
    this._tokenExpr = buildTokenExpr(symbols, "'");
    this._rules = internalRules;
};

patternConverter.prototype.convert = function (pattern, callback) {
    var result = [],
    m;
    this._tokenExpr.lastIndex = 0;
    while (m = this._tokenExpr.exec(pattern)) {
        var symbolTxt = m[2],
        symbol = symbolTxt && symbolTxt.charAt(0),
        symbolLen = symbolTxt && symbolTxt.length,
        value = (m[1] || m[3]);
        if (symbol) {
            if (callback) {
                callback(symbol, symbolLen);
            }
            var rule = this._rules[symbol];
            value = rule ? (rule[symbolLen] || rule[0]) : value;
        }
        if (value) {
            result.push(value);
        }
    }
    return result.join("");
};

patternConverter.prototype.indexOfFirstRule = function (pattern) {
    return this._indexOfRule(pattern, false);
};

patternConverter.prototype.indexOfLastRule = function (pattern) {
    return this._indexOfRule(pattern, true);
};

patternConverter.prototype._indexOfRule = function (pattern, last) {
    var index = -1,
    m;
    this._tokenExpr.lastIndex = 0;
    while (m = this._tokenExpr.exec(pattern)) {
        if (m[1] && this._rules[m[1][0]]) {
            index = m.index + (last ? m[1].length : 0);
            if (!last) {
                break;
            }
        }
    }
    return index;
};

patternConverter.prototype._makeTranslationArray = function (tr) {
    if (typeof tr === "string") {
        return [tr];
    } else if (typeof tr === "object") {
        var arr = [];
        this._iterate(tr, function (range, subTranslation) {
            if (!/^(?:\d+(?:,\d+)?)?|%$/.test(range)) {
                throw new Error("Invalid symbol range");
            }
            if (range === "%") {
                var repeated = "";
                for (var i = 1; i <= 6; i++) {
                    repeated += subTranslation;
                    arr[i] = "" + repeated; // workaround for IE9 string mutability bug
                }
            } else {
                var nums = range ? range.split(",") : [0, 0];
                nums = [Number(nums[0]), Number(nums[1] || nums[0])];
                for (var i = nums[0]; i <= nums[1]; i++) {
                    arr[i] = subTranslation;
                }
            }
        });
        return arr;
    }
    throw new Error("Invalid translation object");
};

patternConverter.prototype._iterate = function (o, callback) {
    for (var k in o) {
        if (o.hasOwnProperty(k)) {
            callback.call(o, k, o[k]);
        }
    }
};

var createPatternConverter = function () {
    var momentSymbols = "YQMDdgwGWEHhaAmsSZ",
    rules = {
        Y: {
            "%": "y"
        },
        M: {
            "%": "M"
        },
        D: {
            "1": "d",
            "2": "dd",
            "3": "D",
                    "": "DD"
        },
        d: {
            "%": "E"
        },
        g: {
            "%": "Y"
        },
        w: {
            "%": "w"
        },
        G: {
            "%": "Y"
        },
        W: {
            "%": "w"
        },
        E: {
            "%": "u"
        },
        H: {
            "%": "H"
        },
        h: {
            "%": "h"
        },
        a: {
            "%": "a"
        },
        A: {
            "%": "a"
        },
        m: {
            "%": "m"
        },
        s: {
            "%": "s"
        },
        S: {
            "%": "S"
        },
        Z: {
            "%": "Z"
        }
    };
    
    return new patternConverter(momentSymbols, rules);
}

var momentConverter = createPatternConverter();

module.exports = {
    convert: function (pattern) {
        return momentConverter.convert(pattern);
    }
};
