let ports = [];

chrome.runtime.onConnect.addListener(function (p) {
    console.log("accept connect:%o", p);
    p.onDisconnect.addListener(handleDisconnect);
    ports.push(p);

    p.postMessage({theme:theme()});
});

function handleDisconnect(port) {
    if (port.error) {
        console.log(`Disconnected due to an error: ${p.error.message}`);
    }
    let i = ports.indexOf(port);
    ports.splice(i, 1);
    console.log("disconnected");
}

function send(msg) {
    console.log("send message:%o", msg);
    if (ports.length > 0) {
        ports.forEach(function (port) {
            try {
                port.postMessage(msg);
            } catch (e) {
                console.log("post message failed due to:", e);
            }
        });
    }
}

function theme(t) {
    if (t) {
        localStorage.theme = t;
    }

    if (!localStorage.theme) {
        localStorage.theme = "highlight/styles/a11y-dark.css";
    }

    return localStorage.theme;
}