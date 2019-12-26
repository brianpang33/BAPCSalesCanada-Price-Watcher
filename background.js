chrome.storage.sync.get('data', function (result) {
    if (result.data) {
        window.data = result.data;
    } else {
        window.data = {
            CASE: [],
            CPU: [],
            GPU: [],
            HDD: [],
            MOBO: [],
            MONITOR: [],
            PSU: [],
            RAM: [],
            SSD: [],
        }
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.watchList) {
        processRedditlistings(request.watchList).then(function (result) {
            console.log(result);
            sendResponse({ message: result });
        }).catch(function (err) {
            console.log(err);
        });
    } else {
        sendResponse({ message: "failed" });
    }
    return true;
});

function processRedditlistings(watchList) {
    return new Promise(function (resolve, reject) {
        getRedditlistings().then(function (result) {
            if (result.data.children) {
                for (children of result.data.children) {
                    let key = watchList.find(v => children.data["title"].toUpperCase().includes(v.toUpperCase()));
                    if (key) {
                        let url = "https://www.reddit.com" + children.data["permalink"];
                        processEntries(children.data["title"], url, key);
                    }
                }
            }
            resolve(window.data);
        });
    });
}

function getRedditlistings() {
    return new Promise(function (resolve, reject) {
        //https://www.reddit.com/r/bapcsalescanada/new.json?limit=10
        $.getJSON("sampleRedditData.json", function (response, status) {
            if (response) {
                resolve(response);
            } else {
                reject();
            }
        });
    });
}

function processEntries(title, url, key) {
    if (window.data[key].length === 0) {
        window.data[key].push({title: title, url: url});
        chrome.storage.sync.set({ 'data': window.data });
    } else {
        let titles = [];
        for (entry of window.data[key]) {
            titles.push(entry.title);
        }

        if (!titles.some(v => title === v)) {
            window.data[key].push({title: title, url: url});
            chrome.storage.sync.set({ 'data': window.data });
        }
    }
}

// setInterval(function() {
//     chrome.storage.sync.get('watchList', function (result) {
//         if (result.watchList) {
//             processRedditlistings(result.watchList).then(function(result) {
//                 return;
//             }).catch(function(err) {
//                 console.log(err);
//             });
//         }
//     });
// }, 5000);