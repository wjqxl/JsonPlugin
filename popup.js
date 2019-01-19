let select = document.getElementById("them"),
    options = select.options,
    bg = chrome.extension.getBackgroundPage(),
    theme = bg.theme();

select.onchange = function () {
    bg.theme(select.value);
    bg.send({theme: select.value});
};

for (let i = 0; i < options.length; i++) {
    let option = options.item(i);
    if (option.value == theme) {
        option.selected = true;
        break;
    }
}


