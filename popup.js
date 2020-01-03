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
    $('#Add').click(function () {
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

    $('#Delete').click(function() {
        let userInput = $('#Input').find(":selected").text();
        chrome.storage.sync.get('watchList', function (result) {
            let index = Array.from(result.watchList).indexOf(userInput);
            if (index > -1) {
                result.watchList.splice(index, 1);
                window.watchList = result.watchList;
                chrome.storage.sync.set({ 'watchList': window.watchList });
                renderItems(window.watchList);
            }
        });
    });
});


function renderItems(watchList) {
    $('#itemList').empty();
    for (let i = 0; i < watchList.length; i++) {
        renderList(watchList[i]).then(function(result) {
            if (result !== undefined) {
                $('#itemList').append(
                    '<div class="card">' +
                        '<div class="card-header" id="heading' + i + '">' +
                            '<h5 class="mb-0">' +
                                '<button class="btn btn-link" data-toggle="collapse" data-target="#collapse' + i + '" aria-expanded="true" aria-controls="collapse' + i + '">' +
                                    watchList[i] +
                                '</button>' +
                             '</h5>' +
                        '</div>' +

                        '<div id="collapse' + i + '" class="panel-collapse collapse in" aria-labelledby="heading' + i + '" data-parent="#itemList">' +
                            '<ul class="list-group">' + result +
                            '</div>' +
                        '</div>' +
                    '</div>'
                )
            } else {
                $('#itemList').append(
                    '<div class="card">' +
                        '<div class="card-header" id="heading' + i + '">' +
                            '<h5 class="mb-0">' +
                                '<button class="btn btn-link" data-toggle="collapse" data-target="#collapse' + i + '" aria-expanded="true" aria-controls="collapse' + i + '">' +
                                    watchList[i] +
                                '</button>' +
                            '</h5>' +
                        '</div>' +
                    '</div>'
                )
            }
        });
    }
}

function renderList(key) {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get('data', function (result) {
            if (result.data) {
                let items = result.data;
                if (items[key].length > 0) {
                    let resultString = "";
                    for (item of items[key]) {
                        resultString +=              
                        '<a href="' + item["url"] + '" class ="list-group-item" target="_blank">' + item["title"] + '</a>'
                    }
                    resolve(resultString);
                } else {
                    resolve(undefined);
                }
            } else {
                resolve(undefined);
            }
        });
    });
}
