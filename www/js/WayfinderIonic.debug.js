var Class = function() {};

(function() {
    var initializing = false, fnTest = /xyz/.test(function() {
        xyz;
    }) ? /\b_super\b/ : /.*/;
    this.Class = function() {};
    Class.extend = function(prop) {
        var _super = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;
        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? function(name, fn) {
                return function() {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    return ret;
                };
            }(name, prop[name]) : prop[name];
        }
        function Class() {
            if (!initializing && this.init) this.init.apply(this, arguments);
        }
        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;
        return Class;
    };
})();

function ClassCallback(classScope, fnCallback) {
    return function() {
        return fnCallback.apply(classScope, arguments);
    };
}

var Callback = ClassCallback;

if (Float32Array === undefined) {
    var Float32Array = function() {
        return [ 0, 0 ];
    };
}

if (typeof window !== "undefined") {
    window.requestAnimFrame = function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 16);
        };
    }();
    (function() {
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    })();
    if (typeof String.prototype.trim !== "function") {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, "");
        };
    }
    if (typeof String.prototype.format !== "function") {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != "undefined" ? args[number] : match;
            });
        };
    }
    window.log = function() {
        log.history = log.history || [];
        log.history.push(arguments);
        if (this.console) {
            console.log(Array.prototype.slice.call(arguments));
        }
    };
}

var Logistics = function() {
    var storageSupport = false;
    if (typeof window !== "undefined") {
        storageSupport = "localStorage" in window && window["localStorage"] !== null;
    }
    var queue = [];
    var multiQueue = [];
    var stages = {};
    var loadedCount = 0;
    var loading = false;
    var afterLoadCallback = null;
    var progressCallback = null;
    var stageCallback = null;
    var loadedCheckTimer = null;
    var options = {
        loadFromLocalStorage: false,
        storeToLocalStorage: false,
        loadFromFile: false,
        enableCORS: true,
        useCookies: false,
        fallbackFromStorage: true
    };
    var me = this;
    var typefunctions = {
        text: {
            load: function(dt) {
                makeHTTPRequest(dt);
            },
            parse: function(dt, http) {
                dt.data = http.responseText;
            },
            store: function(dt) {
                return dt.data;
            },
            restore: function(dt, data) {
                return data;
            }
        },
        json: {
            load: function(dt) {
                makeHTTPRequest(dt);
            },
            parse: function(dt, http) {
                try {
                    dt.data = JSON.parse(http.responseText);
                } catch (e) {
                    if (typeof console !== "undefined" && console.error) {
                        console.error("JSON parsing failed for " + dt.url, e);
                    }
                }
            },
            store: function(dt) {
                return JSON.stringify(dt.data);
            },
            restore: function(dt, data) {
                if (data) {
                    return JSON.parse(data);
                } else {
                    return {};
                }
            }
        },
        xml: {
            load: function(dt) {
                makeHTTPRequest(dt);
            },
            parse: function(dt, http) {
                if (http.responseXML) {
                    dt.data = http.responseXML;
                } else {
                    dt.data = parseXML(http.responseText);
                }
            },
            store: function(dt) {
                if (XMLSerializer) {
                    return new XMLSerializer().serializeToString(dt.data);
                } else {
                    return "";
                }
            },
            restore: function(dt, data) {
                return parseXML(data);
            }
        },
        image: {
            load: function(dt) {
                if (dt) {
                    dt.data = new Image();
                    if (dt.useCORS) {
                        dt.data.crossOrigin = "Anonymous";
                    }
                    dt.data.onload = function() {
                        dt.ready();
                    };
                    dt.data.onerror = function() {
                        dt.failed();
                    };
                    dt.data.src = dt.url;
                }
            },
            parse: function(dt) {},
            store: function(dt) {
                var canvas = document.createElement("canvas");
                canvas.width = dt.data.width;
                canvas.height = dt.data.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(dt.data, 0, 0);
                var dataURL = canvas.toDataURL("image/png");
                canvas = null;
                return dataURL;
            },
            restore: function(dt, data) {
                var img = new Image();
                img.src = data;
                return img;
            }
        },
        binary: {
            load: function(dt) {
                makeHTTPRequest(dt);
            },
            parse: function(dt, http) {
                dt.data = http.response;
            },
            store: function(dt) {
                var str = "";
                var bytes = new Uint8Array(dt.data);
                var len = bytes.byteLength;
                for (var i = 0; i < len; i++) {
                    str += String.fromCharCode(bytes[i]);
                }
                return window.btoa(str);
            },
            restore: function(dt, data) {
                var buf = new ArrayBuffer(data.length * 2);
                var bufView = new Uint16Array(buf);
                for (var i = 0, strLen = data.length; i < strLen; i++) {
                    bufView[i] = data.charCodeAt(i);
                }
                return buf;
            }
        }
    };
    var DataTransporter = function(_url, _params, _success, _type, _requestType, _options) {
        this.url = _url;
        this.params = _params;
        this.success = _success;
        this.dataType = _type;
        this.loaded = false;
        this.data = false;
        this.requestType = _requestType;
        this.useCORS = false;
        this.options = _options ? _options : {};
        this.successCallback = _success;
        this.errorCallback = false;
        this.alwaysCallback = false;
        this.progressCallback = false;
        this.setOption = function(key, value) {
            this.options[key] = value;
        };
        this.getOption = function(key) {
            return this.options[key];
        };
        this.ready = function() {
            this.loaded = true;
            loadedCount++;
            callSuccess(this);
            callProgress(this);
        };
        this.failed = function() {
            loadedCount++;
            callProgress(this);
            callError(this);
        };
        this.done = function(callback) {
            this.successCallback = callback;
        };
        this.fail = function(callback) {
            this.errorCallback = callback;
        };
        this.error = function(callback) {
            this.errorCallback = callback;
        };
        this.always = function(callback) {
            this.alwaysCallback = callback;
        };
        this.progress = function(callback) {
            this.progressCallback = callback;
        };
        this.toString = function() {
            return this.data;
        };
    };
    var MultiTransporter = function(urlList, _success, _options) {
        this.urls = urlList;
        this.results = {};
        this.loadedCount = 0;
        this.count = 0;
        this.successCallback = _success;
        _options = _options ? _options : {};
        this.load = function() {
            var dt = null;
            var url = null;
            for (var key in this.urls) {
                if (this.urls.hasOwnProperty(key)) {
                    this.count++;
                }
            }
            for (var i in this.urls) {
                url = this.urls[i];
                if (url && url.url && url.type) {
                    try {
                        dt = get(url.url, undefined, callback(this, this.ready, i), url.type, JSON.parse(JSON.stringify(_options)));
                        dt.setOption("logistics.multi.key", i);
                        dt.fail(callback(this, this.fail));
                    } catch (e) {
                        this.fail();
                    }
                }
            }
        };
        this.ready = function(data, status, dt) {
            var key = dt.getOption("logistics.multi.key");
            this.results[key] = data;
            this.loadedCount++;
            this.checkIfAllReady();
        };
        this.fail = function(dt) {
            this.loadedCount++;
            this.checkIfAllReady();
        };
        this.getKeyForURL = function(url) {};
        this.checkIfAllReady = function() {
            if (this.loadedCount >= this.count) {
                if (typeof this.successCallback === "function") {
                    this.successCallback(this.results);
                }
            }
        };
    };
    var get = function(_url, _params, _success, _type, _options) {
        var _requestType = "GET";
        if (typeof _params === "function") {
            _success = _params;
            _params = undefined;
        } else if (_params && typeof _params === "object") {
            _requestType = "POST";
        }
        var dt = new DataTransporter(_url, _params, _success, _type, _requestType, _options);
        if (options.enableCORS) {
            dt.useCORS = ifCORSNeeded(_url);
        }
        if (dt) {
            queue.push(dt);
            startLoad(dt);
        }
        return dt;
    };
    var getMultiple = function(urlList, success, options) {
        var mt = new MultiTransporter(urlList, success, options);
        multiQueue.push(mt);
        mt.load();
    };
    var ifCORSNeeded = function(_url) {
        if (typeof document === "undefined") return false;
        var url = _url.match(/(https?:)?\/\/([^\/]+)\/(.*)/);
        if (!url) return false;
        if (document && url[1] === document.location.origin) return false;
        return true;
    };
    var checkOptions = function(dt) {
        if (dt) {
            var stage = dt.getOption("stage");
            if (stage) {
                if (typeof stages[stage] !== "object") {
                    stages[stage] = [];
                }
                stages[stage].push(dt);
            }
        }
    };
    var startLoad = function(dt) {
        load(dt);
        return true;
    };
    var load = function(dt) {
        checkOptions(dt);
        if (options.loadFromLocalStorage && inLocalStorage(dt)) {
            restore(dt);
        } else {
            getTypeFunction(dt.dataType, "load")(dt);
        }
    };
    var inLocalStorage = function(dt) {
        if (storageSupport && localStorage.getItem(dt.url) !== null) {
            return true;
        }
        return false;
    };
    var restore = function(dt) {
        dt.data = getTypeFunction(dt.dataType, "restore")(dt, loadFromLocalStorage(dt));
        dt.ready();
    };
    var getTypeFunction = function(type, method) {
        if (typefunctions && typefunctions[type] && typefunctions[type][method]) {
            return typefunctions[type][method];
        } else if (typefunctions && typefunctions[type]) {
            return typefunctions[type];
        }
        return function() {
            if (typeof console !== "undefined" && console.warn) {
                console.warn("Method " + method + " for " + type + " not found");
            }
        };
    };
    var setTypeFunction = function(type, method) {
        if (type && method) {
            typefunctions[type] = method;
        }
    };
    var makeHTTPRequest = function(dt) {
        var xhr = getHTTPObject(dt);
        if (xhr && dt) {
            var url = dt.url;
            xhr.open(dt.requestType, url, true);
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType("text/xml");
            }
            if (dt.dataType == "binary") {
                xhr.responseType = "arraybuffer";
                if (dt.useCORS) {
                    xhr.setRequestHeader("Content-Type", "application/x-3dtechdata");
                }
            }
            if (dt.dataType == "default") {
                xhr.responseType = "arraybuffer";
                if (dt.useCORS) {
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                }
            }
            if (dt.useCORS && options.useCookies) {
                xhr.withCredentials = true;
            }
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        getTypeFunction(dt.dataType, "parse")(dt, xhr);
                        dt.ready();
                    } else {
                        dt.failed();
                    }
                } else {
                    if (typeof dt.progressCallback === "function") {
                        dt.progressCallback(xhr);
                    }
                }
            };
            xhr.ontimeout = function() {
                dt.failed();
            };
            xhr.onerror = function() {
                dt.failed();
            };
            callProgress(dt);
            xhr.send(null);
        } else {
            throw "http failed";
        }
    };
    var parseXML = function(data) {
        var xml = null;
        if (!data || typeof data !== "string") {
            return xml;
        }
        if (window && window.DOMParser) {
            var parser = new DOMParser();
            xml = parser.parseFromString(data, "text/xml");
        } else {
            xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = false;
            xml.loadXML(data);
        }
        if (!xml || xml.getElementsByTagName("parsererror").length) {
            throw "XML parsing failed";
        }
        return xml;
    };
    var getHTTPObject = function(dt) {
        var http = false;
        if (dt.useCORS && window && window.XDomainRequest) {
            try {
                http = new XDomainRequest();
            } catch (E) {
                http = false;
            }
        } else if (XMLHttpRequest) {
            try {
                http = new XMLHttpRequest();
            } catch (e) {
                http = false;
            }
        } else if (typeof ActiveXObject !== "undefined") {
            try {
                http = new ActiveXObject("Msxml2.XMLHTTP");
                alert(2);
            } catch (e) {
                try {
                    http = new ActiveXObject("Microsoft.XMLHTTP");
                    alert(3);
                } catch (E) {
                    http = false;
                }
            }
        }
        return http;
    };
    var clear = function() {
        queue = [];
        multiQueue = [];
        loadedCount = 0;
        loading = false;
    };
    var store = function() {
        if (storageSupport) {
            for (var i in queue) {
                storeToLocalStorage(queue[i]);
            }
        } else {
            console.warn("localStorage isn't supported");
        }
    };
    var clearStorage = function() {
        localStorage.clear();
    };
    var storeToLocalStorage = function(dt) {
        if (storageSupport) {
            try {
                localStorage[dt.url] = getTypeFunction(dt.dataType, "store")(dt);
            } catch (err) {
                console.warn("localStorage limit exceeded");
            }
        } else {
            console.warn("localStorage isn't supported");
        }
    };
    var loadFromLocalStorage = function(dt) {
        return localStorage[dt.url];
    };
    var callSuccess = function(dt) {
        if (dt && typeof dt.successCallback === "function") {
            dt.successCallback(dt.data, "success", dt);
            callIfFinished();
        }
        if (dt && options.storeToLocalStorage) {
            storeToLocalStorage(dt);
        }
    };
    var callError = function(dt) {
        if (dt && options.fallbackFromStorage && inLocalStorage(dt)) {
            restore(dt);
            return;
        } else if (dt && typeof dt.errorCallback === "function") {
            dt.errorCallback(dt, "error", "");
        } else {
            throw "Resource " + dt.url + " not loaded";
        }
        callIfFinished();
    };
    var callProgress = function(dt) {
        if (progressCallback && typeof progressCallback === "function" && queue.length && loadedCount) {
            progressCallback(loadedCount / queue.length);
        }
        if (dt && dt.getOption("stage")) {
            callStageCallback(dt);
        }
    };
    var callStageCallback = function(dt) {
        if (stageCallback && typeof stageCallback === "function") {
            var stage = stages[dt.getOption("stage")];
            var length = stage.length;
            var loadedCount = 0;
            for (var i = 0; i < length; i++) {
                if (stage[i] && stage[i].loaded) {
                    loadedCount++;
                }
            }
            if (length > 0) {
                stageCallback(dt.getOption("stage"), loadedCount / length);
            }
        }
    };
    var callIfFinished = function() {
        if (loadedCheckTimer === null) {
            loadedCheckTimer = setTimeout(finishedChecker, 5);
        }
    };
    var finishedChecker = function() {
        loadedCheckTimer = null;
        if (queue.length == loadedCount && afterLoadCallback && typeof afterLoadCallback === "function") {
            afterLoadCallback();
        }
    };
    var callback = function(classScope, fnCallback) {
        return function() {
            return fnCallback.apply(classScope, arguments);
        };
    };
    var setOption = function(key, value) {
        options[key] = value;
    };
    var getOption = function(key) {
        return options[key];
    };
    return {
        count: function() {
            return queue.length;
        },
        loadedCount: function() {
            return loadedCount;
        },
        clear: function() {
            clear();
        },
        get: function(url, params, success, type, options) {
            return get(url, params, success, toLowerCase(type), options);
        },
        getJSON: function(url, params, success, options) {
            return get(url, params, success, "json", options);
        },
        getImage: function(url, params, success, options) {
            return get(url, params, success, "image", options);
        },
        getBinary: function(url, params, success, options) {
            return get(url, params, success, "binary", options);
        },
        getXML: function(url, params, success, options) {
            return get(url, params, success, "xml", options);
        },
        getText: function(url, params, success, options) {
            return get(url, params, success, "text", options);
        },
        getMultiple: function(urlList, success, options) {
            getMultiple(urlList, success, options);
        },
        store: function() {
            store();
        },
        clearStorage: function() {
            clearStorage();
        },
        types: function() {
            return typefunctions;
        },
        onFinishedLoading: function(callback) {
            afterLoadCallback = callback;
        },
        onProgress: function(callback) {
            progressCallback = callback;
        },
        onStageProgress: function(callback) {
            stageCallback = callback;
        },
        getQueue: function() {
            return queue;
        },
        getTypeFunction: function(type, method) {
            return getTypeFunction(type, method);
        },
        setTypeFunction: function(type, method) {
            return setTypeFunction(type, method);
        },
        getOption: function(key) {
            return getOption(key);
        },
        setOption: function(key, value) {
            setOption(key, value);
        },
        start: function() {
            return start();
        }
    };
}();

var WayfinderAPI = {
    LOCATION: "//api.3dwayfinder.com/",
    PROJECT: false,
    getJSON: function(url, callback) {
        Logistics.getJSON(url, callback).error(function(info) {
            if (console && console.log) console.log("Failed to get JSON: " + JSON.stringify(info));
        });
    },
    getURL: function(classname, method, args) {
        if (WayfinderAPI.PROJECT === false) throw "No project opened! Call WayfinderAPI.open(<project name>);";
        args = args || [];
        return [ WayfinderAPI.LOCATION, "public", WayfinderAPI.PROJECT, classname, method ].concat(args).join("/");
    },
    open: function(project) {
        WayfinderAPI.PROJECT = project;
    }
};

WayfinderAPI["2d"] = {};

WayfinderAPI["3d"] = {};

WayfinderAPI["access"] = {};

WayfinderAPI["advertisements"] = {};

WayfinderAPI["building"] = {};

WayfinderAPI["guitranslations"] = {};

WayfinderAPI["images"] = {};

WayfinderAPI["languages"] = {};

WayfinderAPI["lights"] = {};

WayfinderAPI["locationgroups"] = {};

WayfinderAPI["locations"] = {};

WayfinderAPI["materials"] = {};

WayfinderAPI["models"] = {};

WayfinderAPI["navigation"] = {};

WayfinderAPI["poisettings"] = {};

WayfinderAPI["settings"] = {};

WayfinderAPI["statistics"] = {};

WayfinderAPI["templates"] = {};

WayfinderAPI["textures"] = {};

WayfinderAPI["2d"]["edges"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("2d", "edges", []), callback);
};

WayfinderAPI["2d"]["edges"].url = function() {
    return WayfinderAPI.getURL("2d", "edges", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["2d"]["image"] = function(level_id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("2d", "image", [ level_id ]), callback);
};

WayfinderAPI["2d"]["image"].url = function(level_id) {
    return WayfinderAPI.getURL("2d", "image", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["2d"]["lod"] = function(level_id, lod, x, y, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("2d", "lod", [ level_id, lod, x, y ]), callback);
};

WayfinderAPI["2d"]["lod"].url = function(level_id, lod, x, y) {
    return WayfinderAPI.getURL("2d", "lod", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["2d"]["lodcount"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("2d", "lodcount", []), callback);
};

WayfinderAPI["2d"]["lodcount"].url = function() {
    return WayfinderAPI.getURL("2d", "lodcount", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["2d"]["nodes"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("2d", "nodes", []), callback);
};

WayfinderAPI["2d"]["nodes"].url = function() {
    return WayfinderAPI.getURL("2d", "nodes", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["2d"]["overlays"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("2d", "overlays", []), callback);
};

WayfinderAPI["2d"]["overlays"].url = function() {
    return WayfinderAPI.getURL("2d", "overlays", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["3d"]["scene"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("3d", "scene", []), callback);
};

WayfinderAPI["3d"]["scene"].url = function() {
    return WayfinderAPI.getURL("3d", "scene", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["access"]["template"] = function(templateName, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("access", "template", [ templateName ]), callback);
};

WayfinderAPI["access"]["template"].url = function(templateName) {
    return WayfinderAPI.getURL("access", "template", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["advertisements"]["all"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("advertisements", "all", []), callback);
};

WayfinderAPI["advertisements"]["all"].url = function() {
    return WayfinderAPI.getURL("advertisements", "all", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["advertisements"]["data"] = function(id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("advertisements", "data", [ id ]), callback);
};

WayfinderAPI["advertisements"]["data"].url = function(id) {
    return WayfinderAPI.getURL("advertisements", "data", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["advertisements"]["frames"] = function(template_id, container_id, check_time, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("advertisements", "frames", [ template_id, container_id, check_time ]), callback);
};

WayfinderAPI["advertisements"]["frames"].url = function(template_id, container_id, check_time) {
    return WayfinderAPI.getURL("advertisements", "frames", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["building"]["levels"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("building", "levels", []), callback);
};

WayfinderAPI["building"]["levels"].url = function() {
    return WayfinderAPI.getURL("building", "levels", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["building"]["location"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("building", "location", []), callback);
};

WayfinderAPI["building"]["location"].url = function() {
    return WayfinderAPI.getURL("building", "location", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["guitranslations"]["get"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("guitranslations", "get", []), callback);
};

WayfinderAPI["guitranslations"]["get"].url = function() {
    return WayfinderAPI.getURL("guitranslations", "get", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["images"]["checkImage"] = function(id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("images", "checkImage", [ id ]), callback);
};

WayfinderAPI["images"]["checkImage"].url = function(id) {
    return WayfinderAPI.getURL("images", "checkImage", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["images"]["get"] = function(id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("images", "get", [ id ]), callback);
};

WayfinderAPI["images"]["get"].url = function(id) {
    return WayfinderAPI.getURL("images", "get", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["images"]["thumbnail"] = function(id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("images", "thumbnail", [ id ]), callback);
};

WayfinderAPI["images"]["thumbnail"].url = function(id) {
    return WayfinderAPI.getURL("images", "thumbnail", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["languages"]["get"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("languages", "get", []), callback);
};

WayfinderAPI["languages"]["get"].url = function() {
    return WayfinderAPI.getURL("languages", "get", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["languages"]["translation"] = function(id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("languages", "translation", [ id ]), callback);
};

WayfinderAPI["languages"]["translation"].url = function(id) {
    return WayfinderAPI.getURL("languages", "translation", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["lights"]["get"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("lights", "get", []), callback);
};

WayfinderAPI["lights"]["get"].url = function() {
    return WayfinderAPI.getURL("lights", "get", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["locationgroups"]["get"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("locationgroups", "get", []), callback);
};

WayfinderAPI["locationgroups"]["get"].url = function() {
    return WayfinderAPI.getURL("locationgroups", "get", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["locations"]["byfloor"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("locations", "byfloor", []), callback);
};

WayfinderAPI["locations"]["byfloor"].url = function() {
    return WayfinderAPI.getURL("locations", "byfloor", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["locations"]["bygroup"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("locations", "bygroup", []), callback);
};

WayfinderAPI["locations"]["bygroup"].url = function() {
    return WayfinderAPI.getURL("locations", "bygroup", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["locations"]["bynode"] = function(node_id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("locations", "bynode", [ node_id ]), callback);
};

WayfinderAPI["locations"]["bynode"].url = function(node_id) {
    return WayfinderAPI.getURL("locations", "bynode", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["locations"]["get"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("locations", "get", []), callback);
};

WayfinderAPI["locations"]["get"].url = function() {
    return WayfinderAPI.getURL("locations", "get", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["locations"]["location"] = function(poi_id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("locations", "location", [ poi_id ]), callback);
};

WayfinderAPI["locations"]["location"].url = function(poi_id) {
    return WayfinderAPI.getURL("locations", "location", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["locations"]["tags"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("locations", "tags", []), callback);
};

WayfinderAPI["locations"]["tags"].url = function() {
    return WayfinderAPI.getURL("locations", "tags", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["materials"]["get"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("materials", "get", []), callback);
};

WayfinderAPI["materials"]["get"].url = function() {
    return WayfinderAPI.getURL("materials", "get", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["materials"]["textureMaterialNames"] = function(names, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("materials", "textureMaterialNames", [ names ]), callback);
};

WayfinderAPI["materials"]["textureMaterialNames"].url = function(names) {
    return WayfinderAPI.getURL("materials", "textureMaterialNames", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["materials"]["textures"] = function(materialName, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("materials", "textures", [ materialName ]), callback);
};

WayfinderAPI["materials"]["textures"].url = function(materialName) {
    return WayfinderAPI.getURL("materials", "textures", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["materials"]["uniforms"] = function(materialName, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("materials", "uniforms", [ materialName ]), callback);
};

WayfinderAPI["materials"]["uniforms"].url = function(materialName) {
    return WayfinderAPI.getURL("materials", "uniforms", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["models"]["all"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("models", "all", []), callback);
};

WayfinderAPI["models"]["all"].url = function() {
    return WayfinderAPI.getURL("models", "all", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["models"]["allmeshes"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("models", "allmeshes", []), callback);
};

WayfinderAPI["models"]["allmeshes"].url = function() {
    return WayfinderAPI.getURL("models", "allmeshes", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["models"]["get"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("models", "get", []), callback);
};

WayfinderAPI["models"]["get"].url = function() {
    return WayfinderAPI.getURL("models", "get", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["models"]["instances"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("models", "instances", []), callback);
};

WayfinderAPI["models"]["instances"].url = function() {
    return WayfinderAPI.getURL("models", "instances", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["models"]["json"] = function(model_id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("models", "json", [ model_id ]), callback);
};

WayfinderAPI["models"]["json"].url = function(model_id) {
    return WayfinderAPI.getURL("models", "json", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["models"]["meshes"] = function(model_id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("models", "meshes", [ model_id ]), callback);
};

WayfinderAPI["models"]["meshes"].url = function(model_id) {
    return WayfinderAPI.getURL("models", "meshes", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["models"]["meshesbyfloor"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("models", "meshesbyfloor", []), callback);
};

WayfinderAPI["models"]["meshesbyfloor"].url = function() {
    return WayfinderAPI.getURL("models", "meshesbyfloor", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["models"]["model"] = function(model_id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("models", "model", [ model_id ]), callback);
};

WayfinderAPI["models"]["model"].url = function(model_id) {
    return WayfinderAPI.getURL("models", "model", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["navigation"]["allAttributes"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("navigation", "allAttributes", []), callback);
};

WayfinderAPI["navigation"]["allAttributes"].url = function() {
    return WayfinderAPI.getURL("navigation", "allAttributes", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["navigation"]["attributes"] = function(id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("navigation", "attributes", [ id ]), callback);
};

WayfinderAPI["navigation"]["attributes"].url = function(id) {
    return WayfinderAPI.getURL("navigation", "attributes", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["navigation"]["edges"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("navigation", "edges", []), callback);
};

WayfinderAPI["navigation"]["edges"].url = function() {
    return WayfinderAPI.getURL("navigation", "edges", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["navigation"]["node"] = function(id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("navigation", "node", [ id ]), callback);
};

WayfinderAPI["navigation"]["node"].url = function(id) {
    return WayfinderAPI.getURL("navigation", "node", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["navigation"]["nodes"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("navigation", "nodes", []), callback);
};

WayfinderAPI["navigation"]["nodes"].url = function() {
    return WayfinderAPI.getURL("navigation", "nodes", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["navigation"]["nodesbytype"] = function(type, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("navigation", "nodesbytype", [ type ]), callback);
};

WayfinderAPI["navigation"]["nodesbytype"].url = function(type) {
    return WayfinderAPI.getURL("navigation", "nodesbytype", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["poisettings"]["get"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("poisettings", "get", []), callback);
};

WayfinderAPI["poisettings"]["get"].url = function() {
    return WayfinderAPI.getURL("poisettings", "get", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["poisettings"]["getAllPOISettings"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("poisettings", "getAllPOISettings", []), callback);
};

WayfinderAPI["poisettings"]["getAllPOISettings"].url = function() {
    return WayfinderAPI.getURL("poisettings", "getAllPOISettings", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["poisettings"]["getText"] = function(key, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("poisettings", "getText", [ key ]), callback);
};

WayfinderAPI["poisettings"]["getText"].url = function(key) {
    return WayfinderAPI.getURL("poisettings", "getText", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["poisettings"]["getTexts"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("poisettings", "getTexts", []), callback);
};

WayfinderAPI["poisettings"]["getTexts"].url = function() {
    return WayfinderAPI.getURL("poisettings", "getTexts", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["poisettings"]["map"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("poisettings", "map", []), callback);
};

WayfinderAPI["poisettings"]["map"].url = function() {
    return WayfinderAPI.getURL("poisettings", "map", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["poisettings"]["setting"] = function(key, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("poisettings", "setting", [ key ]), callback);
};

WayfinderAPI["poisettings"]["setting"].url = function(key) {
    return WayfinderAPI.getURL("poisettings", "setting", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["settings"]["get"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("settings", "get", []), callback);
};

WayfinderAPI["settings"]["get"].url = function() {
    return WayfinderAPI.getURL("settings", "get", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["settings"]["getText"] = function(key, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("settings", "getText", [ key ]), callback);
};

WayfinderAPI["settings"]["getText"].url = function(key) {
    return WayfinderAPI.getURL("settings", "getText", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["settings"]["getTexts"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("settings", "getTexts", []), callback);
};

WayfinderAPI["settings"]["getTexts"].url = function() {
    return WayfinderAPI.getURL("settings", "getTexts", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["settings"]["map"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("settings", "map", []), callback);
};

WayfinderAPI["settings"]["map"].url = function() {
    return WayfinderAPI.getURL("settings", "map", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["settings"]["setting"] = function(key, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("settings", "setting", [ key ]), callback);
};

WayfinderAPI["settings"]["setting"].url = function(key) {
    return WayfinderAPI.getURL("settings", "setting", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["statistics"]["click"] = function(data, session_id, type, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("statistics", "click", [ data, session_id, type ]), callback);
};

WayfinderAPI["statistics"]["click"].url = function(data, session_id, type) {
    return WayfinderAPI.getURL("statistics", "click", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["statistics"]["device"] = function(width, height, kiosk, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("statistics", "device", [ width, height, kiosk ]), callback);
};

WayfinderAPI["statistics"]["device"].url = function(width, height, kiosk) {
    return WayfinderAPI.getURL("statistics", "device", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["statistics"]["endSession"] = function(session_id, language_id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("statistics", "endSession", [ session_id, language_id ]), callback);
};

WayfinderAPI["statistics"]["endSession"].url = function(session_id, language_id) {
    return WayfinderAPI.getURL("statistics", "endSession", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["statistics"]["search"] = function(data, session_id, type, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("statistics", "search", [ data, session_id, type ]), callback);
};

WayfinderAPI["statistics"]["search"].url = function(data, session_id, type) {
    return WayfinderAPI.getURL("statistics", "search", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["statistics"]["startSession"] = function(language_id, kiosk, application, layout, device_id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("statistics", "startSession", [ language_id, kiosk, application, layout, device_id ]), callback);
};

WayfinderAPI["statistics"]["startSession"].url = function(language_id, kiosk, application, layout, device_id) {
    return WayfinderAPI.getURL("statistics", "startSession", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["templates"]["css"] = function(template_id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("templates", "css", [ template_id ]), callback);
};

WayfinderAPI["templates"]["css"].url = function(template_id) {
    return WayfinderAPI.getURL("templates", "css", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["textures"]["count"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("textures", "count", []), callback);
};

WayfinderAPI["textures"]["count"].url = function() {
    return WayfinderAPI.getURL("textures", "count", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["textures"]["map"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("textures", "map", []), callback);
};

WayfinderAPI["textures"]["map"].url = function() {
    return WayfinderAPI.getURL("textures", "map", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["textures"]["mipmap"] = function(level, name, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("textures", "mipmap", [ level, name ]), callback);
};

WayfinderAPI["textures"]["mipmap"].url = function(level, name) {
    return WayfinderAPI.getURL("textures", "mipmap", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["textures"]["names"] = function(callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("textures", "names", []), callback);
};

WayfinderAPI["textures"]["names"].url = function() {
    return WayfinderAPI.getURL("textures", "names", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["textures"]["texture"] = function(name, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("textures", "texture", [ name ]), callback);
};

WayfinderAPI["textures"]["texture"].url = function(name) {
    return WayfinderAPI.getURL("textures", "texture", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["textures"]["texturebyid"] = function(texture_id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("textures", "texturebyid", [ texture_id ]), callback);
};

WayfinderAPI["textures"]["texturebyid"].url = function(texture_id) {
    return WayfinderAPI.getURL("textures", "texturebyid", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["textures"]["thumbnail"] = function(name, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("textures", "thumbnail", [ name ]), callback);
};

WayfinderAPI["textures"]["thumbnail"].url = function(name) {
    return WayfinderAPI.getURL("textures", "thumbnail", Array.prototype.slice.call(arguments, 0));
};

WayfinderAPI["textures"]["thumbnailbyid"] = function(texture_id, callback) {
    WayfinderAPI.getJSON(WayfinderAPI.getURL("textures", "thumbnailbyid", [ texture_id ]), callback);
};

WayfinderAPI["textures"]["thumbnailbyid"].url = function(texture_id) {
    return WayfinderAPI.getURL("textures", "thumbnailbyid", Array.prototype.slice.call(arguments, 0));
};

var Wayfinder = Class.extend({
    init: function(options, factory) {
        if (!options || !(options instanceof WayfinderOptions)) options = new WayfinderOptions();
        if (!factory) factory = new WayfinderFactory(this);
        this.factory = factory;
        this.setOptions(options);
        this.settings = new Settings();
        this.statistics = new WFStatistics(this);
        this.firstFinishedLoading = false;
        this.debugLog = false;
        this.kiosk = false;
        if (options.debugLog && DebugLog && typeof DebugLog === "DebugLog") {
            this.debugLog = new DebugLog(options.debugLog);
        }
        Logistics.onStageProgress(ClassCallback(this, this.onStageProgress));
        Logistics.onProgress(ClassCallback(this, this.onProgress));
        this.languages = {};
        this.pois = {};
        this.poisArray = [];
        this.poiGroups = {};
        this.nodes = {};
        this.edges = {};
        this.attributes = {};
        this.poisettings = new Settings();
        this.poiAdvertisements = {};
        this.advertisements = {};
        this.translator = new Translator(this.options.language, {});
        this.building = null;
        this.firstLanguageChange = true;
        this.search = new WayfinderSearch(this);
        this.accessibility = "";
    },
    cbOnPOIClick: function(poi) {},
    cbOnDataLoaded: function() {},
    cbOnProgress: function(percentage) {},
    cbOnStageProgress: function(stage, percentage) {},
    cbOnLanguageChange: function(language) {},
    cbOnBeforeFloorChange: function(floor) {},
    cbOnFloorChange: function(floor) {},
    cbOnZoomChange: function(percentage) {},
    cbOnPathStep: function(steps, i) {},
    cbOnPathFinished: function(path) {},
    cbOnTouch: function(action, value) {},
    cbOnMapUpdate: function() {},
    cbOnMapReady: function() {},
    finishedLoading: function(argument) {
        if (!this.firstFinishedLoading) {
            this.firstFinishedLoading = true;
            this.onDataLoaded();
        }
    },
    setOptions: function(options) {
        this.options = options;
        this.options.project = this.readProjectName();
        this.options.loadFromURL();
    },
    setStyle: function(template_id) {
        $("head").append('<link rel="stylesheet" type="text/css" href="{0}">'.format(WayfinderAPI.templates.css.url(template_id)));
    },
    open: function(project) {
        if (typeof project !== "undefined") {
            this.options.project = project;
        }
        WayfinderAPI.open(this.options.project);
        this.startLoading();
        log("Open", this.options.project);
    },
    readProjectName: function() {
        var path = document.location.pathname;
        var folders = path.split("/");
        for (var i = 0; i < folders.length; i++) {
            if (folders[i] == "projects") {
                if (folders.length > i + 1) {
                    return folders[i + 1];
                }
            }
        }
        return this.options.project;
    },
    getLayout: function() {
        var path = document.location.pathname;
        var folders = path.split("/");
        for (var i = 0; i < folders.length; i++) {
            if (folders[i] == "projects") {
                if (folders.length > i + 2) {
                    return folders[i + 2];
                }
            }
        }
        return "default";
    },
    log: function() {
        if (this.debugLog) {
            this.debugLog.logArray(this.log.arguments);
        }
    },
    getProject: function() {
        return this.options.project;
    },
    getAPILocation: function() {
        if (WayfinderAPI && WayfinderAPI.LOCATION) {
            return WayfinderAPI.LOCATION;
        } else {
            return this.options.apiLocation;
        }
    },
    setKiosk: function(node_id) {
        this.options.kiosk = node_id;
    },
    getKiosk: function() {
        return this.options.kiosk;
    },
    getKioskNode: function() {
        if (this.options.kiosk && this.options.kiosk in this.nodes) return this.nodes[this.options.kiosk];
        return false;
    },
    showPath: function(endNode, poi) {},
    showKiosk: function() {},
    showFloor: function(floor, callback) {
        if (this.cbOnFloorChange && typeof this.cbOnFloorChange === "function") {
            this.cbOnFloorChange(floor);
        }
    },
    getLanguage: function() {
        return this.translator.getLanguage();
    },
    setLanguage: function(language) {
        this.translator.translate(language);
        if (typeof this.cbOnLanguageChange === "function") {
            this.cbOnLanguageChange(language);
        }
    },
    startLoading: function() {
        Logistics.getJSON(WayfinderAPI.getURL("settings", "get", []), null, ClassCallback(this, this.onSettingsLoaded), {
            stage: "settings"
        });
        Logistics.getJSON(WayfinderAPI.getURL("poisettings", "getAllPOISettings", []), null, ClassCallback(this, this.onPOISettingsLoaded), {
            stage: "settings"
        });
        Logistics.getJSON(WayfinderAPI.getURL("languages", "get", []), null, ClassCallback(this, this.onLanguagesLoaded), {
            stage: "settings"
        });
    },
    loadPOIIcons: function(data) {
        if (this.pois) {
            var dt = null;
            for (var i in this.pois) {
                if (this.pois[i].image_id && this.pois[i].image_id !== 0 && this.pois[i].alwaysVisible) {
                    dt = Logistics.getImage(WayfinderAPI.getURL("images", "get", [ this.pois[i].image_id ]), null, ClassCallback(this.pois[i], this.pois[i].setIcon), {
                        stage: "locations"
                    });
                }
            }
        }
    },
    loadSecondaryResources: function() {
        var scope = this;
        function load() {
            scope.loadHiddenPOIIcons();
        }
        setTimeout(load, 1e3);
    },
    loadHiddenPOIIcons: function(data) {
        if (this.pois) {
            for (var i in this.pois) {
                if (this.pois[i].image_id && this.pois[i].image_id !== 0 && !this.pois[i].alwaysVisible) {
                    Logistics.getImage(WayfinderAPI.getURL("images", "thumbnail", [ this.pois[i].image_id ]), ClassCallback(this.pois[i], this.pois[i].setIcon));
                }
            }
        }
    },
    onAdvertisementsLoaded: function(response) {
        this.advertisements = response.data;
    },
    onSettingsLoaded: function(dt) {
        if (!dt["data"]) return;
        this.settings.data = dt["data"];
        this.building = this.factory.createBuilding(this.settings.data);
        if (this.settings.data["language.default"]) {
            this.options.language = this.settings.data["language.default"];
            this.setLanguage(this.options.language);
        }
        if (this.settings.data["kiosk.default"]) {
            this.setKiosk(this.settings.getInt("kiosk.default", 0));
            log("setKiosk", this.options.kiosk);
        }
        this.options.loadFromURL();
    },
    onPOISettingsLoaded: function(dt) {
        if (!dt["data"]) return;
        this.poisettings.data = dt["data"];
        this.options.loadFromURL();
    },
    onLanguagesLoaded: function(data) {
        if (!data["data"]) return;
        var languagesData = data["data"];
        for (var languageName in languagesData) {
            this.languages[languageName] = new Language(languagesData[languageName], languagesData);
            if (languageName.toLowerCase() == this.options.language.toLowerCase()) {
                this.translator.language = languageName;
            }
        }
        this.translator.translate();
        Logistics.getJSON(WayfinderAPI.getURL("guitranslations", "get", []), null, ClassCallback(this, this.createTranslations), {
            stage: "settings"
        });
        Logistics.getJSON(WayfinderAPI.getURL("building", "levels", []), null, ClassCallback(this, this.onFloorsLoaded), {
            stage: "settings"
        });
    },
    onFloorsLoaded: function(data) {
        var floors = data["data"];
        this.factory.createFloors(floors);
        Logistics.getMultiple({
            nodes: {
                url: WayfinderAPI.getURL("navigation", "nodes", []),
                type: "json"
            },
            attributes: {
                url: WayfinderAPI.getURL("navigation", "allAttributes", []),
                type: "json"
            },
            pois: {
                url: WayfinderAPI.getURL("locations", "get", []),
                type: "json"
            },
            floor_pois: {
                url: WayfinderAPI.getURL("locations", "byfloor", []),
                type: "json"
            },
            edges: {
                url: WayfinderAPI.getURL("navigation", "edges", []),
                type: "json"
            }
        }, ClassCallback(this, this.onPOIsLoaded), {
            stage: "settings"
        });
    },
    onPOIsLoaded: function(data) {
        var nodes = data["nodes"]["data"];
        var attributes = data["attributes"];
        var pois = data["pois"]["data"];
        var floor_pois = data["floor_pois"]["data"];
        var edges = data["edges"]["data"];
        Logistics.getMultiple({
            groups: {
                url: WayfinderAPI.getURL("locationgroups", "get", []),
                type: "json"
            },
            pois_in_groups: {
                url: WayfinderAPI.getURL("locations", "bygroup", []),
                type: "json"
            },
            tags: {
                url: WayfinderAPI.getURL("locations", "tags", []),
                type: "json"
            }
        }, ClassCallback(this, this.onTextDataLoaded), {
            stage: "locations"
        });
        Logistics.getJSON(WayfinderAPI.advertisements.all.url(), ClassCallback(this, this.onAdvertisementsLoaded));
        this.factory.createNodes(nodes);
        this.factory.createAttributes(attributes);
        this.factory.createPOIs(pois);
        this.factory.createEdges(edges);
        this.factory.addPOIsToFloor(floor_pois);
    },
    onTextDataLoaded: function(data) {
        this.loadPOIIcons();
        var tags = data["tags"]["data"];
        var groups = data["groups"]["data"];
        var pois_in_groups = data["pois_in_groups"]["data"];
        this.factory.createGroups(groups, pois_in_groups);
        this.factory.createTags(tags);
        this.factory.filterPOIs(this.options.filterPOIs.trim().split(","));
    },
    onDataLoaded: function() {
        this.setKiosk(this.options.kiosk);
        this.statistics.start();
        this.loadSecondaryResources();
        this.cbOnProgress(100);
        this.cbOnDataLoaded();
    },
    createTranslations: function(translations) {
        if (this.translator && translations) {
            this.translator.setTranslations(translations["data"]);
        }
    },
    onProgress: function(progress) {
        if (typeof this.cbOnProgress === "function") this.cbOnProgress(progress);
    },
    onStageProgress: function(stage, progress) {
        if (typeof this.cbOnStageProgress === "function") this.cbOnStageProgress(stage, progress);
    },
    resize: function() {
        var map = document.getElementById(this.options.map);
        var style = window.getComputedStyle(map, null);
        var width = parseInt(style.width);
        var height = parseInt(style.height);
        map.setAttribute("width", width + "px");
        map.setAttribute("height", height + "px");
    },
    onPOIClick: function(poi, position, event) {
        if (typeof this.cbOnPOIClick === "function") this.cbOnPOIClick(poi);
    },
    onZoomChange: function(zoom) {
        if (typeof this.cbOnZoomChange === "function") this.cbOnZoomChange(zoom);
    },
    setZoom: function(percentage) {},
    zoomIn: function() {},
    zoomOut: function() {},
    pathToText: function(path) {},
    textPathSimplification: function(path) {
        var simplePath = {};
        var shortDist = 30;
        var doNotUse = "generic portal kiosk landmark";
        simplePath.distance = 0;
        simplePath.steps = [];
        function getTurn(angle) {
            if (angle >= 45 && angle < 135) {
                return "right";
            } else if (angle >= 135 && angle < 225) {
                return "around";
            } else if (angle >= 225 && angle < 315) {
                return "left";
            }
            return false;
        }
        if (path && path.length > 0) {
            var turn = false;
            var turn2 = false;
            var startNode = path[path.length - 1].bNode;
            var lastDistance = 0;
            for (var i = 0; i < path.length; i++) {
                simplePath.distance += path[i].distance;
                lastDistance += path[i].distance;
                turn = getTurn(path[i].angle);
                if (path[i].type && path[i].type == "landmark") {
                    if (path[i].bNode && path[i].bNode.pois && path[i].bNode.pois.length > 0) simplePath.steps.push({
                        landmark: path[i].bNode.pois,
                        endNode: path[i].bNode,
                        startNode: startNode,
                        "in": lastDistance
                    }); else if (path[i].aNode && path[i].aNode.pois && path[i].aNode.pois.length > 0) simplePath.steps.push({
                        landmark: path[i].aNode.pois,
                        endNode: path[i].aNode,
                        startNode: startNode,
                        "in": lastDistance
                    });
                }
                if (turn) {
                    if (!(typeof path[i].type == "string" && doNotUse.indexOf(path[i].type) == -1)) {
                        if (lastDistance > 0) simplePath.steps.push({
                            walk: lastDistance / 100,
                            endNode: path[i].bNode,
                            startNode: startNode
                        });
                        simplePath.steps.push({
                            turn: turn,
                            endNode: path[i].bNode,
                            startNode: startNode,
                            "in": lastDistance
                        });
                    }
                    startNode = path[i].bNode;
                    lastDistance = 0;
                }
                if (path[i].type && doNotUse.indexOf(path[i].type) == -1) {
                    if (i > 0 && i < path.length - 1 && path[i].type !== path[i + 1].type) {
                        if (lastDistance > 0) {
                            simplePath.steps.push({
                                walk: lastDistanc / 100,
                                endNode: path[i].bNode,
                                startNode: startNode
                            });
                        }
                        simplePath.steps.push({
                            use: path[i].type,
                            endNode: path[i].bNode,
                            startNode: startNode,
                            "in": lastDistance
                        });
                        startNode = path[i].bNode;
                    }
                    lastDistance = 0;
                }
                if (path[i].go_to_floor) {
                    if (lastDistance > 0) {
                        simplePath.steps({
                            walk: lastDistance / 100,
                            endNode: path[i].bNode,
                            startNode: startNode
                        });
                    }
                    lastDistance = 0;
                    simplePath.steps.push({
                        go_to_floor: path[i].go_to_floor,
                        endNode: path[i].bNode,
                        startNode: startNode
                    });
                    startNode = path[i].bNode;
                }
            }
            if (lastDistance > 0) {
                simplePath.steps.push({
                    walk: lastDistance / 100,
                    endNode: path[path.length - 1].bNode,
                    startNode: startNode
                });
            }
        }
        return simplePath;
    },
    getPOIWithExternalId: function(id) {
        for (var i in this.pois) {
            if (this.pois[i].room_id == id) {
                return this.pois[i];
            }
        }
        return false;
    },
    getNearestPOI: function(source, pois) {},
    restoreDefaultState: function() {
        if (this.options.language) {
            this.setLanguage(this.options.language);
        }
        this.clearHighlights();
        this.showKiosk();
    },
    showScreensaver: function() {},
    hideScreensaver: function() {},
    setHighlights: function(pois) {},
    clearHighlights: function() {},
    onSetLanguage: function(language) {},
    getLanguages: function() {
        return this.languages;
    },
    getPOIs: function() {
        return this.pois;
    },
    getPOIsArray: function() {
        return this.poisArray;
    },
    getPOIGroups: function() {
        return this.poiGroups;
    },
    getNodes: function() {
        return this.nodes;
    },
    getEdges: function() {
        return this.edges;
    },
    clearPath: function() {},
    zoomOnPathSegment: function(startNode, endNode) {}
});

var WayfinderFactory = Class.extend({
    init: function(wayfinder) {
        this.wayfinder = wayfinder;
    },
    createFloors: function(floors) {
        if (floors && this.wayfinder.building) {
            for (var i in floors) {
                this.wayfinder.building.addFloor(this.createFloor(floors[i], this.wayfinder.languages));
            }
        }
    },
    createNodes: function(nodes) {
        if (nodes) {
            var defaultKiosk = this.wayfinder.settings.getInt("kiosk.default", 0);
            var floors = this.wayfinder.building.getFloors();
            for (var i = 0; i < nodes.length; i++) {
                var node = this.createNode(nodes[i]);
                if (!node) continue;
                this.wayfinder.nodes[nodes[i].id] = node;
                if (node.floor_id in floors) {
                    floors[node.floor_id].addNode(node);
                }
                if (nodes[i].id == defaultKiosk) {
                    this.wayfinder.kiosk = node;
                }
            }
        }
    },
    createAttributes: function(attributes) {
        if (attributes) {
            this.wayfinder.attributes = attributes;
        }
    },
    createPOIs: function(pois) {
        for (var i = 0; i < pois.length; i++) {
            var poi = this.createPOI(pois[i], this.wayfinder.languages);
            this.wayfinder.pois[pois[i].id] = poi;
            this.wayfinder.poisArray.push(poi);
            if (poi.node_id in this.wayfinder.nodes) {
                this.wayfinder.nodes[poi.node_id].addPOI(poi);
            }
            if (this.wayfinder.poisettings && this.wayfinder.poisettings.data && this.wayfinder.poisettings["data"][poi.id]) {
                poi.settings.data = this.wayfinder.poisettings["data"][poi.id];
            }
        }
    },
    createTags: function(tags) {
        if (tags) {
            for (var t in tags) {
                var tag = tags[t];
                var poi = this.wayfinder.pois[tag["poi_id"]];
                if (poi) {
                    poi.setTags(tag["tags"]);
                }
            }
        }
    },
    filterPOIs: function(tags) {
        if (tags && tags.length > 0) {
            var poi;
            var tag = "";
            for (var j in tags) {
                tag = tags[j].trim();
                if (tag && tag !== "") {
                    for (var i in this.wayfinder.pois) {
                        poi = this.wayfinder.pois[i];
                        poi.setShowInMenu(false);
                        if (poi.getTags().indexOf(tag) > -1) {
                            poi.setShowInMenu(true);
                            continue;
                        }
                    }
                }
            }
        }
    },
    createGroups: function(poiGroupsData, poisInGroupsData) {
        if (poisInGroupsData && poiGroupsData) {
            var poiGroup, poiGroupData;
            for (poiGroupData in poiGroupsData) {
                poiGroup = this.createPOIGroup(poiGroupsData[poiGroupData], this.wayfinder.languages);
                this.wayfinder.poiGroups[poiGroup.getID()] = poiGroup;
            }
            for (var poiGroupID in poisInGroupsData) {
                poiGroupData = poisInGroupsData[poiGroupID];
                for (var poiIndex in poiGroupData) {
                    var poi = this.wayfinder.pois[poiGroupData[poiIndex]];
                    poiGroup = this.wayfinder.poiGroups[poiGroupID];
                    if (poi && poiGroup) {
                        poiGroup.addPOI(poi);
                        poi.addGroup(poiGroup);
                    }
                }
            }
        }
    },
    createAdvertisements: function(poiAdsData) {
        if (poiAdsData) {
            for (var poiAdIndex in poiAdsData) {
                var poiAdData = poiAdsData[poiAdIndex];
                var poi = this.wayfinder.pois[poiAdData["poi_id"]];
                if (poi) {
                    var poiAd = this.createPOIAdvertisement(poi, poiAdData, this.wayfinder.languages);
                    this.wayfinder.poiAdvertisements[poiAdData["id"]] = poiAd;
                    poi.addAdvertisement(poiAd);
                }
            }
        }
    },
    addPOIsToFloor: function(floorPOIs) {
        for (var floor_id in floorPOIs) {
            var floors = this.wayfinder.building.getFloors();
            if (!(floor_id in floors)) continue;
            var floor = floors[floor_id];
            for (var i in floorPOIs[floor_id]) {
                if (!(floorPOIs[floor_id][i] in this.wayfinder.pois)) continue;
                floor.addPOI(this.wayfinder.pois[floorPOIs[floor_id][i]]);
            }
        }
    },
    createEdges: function(edges) {
        this.wayfinder.edges = edges;
    },
    createBuilding: function(data) {
        return new Building(data);
    },
    createFloor: function(floorData, languages) {
        return new Floor(floorData, languages);
    },
    createNode: function(data) {
        return new NavigationNode(data);
    },
    createPOI: function(data, languages) {
        return new POI(data, languages);
    },
    createPOIGroup: function(data, languages) {
        return new POIGroup(data, languages);
    },
    createPOIAdvertisement: function(poi, data, languages) {
        return new POIAdvertisement(poi, data, languages);
    }
});

var WayfinderOptions = Class.extend({
    init: function() {
        this.application = "wayfinder";
        this.map = "map";
        this.project = "demo";
        this.kiosk = false;
        this.debugLog = false;
        this.debugPOIs = false;
        this.debugTranslations = false;
        this.drawKioskIcon = true;
        this.apiLocation = "../../api/";
        this.language = "en";
        this.disablePathDrawing = false;
        this.searchScroreLimiter = 3;
        this.searchMinimumScrore = 10;
        this.filterPOIs = "";
        this.factory = new WayfinderFactory();
    },
    loadFromURL: function() {
        if (location.hash.length >= 2 && location.hash.indexOf("{") > -1) {
            var args = unescape(location.hash.substring(1)).split("#");
            if (args.length >= 1) {
                var options = JSON.parse(args[0]);
                for (var i in options) {
                    log("Overriding option: " + i + "=" + options[i]);
                    this[i] = options[i];
                    if (i === "kiosk") {
                        this["kiosk.default"] = options[i];
                    }
                }
            }
        }
    }
});

var DebugLog = Class.extend({
    init: function(enabled) {
        this.enabled = enabled;
        this.element = $("#log .content");
        this.shown = false;
        if (this.enabled) $("#log").show();
        $("#log .toggle").click(function() {
            $("#log .content").toggle();
        });
    },
    logArray: function(args) {
        var div = $("<div></div>");
        for (var i in args) {
            div.append(JSON.stringify(args[i]) + ", ");
        }
        this.element.prepend(div);
    }
});

var ArrayUtility = Class.extend({
    init: function(objectOrArray) {
        if (objectOrArray instanceof Object) {
            var object = objectOrArray;
            this.data = [];
            for (var i in object) {
                this.data.push(object[i]);
            }
        } else if (objectOrArray instanceof Array) {
            this.data = objectOrArray;
        } else throw "Argument objectOrArray must be an object or array";
    },
    get: function() {
        return this.data;
    },
    sort: function(callback) {
        var cb = function(a, b) {
            if (callback(a, b)) return 1;
            if (callback(b, a)) return -1;
            return 0;
        };
        this.data.sort(cb);
        return this.data;
    }
});

var Building = Class.extend({
    init: function(settings, languages) {
        this.name = settings["building.name"];
        this.address = settings["building.address"];
        this.link = new Translations(settings["building.link"]);
        this.description = new Translations(settings["building.description"]);
        this.logoID = settings["building.logo"];
        this.backgroundID = settings["building.background"];
        this.floors = {};
    },
    addFloor: function(floor) {
        this.floors[floor.id] = floor;
    },
    removeFloor: function(floor) {
        delete this.floors[floor.id];
    },
    getFloors: function() {
        return this.floors;
    },
    getSortedFloors: function() {
        var sortedFloors = new ArrayUtility(this.floors);
        return sortedFloors.sort(function(a, b) {
            return a.index < b.index;
        });
    }
});

var Settings = Class.extend({
    init: function() {
        this.data = {};
    },
    has: function(key) {
        return key in this.data;
    },
    get: function(key, defaultValue, item) {
        if (item && item.settings["data"] && item.settings["data"][key]) {
            return item.settings["data"][key]["value"];
        }
        if (key in this.data) return this.data[key];
        return defaultValue;
    },
    getInt: function(key, defaultValue, item) {
        return parseInt(this.get(key, defaultValue));
    },
    getFloat: function(key, defaultValue, item) {
        return parseFloat(this.get(key, defaultValue, item));
    },
    getColor: function(key, defaultValue, item) {
        return new Color().fromHex(this.get(key, defaultValue, item));
    },
    getBoolean: function(key, defaultValue, item) {
        return this.get(key, defaultValue, item) === true;
    },
    getModel: function(key, defaultValue, item) {
        var val = this.getInt(key, 0, item);
        return val === 0 ? defaultValue : val;
    },
    set: function(key, value) {
        this.data[key] = value;
    },
    override: function(local) {
        for (var i in local) {
            this.data[i] = local[i];
        }
    }
});

var NavigationNode = Class.extend({
    init: function(nodeData) {
        this.id = nodeData.id;
        this.floor_id = nodeData.level_id;
        this.type = nodeData.type;
        this.position = vec3.fromValues(-parseFloat(nodeData.x), parseFloat(nodeData.y), parseFloat(nodeData.z));
        this.rotation = vec3.fromValues(parseFloat(nodeData.rotation_x), parseFloat(nodeData.rotation_y), parseFloat(nodeData.rotation_z));
        this.floor = false;
        this.pois = [];
        this.weight = 0;
        if (nodeData.weight) this.weight = parseFloat(nodeData.weight);
        this.zoom = 0;
        if (nodeData.zoom) this.zoom = parseFloat(nodeData.zoom);
    },
    setFloor: function(floor) {
        if (floor instanceof Floor && floor.id == this.floor_id) this.floor = floor;
    },
    addPOI: function(poi) {
        if (poi instanceof POI && poi.node_id == this.id) {
            poi.setNode(this);
            this.pois.push(poi);
        }
    },
    getID: function() {
        return this.id;
    },
    getFloor: function() {
        return this.floor;
    },
    getPOIs: function() {
        return this.pois;
    }
});

var Floor = Class.extend({
    init: function(floorData, languages) {
        this.id = parseInt(floorData.id, 10);
        this.name_id = parseInt(floorData.name_id, 10);
        this.model_id = parseInt(floorData.model_id, 10);
        this.index = parseInt(floorData.index, 10);
        this.y = parseFloat(floorData.y, 10);
        this.lightmap_id = parseInt(floorData.lightmap_id, 10);
        this.showInMenu = parseInt(floorData.show_in_menu, 10) !== 0;
        this.names = new Translations();
        for (var language in languages) {
            this.names.set(language, floorData[language]);
        }
        this.pois = [];
        this.nodes = [];
    },
    getID: function() {
        return this.id;
    },
    getName: function(language) {
        return this.names.get(language);
    },
    getNames: function() {
        return this.names;
    },
    addPOI: function(poi) {
        if (poi instanceof POI) {
            poi.setFloor(this);
            this.pois.push(poi);
        }
    },
    addNode: function(node) {
        if (node instanceof NavigationNode && node.floor_id == this.id) {
            node.setFloor(this);
            this.nodes.push(node);
        }
    },
    getPOIs: function() {
        return this.pois;
    },
    getNodes: function() {
        return this.nodes;
    },
    getShowInMenu: function() {
        return this.showInMenu;
    }
});

var POI = Class.extend({
    init: function(poiData, languages) {
        this.id = parseInt(poiData.id);
        this.type = poiData.type;
        this.node_id = parseInt(poiData.node_id);
        this.mesh_id = parseInt(poiData.mesh_id);
        this.room_id = poiData.room_id;
        this.image_id = parseInt(poiData.image_id);
        this.icon = null;
        this.background_id = parseInt(poiData.background_id);
        this.background = null;
        this.showInMenu = parseInt(poiData.show_in_menu) != 0;
        this.alwaysVisible = parseInt(poiData.always_visible) != 0;
        this.settings = {};
        this.names = new Translations();
        this.descriptions = new Translations();
        this.hasName = false;
        for (var language in languages) {
            this.names.set(language, poiData["names_" + language]);
            this.descriptions.set(language, poiData["descriptions_" + language]);
            if (this.names.get(language).length > 0) this.hasName = true;
        }
        this.floor = false;
        this.node = false;
        this.groups = [];
        this.advertisements = [];
        this.groupNames = {};
        this.tags = "";
    },
    getID: function() {
        return this.id;
    },
    getName: function(language) {
        return this.names.get(language);
    },
    getNames: function() {
        return this.names;
    },
    getDescription: function(language) {
        return this.descriptions.get(language);
    },
    getShowInMenu: function() {
        return this.showInMenu && this.hasName;
    },
    setShowInMenu: function(value) {
        this.showInMenu = value;
    },
    setFloor: function(floor) {
        if (floor instanceof Floor) this.floor = floor;
    },
    getFloor: function() {
        return this.floor;
    },
    setNode: function(node) {
        if (node instanceof NavigationNode) this.node = node;
    },
    getNode: function() {
        return this.node;
    },
    addGroup: function(group) {
        this.groups.push(group);
    },
    getGroups: function() {
        return this.groups;
    },
    getGroupNames: function() {
        if (this.groupNames[language]) return this.groupNames[language];
        var result = {};
        for (var groupID in this.groups) {
            var translations = this.groups[groupID].getNames();
            for (var language in translations.getAll()) {
                if (!result[language]) result[language] = [];
                result[language].push(translations.get(language));
            }
        }
        this.groupNames[language] = result;
        return result;
    },
    addAdvertisement: function(advertisement) {
        this.advertisements.push(advertisement);
    },
    getAdvertisements: function() {
        return this.advertisements;
    },
    getTags: function() {
        return this.tags;
    },
    setTags: function(tag) {
        this.tags = tag;
    },
    setIcon: function(image) {
        this.icon = image;
    },
    getIcon: function() {
        return this.icon;
    },
    setBackground: function(image) {
        this.background = image;
    },
    getBackground: function() {
        return this.background;
    },
    getRoomId: function() {
        return this.room_id;
    },
    isAlwaysVisible: function() {
        return this.alwaysVisible;
    }
});

var POIAdvertisement = Class.extend({
    init: function(poi, adData, languages) {
        this.id = adData.id;
        this.image_id = adData.image_id;
        this.text1 = {};
        this.text2 = {};
        this.link = {};
        this.poi = poi;
        for (var language in languages) {
            this.link[language] = adData["link_" + language];
            if (adData["text1_" + language]) this.text1[language] = adData["text1_" + language]; else this.text1[language] = adData["menu_" + language];
            if (adData["text2_" + language]) this.text2[language] = adData["text2_" + language]; else this.text2[language] = adData["3d_" + language];
        }
    },
    getID: function() {
        return this.id;
    },
    getPOI: function() {
        return this.poi;
    },
    getText1: function(language) {
        if (language in this.text1) return this.text1[language];
        return false;
    },
    getText2: function(language) {
        if (language in this.text2) return this.text2[language];
        return false;
    },
    getLink: function(language) {
        if (language in this.link) return this.link[language];
        return false;
    }
});

var POIGroup = Class.extend({
    init: function(poiGroupData, languages) {
        this.id = poiGroupData.group_id;
        this.names = new Translations();
        this.imageID = poiGroupData.image_id;
        for (var language in languages) {
            this.names.set(language, poiGroupData[language]);
        }
        this.pois = [];
        this.showInMenu = poiGroupData.show_main;
        this.showInTopMenu = poiGroupData.show_top;
        this.color = new Color().fromHex(poiGroupData.color);
    },
    getID: function() {
        return this.id;
    },
    getNames: function() {
        return this.names;
    },
    getName: function(language) {
        return this.names.get(language);
    },
    getNames: function() {
        return this.names;
    },
    getShowInMenu: function() {
        return this.showInMenu != 0;
    },
    getShowInTopMenu: function() {
        return this.showInTopMenu != 0;
    },
    getImageID: function() {
        return this.imageID;
    },
    addPOI: function(poi) {
        this.pois.push(poi);
    },
    getPOIs: function() {
        return this.pois;
    },
    getColor: function() {
        return this.color;
    }
});

var Language = Class.extend({
    init: function(languageData) {
        this.name = languageData.name;
        this.id = languageData.id;
        this.nativeName = languageData["native"];
        this.textDirection = languageData.text_direction;
        this.flagImage = languageData.flag;
    },
    getName: function() {
        return this.name;
    },
    getID: function() {
        return this.id;
    },
    getNativeName: function() {
        return this.nativeName;
    },
    getTextDirection: function() {
        return this.text_direction;
    }
});

var Translator = Class.extend({
    init: function(language, translationMap) {
        this.language = language;
        this.translations = translationMap;
    },
    setTranslations: function(translationMap) {
        this.translations = translationMap;
    },
    setLanguage: function(language) {
        this.language = language;
    },
    getLanguage: function() {
        return this.language;
    },
    get: function(key, params) {
        if (this.translations && key && this.translations[key] && this.translations[key][this.language]) {
            var str = this.translations[key][this.language];
            if (params) {
                str = this.replaceValues(str, params);
            }
            return str;
        }
        return key;
    },
    translate: function(language) {
        var me = this;
        if (language) {
            this.language = language;
        }
        if (typeof $ !== "undefined") {
            $("[data-translation-element]").each(function(index, value) {
                me.translateElement($(this), $(this).attr("data-translation-element"));
            });
            $("[data-translation-attributes]").each(function(index, value) {
                var attributes = $(this).attr("data-translation-attributes").split(",");
                var key = "";
                for (var i in attributes) {
                    key = $(this).attr("data-translation-attribute-" + attributes[i]);
                    if (key) {
                        $(this).attr(attributes[i], me.get(key));
                    }
                }
            });
        }
    },
    setElement: function(element, key) {
        if (element && key) {
            element.attr("data-translation-element", key);
        }
    },
    setAttribute: function(element, attribute, key) {
        if (element && key && attribute) {
            var attr = [];
            if (element.attr("data-translation-attributes")) {
                attr = element.attr("data-translation-attributes").split(",");
            }
            attr.push(attribute);
            element.attr("data-translation-attributes", attr.join(","));
            element.attr("data-translation-attribute-" + attribute, key);
        }
    },
    translateElement: function(parent, key, params) {
        if (parent) {
            if (key && this.exists(key)) {
                var value = this.get(key, params);
                this.setElement(parent, key);
                parent.html(value);
            } else {
                parent.addClass("no-translation");
            }
        }
    },
    translateAttribute: function(parent, attribute, key, params) {
        if (parent && attribute && key) {
            var value = this.get(key, params);
            this.setAttribute(parent, attribute, key);
            parent.attr(attribute, value);
            if (!this.exists(key)) {
                parent.addClass("no-translation");
            }
        }
    },
    replaceValues: function(str, params) {
        if (str && params) {
            var count = 0;
            for (var i in params) {
                str = str.replace("%" + count++, params[i]);
            }
        }
        return str;
    },
    exists: function(key) {
        if (this.translations && key && this.translations[key] && this.translations[key][this.language]) return true; else return false;
    }
});

var Translations = Class.extend({
    init: function(translations) {
        if (translations) this.translations = translations; else this.translations = {};
    },
    set: function(language, translation) {
        this.translations[language] = translation;
    },
    get: function(language) {
        if (!this.translations[language]) return false;
        return this.translations[language];
    },
    setAll: function(translations) {
        this.translations = translations;
    },
    getAll: function() {
        return this.translations;
    },
    setTranslations: function(element, language) {
        var defaultAdded = false;
        if (element && language) {
            for (var l in this.translations) {
                element.attr("data-lang-" + l, this.translations[l]);
            }
            if (this.translations[language]) element.html(this.translations[language]); else element.html("no translation");
            element.attr("data-translated", true);
        }
    }
});

var TranslationsMap = Class.extend({
    init: function() {
        this.translations = {};
    },
    add: function(id, translations) {
        if (!(translations instanceof Translations)) throw "Only Translation instances can be added to translations map";
        this.translations[id] = translations;
    },
    get: function(id) {
        if (!this.translations[id]) return new Translations({
            english: "--missing--"
        });
        return this.translations[id];
    }
});

var WFStatistics = Class.extend({
    init: function(wayfinder) {
        this.wayfinder = wayfinder;
        this.session_id = 0;
        this.storageSupport = typeof window !== "undefined" && "localStorage" in window && window["localStorage"] !== null;
        this.storagePrefix = "wfstats_";
        this.device_id = 0;
        this.searchPhrase = "";
        this.checkStorage();
    },
    start: function() {
        var me = this;
        if (typeof screen !== "undefined") {
            WayfinderAPI.statistics.device(screen.width, screen.height, this.wayfinder.getKiosk(), function(data) {
                if (data) {
                    me.device_id = data["data"]["id"];
                    me.store("deviceId", data["data"]["id"]);
                    log("Device created", data);
                }
            });
        }
    },
    onSessionStart: function() {
        var me = this;
        var language = this.wayfinder.languages[this.wayfinder.getLanguage()];
        if (language && language.getID() && this.wayfinder.getKiosk()) {
            WayfinderAPI.statistics.startSession(language.getID(), this.wayfinder.getKiosk(), this.wayfinder.options.application, this.wayfinder.getLayout(), this.device_id, function(data) {
                try {
                    if (data) me.session_id = data["data"];
                } catch (e) {
                    log("Something went wrong sending startSession");
                }
            });
        }
    },
    onSessionEnd: function() {
        var scope = this;
        if (this.session_id) {
            var language = this.wayfinder.languages[this.wayfinder.getLanguage()];
            WayfinderAPI.statistics.endSession(this.session_id, language.getID(), function() {
                scope.session_id = 0;
                log("Session ended!");
            });
        }
    },
    onClick: function(location, type) {
        WayfinderAPI.statistics.click(location, this.session_id, type);
    },
    onLanguageChange: function(language) {},
    onSearch: function(searchstring, type) {
        WayfinderAPI.statistics.search(searchstring, this.session_id, type);
    },
    checkStorage: function() {
        if (this.storageSupport) {
            this.deviceId = localStorage.getItem(this.storagePrefix + "deviceId");
        }
    },
    getTime: function() {},
    store: function(key, value) {
        if (this.storageSupport) {
            localStorage[this.storagePrefix + key] = JSON.stringify(value);
        }
    },
    isOnline: function() {}
});

var WayfinderSearch = Class.extend({
    init: function(wayfinder) {
        this.wayfinder = wayfinder;
        this.searchParams = [];
        this.limit = 0;
        this.options = {
            maxSearchParams: 15,
            stringSearch: "relative",
            minimumScore: 1,
            splitKeywords: true,
            limit: Infinity,
            scoreLimit: 5
        };
        this.results = {};
        this.highScore = 0;
        this.scores = [];
        this.providers = {};
        this.setupProviders();
    },
    overrideOptions: function(options) {
        for (var i in options) {
            this.options[i] = options[i];
        }
    },
    setupProviders: function() {
        this.providers["poi"] = ClassCallback(this, this.POIsProvider);
    },
    clearResults: function() {
        this.result = {};
        this.highScore = 0;
        this.scores = [];
    },
    search: function(searchstring, _type, _options) {
        var type = "poi";
        this.clearResults();
        if (typeof _type == "string") type = _type;
        this.overrideOptions(_options);
        if (typeof searchstring !== "undefined" && searchstring !== "") {
            searchstring = searchstring.trim().toLowerCase();
            if (this.options.splitKeywords) this.searchParams = searchstring.split(" "); else {
                this.searchParams.push(searchstring);
            }
            if (this.searchParams.length > this.options.maxSearchParams) {
                this.searchParams.splice(this.options.maxSearchParams, this.searchParams.length - this.options.maxSearchParams);
            }
            var foundPOIs = [];
            var pois = this.wayfinder.pois;
            var score = 0;
            for (var p = 0; p < this.searchParams.length; p++) {
                if (this.providers[type] && typeof this.providers[type] == "function") {
                    this.providers[type](this.searchParams[p], this.wayfinder);
                }
            }
        }
        return this.order(this.results, this.highScore, this.scores);
    },
    pushResult: function(score, key, obj) {
        if (score >= this.options.minimumScore) {
            score = parseFloat(parseFloat(score).toFixed(2));
            if (!this.results[score]) this.results[score] = {};
            if (this.scores.indexOf(score) == -1) this.scores.push(score);
            this.results[score][key] = obj;
            this.highScore = Math.max(this.highScore, score);
        }
    },
    POIsProvider: function(keyword, wayfinder) {
        var language = this.wayfinder.getLanguage();
        var scope = this;
        function searchPOI(poi, param) {
            var _score = scope.searchString(poi.getName(language), param);
            if (poi.getDescription(language)) {
                _score = Math.max(_score, scope.searchString(poi.getDescription(language), param, 1));
            }
            if (poi.getTags()) {
                _score = Math.max(_score, scope.searchString(poi.getTags(), param, 1));
            }
            if (poi.getRoomId()) {
                _score = Math.max(_score, scope.searchString(poi.getRoomId(), param, 1));
            }
            return _score;
        }
        var pois = wayfinder.pois;
        for (var i in pois) {
            if (pois[i].getShowInMenu()) {
                score = searchPOI(pois[i], keyword);
                this.pushResult(score, pois[i].getID(), pois[i]);
            }
        }
    },
    findWithChar: function(character) {
        var foundPOIs = [];
        var language = this.wayfinder.getLanguage();
        foundPOIs[0] = [];
        var pois = this.sortPOIs(this.wayfinder.pois);
        for (var i in pois) {
            if (pois[i].getShowInMenu() && pois[i].getName(language).charAt(0) == character) {
                foundPOIs[0].push(pois[i]);
            }
        }
    },
    searchString: function(string, keyword, scoreDown) {
        if (typeof string == "string" && typeof keyword == "string") {
            string = string.toLowerCase().trim();
            keyword = keyword.toLowerCase().trim();
            switch (this.options.stringSearch) {
              case "strict":
                return this.searchStringStrict(string, keyword, scoreDown);
                break;

              case "relative":
                return this.searchStringRelatively(string, keyword, scoreDown);

              default:
                return this.searchStringStrict(string, keyword, scoreDown);
            }
        }
        return 0;
    },
    searchStringStrict: function(string, keyword, scoreDown) {
        if (!(string && keyword)) {
            return 0;
        }
        var pos = keyword.indexOf(string);
        if (pos > -1) {
            pos = pos / string.length * 100;
            var len = keyword.length / string.length * 100;
            return (pos + len) / 2;
        } else {
            return 0;
        }
    },
    searchStringRelatively: function(string, keyword, scoreDown) {
        if (!(string && keyword)) {
            return 0;
        }
        var tokens = keyword.split("");
        var strings = string.split(/,\s*|\s/);
        var tokenIndex = 0, stringIndex = 0, matchWithHighlights = "", matchedPositions = [], score = -1;
        lastFoundIndex = 0;
        if (!scoreDown) {
            scoreDown = 1;
        }
        function evaluate(matchedTokens, tokens, string) {
            if (string.length == matchedTokens.length) {
                return string.length * 11;
            }
            var value;
            var maxSubArrayLength = 0;
            var currentLength = 0;
            var holesTotalLength = 0;
            var subArrayCount = 0;
            var lastToken = -1;
            for (var i = 0; i < matchedTokens.length; i++) {
                if (lastToken == matchedTokens[i] - 1) {
                    currentLength++;
                    maxSubArrayLength = Math.max(maxSubArrayLength, currentLength);
                } else {
                    holesTotalLength += matchedTokens[i] - lastToken - 1;
                    currentLength = 1;
                }
                lastToken = matchedTokens[i];
            }
            return maxSubArrayLength * 10 - holesTotalLength * 7 - (tokens - matchedTokens.length) * 3 - (string.length - matchedTokens.length) * 3;
        }
        for (var i = 0; i < strings.length; i++) {
            string = strings[i];
            if (string.length > 1) {
                while (stringIndex < string.length) {
                    if (string[stringIndex] === tokens[tokenIndex]) {
                        lastFoundIndex = stringIndex;
                        matchedPositions.push(stringIndex);
                        tokenIndex++;
                        if (tokenIndex >= tokens.length) {
                            break;
                        }
                    } else if (stringIndex == string.length - 1 && tokenIndex < tokens.length) {
                        stringIndex = lastFoundIndex;
                        tokenIndex++;
                    }
                    stringIndex++;
                }
                score = Math.max(score, evaluate(matchedPositions, tokens.length, string));
                tokenIndex = 0;
                stringIndex = 0;
                matchedPositions.length = 0;
            }
        }
        score = Math.round(score * scoreDown);
        return score;
    },
    order: function(searchResult, highScore, scores) {
        if (!searchResult || searchResult.length == 0) return [];
        var sorted = [];
        var count = 0;
        var keys = scores.sort();
        var s;
        for (var i in keys) {
            s = keys[i];
            if (searchResult[s]) {
                for (var i in searchResult[s]) {
                    var obj = searchResult[s][i];
                    if (highScore / s > this.options.scoreLimit && count > 0) {
                        return sorted;
                    }
                    sorted.push(obj);
                    count++;
                    if (this.options.limit > 0 && count > this.options.limit) {
                        return sorted;
                    }
                }
            }
        }
        return sorted;
    }
});

var Layers = {
    Default: 1,
    POI: 2,
    MaskAll: 4294967295
};

var Pathfinder3D = function(_nodes, _edges) {
    var nodes = _nodes;
    var edges = _edges;
    var source = null;
    var dest = null;
    var dist = {};
    var previous = {};
    var Q = [];
    var searched = {};
    function getNodeWithSmallestDistance() {
        var min = Infinity;
        var index = 0;
        for (var i = 0; i < Q.length; i++) {
            if (dist[Q[i]] < min) {
                min = dist[Q[i]];
                index = i;
            }
        }
        return index;
    }
    function isSearched(node) {
        return node in searched;
    }
    function decreaseKey(node) {
        var index = 0;
        for (;index < Q.length; index++) {
            if (Q[index] == node) break;
        }
        for (var i = index - 1; i > 0; i--) {
            if (dist[Q[index]] < dist[Q[i]]) {
                var tmp = Q[i];
                Q[i] = Q[index];
                Q[index] = tmp;
                index = i;
            } else break;
        }
    }
    function distanceBetween(a, b) {
        var v0 = nodes[a].position;
        var v1 = nodes[b].position;
        return vec3.distance(v0, v1);
    }
    function rad2Deg(rad) {
        return rad * 180 / Math.PI;
    }
    this.find = function(_start, _end) {
        var i;
        source = _start;
        dest = _end;
        dist = {};
        previous = {};
        Q = [];
        searched = {};
        for (i in nodes) {
            dist[i] = Infinity;
            previous[i] = null;
            Q.push(i);
        }
        dist[source] = 0;
        while (Q.length > 0) {
            var nodeIndex = getNodeWithSmallestDistance();
            var u = Q[nodeIndex];
            if (dist[u] == Infinity) {
                break;
            }
            Q.splice(nodeIndex, 1);
            searched[u] = true;
            if (u == dest) {
                var path = [];
                u = dest;
                while (previous[u] !== null) {
                    path.push(u);
                    u = previous[u];
                }
                path.push(source);
                path.reverse();
                return path;
            }
            for (i = 0; i < edges[u].length; i++) {
                var v = edges[u][i];
                if (isSearched(v)) continue;
                var alt = dist[u] + distanceBetween(u, v) + parseFloat(nodes[v].weight);
                if (alt < dist[v] && (v in edges || v == dest)) {
                    dist[v] = alt;
                    previous[v] = u;
                    decreaseKey(v);
                }
            }
        }
        return [];
    };
    this.pathLength = function(path) {
        var length = -1;
        var last = null;
        for (var i in path) {
            if (last && i) {
                length += distanceBetween(last, path[i]);
                last = path[i];
            } else {
                last = path[i];
            }
        }
        return Math.round(length);
    };
    this.pathToText = function(path) {
        var p2t = [];
        var node = null;
        var step = null;
        var a, b = null;
        var angle = 0;
        if (path.length > 3) {
            step = {};
            if (nodes[path[0]] && nodes[path[0]].rotation) {
                var kioskAngle = nodes[path[0]].rotation[1];
                b = vec2.subtract(vec2.create(), vec2.fromValues(nodes[path[0]].position[0], nodes[path[0]].position[2]), vec2.fromValues(nodes[path[1]].position[0], nodes[path[1]].position[2]));
                b = vec2.normalize(b, b);
                angle = Math.round(Math.acos(vec2.dot(b, vec2.fromValues(0, 1))) * (180 / Math.PI));
                angle += kioskAngle;
                if (angle < 0) {
                    angle = 360 + angle;
                }
                p2t.push({
                    angle: angle,
                    distance: 0
                });
                angle = 0;
            }
            for (var i = 0; i < path.length; i++) {
                if (i < path.length - 1) {
                    step = {};
                    a = nodes[path[i]];
                    b = nodes[path[i + 1]];
                    step.distance = Math.round(distanceBetween(path[i], path[i + 1]));
                    if (i < path.length - 2) {
                        angle = calc2Dangle(nodes[path[i]].position, nodes[path[i + 1]].position, nodes[path[i + 2]].position);
                        step.angle = angle;
                    } else step.angle = 0;
                    if (nodes[path[i]].floor && nodes[path[i + 1]].floor && nodes[path[i]].floor.index != nodes[path[i + 1]].floor.index) {
                        step.go_to_floor = nodes[path[i + 1]].floor.id;
                    }
                    if (nodes[path[i]].type) step.type = nodes[path[i]].type;
                    step.aNode = a;
                    step.bNode = b;
                    p2t.push(step);
                }
            }
        }
        return p2t;
    };
    function calc2Dangle(first, second, third) {
        var a = vec2.subtract(vec2.create(), vec2.fromValues(first[0], first[2]), vec2.fromValues(second[0], second[2]));
        vec2.normalize(a, a);
        var b = vec2.subtract(vec2.create(), vec2.fromValues(second[0], second[2]), vec2.fromValues(third[0], third[2]));
        vec2.normalize(b, b);
        var angle = Math.round(rad2Deg(Math.atan2(a[0] * b[1] - a[1] * b[0], a[0] * b[0] + a[1] * b[1])));
        if (angle < 0) {
            angle = 360 + angle;
        }
        return angle;
    }
};

var Floor3D = Floor.extend({
    init: function(floorData, languages) {
        this._super(floorData, languages);
        this.node3D = false;
        this.mapMeshPathToID = {};
        this.mapIDToMeshPath = {};
    },
    setMeshNames: function(idNameMap) {
        for (var meshID in idNameMap) {
            this.mapMeshPathToID[idNameMap[meshID]] = parseInt(meshID);
            this.mapIDToMeshPath[parseInt(meshID)] = idNameMap[meshID];
        }
    },
    getMeshIDByPath: function(path) {
        if (path in this.mapMeshPathToID) return this.mapMeshPathToID[path];
        return 0;
    },
    getMeshPathByID: function(mesh_id) {
        if (mesh_id in this.mapIDToMeshPath) return this.mapIDToMeshPath[mesh_id];
        return false;
    },
    showYAH: function() {
        if (!this.node3D) return;
        var yah = this.node3D.find("YAHLocation/YAH");
        if (!yah) return;
        yah.onEachChild(function(subnode) {
            var renderer = subnode.getComponent(RendererComponent);
            if (renderer) renderer.enable();
            var billboard = subnode.getComponent(Billboard);
            if (billboard) billboard.enable();
        });
    },
    hideYAH: function() {
        if (!this.node3D) return;
        var yah = this.node3D.find("YAHLocation/YAH");
        if (!yah) return;
        yah.onEachChild(function(subnode) {
            var renderer = subnode.getComponent(RendererComponent);
            if (renderer) renderer.disable();
            var billboard = subnode.getComponent(Billboard);
            if (billboard) billboard.disable();
        });
    }
});

var POI3D = POI.extend({
    init: function(poiData, languages) {
        this._super(poiData, languages);
        this.object = false;
        this.visible = false;
        this.meshNode = false;
        this.submesh = false;
        this.canvasBoard = false;
    },
    show: function(duration) {
        if (!this.object) return;
        var n = this.getName("en");
        this.visible = true;
        this.object.onEachChild(function(subnode) {
            var renderer = subnode.getComponent(RendererComponent);
            if (renderer) renderer.enable();
            var billboard = subnode.getComponent(Billboard);
            if (billboard) billboard.enable();
            var distancescaling = subnode.getComponent(DistanceScalingComponent);
            if (distancescaling) distancescaling.enable();
        });
    },
    hide: function() {
        if (!this.object) return;
        this.visible = false;
        this.object.onEachChild(function(subnode) {
            var renderer = subnode.getComponent(RendererComponent);
            if (renderer) renderer.disable();
            var billboard = subnode.getComponent(Billboard);
            if (billboard) billboard.disable();
            var distancescaling = subnode.getComponent(DistanceScalingComponent);
            if (distancescaling) distancescaling.disable();
        });
    },
    highlight: function() {
        if (!this.object) return;
        this.object.onEachChildComponent(function(c) {
            if (c instanceof POIComponent) {
                c.startHighlight();
            }
        });
    },
    stopHighlight: function() {
        if (!this.object) return;
        this.object.onEachChildComponent(function(c) {
            if (c instanceof POIComponent) {
                c.stopHighlight();
            }
        });
    },
    dehighlight: function() {
        if (!this.object) return;
        this.object.onEachChildComponent(function(c) {
            if (c instanceof POIComponent) {
                c.dehighlight();
            }
        });
    },
    startAnimating: function() {
        if (!this.object) return;
        this.object.onEachChild(function(subnode) {
            var animation = subnode.getComponent(AnimationComponent);
            if (animation) animation.startAnimating();
        });
    },
    setAnimation: function(lowestPosition, higestPosition, animationSpeed) {
        if (!this.object) return;
        this.object.onEachChild(function(subnode) {
            var animation = subnode.getComponent(AnimationComponent);
            if (animation) {
                if (lowestPosition) animation.setLowestPosition(lowestPosition);
                if (higestPosition) animation.setHighestPosition(higestPosition);
                if (animationSpeed) animation.setAnimationSpeed(animationSpeed);
            }
        });
    },
    stopAnimating: function() {
        if (!this.object) return;
        this.object.onEachChild(function(subnode) {
            var animation = subnode.getComponent(AnimationComponent);
            if (animation) animation.finishAnimating();
        });
    },
    setNode: function(node) {
        this._super(node);
        if (this.object && this.node) mat4.fromTranslation(this.object.transform.relative, this.node.position);
    },
    createGeometry: function(engine, wayfinder) {
        var disableBillboard = wayfinder.settings.getBoolean("poi.3d.billboard", false, this);
        var billboardClickable = wayfinder.settings.getBoolean("poi.3d.billboard-clickable", true, this);
        var heightFromFloor = wayfinder.settings.getBoolean("poi.3d.height-from-floor-enabled", true, this);
        var heightFromFloor = wayfinder.settings.getBoolean("poi.3d.height-from-floor-enabled", true, this);
        var wrap = wayfinder.settings.getInt("poi.text.wrap", -1, this);
        var canvasBoard = wayfinder.settings.getBoolean("poi.3d.enable-canvas-board", false, this);
        if (this.mesh_id == 0) disableBillboard = false;
        var options = {
            billboardClickable: billboardClickable,
            heightFromFloor: heightFromFloor,
            disableBillboard: disableBillboard,
            wordWrap: wrap
        };
        if (canvasBoard) this.createCanvasBoard(engine, wayfinder, options); else if (this.image_id > 0) this.createIconGeometry(engine, wayfinder, options); else this.createNameGeometry(engine, wayfinder, options);
    },
    createIconGeometry: function(engine, wayfinder, options) {
        var imageDescriptor = new TextureDescriptor(this.image_id);
        imageDescriptor.loadAsImage = true;
        var material = new Material(engine.assetsManager.addShaderSource("Transparent"), {
            diffuse: new UniformColor(new Color())
        }, [ new Sampler("diffuse0", engine.assetsManager.texturesManager.addDescriptor(imageDescriptor)) ]);
        material.name = "POI_icon_" + this.getID();
        material.shader.requirements.transparent = true;
        var poiObject = Primitives.plane(1, 1, material);
        poiObject.name = "POI";
        var meshRendererComponent = poiObject.getComponent(MeshRendererComponent);
        meshRendererComponent.disable();
        meshRendererComponent.castShadows = false;
        meshRendererComponent.lightContribution = 0;
        if (options.billboardClickable) poiObject.addComponent(new MeshCollider());
        if (!options.disableBillboard) poiObject.addComponent(new Billboard(engine.scene.camera, true));
        poiObject.addComponent(new DistanceScalingComponent(engine.scene.camera));
        poiObject.addComponent(new AnimationComponent());
        var poiComponent = new POIComponent(this, wayfinder.getKioskNode());
        poiComponent.heightFromFloor = options.heightFromFloor;
        poiObject.addComponent(poiComponent);
        poiObject.layer = Layers.POI;
        this.object = new Node("POILocation");
        mat4.fromTranslation(this.object.transform.relative, this.node.position);
        this.object.addNode(poiObject);
    },
    createNameGeometry: function(engine, wayfinder, options) {
        var poiText = Primitives.text(this.getName(wayfinder.translator.getLanguage()), options.wordWrap);
        if (options.billboardClickable) poiText.addComponent(new MeshCollider());
        var poiComponent = new POIComponent(this, wayfinder.getKioskNode());
        poiComponent.heightFromFloor = options.heightFromFloor;
        poiText.addComponent(poiComponent);
        poiText.addComponent(new DistanceScalingComponent(engine.scene.camera));
        if (!options.disableBillboard) poiText.addComponent(new Billboard(engine.scene.camera, true));
        poiText.addComponent(new AnimationComponent());
        poiText.getComponent(TextRendererComponent).castShadows = false;
        poiText.getComponent(TextRendererComponent).lightContribution = 0;
        poiText.getComponent(TextRendererComponent).disable();
        poiText.layer = Layers.POI;
        var textComponent = poiText.getComponent(TextComponent);
        textComponent.family = "Tahoma, Geneva, sans-serif";
        textComponent.color.set(1, 1, 1, 1);
        textComponent.outlineColor.set(0, 0, 0, 1);
        this.object = new Node("POILocation");
        mat4.fromTranslation(this.object.transform.relative, this.node.position);
        this.object.addNode(poiText);
    },
    createCanvasBoard: function(engine, wayfinder, options) {
        this.canvasBoard = Primitives.canvasBoard(256, 256);
        this.canvasBoard.name = "POI";
        if (options.billboardClickable) this.canvasBoard.addComponent(new MeshCollider());
        var poiComponent = new POIComponent(this, wayfinder.getKioskNode());
        poiComponent.heightFromFloor = options.heightFromFloor;
        this.canvasBoard.addComponent(poiComponent);
        this.canvasBoard.addComponent(new DistanceScalingComponent(engine.scene.camera));
        if (!options.disableBillboard) this.canvasBoard.addComponent(new Billboard(engine.scene.camera, true));
        this.canvasBoard.addComponent(new AnimationComponent());
        this.canvasBoard.getComponent(CanvasBoardRendererComponent).castShadows = false;
        this.canvasBoard.getComponent(CanvasBoardRendererComponent).lightContribution = 0;
        this.canvasBoard.getComponent(CanvasBoardRendererComponent).disable();
        this.canvasBoard.layer = Layers.POI;
        this.object = new Node("POILocation");
        mat4.fromTranslation(this.object.transform.relative, this.node.position);
        this.object.addNode(this.canvasBoard);
    },
    getCanvasBoard: function() {
        if (this.canvasBoard) return this.canvasBoard.getComponent(CanvasBoardComponent); else return false;
    },
    createPOISignOnMeshGeometry: function(engine, wayfinder) {
        var poiText = Primitives.text(this.getName(wayfinder.translator.getLanguage()));
        var lineNode = new Node("DebugLine");
        var l = lineNode.addComponent(new LineRendererComponent(new Color(1, 0, 1, 1)));
        l.overlay = true;
        poiText.addComponent(new POIComponent(this, wayfinder.getKioskNode(), l));
        poiText.getComponent(TextRendererComponent).castShadows = false;
        poiText.getComponent(TextRendererComponent).lightContribution = 0;
        poiText.getComponent(TextRendererComponent).disable();
        var textComponent = poiText.getComponent(TextComponent);
        textComponent.family = "Tahoma, Geneva, sans-serif";
        textComponent.color.set(1, 1, 1, 1);
        textComponent.outlineColor.set(0, 0, 0, 1);
        this.object = new Node("POILocation");
        mat4.fromTranslation(this.object.transform.relative, this.node.position);
        this.object.addNode(poiText);
        mat4.fromTranslation(lineNode.transform.relative, vec3.fromValues(-this.node.position[0], 0, -this.node.position[2]));
        this.object.addNode(lineNode);
    },
    linkMesh: function() {
        if (this.mesh_id === 0 || !this.object || !this.floor || !this.floor.node3D) return;
        var poiController = this.object.find("/POIController").getComponent(POIController);
        var info = poiController.getMeshInfoByID(this.mesh_id);
        if (info === false) return;
        var parts = info.path.split("/");
        if (parts.length < 2) return;
        var meshName = parseInt(parts.pop().substring(5));
        var path = parts.join("/");
        if (meshName < 0) return;
        this.meshNode = info.floor.node3D.find(path);
        if (!this.meshNode) return;
        var meshComponent = this.meshNode.getComponent(MeshComponent);
        if (!meshComponent) return;
        if (meshName < meshComponent.mesh.submeshes.length) this.submesh = meshComponent.mesh.submeshes[meshName];
        if (this.setDistanceScalingByMesh) {
            this.object.onEachChildComponent(function(c) {
                if (c instanceof DistanceScalingComponent) {
                    c.maxScale = Math.min(meshComponent.mesh.boundingSphere.radius / 2, c.maxScale);
                }
            });
        }
    },
    applySettings: function(settings) {
        if (!this.object) return;
        var me = this;
        this.object.onEachChildComponent(function(c) {
            if (c instanceof POIComponent) {
                c.offsetY = settings.getFloat("poi.3d.offset", 0, me);
                c.width = settings.getFloat("poi.width", 1, me);
                c.height = settings.getFloat("poi.height", 1, me);
                c.highlightColors[0] = settings.getColor("poi.highlight.color1", "#ff0000ff", me).toVector();
                c.highlightColors[1] = settings.getColor("poi.highlight.color2", "#0000ffff", me).toVector();
                c.dehighlightColor = settings.getColor("poi.dehighlight.color", "#888888ff", me).toVector();
                c.highlightDuration = settings.getFloat("poi.highlight.duration", 5, me);
                c.highlightSpeed = settings.getFloat("poi.highlight.speed", 1, me);
                c.textSize = settings.getFloat("poi.text.size", 1, me);
                c.textColor = settings.getColor("poi.text.color", "#FFFFFF", me);
                c.outline = settings.getBoolean("poi.text.outline", false, me);
                c.outlineColor = settings.getColor("poi.text.outline-color", "#000000", me);
                c.outlineWidth = settings.getInt("poi.text.outline-width", 5, me);
                c.backgroundColor = settings.getColor("poi.text.background-color", "#00000000", me);
                c.disableBillboard = settings.getBoolean("poi.3d.billboard", false, me);
                c.billboardClickable = settings.getBoolean("poi.3d.billboard-clickable", me);
                if (settings.getBoolean("poi.3d.meshgroupcolor", false, me)) {
                    if (me.groups.length > 0 && me.groups[0]) {
                        var group = me.groups[0];
                        c.groupColor = group.getColor().toVector();
                    }
                }
            } else if (c instanceof DistanceScalingComponent) {
                c.doingIt = settings.getBoolean("poi.distancescaling.enabled", false, me);
                c.maxScale = settings.getFloat("poi.distancescaling.maxscale", 15, me);
                if (settings.getBoolean("poi.distancescaling.mesh", false, me)) {
                    me.setDistanceScalingByMesh = true;
                }
            } else if (c instanceof AnimationComponent) {
                if (!settings.getBoolean("path.animation.poi", false, me)) c.disable();
            }
        });
    }
});

var NavigationNode3D = NavigationNode.extend({
    init: function(data) {
        this._super(data);
        this.node3D = false;
    }
});

var WayfinderFactory3D = WayfinderFactory.extend({
    createFloor: function(floorData, languages) {
        return new Floor3D(floorData, languages);
    },
    createNode: function(data) {
        return new NavigationNode3D(data);
    },
    createPOI: function(data, languages) {
        return new POI3D(data, languages);
    }
});

var Wayfinder3D = Wayfinder.extend({
    init: function(options) {
        if (!options || !(options instanceof WayfinderOptions)) options = new WayfinderOptions3D();
        this._super(options, new WayfinderFactory3D(this));
        this.engine = false;
        this.logic = false;
        this.dataLoaded = false;
        this.engineLoaded = false;
        this.orbitController = false;
        this.poiController = false;
        this.pathComponent = false;
        this.materials = false;
        this.floorMeshes = {};
        this.screensaving = false;
        this.screensaver = false;
    },
    startLoading: function() {
        this._super();
        Logistics.getJSON(WayfinderAPI.getURL("materials", "get", []), null, ClassCallback(this, this.onMaterialsLoaded), {
            stage: "settings"
        });
    },
    cbOnWebGLContextFail: function() {
        return false;
    },
    onMaterialsLoaded: function(data) {
        if (data && data.data) {
            this.materials = data.data;
        }
    },
    showFloor: function(floor, callback, withoutPOIs) {
        this._super(floor, callback);
        if (this.logic) this.logic.showFloor(floor, callback, withoutPOIs);
    },
    showPath: function(endNode, poi, options, callback) {
        if (!(endNode instanceof NavigationNode)) return [];
        var source = this.options.kiosk;
        var destination = endNode.id;
        if (this.logic) {
            try {
                var path = this.logic.showPath(source, destination, poi, options, callback);
                return path;
            } catch (e) {
                log("Warning: Could not show path from " + source + " to " + destination);
            }
        }
        return [];
    },
    showKiosk: function(zoom) {
        this.setDefaultView(zoom);
    },
    setZoom: function(percentage) {
        if (this.orbitController) {
            this.orbitController.setZoom(1 - percentage);
        }
    },
    zoomIn: function() {
        if (this.orbitController) {
            this.orbitController.zoomIn();
        }
    },
    zoomOut: function() {
        if (this.orbitController) {
            this.orbitController.zoomOut();
        }
    },
    setDefaultView: function() {
        if (this.logic) this.logic.setDefaultView();
    },
    pathToText: function(path) {
        var pf = new Pathfinder3D(this.nodes, this.edges);
        var result = pf.pathToText(path);
        console.log("path", result);
        return this.textPathSimplification(result);
    },
    onPOIsLoaded: function(data) {
        this._super(data);
        var floors = this.building.getFloors();
        var meshes = {};
        for (var i in floors) {
            meshes["floor-meshes-" + floors[i].id] = {
                url: WayfinderAPI.getURL("models", "meshes", [ floors[i].model_id ]),
                type: "json"
            };
        }
        Logistics.getMultiple(meshes, ClassCallback(this, this.onMeshesLoaded), {
            stage: "models"
        });
    },
    onMeshesLoaded: function(data) {
        this.floorMeshes = data;
        this.setupEngine();
    },
    setupEngine: function() {
        var transparencyMode = "sorted";
        if (this.settings.getBoolean("camera.correct-transparency.enabled", false)) {
            transparencyMode = "blended";
            if (this.settings.getBoolean("camera.correct-transparency.stochastic-enabled", false)) transparencyMode = "stochastic";
        }
        var renderer = "forward";
        if (this.settings.getBoolean("camera.deferred-renderer.enabled", false)) {
            renderer = "auto";
        }
        this.engine = new Engine(this.options.map, {
            requestedFPS: 30,
            renderer: renderer,
            antialias: this.settings.getBoolean("camera.antialiasing.enabled", false),
            ssao: this.settings.getBoolean("camera.ssao.enabled", false),
            ssaoGDisplace: this.settings.getFloat("camera.ssao.gdisplace", .4),
            ssaoRadius: this.settings.getFloat("camera.ssao.radius", 2),
            ssaoLuminanceInfluence: this.settings.getFloat("camera.ssao.luminance-influence", .7),
            ssaoBrightness: this.settings.getFloat("camera.ssao.brightness", 1),
            transparencyMode: transparencyMode,
            softShadows: this.settings.getBoolean("camera.deferred-renderer.soft-shadows", false),
            assetsPath: this.options.assetsLocation,
            contextErrorCallback: ClassCallback(this, this.cbOnWebGLContextFail)
        });
        var map = document.getElementById(this.options.map);
        map.className += " no-select";
        map.addEventListener("selectstart", function(e) {}, false);
        window.addEventListener("resize", ClassCallback(this, this.resize));
        this.resize();
        var scope = this;
        this.engine.assetsManager.shadersManager.shadersPath = this.options.assetsLocation;
        this.engine.assetsManager.modelsManager.createParser = function(data, cbOnComplete, cbOnError, cbOnProgress, userdata) {
            var parser = new ThreadedDataParser(data, cbOnComplete, cbOnError, cbOnProgress, userdata);
            parser.flipX = true;
            return parser;
        };
        this.engine.assetsManager.texturesManager.sourceCallback = function(source) {
            return source;
        };
        this.engine.assetsManager.texturesManager.descriptorCallback = function(descriptor) {
            if (descriptor.loadAsImage) {
                descriptor.source = WayfinderAPI.images.get.url(descriptor.source);
                descriptor.parentDescriptor = false;
                return descriptor;
            }
            descriptor.parentDescriptor = false;
            if (scope.options.textureLOD === false) descriptor.source = WayfinderAPI.textures.texture.url(descriptor.source); else descriptor.source = WayfinderAPI.textures.mipmap.url(scope.options.textureLOD, descriptor.source);
            return descriptor;
        };
        var floors = this.building.getFloors();
        for (var floorIndex in floors) {
            var floor = floors[floorIndex];
            var floorNode = new Node("Level-" + floor.index);
            floorNode.addComponent(new FloorComponent(floor));
            floorNode.addComponent(new FloorFlightComponent());
            floor.node3D = floorNode;
            if (!this.options.disableModelLoading) {
                var modelDescriptor = new ModelDescriptor(WayfinderAPI.models.json.url(floor.model_id), "json");
                floorNode.addNode(this.engine.assetsManager.modelsManager.addDescriptor(modelDescriptor));
            }
            this.engine.scene.root.addNode(floorNode);
        }
        this.engine.assetsManager.load(ClassCallback(this, this.onAssetsLoaded), ClassCallback(this, this.onAssetsProgress));
    },
    onAssetsProgress: function(progress) {},
    onAssetsLoaded: function() {
        var scope = this;
        if (!this.dataLoaded) {
            this.dataLoaded = true;
            this.onDataLoaded();
            this.logic = new WayfinderLogic3D(this);
            var setup = new WayfinderSetup3D(this);
            this.engine.sceneStarted = function() {
                setup.setup();
                if (typeof scope.cbOnMapReady === "function") {
                    scope.cbOnMapReady();
                }
            };
            if (!this.options.disableRendering) {
                this.engine.run();
            }
        }
    },
    onProgress: function(progress) {
        if (typeof this.cbOnProgress === "function") this.cbOnProgress(progress);
    },
    resize: function() {
        this._super();
        if (this.engine.context instanceof RenderingContext) {
            var gl = this.engine.context.gl;
            var width = gl.canvas.clientWidth;
            var height = Math.max(1, gl.canvas.clientHeight);
            this.engine.scene.cameraComponent.setAspectRatio(gl.drawingBufferWidth / gl.drawingBufferHeight);
            this.engine.scene.camera.target.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
            if (this.orbitController) this.onZoomChange(this.orbitController.getZoom());
        }
    },
    getNearestPOI: function(source, pois) {
        if (this.logic) return this.logic.getNearestPOI(source, pois);
        return null;
    },
    showScreensaver: function() {
        if (this.pathComponent) {
            if (this.pathComponent.path && !this.pathComponent.finished) return;
        }
        this.clearHighlights();
        this.showKiosk();
        if (!this.settings.getBoolean("kiosk.screensaver.enabled", false)) {
            return;
        }
        if (this.screensaver) {
            this.screensaving = true;
            var destinations = [];
            for (var i in this.pois) {
                if (this.pois[i].node_id in this.nodes && this.pois[i].node_id != this.options.kiosk && this.pois[i].node_id != this.screensaver.destNodeID) destinations.push(this.pois[i].node_id);
            }
            var destination = destinations[Math.floor(Math.random() * destinations.length)];
            for (var i in this.nodes[destination].pois) {
                this.nodes[destination].pois[i].show();
            }
            var me = this;
            this.screensaver.setDestination(this.nodes[destination], destination, function() {
                if (me.nodes[destination].pois) {
                    for (var i in me.nodes[destination].pois) me.nodes[destination].pois[i].hide();
                }
            });
            for (var i in this.nodes[destination].pois) {
                this.nodes[destination].pois[i].show();
            }
        }
    },
    restoreDefaultState: function() {
        this._super();
        if (this.pathComponent) this.pathComponent.clearPath();
    },
    hideScreensaver: function() {
        this.screensaving = false;
        if (this.screensaver) this.screensaver.clearDestination();
        this.restoreDefaultState();
    },
    setHighlights: function(pois) {
        this.clearHighlights();
        if (this.poiController && pois) {
            this.poiController.setHighlights(pois);
        }
    },
    clearHighlights: function() {
        if (this.poiController) {
            this.poiController.clearHighlights();
        }
    },
    setDisplaying: function(pois) {
        this.clearDisplaying();
        if (this.poiController && pois) {
            this.poiController.setDisplaying(pois);
        }
    },
    clearDisplaying: function() {
        if (this.poiController) {
            this.poiController.clearDisplaying();
        }
    },
    onSetLanguage: function(language) {
        for (var i in this.pois) {
            var poi = this.pois[i];
            if (!poi.object || poi.object.subnodes.length < 1) continue;
            var textComponent = poi.object.subnodes[0].getComponent(TextComponent);
            if (!textComponent) continue;
            var text = poi.getName(language);
            if (text) textComponent.setText(text);
        }
    },
    clearPath: function() {
        if (this.pathComponent) this.pathComponent.clearPath();
    },
    zoomOnPathSegment: function(startNode, endNode) {
        this.pathComponent.zoomOnPathSegment(startNode, endNode);
    }
});

var Wayfinder3DEx = Wayfinder.extend({
    init: function(options) {
        if (!options || !(options instanceof WayfinderOptions)) options = new WayfinderOptions3D();
        this._super(options, new WayfinderFactory3D(this));
        this.engine = false;
        this.logic = false;
        this.dataLoaded = false;
        this.engineLoaded = false;
        this.orbitController = false;
        this.poiController = false;
        this.pathComponent = false;
        this.materials = false;
        this.floorMeshes = {};
        this.screensaving = false;
        this.screensaver = false;
    },
    startLoading: function() {
        var scope = this;
        var loading = new WayfinderLoading3D(this, function() {
            scope.setupEngine();
        });
    },
    onSettings: function() {
        this.building = this.factory.createBuilding(this.settings.data);
        this.options.language = this.settings.get("language.default", this.options.language);
        this.setLanguage(this.options.language);
        if (this.options.kiosk === false) {
            this.setKiosk(this.settings.getInt("kiosk.default", 0));
        }
    },
    showFloor: function(floor, callback, withoutPOIs) {
        this._super(floor, callback);
        if (this.logic) this.logic.showFloor(floor, callback, withoutPOIs);
    },
    showPath: function(endNode, poi, options, callback) {
        if (!(endNode instanceof NavigationNode)) return [];
        var source = this.options.kiosk;
        var destination = endNode.id;
        if (this.logic) {
            try {
                var path = this.logic.showPath(source, destination, poi, options, callback);
                return path;
            } catch (e) {
                log("Warning: Could not show path from " + source + " to " + destination);
            }
        }
        return [];
    },
    showKiosk: function(zoom) {
        this.setDefaultView(zoom);
    },
    setZoom: function(percentage) {
        if (this.orbitController) {
            this.orbitController.setZoom(1 - percentage);
        }
    },
    zoomIn: function() {
        if (this.orbitController) {
            this.orbitController.zoomIn();
        }
    },
    zoomOut: function() {
        if (this.orbitController) {
            this.orbitController.zoomOut();
        }
    },
    setDefaultView: function() {
        if (this.logic) this.logic.setDefaultView();
    },
    pathToText: function(path) {
        var pf = new Pathfinder3D(this.nodes, this.edges);
        var result = pf.pathToText(path);
        return this.textPathSimplification(result);
    },
    setupEngine: function() {
        var map = $("#" + this.options.map);
        var transparencyMode = "sorted";
        if (this.settings.getBoolean("camera.correct-transparency.enabled", false)) {
            transparencyMode = "blended";
            if (this.settings.getBoolean("camera.correct-transparency.stochastic-enabled", false)) transparencyMode = "stochastic";
        }
        var renderer = "forward";
        if (this.settings.getBoolean("camera.deferred-renderer.enabled", false)) {
            renderer = "auto";
        }
        this.engine = new Engine(this.options.map, {
            requestedFPS: 30,
            renderer: renderer,
            antialias: this.settings.getBoolean("camera.antialiasing.enabled", false),
            ssao: this.settings.getBoolean("camera.ssao.enabled", false),
            ssaoGDisplace: this.settings.getFloat("camera.ssao.gdisplace", .4),
            ssaoRadius: this.settings.getFloat("camera.ssao.radius", 2),
            ssaoLuminanceInfluence: this.settings.getFloat("camera.ssao.luminance-influence", .7),
            ssaoBrightness: this.settings.getFloat("camera.ssao.brightness", 1),
            transparencyMode: transparencyMode,
            softShadows: this.settings.getBoolean("camera.deferred-renderer.soft-shadows", false),
            assetsPath: this.options.assetsLocation
        });
        map.addClass("no-select").on("selectstart", false);
        $(window).resize(ClassCallback(this, this.resize));
        this.resize();
        var scope = this;
        this.engine.assetsManager.shadersManager.shadersPath = this.options.assetsLocation;
        this.engine.assetsManager.modelsManager.createParser = function(data, cbOnComplete, cbOnError, cbOnProgress, userdata) {
            var parser = new ThreadedDataParser(data, cbOnComplete, cbOnError, cbOnProgress, userdata);
            parser.flipX = true;
            return parser;
        };
        this.engine.assetsManager.texturesManager.sourceCallback = function(source) {
            return source;
        };
        this.engine.assetsManager.texturesManager.descriptorCallback = function(descriptor) {
            if (descriptor.loadAsImage) {
                descriptor.source = WayfinderAPI.images.get.url(descriptor.source);
                descriptor.parentDescriptor = false;
                return descriptor;
            }
            descriptor.parentDescriptor = false;
            if (scope.options.textureLOD === false) descriptor.source = WayfinderAPI.textures.texture.url(descriptor.source); else descriptor.source = WayfinderAPI.textures.mipmap.url(scope.options.textureLOD, descriptor.source);
            return descriptor;
        };
        var floors = this.building.getFloors();
        for (var floorIndex in floors) {
            var floor = floors[floorIndex];
            var floorNode = new Node("Level-" + floor.index);
            floorNode.addComponent(new FloorComponent(floor));
            floorNode.addComponent(new FloorFlightComponent());
            floor.node3D = floorNode;
            if (!this.options.disableModelLoading) {
                var modelDescriptor = new ModelDescriptor(WayfinderAPI.models.json.url(floor.model_id), "json");
                floorNode.addNode(this.engine.assetsManager.modelsManager.addDescriptor(modelDescriptor));
            }
            this.engine.scene.root.addNode(floorNode);
        }
        this.engine.assetsManager.modelsManager.load(ClassCallback(this, this.onAssetsLoaded), function(progress) {
            if (typeof scope.cbOnProgress === "function") scope.cbOnProgress(progress);
        });
    },
    placeDynamicModels: function(data, poi) {
        var scope = this;
        var allFloors = new Node("Models-all");
        var modelsLoaded = function() {
            var model = data[0];
            if (model.node3D && model.instances) {
                var instance = model.instances[0];
                instance.node3D = model.node3D.instantiate();
                instance.node3D.transform.setPosition(instance.position);
                poi.node.node3D = instance.node3D;
                if (instance.floor) {
                    var whereToAdd = scope.engine.scene.root.findChildWithName("Level-" + instance.floor);
                    if (whereToAdd) {
                        poi.node.position = instance.position;
                        poi.setNode(poi.node);
                        whereToAdd.addNode(poi.node.node3D);
                    } else {
                        allFloors.addNode(instance.node3D);
                    }
                } else {
                    allFloors.addNode(instance.node3D);
                }
            }
            scope.engine.scene.root.addNode(allFloors);
        };
        var model = data[0];
        var descriptor = new ModelDescriptor(WayfinderAPI.models.json.url(model.id), "json");
        model.node3D = this.engine.assetsManager.modelsManager.addDescriptor(descriptor);
        this.engine.assetsManager.modelsManager.load(modelsLoaded);
    },
    onAssetsLoaded: function() {
        var scope = this;
        this.onDataLoaded();
        var clientJS = this.settings.getInt("template.client.js", 0);
        if (this.texts[clientJS]) {
            window["eval"].call(window, this.texts[clientJS]);
        }
        this.logic = new WayfinderLogic3D(this);
        var setup = new WayfinderSetup3D(this);
        this.engine.sceneStarted = function() {
            setup.setup();
            if (typeof scope.cbOnMapReady === "function") {
                scope.cbOnMapReady();
            }
        };
        if (!this.options.disableRendering) {
            this.engine.run();
        }
    },
    onProgress: function(progress) {},
    resize: function() {
        this._super();
        if (this.engine.context instanceof RenderingContext) {
            var gl = this.engine.context.gl;
            var width = gl.canvas.clientWidth;
            var height = Math.max(1, gl.canvas.clientHeight);
            this.engine.scene.cameraComponent.setAspectRatio(gl.drawingBufferWidth / gl.drawingBufferHeight);
            this.engine.scene.camera.target.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
            if (this.orbitController) this.onZoomChange(this.orbitController.getZoom());
        }
    },
    getNearestPOI: function(source, pois) {
        if (this.logic) return this.logic.getNearestPOI(source, pois);
        return null;
    },
    showScreensaver: function() {
        if (this.pathComponent) {
            if (this.pathComponent.path && !this.pathComponent.finished) return;
        }
        this.clearHighlights();
        this.showKiosk();
        if (!this.settings.getBoolean("kiosk.screensaver.enabled", false)) {
            return;
        }
        if (this.screensaver) {
            this.screensaving = true;
            var destinations = [];
            for (var i in this.pois) {
                if (this.pois[i].node_id in this.nodes && this.pois[i].node_id != this.options.kiosk && this.pois[i].node_id != this.screensaver.destNodeID) destinations.push(this.pois[i].node_id);
            }
            var destination = destinations[Math.floor(Math.random() * destinations.length)];
            for (var i in this.nodes[destination].pois) {
                this.nodes[destination].pois[i].show();
            }
            var me = this;
            this.screensaver.setDestination(this.nodes[destination], destination, function() {
                if (me.nodes[destination].pois) {
                    for (var i in me.nodes[destination].pois) me.nodes[destination].pois[i].hide();
                }
            });
            for (var i in this.nodes[destination].pois) {
                this.nodes[destination].pois[i].show();
            }
        }
    },
    restoreDefaultState: function() {
        this._super();
        if (this.pathComponent) this.pathComponent.clearPath();
    },
    hideScreensaver: function() {
        this.screensaving = false;
        if (this.screensaver) this.screensaver.clearDestination();
        this.restoreDefaultState();
    },
    setHighlights: function(pois) {
        this.clearHighlights();
        if (this.poiController && pois) {
            this.poiController.setHighlights(pois);
        }
    },
    clearHighlights: function() {
        if (this.poiController) {
            this.poiController.clearHighlights();
        }
    },
    setDisplaying: function(pois) {
        this.clearDisplaying();
        if (this.poiController && pois) {
            this.poiController.setDisplaying(pois);
        }
    },
    clearDisplaying: function() {
        if (this.poiController) {
            this.poiController.clearDisplaying();
        }
    },
    onSetLanguage: function(language) {
        for (var i in this.pois) {
            var poi = this.pois[i];
            if (!poi.object || poi.object.subnodes.length < 1) continue;
            var textComponent = poi.object.subnodes[0].getComponent(TextComponent);
            if (!textComponent) continue;
            var text = poi.getName(language);
            if (text) textComponent.setText(text);
        }
    },
    clearPath: function() {
        if (this.pathComponent) this.pathComponent.clearPath();
    },
    zoomOnPathSegment: function(startNode, endNode) {
        this.pathComponent.zoomOnPathSegment(startNode, endNode);
    }
});

var WayfinderLoading3D = Class.extend({
    init: function(wayfinder, callback) {
        this.wayfinder = wayfinder;
        this.callback = callback;
        Logistics.getJSON(WayfinderAPI["3d"].scene.url(), null, ClassCallback(this, this.onSceneData), {
            stage: "settings"
        });
    },
    onSceneData: function(response) {
        var data = response.data;
        this.wayfinder.settings.data = data.settings;
        this.wayfinder.poisettings.data = data.poisettings;
        this.wayfinder.texts = data.texts;
        this.wayfinder.onSettings();
        if (data.guitranslations) this.wayfinder.translator.setTranslations(data.guitranslations);
        this.createLanguages(data.languages);
        this.wayfinder.factory.createFloors(data.levels);
        this.createLocations(data);
        for (var level_id in data.meshes) {
            var o = {};
            var meshes = data.meshes[level_id];
            for (var mesh_id in meshes) {
                o[mesh_id] = meshes[mesh_id].name;
            }
            this.wayfinder.floorMeshes["floor-meshes-" + level_id] = {
                data: o
            };
        }
        this.wayfinder.materials = data.materials;
        if (this.callback) this.callback();
    },
    createLanguages: function(languages) {
        for (var name in languages) {
            this.wayfinder.languages[name] = new Language(languages[name]);
            if (name.toLowerCase() == this.wayfinder.options.language.toLowerCase()) {
                this.wayfinder.translator.language = name;
            }
        }
        this.wayfinder.translator.translate();
    },
    createLocations: function(data) {
        this.wayfinder.factory.createNodes(data.navigation.nodes);
        this.wayfinder.factory.createEdges(data.navigation.edges);
        this.wayfinder.factory.createPOIs(data.locations.all);
        this.wayfinder.factory.addPOIsToFloor(data.locations.byfloor);
        this.wayfinder.factory.createGroups(data.locations.groups, data.locations.bygroup);
        this.wayfinder.factory.createTags(data.locations.tags);
        this.wayfinder.factory.filterPOIs(this.wayfinder.options.filterPOIs.trim().split(","));
        this.wayfinder.advertisements = data.a;
        Logistics.getJSON(WayfinderAPI.navigation.allAttributes.url(), null, ClassCallback(this.wayfinder.factory, this.wayfinder.factory.createAttributes), {
            stage: "settings"
        });
    }
});

var WayfinderOptions3D = WayfinderOptions.extend({
    init: function() {
        this._super();
        this.application = "3d";
        this.assetsLocation = "/shared/";
        this.pathDisplayInstructions = true;
        this.pathZoomPadding = 100;
        this.pathColor = "rgba(255,0,0,0.8)";
        this.pathPauseTime = 2e3;
        this.pathSpotRadius = 3;
        this.pathStride = 30;
        this.pathSpeed = 60;
        this.zoomPadding = 1.05;
        this.poiColor = "rgba(100,200,0,0.9)";
        this.poiRadius = 9;
        this.textureLOD = 0;
        this.debugTransparency = false;
        this.disableModelLoading = false;
        this.disableCollisionTrees = false;
        this.disableRendering = false;
    }
});

var WayfinderSetup3D = Class.extend({
    init: function(wayfinder) {
        this.wayfinder = wayfinder;
    },
    setup: function() {
        var scene = this.wayfinder.engine.scene;
        this.overrideBuildingMaterials();
        this.setupPathComponent(scene);
        this.setupScreensaverComponent(scene);
        this.setupCamera(scene);
        this.setupOrbitController(scene);
        this.setupLights(scene);
        this.setupPOIs(scene);
        this.setupYAH(scene);
        this.setupSkybox(scene);
        scene.cameraComponent.fitNodeToView(scene.root);
        if (this.wayfinder.options.debugTransparency) {
            scene.cameraComponent.camera.renderStage = new DebugRenderStage(new TargetScreen(), this.wayfinder.engine);
        }
        this.wayfinder.showKiosk();
    },
    setupCamera: function(scene) {
        scene.camera.backgroundColor = this.wayfinder.settings.getColor("scene.background-color", "#FFFFFF00");
        if (scene.cameraComponent instanceof PerspectiveCamera) {
            scene.cameraComponent.setClipPlanes(this.wayfinder.settings.getFloat("camera.plane.near", .1), this.wayfinder.settings.getFloat("camera.plane.far", 1e3));
        }
    },
    setupPathComponent: function(scene) {
        var pathNode = new Node();
        this.wayfinder.pathComponent = pathNode.addComponent(new PathComponent(this.wayfinder.nodes, this.wayfinder));
        scene.root.addNode(pathNode);
    },
    setupScreensaverComponent: function(scene) {
        if (this.wayfinder.settings.getBoolean("kiosk.screensaver.enabled", false)) {
            var screensaverNode = new Node();
            this.wayfinder.screensaver = screensaverNode.addComponent(new ScreensaverComponent(this.wayfinder));
            scene.root.addNode(screensaverNode);
        }
    },
    setupOrbitController: function(scene) {
        var settings = this.wayfinder.settings;
        var target = scene.root.addNode(new Node("CameraTarget"));
        var orbitController = scene.cameraNode.addComponent(new WayfinderOrbitController(this.wayfinder));
        orbitController.target.value = target.transform;
        orbitController.distance = 50;
        orbitController.distanceSteps = 64;
        orbitController.minimumDistance = settings.getFloat("camera.distance.min", 10);
        orbitController.maximumDistance = settings.getFloat("camera.distance.max", 100);
        var boundingBox = scene.root.getBoundingBox();
        if (boundingBox) {
            orbitController.minimumPan[0] = boundingBox.min[0];
            orbitController.minimumPan[1] = boundingBox.min[1];
            orbitController.minimumPan[2] = boundingBox.min[2];
            orbitController.maximumPan[0] = boundingBox.max[0];
            orbitController.maximumPan[1] = boundingBox.max[1];
            orbitController.maximumPan[2] = boundingBox.max[2];
        }
        orbitController.minimumPitch = -Math.PI / 2.2;
        orbitController.maximumPitch = -.1;
        if (settings.getBoolean("mouse.invert-buttons", false)) {
            orbitController.panButton = 0;
            orbitController.rotateButton = 2;
        }
        var rotate = settings.getBoolean("mouse.enable-rotation", true);
        orbitController.enableRotation(rotate);
        var rotateTouch = settings.getBoolean("mouse.enable-touch-rotation", false);
        orbitController.enableTouchRotation(rotateTouch);
        this.wayfinder.orbitController = orbitController;
        var scope = this;
        orbitController.cbOnChange = function(action, value) {
            scope.wayfinder.cbOnTouch(action, value);
        };
    },
    setupLights: function(scene) {
        var settings = this.wayfinder.settings;
        scene.light.intensity = settings.getFloat("lights.directional.intensity", 1);
        scene.light.shadowCasting = settings.getBoolean("lights.directional.shadows", false);
        scene.light.color = settings.getColor("lights.directional.color", new Color(1, 1, .98));
        scene.light.setLightDirection(vec3.fromValues(settings.getFloat("lights.directional.direction-x", 1), settings.getFloat("lights.directional.direction-y", 1), settings.getFloat("lights.directional.direction-z", 1)));
        var abc = settings.getColor("lights.ambient.color", new Color(.5, .5, .5));
        var ambient = scene.lightNode.addComponent(new AmbientLight(abc));
        function lights(data) {
            if (data && data.data) {
                var firstDirectional = true;
                var firstAmbient = true;
                for (var i in data.data) {
                    var light = data.data[i];
                    var c = light.color.split(" ");
                    var color = new Color(parseFloat(c[0]), parseFloat(c[1]), parseFloat(c[2]));
                    var r = light.rotation.split(" ");
                    var rotation = quat.fromValues(parseFloat(r[0]), parseFloat(r[1]), parseFloat(r[2]), parseFloat(r[3]));
                    var direction = vec3.transformQuat(vec3.create(), vec3.fromValues(0, -1, 0), rotation);
                    var p = light.position.split(" ");
                    var position = vec3.fromValues(parseFloat(p[0]), parseFloat(p[1]), parseFloat(p[2]));
                    var is = parseFloat(light.intensity);
                    switch (light.type) {
                      case "point":
                        var omni = new Node("Omni");
                        omni.addComponent(new OmniLight(parseFloat(light.radius), color)).intensity = is;
                        omni.transform.setPosition(position);
                        scene.lightNode.addNode(omni);
                        break;

                      case "ambient":
                        if (!firstAmbient) {
                            var amb = new Node("Ambient");
                            amb.addComponent(new AmbientLight(color)).intensity = is;
                            scene.lightNode.addNode(amb);
                        } else {
                            ambient.color = color;
                            firstAmbient = false;
                        }
                        break;

                      case "directional":
                        if (!firstDirectional) {
                            var dir = new Node("Directional");
                            dir.addComponent(new DirectionalLight(direction, color)).intensity = is;
                            scene.lightNode.addNode(dir);
                        } else {
                            scene.light.intensity = is;
                            scene.light.color = color;
                            scene.light.setLightDirection(direction);
                            firstDirectional = false;
                        }
                        break;
                    }
                }
            }
        }
        Logistics.getJSON(WayfinderAPI.getURL("lights", "get", []), null, lights, {
            stage: "settings"
        });
    },
    setupPOIs: function(scene) {
        var poiControllerNode = new Node("POIController");
        var poiController = poiControllerNode.addComponent(new POIController(this.wayfinder));
        scene.root.addNode(poiControllerNode);
        var floors = this.wayfinder.building.getFloors();
        for (var i in floors) {
            var floor = floors[i];
            var meshNames = this.wayfinder.floorMeshes["floor-meshes-" + floor.id];
            if (meshNames && meshNames.data) {
                floor.setMeshNames(meshNames.data);
                for (var mesh_id in meshNames.data) poiController.meshIDToPath[parseInt(mesh_id, 10)] = {
                    path: meshNames.data[mesh_id],
                    floor: floors[i]
                };
            }
            var poisNode = new Node("pois");
            for (var j in floor.pois) {
                floor.pois[j].createGeometry(this.wayfinder.engine, this.wayfinder);
                floor.pois[j].applySettings(this.wayfinder.settings);
                poisNode.addNode(floor.pois[j].object);
            }
            floor.node3D.addNode(poisNode);
        }
        this.wayfinder.poiController = poiController;
        scene.engine.assetsManager.texturesManager.load(function() {});
    },
    setupSkybox: function(scene) {
        var skyboxImageNames = [ "scene.skybox.front", "scene.skybox.back", "scene.skybox.left", "scene.skybox.right", "scene.skybox.down", "scene.skybox.up" ];
        var skyboxImages = [];
        var createSkybox = false;
        for (var i in skyboxImageNames) {
            var imageID = this.wayfinder.settings.getInt(skyboxImageNames[i], 0);
            if (imageID !== 0) createSkybox = true;
            var imageDescriptor = new TextureDescriptor(imageID);
            imageDescriptor.loadAsImage = true;
            skyboxImages.push(imageDescriptor);
        }
        if (!createSkybox) return;
        var skybox = scene.cameraNode.addComponent(new SkyboxComponent());
        skybox.setup(scene.engine.assetsManager, scene.engine, skyboxImages);
    },
    setupYAH: function(scene) {
        var kioskNode = this.wayfinder.getKioskNode();
        if (!kioskNode || !kioskNode.floor || !kioskNode.floor.node3D) return;
        var settings = this.wayfinder.settings;
        var yahImageID = settings.getInt("kiosk.you-are-here-image", 0);
        if (yahImageID === 0 || !this.wayfinder.options.drawKioskIcon) return;
        var engine = scene.engine;
        var imageDescriptor = new TextureDescriptor(yahImageID);
        imageDescriptor.loadAsImage = true;
        var material = new Material(engine.assetsManager.addShaderSource("Transparent"), {
            diffuse: new UniformColor(new Color())
        }, [ new Sampler("diffuse0", engine.assetsManager.texturesManager.addDescriptor(imageDescriptor)) ]);
        material.name = "YAH_icon";
        material.shader.requirements.transparent = true;
        var width = settings.getFloat("poi.width", 1);
        var height = settings.getFloat("poi.height", 1);
        var poiObject = Primitives.plane(width, height, material);
        poiObject.name = "YAH";
        var meshRendererComponent = poiObject.getComponent(MeshRendererComponent);
        meshRendererComponent.castShadows = false;
        meshRendererComponent.lightContribution = 0;
        meshRendererComponent.disable();
        poiObject.addComponent(new MeshCollider());
        poiObject.addComponent(new Billboard(scene.camera, true));
        poiObject.addComponent(new YAHComponent(kioskNode)).offsetY = settings.getFloat("poi.3d.offset", 0);
        if (settings.getBoolean("path.animation.yah", false)) poiObject.addComponent(new AnimationComponent());
        if (poiObject.getComponent(AnimationComponent)) {
            poiObject.getComponent(AnimationComponent).setLowestPosition(settings.getFloat("poi.3d.offset", 0));
            poiObject.getComponent(AnimationComponent).setHighestPosition(settings.getFloat("path.animation.yah-highest-position", 5));
            poiObject.getComponent(AnimationComponent).setAnimationSpeed(settings.getFloat("path.animation.yah-speed", 1));
            poiObject.getComponent(AnimationComponent).startAnimating();
        }
        poiObject.layer = Layers.POI;
        var poiLocation = new Node("YAHLocation");
        mat4.fromTranslation(poiLocation.transform.relative, kioskNode.position);
        poiLocation.addNode(poiObject);
        kioskNode.floor.node3D.addNode(poiLocation);
    },
    overrideBuildingMaterials: function() {
        var namedMaterials = {};
        for (var i in this.wayfinder.materials) {
            namedMaterials[this.wayfinder.materials[i].id] = {
                parsed: this.wayfinder.materials[i],
                material: false
            };
        }
        var engine = this.wayfinder.engine;
        engine.scene.root.onEachChildComponent(function(c) {
            if (c instanceof MeshComponent) {
                var p = c.node.path();
                p = p.substring(6);
                p = p.substring(0, p.indexOf("/"));
                var n = c.node.scene.root.findChildWithName(p);
                var model_id = false;
                if (n) {
                    var f = n.getComponent(FloorComponent);
                    if (f) {
                        model_id = f.floor.model_id;
                    }
                }
                for (var r in c.mesh.materials) {
                    var material = c.mesh.materials[r];
                    var replacementMaterial = false;
                    for (var i in namedMaterials) {
                        if (namedMaterials[i].parsed.name === material.name) {
                            if (namedMaterials[i].parsed.model_id === 0) {
                                replacementMaterial = namedMaterials[i];
                                break;
                            } else if (namedMaterials[i].parsed.model_id === model_id) {
                                replacementMaterial = namedMaterials[i];
                            }
                        }
                    }
                    if (!replacementMaterial) {
                        continue;
                    }
                    if (replacementMaterial.material) {
                        c.mesh.materials[r] = replacementMaterial.material;
                        continue;
                    }
                    for (var u in replacementMaterial.parsed.uniforms) {
                        var uniformData = replacementMaterial.parsed.uniforms[u];
                        var uniformValue = uniformData.value.split(" ");
                        var uniform = false;
                        var value = false;
                        switch (uniformData.type) {
                          case "int":
                            uniform = new UniformInt(parseInt(uniformData.value));
                            break;

                          case "float":
                            uniform = new UniformFloat(parseFloat(uniformData.value));
                            break;

                          case "vec2":
                            value = vec2.create();
                            uniform = new UniformVec2(value);
                            break;

                          case "vec3":
                            value = vec3.create();
                            uniform = new UniformVec3(value);
                            break;

                          case "color":
                          case "vec4":
                            value = vec4.create();
                            uniform = new UniformVec4(value);
                            break;

                          case "mat4":
                            value = mat4.create();
                            uniform = new UniformMat4(value);
                            break;
                        }
                        if (value) {
                            for (var i in uniformValue) {
                                value[i] = parseFloat(uniformValue[i]);
                            }
                            uniform.value = value;
                        }
                        if (uniform) {
                            material.uniforms[uniformData.name] = uniform;
                        }
                    }
                    material.shader = engine.assetsManager.addShaderSource(replacementMaterial.parsed.shader);
                    if (material.uniforms["diffuse"].value[3] < 1) {
                        material.shader = engine.assetsManager.addShaderSource("transparent");
                    }
                    if (replacementMaterial.parsed.textures instanceof Array) {
                        for (var t in replacementMaterial.parsed.textures) {
                            var texture = replacementMaterial.parsed.textures[t];
                            var used = false;
                            for (var s in material.samplers) {
                                if (material.samplers[s].name == texture.sampler && material.samplers[s].texture.name != texture.name) {
                                    var imageDescriptor = new TextureDescriptor(texture.name);
                                    var t = engine.assetsManager.texturesManager.addDescriptor(imageDescriptor);
                                    material.samplers[s] = new Sampler(texture.sampler, t);
                                }
                            }
                            if (!used) {
                                var imageDescriptor = new TextureDescriptor(texture.name);
                                var t = engine.assetsManager.texturesManager.addDescriptor(imageDescriptor);
                                material.samplers.push(new Sampler(texture.sampler, t));
                            }
                        }
                    }
                    replacementMaterial.material = material;
                }
            } else if (c instanceof MeshRendererComponent) {
                var p = c.node.path();
                p = p.substring(6);
                p = p.substring(0, p.indexOf("/"));
                var n = c.node.scene.root.findChildWithName(p);
                var model_id = false;
                if (n) {
                    var f = n.getComponent(FloorComponent);
                    if (f) {
                        model_id = f.floor.model_id;
                    }
                }
                for (var r in c.meshRenderers) {
                    var material = c.meshRenderers[r].material;
                    var replacementMaterial = false;
                    for (var i in namedMaterials) {
                        if (namedMaterials[i].parsed.name === material.name) {
                            if (namedMaterials[i].parsed.model_id === 0) {
                                replacementMaterial = namedMaterials[i];
                                break;
                            } else if (namedMaterials[i].parsed.model_id === model_id) {
                                replacementMaterial = namedMaterials[i];
                            }
                        }
                    }
                    if (!replacementMaterial) {
                        continue;
                    }
                    if (replacementMaterial.parsed.shader == "transparent" || material.uniforms["diffuse"].value[3] < 1) {
                        c.meshRenderers[r].transparent = true;
                    }
                    if (replacementMaterial.material) {
                        c.meshRenderers[r].material = replacementMaterial.material;
                        continue;
                    }
                }
            }
        });
        engine.assetsManager.load();
    }
});

var WayfinderLogic3D = Class.extend({
    init: function(wayfinder) {
        this.wayfinder = wayfinder;
        this.engine = wayfinder.engine;
        this.currentFloor = false;
    },
    showPath: function(source, destination, poi, _options, callback) {
        if (!this.wayfinder.pathComponent) throw "Cannot show path: Wayfinder has no PathComponent reference.";
        var destNode = this.wayfinder.nodes[destination];
        if (!destNode) throw "Destination node not found.";
        console.log("Path from: " + source + " to " + destination);
        console.log("destnode %o", destNode);
        this.stopAnimatingAllPOIs(destNode.id);
        var options = {
            displayDestinationOnStart: _options && _options.displayDestinationOnStart ? true : false
        };
        var today = new Date();
        var day = today.getDay();
        var hour = today.getHours();
        var nodes = {}, edges = {}, rejectedNodes = [];
        for (var i in this.wayfinder.nodes) {
            var node = this.wayfinder.nodes[i];
            if (this.wayfinder.attributes && i in this.wayfinder.attributes && "allowedTimes" in this.wayfinder.attributes[i]) {
                var allowedTime;
                var attributes = this.wayfinder.attributes[i];
                if (attributes.allowedTimes.length == 1) {
                    allowedTime = attributes.allowedTimes[0];
                } else {
                    if (day >= attributes.allowedTimes.length) {
                        nodes[i] = node;
                        continue;
                    }
                    allowedTime = attributes.allowedTimes[day];
                }
                for (var j = 0; j < allowedTime.length; j += 2) {
                    if (hour >= allowedTime[j] && hour < allowedTime[j + 1]) {
                        nodes[i] = node;
                        break;
                    }
                }
                if (!(i in nodes)) rejectedNodes.push(i);
            }
            if (this.wayfinder.attributes && i in this.wayfinder.attributes && "inaccessibility" in this.wayfinder.attributes[i]) {
                var rejected = this.wayfinder.attributes[i].inaccessibility;
                if (this.wayfinder.accessibility && rejected.indexOf(this.wayfinder.accessibility) != -1) {
                    rejectedNodes.push(i);
                    if (i in nodes) {
                        delete nodes[i];
                    }
                } else if (rejectedNodes.indexOf(i) == -1) {
                    nodes[i] = node;
                }
            }
            if (rejectedNodes.indexOf(i) == -1) {
                nodes[i] = node;
            }
        }
        for (var i in this.wayfinder.edges) {
            var edge = this.wayfinder.edges[i];
            if (rejectedNodes.indexOf(i) !== -1) continue;
            var newEdge = [];
            for (var j = 0; j < edge.length; j++) {
                if (rejectedNodes.indexOf(edge[j]) == -1) newEdge.push(edge[j]);
            }
            edges[i] = newEdge;
        }
        var pathfinder = new Pathfinder3D(nodes, edges);
        var path = pathfinder.find(source, destination);
        this.wayfinder.showFloor(this.currentFloor);
        var poiController = this.wayfinder.poiController;
        poiController.clearHighlights();
        poiController.clearDisplaying();
        var scope = this;
        this.wayfinder.pathComponent.setPath(path, function() {
            var kioskNode = scope.wayfinder.getKioskNode();
            if (typeof callback == "function") callback(path, destination, poi);
            if (!kioskNode || !kioskNode.floor || !kioskNode.floor.node3D) return;
            var YAHNode = kioskNode.floor.node3D.find("YAHLocation/YAH");
            if (!YAHNode) return;
        });
        if (options.displayDestinationOnStart) {
            if (poi) {
                poiController.setHighlights([ poi ]);
                poiController.setDisplaying([ poi ]);
            } else {
                poiController.setHighlights(destNode.pois);
                poiController.setDisplaying(destNode.pois);
            }
        }
        if (this.wayfinder.settings.getBoolean("path.animation.poi", true)) {
            var _poi = poi ? poi : destNode.pois[0];
            _poi.setAnimation(this.wayfinder.settings.getFloat("poi.3d.offset", 0), this.wayfinder.settings.getFloat("path.animation.yah-highest-position", 10), this.wayfinder.settings.getFloat("path.animation.yah-speed", .5));
            _poi.startAnimating();
        }
        var kioskNode = scope.wayfinder.getKioskNode();
        if (!kioskNode || !kioskNode.floor || !kioskNode.floor.node3D) return path;
        var YAHNode = kioskNode.floor.node3D.find("YAHLocation/YAH");
        if (!YAHNode) return path;
        var animation = YAHNode.getComponent(AnimationComponent);
        if (animation) animation.startAnimating();
        return path;
    },
    showFloor: function(floor, callback, withoutPOIs) {
        if (!(floor instanceof Floor)) {
            return;
        }
        var scope = this;
        var sortedFloors = this.wayfinder.building.getSortedFloors();
        var counts = {};
        counts.inflight = 0;
        function hideGeometry() {
            if (scope.currentFloor === false) return;
            function disableGeometry(c) {
                if (c instanceof RendererComponent) {
                    c.disable();
                }
            }
            for (var i in sortedFloors) {
                if (sortedFloors[i].index > scope.currentFloor.index) {
                    sortedFloors[i].node3D.onEachChildComponent(disableGeometry);
                }
            }
        }
        function floorFlightCompleted(node) {
            counts.inflight--;
            if (counts.inflight === 0) {
                if (!withoutPOIs) {
                    floor.showYAH();
                    scope.showFloorPOIs(scope.currentFloor);
                    scope.showPathMeshes(scope.currentFloor);
                    hideGeometry();
                }
                if (callback) callback(floor);
            }
        }
        function landFloor(node) {
            node.onEachChild(enableShadows);
            floorFlightCompleted(node);
        }
        function disableShadows(node) {
            if (node.getComponent(POIComponent)) return;
            if (node.getComponent(YAHComponent)) return;
            var c = node.getComponent(RendererComponent);
            if (c) c.castShadows = false;
        }
        function enableShadows(node) {
            if (node.getComponent(POIComponent)) return;
            if (node.getComponent(YAHComponent)) return;
            var c = node.getComponent(RendererComponent);
            if (c) c.castShadows = true;
        }
        function enableFloor(node) {
            if (node.getComponent(POIComponent)) return;
            if (node.getComponent(YAHComponent)) return;
            var c = node.getComponent(RendererComponent);
            if (c) {
                c.enable();
            }
        }
        if (this.currentFloor instanceof Floor) {
            this.hideFloorPOIs(this.currentFloor);
            if (this.currentFloor === floor) {
                this.showFloorPOIs(this.currentFloor);
            }
        }
        this.currentFloor = floor;
        if (this.wayfinder.pathComponent) {
            if (this.wayfinder.settings.getBoolean("path.3d.hide-above", true)) {
                var instances = this.wayfinder.pathComponent.getInstancesAboveFloor(this.currentFloor);
                for (var i in instances) {
                    instances[i][0].disable();
                    instances[i][1].disable();
                    instances[i][2].disable();
                }
            }
        }
        for (var i in sortedFloors) {
            var sortedFloor = sortedFloors[i];
            counts.inflight++;
            if (sortedFloor.index > floor.index) {
                sortedFloor.node3D.onEachChild(disableShadows);
                sortedFloor.node3D.getComponent(FloorFlightComponent).fly(floorFlightCompleted);
            } else {
                sortedFloor.node3D.onEachChild(enableFloor);
                sortedFloor.node3D.getComponent(FloorFlightComponent).land(landFloor);
            }
        }
    },
    showFloorPOIs: function(floor) {
        this.hideAllPOIs();
        floor.showYAH();
        this.wayfinder.poiController.showPOIs(floor.pois);
    },
    hideFloorPOIs: function(floor) {
        floor.hideYAH();
        this.wayfinder.poiController.hidePOIs(floor.pois);
    },
    hideAllPOIs: function() {
        var floors = this.wayfinder.building.getFloors();
        var poiController = this.wayfinder.poiController;
        for (var i in floors) floors[i].hideYAH();
        poiController.hidePOIs(this.pois);
    },
    stopAnimatingAllPOIs: function(nodeId) {
        var poiController = this.wayfinder.poiController;
        var floors = this.wayfinder.building.getFloors();
        poiController.stopAnimatingPOIs(this.wayfinder.pois, nodeId);
    },
    showPathMeshes: function(floor) {
        var pathComponent = this.wayfinder.pathComponent;
        if (!pathComponent || !pathComponent.finished) return;
        var instances = pathComponent.getInstancesBelowFloor(floor);
        for (var i in instances) {
            instances[i][0].enable();
        }
        instances = pathComponent.getInstancesAtFloor(floor);
        for (var i in instances) {
            instances[i][0].enable();
        }
    },
    setDefaultView: function(zoom) {
        if (this.wayfinder.pathComponent) this.wayfinder.pathComponent.clearPath();
        this.setKioskView(zoom);
    },
    setKioskView: function(zoom) {
        this.wayfinder.clearHighlights();
        this.wayfinder.clearDisplaying();
        var orbitController = this.wayfinder.orbitController;
        var offset = vec3.fromValues(this.wayfinder.settings.getFloat("camera.target.x", 0), this.wayfinder.settings.getFloat("camera.target.y", 0), this.wayfinder.settings.getFloat("camera.target.z", 0));
        var kioskNode = this.wayfinder.getKioskNode();
        this.setNormalRotation();
        if (orbitController) {
            vec3.set(orbitController.pan, 0, 0, 0);
            if (zoom) {
                orbitController.setZoom(zoom);
                vec3.add(offset, kioskNode.position, offset);
                orbitController.target.value.setPosition(offset);
            } else {
                if (kioskNode.zoom) {
                    orbitController.setDistance(kioskNode.zoom);
                    vec3.add(offset, kioskNode.position, offset);
                    orbitController.target.value.setPosition(offset);
                } else {
                    this.fitToView();
                }
            }
            if (kioskNode && kioskNode.floor) {
                this.wayfinder.showFloor(kioskNode.floor);
            }
            this.wayfinder.onZoomChange(orbitController.getZoom());
        }
    },
    setNodeView: function(node, zoom) {
        var orbitController = this.wayfinder.orbitController;
        if (!orbitController || !orbitController.target || orbitController.target.isNull()) return;
        if (!node) {
            return;
        }
        this.setNormalRotation();
        var p = vec3.create();
        vec3.add(p, p, node.position);
        vec3.scale(p, p, 1 / 2);
        vec3.scale(p, p, wayfinder.options.zoomPadding);
        var b = new BoundingSphere(p, node.position);
        b.encapsulateSphere(node.position);
        vec3.set(orbitController.pan, 0, 0, 0);
        orbitController.target.value.setPosition(b.center);
        if (zoom) {
            orbitController.setZoom(zoom);
        } else {
            if (node.zoom) {
                orbitController.setDistance(node.zoom);
            } else {
                this.fitToView();
            }
        }
        this.wayfinder.showFloor(node.floor);
    },
    fitToView: function() {
        var orbitController = this.wayfinder.orbitController;
        if (!orbitController || !orbitController.target || orbitController.target.isNull()) return;
        var scene = this.wayfinder.engine.scene;
        scene.root.updateChildTransforms();
        var bounds = scene.root.getBoundingBox(true);
        var dir = vec3.fromValues(0, 0, 1);
        var rotation = quat.identity(quat.create());
        quat.rotateY(rotation, rotation, orbitController.rotation[1]);
        quat.rotateX(rotation, rotation, orbitController.rotation[0]);
        vec3.transformQuat(dir, dir, rotation);
        vec3.negate(dir, dir);
        vec3.normalize(dir, dir);
        var plane = new Plane();
        plane.setByNormalAndPoint(dir, bounds.center);
        var vertices = bounds.getVertices();
        for (var i in vertices) vertices[i] = plane.projectToPlane(vertices[i]);
        var min = vec3.create();
        var max = vec3.create();
        vec3.copy(min, vertices[0]);
        vec3.copy(max, vertices[0]);
        for (var v = 1; v < 8; v++) {
            for (var i = 0; i < 3; i++) {
                if (vertices[v][i] < min[i]) min[i] = vertices[v][i];
                if (vertices[v][i] > max[i]) max[i] = vertices[v][i];
            }
        }
        var yaxis = vec3.cross(vec3.create(), plane.normal, [ 1, 0, 0 ]);
        var xaxis = vec3.cross(vec3.create(), yaxis, plane.normal);
        vec3.normalize(xaxis, xaxis);
        vec3.normalize(yaxis, yaxis);
        var v = vec3.sub(vec3.create(), max, min);
        if (!this.wayfinder.options) {
            this.wayfinder.options = 1.05;
        }
        var size = Math.max(vec3.dot(xaxis, v), vec3.dot(yaxis, v)) * 1.05;
        var fov = Math.min(scene.cameraComponent.getVerticalFieldOfView(), scene.cameraComponent.getHorizontalFieldOfView()) * Math.PI / 180;
        orbitController.setDistance(size / Math.sin(fov / 2) - size);
    },
    setNormalRotation: function() {
        var orbitController = this.wayfinder.orbitController;
        var kioskNode = this.wayfinder.getKioskNode();
        if (orbitController) {
            if (kioskNode) {
                orbitController.rotation[0] = -kioskNode.rotation[0] / 180 * Math.PI;
                var n = Math.floor(Math.abs(orbitController.currentRotation[1]) / (2 * Math.PI));
                if (orbitController.currentRotation[1] < 2 * Math.PI) {
                    orbitController.currentRotation[1] += n * (2 * Math.PI);
                } else {
                    orbitController.currentRotation[1] -= n * (2 * Math.PI);
                }
                var kioskZero = kioskNode.rotation[1] / 180 * Math.PI;
                if (orbitController.currentRotation[1] > kioskZero + Math.PI) {
                    orbitController.rotation[1] = kioskZero + 2 * Math.PI;
                } else if (orbitController.currentRotation[1] < kioskZero - Math.PI) {
                    orbitController.rotation[1] = kioskZero - 2 * Math.PI;
                } else {
                    orbitController.rotation[1] = kioskZero;
                }
            } else {
                orbitController.rotation[0] = orbitController.minimumPitch;
                orbitController.rotation[1] = 0;
            }
        }
    },
    getNearestPOI: function(source, pois) {
        var nodes = this.wayfinder.nodes;
        var edges = this.wayfinder.edges;
        if (pois.length == 0 || !(source in nodes)) return null;
        function getPathHeuristic(path) {
            var l = path.length;
            if (l < 2) return false;
            var length = 0;
            for (var i = 1; i < l; ++i) {
                length += vec3.distance(nodes[path[i - 1]].position, nodes[path[i]].position);
            }
            return length;
        }
        var pathfinder = new Pathfinder3D(nodes, edges);
        var src = nodes[source];
        pois.sort(function(a, b) {
            var nodeA = a.getNode();
            var nodeB = b.getNode();
            if (!nodeA && !nodeB) return 0;
            if (!nodeA) return 1;
            if (!nodeB) return -1;
            var d1 = vec3.squaredDistance(a.getNode().position, src.position);
            var d2 = vec3.squaredDistance(b.getNode().position, src.position);
            return d1 - d2;
        });
        var distance = Infinity;
        var nearest = null;
        var length = pois.length;
        var path, d;
        for (var i = 0; i < length; ++i) {
            path = pathfinder.find(source, pois[i].getNode().id);
            d = getPathHeuristic(path);
            if (d === false) continue;
            if (d < distance) {
                distance = d;
                nearest = pois[i];
            } else break;
        }
        return nearest;
    }
});

var FloorComponent = Component.extend({
    init: function(floor) {
        this._super();
        this.floor = false;
        if (floor instanceof Floor3D) this.floor = floor;
    },
    type: function() {
        return "FloorComponent";
    }
});

var FloorFlightComponent = Component.extend({
    init: function() {
        this._super("Floor Flight Component");
        this.flightAltitude = 500;
        this.flightMultiplier = 5;
        this.originalRelative = false;
        this.originalPosition = false;
        this.flying = false;
        this.readyCallbacks = [];
    },
    type: function() {
        return "FloorFlightComponent";
    },
    fly: function(callback) {
        if (!this.originalPosition) {
            this.originalRelative = mat4.clone(this.node.transform.relative);
            this.originalPosition = mat4.translation(vec3.create(), this.node.transform.relative);
        }
        this.flying = true;
        this.flightSpeed = 0;
        if (callback) this.readyCallbacks.push(callback);
    },
    land: function(callback) {
        if (!this.originalPosition) {
            this.originalRelative = mat4.clone(this.node.transform.relative);
            this.originalPosition = mat4.translation(vec3.create(), this.node.transform.relative);
        }
        this.flying = false;
        this.flightSpeed = 0;
        if (callback) this.readyCallbacks.push(callback);
    },
    isInPlace: function() {
        var position = mat4.translation(vec3.create(), this.node.transform.relative);
        return this.flying && position[1] >= this.originalPosition[1] + this.flightAltitude || !this.flying && position[1] <= this.originalPosition[1];
    },
    callReadyCallbacks: function() {
        if (this.readyCallbacks.length == 0) return;
        for (var c in this.readyCallbacks) {
            var callback = this.readyCallbacks[c];
            callback(this.node);
        }
        this.readyCallbacks = [];
    },
    onUpdate: function(engine) {
        if (!this.originalPosition) return;
        var position = mat4.translation(vec3.create(), this.node.transform.relative);
        var delta = 0;
        var difference = position[1] - this.originalPosition[1];
        if (this.flying) {
            if (position[1] < this.originalPosition[1] + this.flightAltitude) delta = 1 + this.flightMultiplier * difference; else {
                this.callReadyCallbacks();
            }
        } else {
            if (position[1] > this.originalPosition[1]) delta = -(1 + this.flightMultiplier * difference); else {
                this.callReadyCallbacks();
            }
        }
        mat4.translate(this.node.transform.relative, this.node.transform.relative, [ 0, engine.fps.getDelta() / 1e3 * delta, 0 ]);
        var position = mat4.translation(vec3.create(), this.node.transform.relative);
        if (position[1] < this.originalPosition[1]) this.node.transform.relative = mat4.clone(this.originalRelative);
    }
});

var PathComponent = Component.extend({
    init: function(nodes, wayfinder) {
        this._super();
        this.wayfinder = wayfinder;
        this.nodes = nodes;
        this.speed = 10;
        this.stepDistance = .5;
        this.floorPause = 0;
        this.liftStepDistance = .5;
        this.liftingDistance = 1;
        this.position = 0;
        this.finished = false;
        this.paused = false;
        this.floorTime = 0;
        this.floorPaused = false;
        this.followPath = false;
        this.currentPathNode = false;
        this.targetPosition = vec3.create();
        this.targeting = false;
        function getPathMesh(setting, fallback) {
            var id = wayfinder.settings.getModel(setting, 0);
            if (id > 0) {
                var descriptor = new ModelDescriptor(WayfinderAPI.models.model.url(id), "data");
                return descriptor;
            }
            return fallback;
        }
        this.pathMeshSources = {
            start: getPathMesh("path.3d.model.start", "models/PathStart.data"),
            middle: getPathMesh("path.3d.model.middle", "models/PathMiddle.data"),
            end: getPathMesh("path.3d.model.end", "models/PathEnd.data"),
            active: getPathMesh("path.3d.model.active", "models/PathMiddle.data"),
            liftUp: getPathMesh("path.3d.model.liftup", "models/PathLiftUp.data"),
            liftUpIn: getPathMesh("path.3d.model.liftupin", "models/PathLiftUp.data"),
            liftUpOut: getPathMesh("path.3d.model.liftupout", "models/PathLiftUp.data"),
            liftDown: getPathMesh("path.3d.model.liftdown", "models/PathLiftDown.data"),
            liftDownIn: getPathMesh("path.3d.model.liftdownin", "models/PathLiftDown.data"),
            liftDownOut: getPathMesh("path.3d.model.liftdownout", "models/PathLiftDown.data"),
            prestart: getPathMesh("path.3d.model.prestart", "models/PathStart.data"),
            premiddle: getPathMesh("path.3d.model.premiddle", "models/PrePathMiddle.data"),
            preend: getPathMesh("path.3d.model.preend", "models/PathEnd.data"),
            preliftUp: getPathMesh("path.3d.model.preliftup", "models/PathPreLiftUp.data"),
            preliftUpIn: getPathMesh("path.3d.model.preliftupin", "models/PathPreLiftUp.data"),
            preliftUpOut: getPathMesh("path.3d.model.preliftupout", "models/PathPreLiftUp.data"),
            preliftDown: getPathMesh("path.3d.model.preliftdown", "models/PathPreLiftDown.data"),
            preliftDownIn: getPathMesh("path.3d.model.preliftdownin", "models/PathPreLiftDown.data"),
            preliftDownOut: getPathMesh("path.3d.model.preliftdownout", "models/PathPreLiftDown.data"),
            belowstart: "models/PathStart.data",
            belowmiddle: "models/PathMiddle.data",
            belowend: "models/PathStart.data",
            belowliftUp: "models/PathLiftUp.data",
            belowliftUpIn: "models/PathLiftUp.data",
            belowliftUpOut: "models/PathLiftUp.data",
            belowliftDown: "models/PathLiftDown.data",
            belowliftDownIn: "models/PathLiftDown.data",
            belowliftDownOut: "models/PathLiftDown.data"
        };
        this.pathMeshes = {};
        this.resetStructures();
    },
    type: function() {
        return "PathComponent";
    },
    resetStructures: function() {
        this.path = false;
        this.totalPathLength = 0;
        this.floor = false;
        this.cbOnFinish = false;
        this.pathMeshFloors = [];
        this.pathMeshInstances = [];
        this.pathWaitingInstances = [];
        this.position = 0;
        this.floorPause = 0;
        this.floorTime = 0;
        this.floorPaused = false;
    },
    onStart: function(context, engine) {
        for (var i in this.pathMeshSources) {
            var src = this.pathMeshSources[i];
            if (src instanceof ModelDescriptor) {
                this.pathMeshes[i] = engine.assetsManager.modelsManager.addDescriptor(src);
            } else {
                this.pathMeshes[i] = engine.assetsManager.addModel(src);
            }
        }
        var me = this;
        engine.assetsManager.load(function() {
            for (var m in me.pathMeshes) {
                me.pathMeshes[m].onEachChildComponent(function(c) {
                    if (c instanceof RendererComponent) {
                        c.castShadows = false;
                        c.lightContribution = 0;
                    }
                });
            }
        });
    },
    setPath: function(path, cbOnFinish) {
        this.clearPath();
        this.path = path;
        this.cbOnFinish = cbOnFinish;
        this.finished = false;
        this.stepDistance = this.wayfinder.settings.getFloat("path.3d.stride", 1);
        this.speed = this.wayfinder.settings.getFloat("path.3d.speed", 10);
        this.floorPause = this.wayfinder.settings.getFloat("path.floor.pause", 0);
        this.followPath = this.wayfinder.settings.getBoolean("path.3d.follow-path", false);
        if (this.wayfinder.settings.getBoolean("camera.first-person.enabled", false)) {
            this.speed = this.wayfinder.settings.getFloat("camera.first-person.speed", 2);
            var orbitController = this.node.scene.cameraComponent.node.getComponent(OrbitController);
            if (orbitController) {
                this._minimumDistance = orbitController.minimumDistance;
                orbitController.minimumDistance = this.wayfinder.settings.getFloat("camera.first-person.eye-height", 1.68);
            }
        }
        var scale = this.wayfinder.settings.getFloat("path.3d.size", 1);
        var pathScale = vec3.fromValues(scale, scale, scale);
        if (path) {
            if (path.length < 2) return;
            var me = this;
            var place = function(floor, meshType, position, rotationAngle, pathNode) {
                function instantiateNode(meshType) {
                    var mesh = me.pathMeshes[meshType];
                    var node = mesh.instantiate();
                    node.transform.translate(position);
                    node.transform.scale(pathScale);
                    if (rotationAngle) node.transform.rotate(rotationAngle, [ 0, 1, 0 ]);
                    me.node.addNode(node);
                    node.pathNode = pathNode;
                    return node;
                }
                var node = instantiateNode(meshType);
                var prenode = instantiateNode("pre" + meshType);
                var belownode = instantiateNode("below" + meshType);
                var active = instantiateNode("active");
                node.disable();
                belownode.disable();
                active.disable();
                var item = [ node, prenode, belownode, active ];
                me.pathMeshInstances.push(item);
                me.pathWaitingInstances.push(item);
                me.pathMeshFloors.push(floor);
                return node;
            };
            var placeBetween = function(floor, meshType, start, end, offset, endOffset, pathNode) {
                var delta = vec3.subtract(vec3.create(), end, start);
                var d = offset;
                var step = me.stepDistance;
                var deltaLength = vec3.length(delta);
                while (d < deltaLength - endOffset) {
                    place(floor, meshType, vec3.add(vec3.create(), start, vec3.scale(vec3.create(), delta, d / deltaLength)), Math.PI / 2 - Math.atan2(delta[2], delta[0]), pathNode);
                    d += step;
                }
                return d - deltaLength - endOffset;
            };
            var startNode = this.nodes[path[0]];
            var endNode = this.nodes[path[path.length - 1]];
            place(startNode.floor, "start", startNode.position, false, startNode);
            var position = this.nodes[path[0]].position;
            var offset = me.stepDistance;
            for (var i = 1; i < path.length; i++) {
                var pathNode = this.nodes[path[i]];
                if (!pathNode) continue;
                var floor = pathNode.floor;
                var nextPosition = pathNode.position;
                var delta = vec3.subtract(vec3.create(), nextPosition, position);
                this.totalPathLength += vec3.length(delta);
                if (vec2.length(vec2.fromValues(delta[0], delta[2])) < this.stepDistance * 2 && delta[1] > this.liftingDistance) {
                    offset = 0;
                    if (this.liftStepDistance) offset = placeBetween(floor, "liftUp", position, nextPosition, offset, 0, pathNode); else place(floor, "liftUp", position, false, pathNode);
                } else if (vec2.length(vec2.fromValues(delta[0], delta[2])) < this.stepDistance * 2 && delta[1] < -this.liftingDistance) {
                    offset = 0;
                    if (this.liftStepDistance) offset = placeBetween(floor, "liftDown", position, nextPosition, offset, 0, pathNode); else place(floor, "liftDown", nextPosition, false, pathNode);
                } else {
                    offset = placeBetween(floor, "middle", position, nextPosition, offset, i + 1 == path.length ? me.stepDistance / 2 : 0, pathNode);
                }
                position = nextPosition;
            }
            place(endNode.floor, "end", endNode.position, false, endNode);
        }
        this.showCurrentFloor(false);
        this.node.updateChildTransforms();
        if (this.wayfinder.settings.getBoolean("path.3d.top-down", false)) this.setTopView();
        if (!this.followPath) this.zoomOnPath(this.node.getBoundingSphere(), startNode.position);
    },
    clearPath: function() {
        this.resetStructures();
        this.node.removeSubnodes();
    },
    setTopView: function() {
        var orbitController = this.node.scene.cameraComponent.node.getComponent(OrbitController);
        if (!orbitController || !orbitController.target || orbitController.target.isNull()) return;
        orbitController.rotation[0] = -1.53588974;
        orbitController.rotation[2] = 0;
        var kiosk = this.wayfinder.getKioskNode();
        if (kiosk && kiosk.zoom) {
            orbitController.setDistance(kiosk.zoom);
        }
    },
    zoomOnPath: function(bounds, kioskPosition) {
        if (!bounds) return;
        var orbitController = this.node.scene.cameraComponent.node.getComponent(OrbitController);
        if (!orbitController || !orbitController.target || orbitController.target.isNull()) return;
        if (!this.previousRotationSpeed) {
            this.previousRotationSpeed = orbitController.speed;
            orbitController.speed = this.wayfinder.settings.getFloat("path.3d.camera-speed", 2);
        }
        var p = vec3.create();
        vec3.sub(p, kioskPosition, bounds.center);
        vec3.scale(p, p, 2 / 3);
        vec3.add(p, bounds.center, p);
        var b = new BoundingSphere(p, bounds.radius);
        b.encapsulateSphere(bounds);
        vec3.set(orbitController.pan, 0, 0, 0);
        vec3.copy(this.targetPosition, b.center);
        this.targeting = true;
        var size = b.radius * 2.2;
        var fov = Math.min(this.node.scene.cameraComponent.getVerticalFieldOfView(), this.node.scene.cameraComponent.getHorizontalFieldOfView()) * Math.PI / 180;
        orbitController.setDistance((size / Math.sin(fov / 2) - b.radius) * .5);
        var kiosk = this.wayfinder.getKioskNode();
        if (kiosk && !this.wayfinder.settings.getBoolean("path.3d.top-down", false)) {
            orbitController.rotation[0] = -kiosk.rotation[0] / 180 * Math.PI;
            var n = Math.floor(Math.abs(orbitController.currentRotation[1]) / (2 * Math.PI));
            if (orbitController.currentRotation[1] < 2 * Math.PI) {
                orbitController.currentRotation[1] += n * (2 * Math.PI);
            } else {
                orbitController.currentRotation[1] -= n * (2 * Math.PI);
            }
            var kioskZero = kiosk.rotation[1] / 180 * Math.PI;
            if (orbitController.currentRotation[1] > kioskZero + Math.PI) {
                orbitController.rotation[1] = kioskZero + 2 * Math.PI;
            } else if (orbitController.currentRotation[1] < kioskZero - Math.PI) {
                orbitController.rotation[1] = kioskZero - 2 * Math.PI;
            } else {
                orbitController.rotation[1] = kioskZero;
            }
        } else {
            orbitController.rotation[0] = -1.53588974;
        }
        if (this.wayfinder.cbOnZoomChange && typeof this.wayfinder.cbOnZoomChange === "function") {
            this.wayfinder.cbOnZoomChange(orbitController.getZoom());
        }
    },
    moveOnPoint: function(targetNode, dT) {
        var orbitController = this.node.scene.cameraComponent.node.getComponent(OrbitController);
        if (!orbitController || !orbitController.target || orbitController.target.isNull()) return;
        var p = targetNode.transform.getPosition();
        var tmp = orbitController.target.value.getPosition();
        vec3.lerp(tmp, tmp, p, Math.min(1, dT * orbitController.speed));
        orbitController.target.value.setPosition(tmp);
    },
    zoomOnPoint: function(bounds) {
        if (!bounds) return;
        var orbitController = this.node.scene.cameraComponent.node.getComponent(OrbitController);
        if (!orbitController || !orbitController.target || orbitController.target.isNull()) return;
        var loc = this.position / 6;
        var lastSegment = false;
        if (Math.floor(loc) + 1 >= this.path.length) return;
        if (Math.floor(loc) + 2 == this.path.length) lastSegment = true;
        var p0 = this.nodes[this.path[Math.floor(loc)]].position;
        var p1 = this.nodes[this.path[Math.floor(loc + 1)]].position;
        var p2 = null;
        if (!lastSegment) p2 = this.nodes[this.path[Math.floor(loc + 2)]].position;
        var p = vec3.create();
        vec3.sub(p, p1, p0);
        var delta0 = vec3.sub(vec3.create(), p1, p0);
        var delta1 = null;
        if (!lastSegment) delta1 = vec3.sub(vec3.create(), p2, p1);
        vec3.scale(p, p, loc - Math.floor(loc));
        vec3.add(p, p0, p);
        p[1] += this.wayfinder.settings.getFloat("camera.first-person.eye-height", 1.68);
        var b = new BoundingSphere(p, bounds.radius);
        vec3.set(orbitController.pan, 0, 0, 0);
        orbitController.target.value.setPosition(b.center);
        var size = b.radius * 2.2;
        var fov = Math.min(this.node.scene.cameraComponent.getVerticalFieldOfView(), this.node.scene.cameraComponent.getHorizontalFieldOfView()) * Math.PI / 180;
        orbitController.setDistance(0);
        orbitController.rotation[0] = 0;
        var rot0 = Math.PI * 3 / 2 - Math.atan2(delta0[2], delta0[0]);
        rot0 += Math.PI;
        rot0 %= Math.PI * 2;
        rot0 -= Math.PI;
        var rot = rot0;
        var rot1 = 0;
        if (!lastSegment) {
            rot1 = Math.PI * 3 / 2 - Math.atan2(delta1[2], delta1[0]);
            rot1 += Math.PI;
            rot1 %= Math.PI * 2;
            rot1 -= Math.PI;
            while (Math.abs(rot1 - rot0) > Math.PI) {
                if (rot1 - rot0 < 0) rot1 += Math.PI * 2; else rot0 += Math.PI * 2;
            }
            rot = rot0 + (rot1 - rot0) * (loc - Math.floor(loc));
            rot += Math.PI;
            rot %= Math.PI * 2;
            rot -= Math.PI;
        }
        while (Math.abs(rot - orbitController.rotation[1]) > Math.PI) {
            if (rot - orbitController.rotation[1] < 0) rot += Math.PI * 2; else rot -= Math.PI * 2;
        }
        orbitController.rotation[1] = rot;
        if (this.wayfinder.cbOnZoomChange && typeof this.wayfinder.cbOnZoomChange === "function") {
            this.wayfinder.cbOnZoomChange(orbitController.getZoom());
        }
    },
    zoomBetweenNodes: function(startNode, endNode) {
        if (startNode && endNode) {
            var orbitController = this.node.scene.cameraComponent.node.getComponent(OrbitController);
            if (!orbitController || !orbitController.target || orbitController.target.isNull()) return;
            var fov = Math.min(this.node.scene.cameraComponent.getVerticalFieldOfView(), this.node.scene.cameraComponent.getHorizontalFieldOfView()) * Math.PI / 180;
            distance = vec3.create();
            vec3.sub(distance, startNode.position, endNode.position);
            var length = vec3.length(distance) * 1.1;
            orbitController.setDistance(length / Math.sin(fov / 2) - length);
            if (this.wayfinder.cbOnZoomChange && typeof this.wayfinder.cbOnZoomChange === "function") {
                this.wayfinder.cbOnZoomChange(orbitController.getZoom());
            }
        }
    },
    onUpdate: function(engine) {
        if (!this.path) return;
        if (this.paused || this.finished) return;
        var deltaTime = engine.fps.getDelta() / 1e3;
        if (this.floorPaused) {
            this.showCurrentFloor(deltaTime);
            return;
        }
        var orbitController = this.node.scene.cameraComponent.node.getComponent(OrbitController);
        if (orbitController && this.targeting) {
            var tmp = vec3.create();
            orbitController.target.value.getPosition(tmp);
            vec3.lerp(tmp, tmp, this.targetPosition, Math.min(1, deltaTime * orbitController.speed));
            orbitController.target.value.setPosition(tmp);
        }
        var lastPosition = this.position;
        this.position += deltaTime * this.speed;
        if (this.position > this.pathMeshInstances.length && (!this.wayfinder.settings.getBoolean("camera.first-person.enabled", false) || this.wayfinder.settings.getBoolean("camera.first-person.show-path", true)) || this.wayfinder.settings.getBoolean("camera.first-person.enabled", false) && !this.wayfinder.settings.getBoolean("camera.first-person.show-path", true) && this.position / 6 > this.path.length) {
            this.finished = true;
            if (this.wayfinder.settings.getBoolean("camera.first-person.enabled", false)) {
                if (orbitController) {
                    orbitController.minimumDistance = this._minimumDistance;
                    this.wayfinder.setDefaultView();
                }
            }
            this.onPathFinished(this.path);
            if (this.cbOnFinish) {
                this.cbOnFinish();
            }
        }
        var animatePath = true;
        if (this.wayfinder.settings.getBoolean("camera.first-person.enabled", false) && !this.wayfinder.settings.getBoolean("camera.first-person.show-path", true)) {
            animatePath = false;
        }
        if (animatePath) {
            var i = Math.floor(lastPosition);
            var j = Math.floor(this.position) - Math.floor(lastPosition) + i;
            for (;i <= Math.floor(this.position); i++) {
                if (i >= this.pathMeshInstances.length) break;
                if (i == j) {
                    this.pathMeshInstances[i][3].enable();
                } else {
                    this.pathMeshInstances[i][0].enable();
                    this.pathMeshInstances[i][3].disable();
                }
                if (this.pathMeshInstances[i][0].pathNode != this.currentPathNode) {
                    this.currentPathNode = this.pathMeshInstances[i][0].pathNode;
                    this.wayfinder.cbOnPathStep(this.pathMeshInstances[i][0].pathNode);
                }
                this.pathMeshInstances[i][1].disable();
                this.pathWaitingInstances.shift();
            }
            if (i < this.pathMeshInstances.length && this.followPath) this.moveOnPoint(this.pathMeshInstances[i][0], deltaTime);
        }
        if (this.wayfinder.settings.getBoolean("camera.first-person.enabled", false) && !this.finished) {
            this.zoomOnPoint(this.node.getBoundingSphere());
        }
        this.showCurrentFloor(deltaTime);
    },
    onPathFinished: function(path) {
        this.targeting = false;
        if (this.previousRotationSpeed) {
            var orbitController = this.node.scene.cameraComponent.node.getComponent(OrbitController);
            if (orbitController) {
                var dt = this.node.scene.engine.fps.getDelta() / 1e3 * orbitController.speed * 2;
                dt = Math.min(dt, 1);
                orbitController.rotation[0] = lerp(orbitController.currentRotation[0], orbitController.rotation[0], dt);
                orbitController.rotation[1] = lerp(orbitController.currentRotation[1], orbitController.rotation[1], dt);
                orbitController.distance = lerp(orbitController.currentDistance, orbitController.distance, dt);
                orbitController.speed = this.previousRotationSpeed;
            }
            delete this.previousRotationSpeed;
        }
        if (typeof this.wayfinder.cbOnPathFinished == "function") {
            this.wayfinder.cbOnPathFinished(path);
        }
    },
    showCurrentFloor: function(dT) {
        var currentMeshInstance = Math.floor(this.position);
        if (currentMeshInstance >= this.pathMeshInstances.length) return;
        if (this.floor == this.pathMeshFloors[currentMeshInstance] && !this.floorPaused) return;
        if (!this.floorPaused) {
            var previousFloor = this.floor;
            this.floor = this.pathMeshFloors[currentMeshInstance];
            if (this.wayfinder.cbOnBeforeFloorChange && previousFloor) this.wayfinder.cbOnBeforeFloorChange(previousFloor, this.floor, this.pathMeshFloors[this.pathMeshFloors.length - 1]);
        }
        if (dT) {
            this.floorPaused = true;
            this.floorTime += dT;
            if (this.floorTime < this.floorPause) return; else {
                this.floorPaused = false;
                this.floorTime = 0;
            }
        }
        var me = this;
        this.paused = true;
        this.wayfinder.showFloor(this.floor, function(floor) {
            if (me.wayfinder.cbOnFloorChange) me.wayfinder.cbOnFloorChange(floor);
            me.paused = false;
        });
    },
    getInstancesAtFloor: function(floor) {
        var a = [];
        for (var i in this.pathMeshFloors) {
            if (this.pathMeshFloors[i] === floor) {
                a.push(this.pathMeshInstances[i]);
            }
        }
        return a;
    },
    getInstancesBelowFloor: function(floor) {
        var a = [];
        for (var i in this.pathMeshFloors) {
            if (this.pathMeshFloors[i].index < floor.index) {
                a.push(this.pathMeshInstances[i]);
            }
        }
        return a;
    },
    getInstancesAboveFloor: function(floor) {
        var a = [];
        for (var i in this.pathMeshFloors) {
            if (this.pathMeshFloors[i].index > floor.index) {
                a.push(this.pathMeshInstances[i]);
            }
        }
        return a;
    },
    zoomOnPathSegment: function(startNode, endNode) {
        for (var i = 0; i < this.pathMeshInstances.length; i++) {
            if (this.pathMeshInstances[i][0].pathNode == endNode) {
                this.position = i;
                this.showCurrentFloor(100);
                this.moveOnPoint(this.pathMeshInstances[i][0], 1e3);
                this.zoomBetweenNodes(startNode, endNode);
                return;
            }
        }
    }
});

var ScreensaverComponent = Component.extend({
    init: function(wayfinder) {
        this._super();
        this.wayfinder = wayfinder;
        this.destination = false;
        this.destNodeID = -1;
        this.waitTime = 1;
        this.waitedTime = 0;
        this.preWaitedTime = 0;
        this.distance = 0;
        this.minimumDistance = 0;
        this.originalDistance = 1;
        this.paused = false;
        this.movementSpeed = 5;
        this.finishFunction = false;
    },
    type: function() {
        return "ScreensaverComponent";
    },
    setDestination: function(destNode, destNodeID, finFun) {
        this.destination = destNode;
        this.destNodeID = destNodeID;
        this.finishFunction = finFun;
        this.waitedTime = 0;
        this.preWaitedTime = 0;
        this.movementSpeed = this.wayfinder.settings.getFloat("kiosk.screensaver.speed", 5);
        var orbitController = this.node.scene.cameraComponent.node.getComponent(OrbitController);
        if (!orbitController || !orbitController.target || orbitController.target.isNull()) return;
        var delta = vec3.sub(vec3.create(), this.destination.position, orbitController.target.value.getPosition());
        this.distance = vec3.length(delta);
        this.minimumDistance = orbitController.minimumDistance;
        this.originalDistance = orbitController.distance - this.minimumDistance;
        this.showCurrentFloor();
    },
    clearDestination: function() {
        this.destination = false;
        if (this.finFun) this.finFun();
    },
    onUpdate: function(engine) {
        if (this.destination && !this.paused) {
            var dTime = engine.fps.getDelta() / 1e3;
            var orbitController = this.node.scene.cameraComponent.node.getComponent(OrbitController);
            if (!orbitController || !orbitController.target || orbitController.target.isNull()) return;
            orbitController.rotation[0] = -1;
            if (this.preWaitedTime < this.waitTime) {
                this.preWaitedTime += dTime;
                return;
            }
            var target = this.destination.position;
            var speed = this.movementSpeed * dTime;
            var delta = vec3.sub(vec3.create(), target, orbitController.target.value.getPosition());
            if (vec3.length(delta) < speed) {
                orbitController.target.value.setPosition(target);
                this.waitedTime += dTime;
                if (this.waitedTime > this.waitTime) {
                    if (this.finFun) this.finFun();
                    this.wayfinder.showScreensaver();
                    return;
                }
            } else {
                var dir = vec3.normalize(vec3.create(), delta);
                vec3.scale(dir, dir, speed);
                var pos = vec3.add(vec3.create(), orbitController.target.value.getPosition(), dir);
                orbitController.target.value.setPosition(pos);
            }
            orbitController.setDistance(this.minimumDistance + this.originalDistance * (vec3.length(delta) / this.distance));
        }
    },
    showCurrentFloor: function() {
        var me = this;
        me.paused = true;
        this.wayfinder.showFloor(this.destination.floor, function(floor) {
            me.paused = false;
        });
    }
});

var DistanceScalingComponent = Component.extend({
    init: function(camera) {
        this._super();
        this.camera = camera;
        if (!(this.camera instanceof Camera)) {
            throw "DistanceScalingComponent.camera is not an instance of Camera";
        }
        this.minScale = 1;
        this.maxScale = 15;
        this.doingIt = true;
        this.v = vec3.create();
        this.cameraPosition = vec3.create();
        this.localPosition = vec3.create();
        this.localRotation = quat.create();
    },
    type: function() {
        return "DistanceScalingComponent";
    },
    onUpdate: function(engine) {
        if (!this.enabled || !this.doingIt) return;
        this.node.transform.getPosition(this.v);
        this.camera.getPosition(this.cameraPosition);
        vec3.sub(this.v, this.v, this.cameraPosition);
        var scale = vec3.len(this.v) * .1;
        scale = scale < this.minScale ? this.minScale : scale > this.maxScale ? this.maxScale : scale;
        vec3.set(this.v, scale, scale, scale);
        mat4.translation(this.localPosition, this.node.transform.relative);
        quat.fromMat4(this.localRotation, this.node.transform.relative);
        mat4.fromRotationTranslationScale(this.node.transform.relative, this.localRotation, this.localPosition, this.v);
    }
});

var AnimationComponent = Component.extend({
    init: function() {
        this._super();
        this.lowestPosition = vec3.create();
        this.highestPosition = vec3.create();
        this.animationPositions = [ vec3.create(), vec3.create() ];
        this.animating = false;
        this.t = 0;
        this.animationSpeed = 1;
        this.direction = 1;
        this.finish = false;
        this.defaultPosition = vec3.create();
        this.localPosition = vec3.create();
        this.localRotation = quat.create();
        this.localScale = vec3.create();
        this.timeout = 1e4;
    },
    type: function() {
        return "AnimationComponent";
    },
    startAnimating: function() {
        if (this.animating) return;
        this.t = 0;
        this.direction = 1;
        this.animating = true;
        mat4.decompose(this.defaultPosition, this.localRotation, this.localScale, this.node.transform.relative);
        vec3.add(this.animationPositions[0], this.lowestPosition, this.defaultPosition);
        vec3.add(this.animationPositions[1], this.highestPosition, this.defaultPosition);
        this.finish = false;
    },
    stopAnimating: function() {
        if (!this.animating) return;
        this.animating = false;
        this.finish = true;
        mat4.fromRotationTranslationScale(this.node.transform.relative, this.localRotation, this.defaultPosition, this.localScale);
    },
    finishAnimating: function() {
        this.finish = true;
    },
    onUpdate: function(engine) {
        if (!this.enabled || !this.animating) return;
        mat4.decompose(this.localPosition, this.localRotation, this.localScale, this.node.transform.relative);
        vec3.lerp(this.localPosition, this.animationPositions[0], this.animationPositions[1], this.t);
        this.t += engine.fps.getDelta() * this.animationSpeed * .001;
        if (this.t >= 1) {
            if (this.finish && this.direction < 0) {
                return;
            }
            this.animationPositions.reverse();
            this.t = 0;
            this.direction *= -1;
        }
        mat4.fromRotationTranslationScale(this.node.transform.relative, this.localRotation, this.localPosition, this.localScale);
    },
    setLowestPosition: function(coordinateZ) {
        this.lowestPosition = vec3.fromValues(0, coordinateZ, 0);
    },
    setHighestPosition: function(coordinateZ) {
        this.highestPosition = vec3.fromValues(0, coordinateZ, 0);
    },
    setAnimationSpeed: function(speed) {
        this.animationSpeed = speed;
    },
    setAnimationTime: function(time) {
        this.timeout = time;
    }
});

var POIComponent = Component.extend({
    init: function(poi, kioskNode, debugLine) {
        this._super();
        this.poi = false;
        if (poi instanceof POI3D) this.poi = poi;
        this.debugLine = debugLine;
        this.kioskNode = kioskNode;
        this.highlightDuration = 5;
        this.highlightSpeed = 1;
        this.highlightColors = [ vec4.fromValues(1, 0, 0, 1), vec4.fromValues(1, 1, 0, 1) ];
        this.dehighlightColor = vec4.fromValues(0, 0, 0, 1);
        this.highlighting = false;
        this.dehighlighting = false;
        this.t = 0;
        this.originalMaterial = false;
        this.currentColor = new UniformVec4([ 1, 1, 1, 1 ]);
        this.offsetY = 0;
        this.width = 1;
        this.height = 1;
        this.textSize = 1;
        this.textColor = new Color(1, 1, 1, 1);
        this.outlineColor = new Color(0, 0, 0, 0);
        this.outlineWidth = 5;
        this.outline = true;
        this.backgroundColor = new Color(0, 0, 0, 0);
        this.groupColor = null;
        this.disableBillboard = false;
        this.billboardClickable = true;
        this.heightFromFloor = true;
    },
    type: function() {
        return "POIComponent";
    },
    excluded: function() {
        return [ "originalMaterial" ];
    },
    dehighlight: function() {
        if (!this.poi || !this.poi.submesh) return;
        this.dehighlighting = true;
        this.startTime = new Date().getTime();
        var meshRendererComponent = this.poi.meshNode.getComponent(MeshRendererComponent);
        var submeshRenderer = meshRendererComponent.getSubmeshRenderer(this.poi.submesh);
        if (submeshRenderer && submeshRenderer.material && "diffuse" in submeshRenderer.material.uniforms) {
            this.originalMaterial = submeshRenderer.material;
            this.dehighlightColor[3] = this.originalMaterial.uniforms["diffuse"].value[3];
            vec4.copy(this.currentColor.value, this.dehighlightColor);
            submeshRenderer.material = submeshRenderer.material.instantiate();
            submeshRenderer.material.uniforms["diffuse"] = this.currentColor;
        }
    },
    startHighlight: function() {
        if (!this.poi || !this.poi.submesh) return;
        this.highlighting = true;
        this.startTime = new Date().getTime();
        this.t = 0;
        var meshRendererComponent = this.poi.meshNode.getComponent(MeshRendererComponent);
        var submeshRenderer = meshRendererComponent.getSubmeshRenderer(this.poi.submesh);
        if (submeshRenderer && submeshRenderer.material && "diffuse" in submeshRenderer.material.uniforms) {
            this.originalMaterial = submeshRenderer.material;
            for (var i in this.highlightColors) this.highlightColors[i][3] = this.originalMaterial.uniforms["diffuse"].value[3];
            vec4.copy(this.currentColor.value, this.highlightColors[0]);
            submeshRenderer.material = submeshRenderer.material.instantiate();
            submeshRenderer.material.uniforms["diffuse"] = this.currentColor;
        }
    },
    stopHighlight: function() {
        this.highlighting = false;
        this.dehighlighting = false;
        if (this.originalMaterial !== false) {
            var meshRendererComponent = this.poi.meshNode.getComponent(MeshRendererComponent);
            var submeshRenderer = meshRendererComponent.getSubmeshRenderer(this.poi.submesh);
            if (submeshRenderer) submeshRenderer.material = this.originalMaterial;
            this.originalMaterial = false;
        }
    },
    onUpdate: function(engine, pass) {
        if (!this.highlighting && !this.dehighlighting) return;
        var now = new Date().getTime();
        if (now - this.startTime <= this.highlightDuration * 1e3 || Math.abs(this.highlightDuration) < 1e-5) {
            if (this.highlighting) {
                vec4.lerp(this.currentColor.value, this.highlightColors[0], this.highlightColors[1], this.t);
                this.t += engine.fps.getDelta() * this.highlightSpeed * .001;
                if (this.t >= 1) {
                    this.highlightColors.reverse();
                    this.t = 0;
                }
            }
        }
    },
    onStart: function() {
        if (!this.poi) return;
        this.poi.linkMesh();
        var scale = vec3.fromValues(this.width, this.height, 1);
        var textComponent = this.node.getComponent(TextComponent);
        if (textComponent) {
            textComponent.color = this.textColor;
            textComponent.backgroundColor = this.backgroundColor;
            textComponent.outline = this.outline;
            textComponent.outlineColor = this.outlineColor;
            textComponent.outlineWidth = this.outlineWidth;
            textComponent.updateText();
            vec3.set(scale, this.textSize, this.textSize, this.textSize);
        }
        if (this.poi.meshNode && this.disableBillboard) {
            this.positionToMeshCenter();
        } else {
            if (this.heightFromFloor) {
                var bounds = this.poi.floor.node3D.getBoundingBox();
                var plane = new Plane();
                plane.setByNormalAndPoint([ 0, -1, 0 ], bounds.max);
                var d = plane.getDistanceToPoint(this.poi.node.position);
                if (d < 0) d = 0;
                mat4.fromRotationTranslationScale(this.node.transform.relative, quat.create(), [ 0, d + this.offsetY, 0 ], scale);
            } else {
                mat4.fromRotationTranslationScale(this.node.transform.relative, quat.create(), [ 0, this.offsetY, 0 ], scale);
            }
        }
        if (this.groupColor && this.poi.meshNode) {
            var meshRendererComponent = this.poi.meshNode.getComponent(MeshRendererComponent);
            var submeshRenderer = meshRendererComponent.getSubmeshRenderer(this.poi.submesh);
            if (submeshRenderer) {
                var material = submeshRenderer.material;
                if (material && material.uniforms && "diffuse" in material.uniforms) {
                    var instance = material.instantiate();
                    submeshRenderer.material = instance;
                    vec4.copy(instance.uniforms["diffuse"].value, this.groupColor);
                }
            }
        }
    },
    getConcaveHull: function(center, name) {
        if (!this.poi.submesh) return;
        var meshRendererComponent = this.poi.meshNode.getComponent(MeshRendererComponent);
        var submeshRenderer = meshRendererComponent.getSubmeshRenderer(this.poi.submesh);
        var s = submeshRenderer.submesh;
        var matrix = submeshRenderer.matrix;
        function cmpFloat(a, b) {
            var EPSILON = 1e-5;
            var absA = Math.abs(a);
            var absB = Math.abs(b);
            var diff = Math.abs(a - b);
            if (a == b) return true; else if (a * b == 0) return diff < EPSILON * EPSILON; else return diff / (absA + absB) < EPSILON;
        }
        function mergeVertices(points, triangles) {
            var visited = {};
            for (var i = 0; i < points.length; i++) {
                visited[i] = true;
                for (var j = 0; j < points.length; j++) {
                    if (i == j || j in visited) continue;
                    if (cmpFloat(points[i][0], points[j][0]) && cmpFloat(points[i][1], points[i][1])) {
                        for (var k = 0; k < triangles.length; k++) {
                            if (triangles[k] == j) triangles[k] = i;
                        }
                    }
                }
            }
        }
        var rotationY = this.poi.node.rotation ? this.poi.node.rotation[1] * Math.PI / 180 : 0;
        var points = [];
        if (!s.faces) return;
        var triangles = s.faces.slice();
        var cacheMat = mat2.create();
        var cacheVec = vec3.create();
        for (var i = 0; i < s.positions.length; i += 3) {
            var point = vec3.transformMat4(vec3.create(), vec3.fromValues(s.positions[i], s.positions[i + 1], s.positions[i + 2]), matrix);
            points.push(vec2.fromValues(point[0], point[2]));
        }
        var startIndex = 0;
        for (var i = 1; i < points.length; i++) {
            if (points[i][0] > points[startIndex][0]) startIndex = i;
        }
        function getSignedAngle(v1, v2) {
            var perpDot = v1[0] * v2[1] - v1[1] * v2[0];
            return Math.atan2(perpDot, vec2.dot(v1, v2));
        }
        function findSmallestAngleTo(axis, origin, edges) {
            var smallest = 1e20;
            var index = -1;
            for (var i = 0; i < edges.length; i++) {
                var v = vec2.normalize(vec2.create(), vec2.sub(vec2.create(), points[origin], points[edges[i]]));
                var a = getSignedAngle(axis, v);
                if (a < smallest) {
                    smallest = a;
                    index = edges[i];
                }
            }
            return index;
        }
        function findEdges(index) {
            var ret = [];
            for (var i = 0; i < triangles.length; i += 3) {
                for (var v = 0; v < 3; v++) {
                    if (triangles[i + v] == index) {
                        if (ret.indexOf(triangles[i + (v + 1) % 3]) == -1) ret.push(triangles[i + (v + 1) % 3]);
                        if (ret.indexOf(triangles[i + (v + 2) % 3]) == -1) ret.push(triangles[i + (v + 2) % 3]);
                        break;
                    }
                }
            }
            return ret;
        }
        function findNextOutlinePoint(originIndex, previousEdgeVector, prev) {
            var e = findEdges(originIndex);
            var edges = new Array();
            for (var i in e) {
                if (prev.indexOf(e[i]) == -1) edges.push(e[i]);
            }
            return findSmallestAngleTo(previousEdgeVector, originIndex, edges);
        }
        var solution = new Array();
        var axis = vec2.fromValues(1, 0);
        var index = startIndex;
        var success = points.length + 1;
        var previous = new Array();
        previous.push(index);
        while (success > 0) {
            while (previous.length > 2) {
                previous.shift();
            }
            var next = findNextOutlinePoint(index, axis, previous);
            if (next == -1) {
                break;
            }
            previous.push(next);
            solution.push(next);
            vec2.normalize(axis, vec2.sub(axis, points[index], points[next]));
            index = next;
            if (index == startIndex) break;
            success--;
        }
        if (!success) {
            return;
        }
        var ret = new Array();
        for (var i in solution) {
            ret.push(points[solution[i]]);
        }
        return ret;
    },
    calculateEdgeAngleFromAxis: function(a, b) {
        var v1 = vec2.fromValues(b[0] - a[0], b[1] - a[1]);
        var axis = vec2.fromValues(1, 0);
        var axis2 = vec2.fromValues(-1, 0);
        var dot2 = vec2.dot(v1, axis2);
        var len2 = vec2.len(v1) * vec2.len(axis2);
        var dot = vec2.dot(v1, axis);
        var len = vec2.len(v1) * vec2.len(axis);
        var angle1 = Math.acos(dot / len);
        var angle2 = Math.acos(dot2 / len2);
        if (angle2 < angle1) {
            return [ angle2, -1 ];
        } else return [ angle1, 1 ];
    },
    calculateRotatedAreaBounds: function(hull) {
        var minArea = Infinity;
        var maxBounds;
        var maxAngle = 0;
        var angle = 0;
        var realAnge = 0;
        var bounds;
        var direction = 1;
        var edgeA, edgeB;
        var edgeLen = 0;
        var _vec = vec2.create();
        var __vec = vec2.create();
        for (var i = 0; i < hull.length - 1; i++) {
            angle = this.calculateEdgeAngleFromAxis(hull[i], hull[i + 1]);
            realAnge = angle[1] === -1 ? angle[0] : Math.PI - angle[0];
            bounds = this.calculateBounds(hull, realAnge);
            if (Math.abs(bounds[2] * bounds[3]) < minArea) {
                minArea = Math.abs(bounds[2] * bounds[3]);
                edgeA = hull[i];
                edgeB = hull[i + 1];
                maxBounds = bounds;
                direction = angle[1];
                maxAngle = direction * angle[0];
            } else if (Math.abs(bounds[2] * bounds[3]) == minArea) {
                vec2.sub(__vec, edgeA, edgeB);
                vec2.sub(_vec, hull[i], hull[i + 1]);
                edgeLen = vec2.len(__vec);
                if (vec2.len(_vec) > vec2.len(__vec)) {
                    minArea = Math.abs(bounds[2] * bounds[3]);
                    edgeA = hull[i];
                    edgeB = hull[i + 1];
                    maxBounds = bounds;
                    direction = angle[1];
                    maxAngle = direction * angle[0];
                }
            }
        }
        if (!maxBounds) return false;
        var corner = vec2.fromValues(maxBounds[0], maxBounds[1]);
        var center = vec2.fromValues(maxBounds[2] / 2, maxBounds[3] / 2);
        center = this.rotatePoint(center, maxAngle);
        if (direction == -1) {
            vec2.add(center, corner, center);
        } else {
            vec2.sub(center, corner, center);
        }
        return {
            edge: [ edgeA, edgeB, vec2.sub(vec2.create(), edgeA, edgeB), this.getOrientation(edgeA, edgeB, center) ],
            angle: maxAngle,
            bounds: {
                corner: corner,
                width: maxBounds[2],
                height: maxBounds[3]
            },
            center: center,
            direction: direction
        };
    },
    calculateBounds: function(polygon, rotation) {
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;
        var point;
        for (var i = 0; i < polygon.length; i++) {
            point = polygon[i];
            if (rotation) {
                point = this.rotatePoint(point, rotation);
            }
            minX = Math.min(minX, point[0]);
            minY = Math.min(minY, point[1]);
            maxX = Math.max(maxX, point[0]);
            maxY = Math.max(maxY, point[1]);
        }
        point = this.rotatePoint(vec2.fromValues(minX, minY), -rotation);
        return [ point[0], point[1], maxX - minX, maxY - minY, maxX, maxY ];
    },
    rotatePoint: function(point, angle) {
        var x = point[0] * Math.cos(angle) - point[1] * Math.sin(angle);
        var y = point[1] * Math.cos(angle) + point[0] * Math.sin(angle);
        return vec2.fromValues(x, y);
    },
    getOrientation: function(p1, p2, p) {
        var orin = (p2[0] - p1[0]) * (p[1] - p1[1]) - (p[0] - p1[0]) * (p2[1] - p1[1]);
        if (orin > 0) return -1;
        if (orin < 0) return 1;
        return 0;
    },
    positionToMeshCenter: function() {
        if (!this.kioskNode) return;
        var meshRendererComponent = this.poi.meshNode.getComponent(MeshRendererComponent);
        var submeshRenderer = meshRendererComponent.getSubmeshRenderer(this.poi.submesh);
        var component = this.node.getComponent(MeshRendererComponent);
        if (!(component && component.meshRenderers)) {
            console.warn(this.poi.getName("en"), "no meshRenderers");
            return;
        }
        var textBounds = component.meshRenderers[0].globalBoundingBox;
        var center = submeshRenderer.globalBoundingBox;
        var bounds = submeshRenderer.localBoundingBox;
        var plane = new Plane();
        var rotate = 0;
        var concaveHull = this.getConcaveHull(center.center, this.poi.getName("en"));
        var area;
        var meshSize = Math.min(bounds.size[0], bounds.size[1]);
        plane.setByNormalAndPoint([ 0, -1, 0 ], center.max);
        var d = plane.getDistanceToPoint(this.poi.node.position);
        if (d < 0) d = 0;
        var newPosition = vec3.fromValues(center.center[0] - this.poi.node.position[0], this.poi.node.position[1] + d + .15, center.center[2] - this.poi.node.position[2]);
        if (concaveHull && this.kioskNode) {
            area = this.calculateRotatedAreaBounds(concaveHull);
            if (area && area.bounds) {
                meshSize = area.bounds.width;
                rotate = Math.round(area.angle * (180 / Math.PI) + this.kioskNode.rotation[1]);
                vec3.set(newPosition, area.center[0] - this.poi.node.position[0], newPosition[1], area.center[1] - this.poi.node.position[2]);
            } else {
                console.warn("no area", this.poi.getName("en"), area, concaveHull);
            }
        } else {
            console.warn("nohull", this.poi.getName("en"), concaveHull);
        }
        var scale2 = Math.min(bounds.size[0], bounds.size[1]);
        var ratio = meshSize / textBounds.size[0];
        var scale = vec3.fromValues(ratio * .95, ratio * .95, 1);
        mat4.fromRotationTranslationScale(this.node.transform.relative, quat.euler(quat.create(), -90, rotate, 0), newPosition, scale);
    }
});

var POIController = Controller.extend({
    init: function(wayfinder) {
        this._super("POI Controller");
        this.wayfinder = wayfinder;
        this.meshIDToPath = {};
        this.highlights = [];
        this.displaying = [];
        this.deHighlightPOIs = this.wayfinder.settings.getBoolean("poi.dehighlight.enabled", false);
    },
    type: function() {
        return "POIController";
    },
    getMeshInfo: function(node, submesh) {
        if (!node || !submesh) return false;
        var material = false;
        var path = [];
        var meshComponent = node.getComponent(MeshComponent);
        if (meshComponent) {
            var mesh = meshComponent.mesh;
            for (var i in mesh.submeshes) {
                if (mesh.submeshes[i] === submesh) {
                    material = mesh.getMaterial(submesh.materialIndex);
                    path.push("mesh-" + i);
                    break;
                }
            }
        }
        var n = node;
        var floor = false;
        while (n) {
            if (n.getComponent(FloorComponent)) {
                floor = n.getComponent(FloorComponent).floor;
                break;
            }
            path.push(n.name);
            n = n.parent;
        }
        path.reverse();
        return {
            path: path.join("/"),
            floor: floor,
            material: material
        };
    },
    getMeshInfoByID: function(mesh_id) {
        if (mesh_id in this.meshIDToPath) return this.meshIDToPath[mesh_id];
        return false;
    },
    onClick: function(position, button, type, event) {
        var ray = this.node.scene.cameraComponent.screenPointToRay(position);
        if (ray) {
            var result = this.node.scene.dynamicSpace.rayCast(ray, Layers.POI);
            var nearest = result.nearest();
            if (nearest) {
                var poiComponent = nearest.collider.node.getComponent(POIComponent);
                if (poiComponent) this.onPOIClick(poiComponent.poi);
            } else {
                result = this.node.scene.dynamicSpace.rayCast(ray, Layers.Default);
                nearest = result.nearest();
                if (nearest) {
                    var info = this.getMeshInfo(nearest.node, nearest.submesh);
                    var meshID = info.floor.getMeshIDByPath(info.path);
                    if (meshID) {
                        for (var i in info.floor.pois) {
                            if (info.floor.pois[i].mesh_id == meshID) {
                                this.onPOIClick(info.floor.pois[i], position, event);
                                return;
                            }
                        }
                        if (this.wayfinder.settings.getBoolean("poi.3d.check-other-floors", false)) {
                            for (var i in this.wayfinder.pois) {
                                if (this.wayfinder.pois[i].mesh_id == meshID) {
                                    this.onPOIClick(this.wayfinder.pois[i], position, event);
                                    return;
                                }
                            }
                        }
                    }
                    if (this.wayfinder.logic.currentFloor) {
                        var pois = this.wayfinder.logic.currentFloor.pois;
                        var maxDist = this.wayfinder.settings.getFloat("poi.activation.radius", 10);
                        var duration = this.wayfinder.settings.getFloat("poi.activation.duration", 3);
                        for (var i in pois) {
                            if (!pois[i].object || pois[i].type == "utility" || pois[i].visible) continue;
                            var pos = mat4.translation(vec3.create(), pois[i].object.transform.absolute);
                            if (vec3.distance(pos, nearest.point) <= maxDist) pois[i].show(duration);
                        }
                    }
                }
            }
        }
    },
    onPOIClick: function(poi, position, event) {
        this.clearHighlights();
        this.setHighlights([ poi ]);
        this.wayfinder.onPOIClick(poi, position, event);
    },
    setHighlights: function(pois) {
        if (pois && typeof pois === "object") {
            var poi;
            for (var i = 0; i < pois.length; i++) {
                poi = pois[i];
                if (poi instanceof POI3D) {
                    this.highlights.push(poi);
                    poi.highlight();
                }
            }
            if (this.deHighlightPOIs) {
                for (var i in this.wayfinder.pois) {
                    poi = this.wayfinder.pois[i];
                    if (poi instanceof POI3D && !(poi in this.highlights)) {
                        poi.dehighlight();
                    }
                }
            }
        }
    },
    clearHighlights: function() {
        for (var i = 0; i < this.highlights.length; i++) {
            this.highlights[i].stopHighlight();
        }
        this.highlights.length = 0;
    },
    setDisplaying: function(pois) {
        var poi;
        if (pois && typeof pois === "object") {
            for (var i = 0; i < pois.length; i++) {
                poi = pois[i];
                if (poi instanceof POI3D) {
                    poi.show();
                    this.displaying.push(poi);
                }
            }
        }
    },
    clearDisplaying: function() {
        var poi;
        for (var i = 0; i < this.displaying.length; i++) {
            poi = this.displaying[i];
            if (!poi.isAlwaysVisible()) {
                poi.hide();
            }
        }
        this.displaying.length = 0;
    },
    hidePOIs: function(pois) {
        for (var i in pois) {
            if (!(pois[i] in this.displaying)) {
                pois[i].hide();
            }
        }
    },
    showPOIs: function(pois) {
        for (var i in pois) {
            if (pois[i].alwaysVisible || pois[i].type == "utility" || this.poiInArray(pois[i], this.displaying)) {
                pois[i].show();
            }
        }
    },
    stopAnimatingPOIs: function(pois, nodeId) {
        for (var i in pois) {
            if (nodeId && pois[i].node_id == nodeId) {
                continue;
            } else {
                pois[i].stopAnimating();
            }
        }
    },
    poiInArray: function(poi, pois) {
        for (var i in pois) {
            if (pois[i].id == poi.id) {
                return true;
            }
        }
        return false;
    }
});

var WayfinderOrbitController = SmoothOrbitController.extend({
    init: function(wayfinder) {
        this._super();
        this.wayfinder = wayfinder;
        this.lastPinch = 0;
        this.lastRotation = 0;
        this.lastDeltaX = 0;
        this.lastDeltaY = 0;
        this.rotatingEnabled = true;
        this.rotatingTouchEnabled = true;
    },
    setZoom: function(percentage) {
        this._super(percentage);
        this.wayfinder.onZoomChange(this.getZoom());
    },
    zoomIn: function(deltaTime) {
        this._super(deltaTime);
        this.wayfinder.onZoomChange(this.getZoom());
    },
    zoomOut: function(deltaTime) {
        this._super(deltaTime);
        this.wayfinder.onZoomChange(this.getZoom());
    },
    onMouseMove: function(position, button, delta) {
        if (this.rotateButton !== false && button == this.panButton && this.rotatingEnabled) {
            this.rotate(delta[1], delta[0]);
        }
        if (this.panButton !== false && button == this.rotateButton) {
            this.move(delta[0], delta[1]);
        }
    },
    onPan: function(position, deltaChange, type, event) {
        var rotateSpeed = vec2.len(deltaChange);
        var rotateSpeedLR = rotateSpeed * .8;
        if (this.rotatingTouchEnabled) {
            if (event.type === "panup") {
                this.rotate(-rotateSpeed, 0);
            }
            if (event.type === "pandown") {
                this.rotate(rotateSpeed, 0);
            }
            if (event.type === "panleft") {
                this.rotate(0, -rotateSpeedLR);
            }
            if (event.type === "panright") {
                this.rotate(0, rotateSpeedLR);
            }
        } else {
            this.move(deltaChange[0], deltaChange[1]);
        }
    },
    onMultiDrag: function(event) {
        var ev = event.gesture;
        if (Math.abs(ev.angle) > 100) {
            if (ev.direction == "down") {
                this.rotate(0, 1);
            } else if (ev.direction == "up") {
                this.rotate(0, 1);
            }
        }
    },
    onRotate: function(position, rotation, type, event) {
        if (this.rotatingEnabled) this.rotateY(rotation);
    },
    rotateX: function(deg) {
        var rad = deg * (Math.PI / 180);
        this.rotation[0] = this.rotation[0] + rad;
    },
    rotateY: function(deg) {
        var rad = deg * (Math.PI / 180);
        this.rotation[1] = this.rotation[1] + rad;
    },
    rotateZ: function(deg) {
        var rad = deg * (Math.PI / 180);
        this.rotation[2] = this.rotation[2] + rad;
    },
    onDrag: function(event) {
        event.gesture.preventDefault();
        if (event.gesture) {
            this.move(-(event.gesture.deltaX - this.lastDeltaX), -(event.gesture.deltaY - this.lastDeltaY));
            this.lastDeltaX = event.gesture.deltaX;
            this.lastDeltaY = event.gesture.deltaY;
        }
    },
    onTouchRelease: function() {
        this.lastPinch = 0;
        this.lastRotation = 0;
        this.lastDeltaY = 0;
        this.lastDeltaX = 0;
    },
    move: function(xDelta, yDelta) {
        var delta = vec3.create();
        vec3.scale(delta, this.panXAxis, -xDelta);
        vec3.add(delta, delta, vec3.scale(vec3.create(), this.panYAxis, -yDelta));
        delta = vec3.scale(delta, delta, this.distance / 900);
        var q = quat.fromMat4(quat.create(), this.node.transform.absolute);
        var dir = vec3.fromValues(0, 0, 1);
        vec3.transformQuat(dir, dir, q);
        var angle = Math.atan2(dir[2], dir[0]);
        angle -= Math.PI / 2;
        quat.identity(q);
        quat.rotateY(q, q, angle);
        quat.conjugate(q, q);
        quat.normalize(q, q);
        vec3.transformQuat(delta, delta, q);
        vec3.add(this.pan, this.pan, delta);
        this.pan[0] = Math.max(this.pan[0], this.minimumPan[0]);
        this.pan[1] = Math.max(this.pan[1], this.minimumPan[1]);
        this.pan[2] = Math.max(this.pan[2], this.minimumPan[2]);
        this.pan[0] = Math.min(this.pan[0], this.maximumPan[0]);
        this.pan[1] = Math.min(this.pan[1], this.maximumPan[1]);
        this.pan[2] = Math.min(this.pan[2], this.maximumPan[2]);
        this.onChange("move", xDelta, yDelta);
    },
    enableRotation: function(flag) {
        this.rotatingEnabled = flag;
    },
    enableTouchRotation: function(flag) {
        this.rotatingTouchEnabled = flag;
    }
});

var YAHComponent = Component.extend({
    init: function(kioskNode) {
        this._super("YAH Component");
        this.kioskNode = kioskNode;
        this.offsetY = 0;
    },
    type: function() {
        return "YAHComponent";
    },
    onStart: function() {
        if (!this.kioskNode) return;
        var bounds = this.kioskNode.floor.node3D.getBoundingBox();
        var plane = new Plane();
        plane.setByNormalAndPoint([ 0, -1, 0 ], bounds.max);
        var d = plane.getDistanceToPoint(this.kioskNode.position);
        if (d < 0) d = 0;
        mat4.fromRotationTranslation(this.node.transform.relative, quat.create(), [ 0, d + this.offsetY, 0 ]);
    }
});