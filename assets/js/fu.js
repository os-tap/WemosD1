
Date.prototype.DateTime = function() {

    var date = [
        this.getFullYear(),
        this.getMonth() + 1,
        this.getDate()
    ];

    var time = [
        this.getHours(),
        this.getMinutes(),
        this.getSeconds()
    ];

    for (var i = 0; i < 3; i++) {
        time[i] = ("0" + time[i]).slice(-2);
        if (i) date[i] = ("0" + date[i]).slice(-2);
    }

    return date.join('-') + '_' + time.join(':');
};



function xhrGET(request, paramsObj, cb) {

    var xhr = new XMLHttpRequest();

    var requestParams = '?';
    for (let key in paramsObj) {
        if (paramsObj[key])
            requestParams += key + '=' + paramsObj[key] + '&';
    }
    requestParams = requestParams.slice(0, -1);

    xhr.open('GET', request + requestParams);
    xhr.send();

    xhr.onreadystatechange = function() {
        if (this.readyState === 4)
            if (this.status == 200 && this.status < 300)
                if (typeof cb === 'function')
                    cb(JSON.parse(xhr.responseText));
    }
}