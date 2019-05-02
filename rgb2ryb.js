var _framework = {
    aDefs: [],
    aLoaded: [],
    add: function (c, a, b) {
        "undefined" == typeof b && (b = []);
        if ("string" != typeof c) throw "Expected file name to be passed in.";
        if ("function" != typeof a) throw "Expected a function to be passed in.";
        if (null == b || "object" != typeof b) throw "Expected list of dependancies.";
        for (var d = 0; d < _framework.aDefs.length; d++)
            if (_framework.aDefs[d].pName == c) throw "Filename " + c + " added twice to _framework!";
        _framework.aDefs.push({
            pName: c,
            pInit: a,
            pDepends: b
        })
    },
    canInitialize: function (c) {
        for (var a = !0,
                b = 0; b < c.length; b++) {
            for (var d = c[b], e = !1, f = 0; f < _framework.aLoaded.length; f++)
                if (_framework.aLoaded[f] == d) {
                    e = !0;
                    break
                } if (!e) {
                a = !1;
                break
            }
        }
        return a
    },
    canStart: function () {
        for (var c = [], a = [], b = 0; b < _framework.aDefs.length; b++) {
            var d = _framework.aDefs[b];
            c.push(d.pName);
            var e = a.indexOf(d.pName); - 1 != e && a.splice(e, 1);
            for (e = 0; e < d.pDepends.length; e++) {
                var f = d.pDepends[e]; - 1 == c.indexOf(f) && -1 == a.indexOf(f) && a.push(f)
            }
        }
        if (0 < a.length) {
            console.log("Required JavaScript files not found:");
            for (b = 0; b < a.length; b++) console.log("    " +
                a[b]);
            throw "Couldn't find all required files.";
        }
    },
    reportCircular: function (c) {
        console.log("Circular dependencies:");
        for (var a = 0; a < c.length; a++) console.log("    " + c[a].pName);
        throw "Stopped";
    },
    start: function () {
        _framework.canStart();
        for (var c = _framework.aDefs, a = []; 0 < c.length;) {
            for (var b = 0; b < c.length; b++) {
                var d = c[b];
                _framework.canInitialize(d.pDepends) ? (d.pInit(), _framework.aLoaded.push(d.pName)) : a.push(d)
            }
            c.length == a.length && _framework.reportCircular(a);
            c = a;
            a = []
        }
    }
};
$(function () {
    _framework.start()
});

function controller() {
    new DbsValidation("controller.js");
    var c = new RgbRyb(127, 127, 127),
        a = new ColorBlock($("#color")),
        b = null,
        d = null;
    $(".checkbox").button({
        icons: {
            primary: "ui-icon-unlocked"
        }
    });
    $(".checkbox").on("change", function (a) {
        $(this).prop("checked") ? $(this).button("option", "icons", {
            primary: "ui-icon-locked"
        }) : $(this).button("option", "icons", {
            primary: "ui-icon-unlocked"
        })
    });
    b = new SliderGroup($("#rgb_group"), function (b) {
        c.setRgb(b[0], b[1], b[2]);
        a.changeColor(c.getRgbText(), c.getRybText(), 127 < c.getLuminance());
        d.set([c.getRybRed(), c.getRybYellow(), c.getRybBlue()])
    });
    d = new SliderGroup($("#ryb_group"), function (d) {
        c.setRyb(d[0], d[1], d[2]);
        a.changeColor(c.getRgbText(), c.getRybText(), 127 < c.getLuminance());
        b.set([c.getRgbRed(), c.getRgbGreen(), c.getRgbBlue()])
    })
}
_framework.add("controller.js", controller, ["color_block.js", "dbs_validation.js", "slider_group.js", "rgb_ryb.js"]);
var ColorBlock = function () {
    throw "Class not initialized yet.";
};

function color_block() {
    var c = new DbsValidation("color_block.js");
    ColorBlock = function (a) {
        c.validate("E10001", "ColorBlock", arguments, ["Object"]);
        this.pBlock = a;
        this.pRgb = a.find("#rgb_text");
        this.pRyb = a.find("#ryb_text")
    };
    ColorBlock.prototype.changeColor = function (a, b, d) {
        c.validate("E10002", "changeColor", arguments, ["string", "string", "boolean"]);
        this.pBlock.css("background-color", a);
        this.pRgb.html(a);
        this.pRyb.html(b);
        d ? this.pBlock.css("color", "#00000") : this.pBlock.css("color", "#ffffff")
    }
}
_framework.add("color_block.js", color_block, ["dbs_validation.js"]);
var DbsValidation = function () {
    throw "Class not initialized yet.";
};

function dbs_validation() {
    DbsValidation = function (c) {
        this.pFile = c;
        this.pTypes = this.pArgs = this.pName = this.pCode = null
    };
    DbsValidation.prototype.name = function () {
        return "DbValidation"
    };
    DbsValidation.prototype.logMessage = function (c) {
        throw c;
    };
    DbsValidation.prototype.getObjType = function (c) {
        var a = typeof c;
        "object" == a && "function" == typeof c.name ? a = c.name() : "object" == a && (c = Object.prototype.toString.call(c), a = /\[object (.+)\]/.exec(c)[1]);
        return a
    };
    DbsValidation.prototype.logFuncTypes = function (c) {
        for (var a = this.pCode +
                " - " + this.pName + "(", b = 0; b < this.pTypes.length; b++) 0 < b && (a += ", "), a = "string" == typeof this.pTypes[b] ? a + this.pTypes[b] : a + this.pTypes[b].type;
        this.logMessage(a + ")\n" + c)
    };
    DbsValidation.prototype.logFuncValues = function (c) {
        for (var a = this.pCode + " - " + this.pName + "(", b = 0; b < this.pArgs.length; b++) 0 < b && (a += ", "), a = null == this.pArgs[b] ? a + "null" : "object" == typeof this.pArgs[b] ? a + Object.prototype.toString.call(this.pArgs[b]) : a + String(this.pArgs[b]);
        this.logMessage(a + ")\n" + c)
    };
    DbsValidation.prototype.validatedMembers =
        function (c, a) {
            for (var b = {}, d = 0; d < a.length; d++) b[a[d]] = !0;
            for (var e in c)
                if (c.hasOwnProperty(e) && !b[e]) throw "Unrecognized validation property: " + e;
        };
    DbsValidation.prototype.validateArgTypes = function () {
        this.pTypes.length != this.pArgs.length && logFuncTypes("Incorrect number of arguments passed in, expected " + this.aTypes.length + " arguments but got " + this.pTypes.length);
        for (var c = 0; c < this.pArgs.length; c++) {
            var a = this.pTypes[c],
                b = this.getObjType(this.pArgs[c]);
            "string" == typeof a && a != b ? this.logFuncTypes("Argument " +
                c + " expected a " + a + " but got a " + b) : "object" == typeof a && a.type != b && this.logFuncTypes("Argument " + c + " expected a " + a.type + " but got a " + b)
        }
    };
    DbsValidation.prototype.validateArgValues = function () {
        for (var c = 0; c < this.pArgs.length; c++) {
            var a = this.pTypes[c],
                b = this.pArgs[c];
            if ("object" != typeof a) break;
            "number" == typeof a.min && b < a.min && this.logFuncValues("Argument " + c + " is invalid [" + a.min + ">" + b + "].");
            "number" == typeof a.max && b > a.max && this.logFuncValues("Argument " + c + " is invalid [" + a.max + "<" + b + "].");
            a.intNum &&
                b != Math.floor(b) && this.logFuncValues("Argument " + c + " should be an integer but is " + b);
            "number" == a.type && a.compare && (">=" == a.compare && b < this.pArgs[a.compareWith] ? this.logFuncValues("Argument " + c + " must be greather than or equal argument " + a.compareWith + " [" + b + "<" + this.pArgs[a.compareWith] + "].") : ">" == a.compare && b <= this.pArgs[a.compareWith] ? this.logFuncValues("Argument " + c + " must be greather than argument " + a.compareWith + " [" + b + "<=" + this.pArgs[a.compareWith] + "].") : "<=" == a.compare && b > this.pArgs[a.compareWith] ?
                this.logFuncValues("Argument " + c + " must be less than or equal argument " + a.compareWith + " [" + b + ">" + this.pArgs[a.compareWith] + "].") : "<" == a.compare && b >= this.pArgs[a.compareWith] && this.logFuncValues("Argument " + c + " must be less than argument " + a.compareWith + " [" + b + ">=" + this.pArgs[a.compareWith] + "]."));
            null != b || a.validNull || this.logFuncValues("Argument " + c + " cannot be null.");
            "number" == typeof a.arrayLen && a.arrayLen != b.length && this.logFuncValues("Argument " + c + " should have " + a.arrayLen + " items not " + b.length +
                " items.");
            if (a.arrayType && "int" == a.arrayType)
                for (var d = 0; d < b.length; d++) "number" == this.getObjType(b[d]) && Math.floor(b[d]) == b[d] || this.logFuncValues("Argument " + c + "'s item " + d + " is " + b[d] + " it should be an integer."), "number" == typeof a.arrayMinVal && b[d] < a.arrayMinVal && this.logFuncValues("Argument " + c + "'s item " + d + " value must be at least " + a.arrayMinVal + "but is " + b[d] + "."), "number" == typeof a.arrayMaxVal && b[d] > a.arrayMaxVal && this.logFuncValues("Argument " + c + "'s item " + d + " value must can't be greater than " +
                    a.arrayMaxVal + "but is " + b[d] + ".")
        }
    };
    DbsValidation.prototype.panic = function (c, a, b, d) {
        this.pCode = c;
        this.pName = a;
        this.pArgs = b;
        this.pTypes = null;
        this.logFuncValues(d)
    };
    DbsValidation.prototype.validate = function (c, a, b, d) {
        for (var e = 0; e < d.length; e++) "object" == typeof d[e] && this.validatedMembers(d[e], "min max intNum compare compareWith validNull arrayLen arrayType type arrayMaxVal arrayMinVal".split(" "));
        this.pCode = c;
        this.pName = a;
        this.pArgs = b;
        this.pTypes = d;
        this.validateArgTypes();
        this.validateArgValues()
    }
}
_framework.add("dbs_validation.js", dbs_validation, []);
var RgbRyb = function () {
    throw "Class not initialized yet.";
};

function rgb_ryb() {
    var c = new DbsValidation("rgb_ryb.js");
    RgbRyb = function (a, b, d) {
        c.validate("E10004", "RgbRyb", arguments, [{
            type: "number",
            max: 255,
            min: 0,
            arrayType: "int"
        }, {
            type: "number",
            max: 255,
            min: 0,
            arrayType: "int"
        }, {
            type: "number",
            max: 255,
            min: 0,
            arrayType: "int"
        }]);
        this.setRgb(a, b, d)
    };
    RgbRyb.prototype.setRgb = function (a, b, d) {
        c.validate("E10003", "setRgb", arguments, [{
            type: "number",
            max: 255,
            min: 0,
            arrayType: "int"
        }, {
            type: "number",
            max: 255,
            min: 0,
            arrayType: "int"
        }, {
            type: "number",
            max: 255,
            min: 0,
            arrayType: "int"
        }]);
        this.pRgb = [a, b, d];
        var e = Math.min(a, b, d);
        a -= e;
        b -= e;
        d -= e;
        var f = Math.max(a, b, d),
            g = Math.min(a, b);
        a -= g;
        b -= g;
        0 < d && 0 < b && (d /= 2, b /= 2);
        g += b;
        d += b;
        var h = Math.max(a, g, d);
        0 < h && (f /= h, a *= f, g *= f, d *= f);
        this.pRyb = [Math.floor(a + e), Math.floor(g + e), Math.floor(d + e)]
    };
    RgbRyb.prototype.setRyb = function (a, b, d) {
        c.validate("E10002", "setRyb", arguments, [{
            type: "number",
            max: 255,
            min: 0,
            arrayType: "int"
        }, {
            type: "number",
            max: 255,
            min: 0,
            arrayType: "int"
        }, {
            type: "number",
            max: 255,
            min: 0,
            arrayType: "int"
        }]);
        this.pRyb = [a, b, d];
        var e = Math.min(a, b, d);
        a -= e;
        b -=
            e;
        d -= e;
        var f = Math.max(a, b, d),
            g = Math.min(b, d);
        b -= g;
        d -= g;
        0 < d && 0 < g && (d *= 2, g *= 2);
        a += b;
        var g = g + b,
            h = Math.max(a, g, d);
        0 < h && (f /= h, a *= f, g *= f, d *= f);
        this.pRgb = [Math.floor(a + e), Math.floor(g + e), Math.floor(d + e)]
    };
    RgbRyb.prototype.getHexCode = function (a) {
        c.validate("E10001", "getHexCode", arguments, [{
            type: "Array",
            arrayLen: 3,
            arrayMaxVal: 255,
            arrayMinVal: 0,
            arrayType: "int"
        }]);
        var b = "",
            d = a[0].toString(16),
            e = a[1].toString(16),
            f = a[2].toString(16),
            b = 1 == d.length ? b + ("0" + d) : b + d,
            b = 1 == e.length ? b + ("0" + e) : b + e;
        return b = 1 == f.length ?
            b + ("0" + f) : b + f
    };
    RgbRyb.prototype.getLuminance = function () {
        return Math.floor(0.2126 * this.pRgb[0] + 0.7152 * this.pRgb[1] + 0.0722 * this.pRgb[2])
    };
    RgbRyb.prototype.getRgbText = function () {
        return "#" + this.getHexCode(this.pRgb)
    };
    RgbRyb.prototype.getRybText = function () {
        return "#" + this.getHexCode(this.pRyb)
    };
    RgbRyb.prototype.getRgbRed = function () {
        return this.pRgb[0]
    };
    RgbRyb.prototype.getRgbGreen = function () {
        return this.pRgb[1]
    };
    RgbRyb.prototype.getRgbBlue = function () {
        return this.pRgb[2]
    };
    RgbRyb.prototype.getRybRed = function () {
        return this.pRyb[0]
    };
    RgbRyb.prototype.getRybYellow = function () {
        return this.pRyb[1]
    };
    RgbRyb.prototype.getRybBlue = function () {
        return this.pRyb[2]
    }
}
_framework.add("rgb_ryb.js", rgb_ryb, ["dbs_validation.js"]);
var SliderGroup = function () {
    throw "Class not initialized yet.";
};

function slider_group() {
    var c = new DbsValidation("slider_group.js");
    SliderGroup = function (a, b) {
        c.validate("E10001", "SliderGroup", arguments, ["Object", "function"]);
        var d = this,
            e = a.find(".slider");
        this.pNotify = b;
        this.pCheckbox = [a.find(".checkbox.one"), a.find(".checkbox.two"), a.find(".checkbox.three")];
        this.pSliders = [new Slider($(e[0]), function (a) {
            return d.change(0, a)
        }), new Slider($(e[1]), function (a) {
            return d.change(1, a)
        }), new Slider($(e[2]), function (a) {
            return d.change(2, a)
        })];
        this.pCurrent = [127, 127, 127];
        this.pSliders[0].set(127);
        this.pSliders[1].set(127);
        this.pSliders[2].set(127)
    };
    SliderGroup.prototype.locked = function (a) {
        c.validate("E10004", "locked", arguments, [{
            type: "number",
            intNum: !0,
            min: 0,
            max: 2
        }]);
        var b = [];
        0 != a && this.pCheckbox[0].prop("checked") && b.push(0);
        1 != a && this.pCheckbox[1].prop("checked") && b.push(1);
        2 != a && this.pCheckbox[2].prop("checked") && b.push(2);
        return b
    };
    SliderGroup.prototype.set = function (a) {
        c.validate("E10003", "set", arguments, [{
            type: "Array",
            arrayLen: 3,
            arrayMaxVal: 255,
            arrayMinVal: 0,
            arrayType: "int"
        }]);
        this.pCurrent = a;
        this.pSliders[0].set(a[0]);
        this.pSliders[1].set(a[1]);
        this.pSliders[2].set(a[2])
    };
    SliderGroup.prototype.change = function (a, b) {
        c.validate("E10002", "change", arguments, [{
            type: "number",
            intNum: !0,
            min: 0,
            max: 2
        }, {
            type: "number",
            intNum: !0,
            min: 0,
            max: 255
        }]);
        var d = !0,
            e = b - this.pCurrent[a],
            f = this.locked(a);
        if (0 < f.length) {
            for (var g = 0, h = 0, k = 0; k < f.length; k++) {
                var l = this.pCurrent[f[k]] + e;
                l > g && (g = l);
                l < h && (h = l)
            }
            if (255 >= g && 0 <= h) {
                f.push(a);
                for (k = 0; k < f.length; k++) g = f[k], this.pCurrent[g] +=
                    e, a != g && this.pSliders[g].set(this.pCurrent[g]);
                this.pNotify(this.pCurrent)
            } else d = !1
        } else this.pCurrent[a] = b, this.pNotify(this.pCurrent);
        return d
    }
}
_framework.add("slider_group.js", slider_group, ["dbs_validation.js", "slider.js"]);
var Slider = function () {
    throw "Class not initialized yet.";
};

function slider() {
    var c = new DbsValidation("slider.js");
    Slider = function (a, b) {
        c.validate("E10001", "Slider", arguments, ["Object", "function"]);
        this.pSlider = a.find(".ui_slider");
        this.pValue = a.find(".value");
        this.pNotify = b;
        var d = this;
        this.pSlider.slider({
            min: 0,
            max: 255,
            range: "min",
            value: 127,
            orientation: "vertical",
            change: function (a, b) {
                d.notifyChanged(b.value)
            },
            slide: function (a, b) {
                d.notifySlide(a, b.value)
            }
        })
    };
    Slider.prototype.notifyChanged = function (a) {
        c.validate("E10002", "notifyChanged", arguments, [{
            type: "number",
            intNum: !0,
            min: 0,
            max: 255
        }]);
        this.pValue.html(a)
    };
    Slider.prototype.notifySlide = function (a, b) {
        c.validate("E10003", "notifySlide", arguments, [{
            type: "Object"
        }, {
            type: "number",
            intNum: !0,
            min: 0,
            max: 255
        }]);
        this.pNotify(b) ? this.pValue.html(b) : a.preventDefault()
    };
    Slider.prototype.set = function (a) {
        c.validate("E10004", "set", arguments, [{
            type: "number",
            intNum: !0,
            min: 0,
            max: 255
        }]);
        this.pSlider.slider("value", a)
    }
}
_framework.add("slider.js", slider, ["dbs_validation.js"]);