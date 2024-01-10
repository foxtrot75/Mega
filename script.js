chrome.runtime.onMessage.addListener(({ name, data }) => {
    if(name === 'data') {
        let tbody = document.getElementById("table").getElementsByTagName('tbody')[0];
        tbody.innerHTML = "";
        data.value.forEach((elem) => {
            let row = tbody.insertRow();
            let c1 = row.insertCell();
            let c2 = row.insertCell();
            let c3 = row.insertCell();

            c1.innerHTML = elem.total;
            c2.innerHTML = elem.price;
            c3.innerHTML = "<a href=\"" + elem.link + "\">link</a>";
        });
    }
});

function update() {
    chrome.runtime.sendMessage({ name: 'update' });
}

document.getElementById("button").addEventListener("click", update)

chrome.runtime.sendMessage({ name: 'load' });
