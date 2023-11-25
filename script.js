chrome.runtime.onMessage.addListener(({ name, data }) => {
    if(name === 'megamarket') {
        let table = document.getElementsByClassName("table")[0];
        data.value.forEach((elem) => {
            let row = table.insertRow();
            let c1 = row.insertCell();
            let c2 = row.insertCell();
            let c3 = row.insertCell();

            c1.innerHTML = elem.total;
            c2.innerHTML = elem.price;
            c3.innerHTML = "<a href=\"" + elem.link + "\">link</a>";
        });
    }
  });

chrome.runtime.sendMessage({ name: 'megamarket' });
