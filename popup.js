$(function () {
    // retrieve value from storage and populate when the popup is opened
    chrome.storage.sync.get('watchList', function (result) {
        if (result.watchList) {
            renderItems(result.watchList);
            window.watchList = new Set(result.watchList);
        } else {
            window.watchList = [];
        }
    });

    // process saving the value and displaying it on popup
    $('#Submit').click(function () {
        let userInput = $('#Input').find(":selected").text();
        if (userInput) {
            window.watchList = new Set(Array.from(window.watchList));
            window.watchList.add(userInput);
            window.watchList = Array.from(window.watchList);
        }

        chrome.storage.sync.set({ 'watchList': window.watchList });

        chrome.runtime.sendMessage({ watchList: window.watchList }, function (response) {
            renderItems(window.watchList);
        });
    });
});


function renderItems(watchList) {
    //TODO
}

function renderList(key) {
    //TODO
}
