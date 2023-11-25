async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getPrice() {
    let res = [];

    let blocks = document.querySelectorAll(".item-block");
    blocks.forEach((elem) => {
        let price = elem.getElementsByClassName("item-price")[0];
        if(price)
            price = price.outerText.replaceAll(' ', '').replaceAll('₽', '');
        else
            return;

        let bonus = elem.getElementsByClassName("bonus-amount")[0]
        if(bonus)
            bonus = bonus.outerText.replaceAll(' ', '');
        else
            return;

        let link = elem.getElementsByClassName("ddl_product_link")[0].href;

        let total = price - bonus;
        res.push({ total, price, link });
    })

    return res;
}

async function getList(i) {
    let tab = await chrome.tabs.create({ url: "https://megamarket.ru/catalog/igrovye-pristavki-playstation/set-ps-5/page-" + i, active: false });

    do {
        await sleep(500);
        tab = await chrome.tabs.get(tab.id);
    }
    while(tab.status != "complete");

    let res = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: getPrice });

    chrome.tabs.remove(tab.id);

    return res[0].result;
}

async function process() {
    let res = [];

    await Promise.all([getList(1), getList(2), getList(3), getList(4)]).then((lists) => {
        lists.forEach((list) => {
            list.forEach((elem) => {
                res.push(elem);
            });
        });
    });

    res.sort(function (a, b) { return a.total - b.total });
    res = res.filter((item) => { return item.total < 60000; })

    chrome.runtime.sendMessage({
        name: 'megamarket',
        data: { value: res }
    });

}

chrome.runtime.onMessage.addListener(({ name, data }) => {
    if(name === 'megamarket')
        process();
});
