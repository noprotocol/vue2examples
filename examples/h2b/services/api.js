import {Observable} from 'rxjs/Observable';
import {cookie} from 'cookie_js';

const api = {
    routes: {
        message: API_ROOT + '/message',
    },
    get(path) {
        return Observable.ajax.getJSON(path)
    },
    post(path, data) {
        return Observable.ajax.post(path, JSON.stringify(data, null, 4), {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-XSRF-TOKEN': cookie('XSRF-TOKEN')
        }).map(res => res.response)
    },
    put(path, data) {
        return Observable.ajax.post(path, JSON.stringify(data, null, 4), {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-XSRF-TOKEN': cookie('XSRF-TOKEN')
        }).map(res => res.response)
    },
    patch(path, data) {
        return Observable.ajax({
            url: path,
            method: 'PATCH',
            body: JSON.stringify(data, null, 4),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-XSRF-TOKEN': cookie('XSRF-TOKEN')
            }
        }).map(res => res.response)
    },
    delete(path) {
        return Observable.ajax.delete(path, {
            'X-XSRF-TOKEN': cookie('XSRF-TOKEN')
        }).map(res => res.response)
    },

    uploadDataUri(path, dataUri, progressObservable) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var binary = atob(dataUri.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
        return this.uploadFile(path, blob)
    },

    uploadFile(path, blob, progressObservable) {
        const body = new FormData(document.forms[0]);
        body.append("file", blob);
        return Observable.ajax({
            url: path,
            method: 'POST',
            body: body,
            headers: {
                // 'Content-Type': 'application/json; charset=UTF-8',
                'X-XSRF-TOKEN': cookie('XSRF-TOKEN')
            }
        }).map(res => res.response)
    }
};

export default api