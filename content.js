let port = chrome.runtime.connect(), id = "theme";
if (port) {
    port.onMessage.addListener(function (msg) {
        console.log("receive message:%o", msg);
        let themeElem = document.getElementById(id);
        themeElem ? themeElem.remove() : 0;
        injectCss(msg.theme, id);
    });
    port.onDisconnect.addListener(function (p) {
        if (p.error) {
            console.log("disconnected due to an error:%s.", p.error.message);
        }
        console.log("disconnected with extension.");
    });
}

function extractData(rawText) {
    var tokens, text = rawText.trim();

    function test(text) {
        return ((text.charAt(0) == "[" && text.charAt(text.length - 1) == "]") || (text.charAt(0) == "{" && text.charAt(text.length - 1) == "}"));
    }

    if (test(text))
        return {
            text: rawText,
            offset: 0
        };
    tokens = text.match(/^([^\s\(]*)\s*\(([\s\S]*)\)\s*;?$/);
    if (tokens && tokens[1] && tokens[2]) {
        if (test(tokens[2].trim()))
            return {
                fnName: tokens[1],
                text: tokens[2],
                offset: rawText.indexOf(tokens[2])
            };
    }
}

function injectJs(filename, cb, end) {
    let url = chrome.extension.getURL(filename);
    let script = document.createElement("script");
    script.src = url;
    if (typeof cb == "function") {
        script.onload = cb;
    } else {
        end = cb;
    }
    if (end) {
        document.body.appendChild(script);
    } else {
        document.head.appendChild(script);
    }
}

function injectCss(filename, id) {
    let url = chrome.extension.getURL(filename);
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    if (id) {
        link.id = id;
    }
    document.head.appendChild(link);
}

function load() {
    var child, data;
    if (document.body && (document.body.childNodes[0] && document.body.childNodes[0].tagName == "PRE" || document.body.children.length == 0)) {
        child = document.body.children.length ? document.body.childNodes[0] : document.body;
        data = extractData(child.innerText);
        if (data) {

            let jsonObj = JSON.parse(data.text);
            let json = JSON.stringify(jsonObj, null, 4);
            child.innerHTML = '<pre style="margin: 0px;"><code class="json">' + json + '</code></pre>';

            injectCss("normalize.css");
            injectJs("highlight/highlight.pack.js", function () {
                injectJs("inject.js");
            });
        }
    }
}

load();