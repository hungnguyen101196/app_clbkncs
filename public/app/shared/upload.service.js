(function () {
    angular.module('app.core')
        .service('UploadService', UploadService);

    UploadService.$inject = ['$http', 'exception'];


    function UploadService($http, exception) {

        function hasObject(obj) {
            if (obj && obj !== null &&  obj !== undefined) {
                return true;
            } else {
                return false;
            }
        }
        this.uploadFileAndData = function (method, url, data, img) {
            const formData = new FormData();
            if (hasObject(img)) {
                let imageBase64 = img.split(',')[1];
                let blob = base64toBlob(imageBase64, 'image/png');
                let file = new File([blob], 'Image.png');
                formData.append('File', file)
            }
            for (let i in data) {
                formData.append(i, data[i])
            }
            return $http({
                    method: method,
                    url: url,
                    data: formData,
                    withCredentials: true,
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                    }
                })
                .then((response) => {
                    return response.data;
                }).catch(error => {
                    return handlingError('error ', error);
                })
        };

        this.uploadImage = (method, url, data, img, fieldName) => {
            try {
                let fd = new FormData();
                if (img) {
                    // let imageBase64 = img[0].split(',')[1];
                    // let blob = base64toBlob(imageBase64, 'image/png');
                    // let file = new File([blob], 'Image.png');
                    // fd.append(fieldName, file);.
                    fd.append(fieldName, img);
                };
                fd.append('data', JSON.stringify(data));
                return $http({
                        method: method,
                        url: url,
                        data: fd,
                        withCredentials: true,
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined,
                        }
                    })
                    .then((response) => {
                        return response.data;
                    })
                    .catch(err => {
                        handlingError('Error occurred when upload image', err)
                    });
            } catch (err) {
                handlingError('Error occurred when upload image. File is not image', err);
            }
        };
        this.uploadFile = (method, url, file, obj) => {
            try {
                let fd = new FormData();
                if(obj && Object.keys(obj).length){
                    let keysObj = Object.keys(obj);
                    keysObj.map(key =>{
                        fd.append(key, obj[key])
                    });
                }
                if (file) {
                    fd.append('File', file);
                };
                return $http({
                        method: method,
                        url: url,
                        data: fd,
                        withCredentials: true,
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined,
                        }
                    })
                    .then((response) => {
                        return response.data;
                    })
                    .catch(err => {
                        handlingError('Error occurred when upload file', err)
                    });
            } catch (err) {
                handlingError('Error occurred when upload file', err);
            }
        };

        this.downloadfile = (method, url, data) => {
            try {
                return $http({
                        method: method,
                        url: url,
                        data: data,
                        // withCredentials: true,
                        // transformRequest: angular.identity,
                        //responseType: 'arraybuffer',
                        // headers: {
                        //     'Content-Type': undefined,
                        // }
                    })
                    .then((response) => {
                        return response.data;
                    })
                    .catch(err => {
                        handlingError('Error occurred when download file', err)
                    });
            } catch (err) {
                handlingError('Error occurred when upload file', err);
            }
        };
        this.uploadMultiImage = (url, data, img) => {
            try {
                const formData = new FormData();
                if (img && img.length) {
                    for (let i = 0; i < img.length; i++) {
                        let imageBase64 = img[i].split(',')[1];
                        let blob = base64toBlob(imageBase64, 'image/png');
                        let file = new File([blob], 'Image.png');
                        formData.append('file', file);
                    }
                }
                for (let i in data) {
                    formData.append(i, data[i])
                }
                return $http({
                    method: 'POST',
                    url: url,
                    data: formData,
                    withCredentials: true,
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                    }
                })
                .then((response) => {
                    return response.data;
                }).catch(error => {
                    return handlingError('error ', error);
                })
            } catch (err) {
                handlingError('Error occurred when upload image. File is not image', err);

            }

        };

        this.upload = (img) => {
            let imageBase64 = img[0].split(',')[1];
            let blob = base64toBlob(imageBase64, 'image/png');
            let file = new File([blob], 'Image.png');
            let fd = new FormData();
            fd.append('file', file);
            return $http.post('/admin/setting/banner/create', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .then((response) => {
                    return response.data;
                })
                .catch(err => handlingError('Error occurred when upload image', err));

        };

        this.deleteFile = (data) => {
            return $http.post('/admin/deleteFile', data)
            .then((response) => {
                return response.data;
            })
            .catch(err => handlingError('Lỗi xảy ra khi xóa file ', err));
        };


        function base64toBlob(base64Data, contentType) {
            contentType = contentType || 'image/png';
            let sliceSize = 1024;
            let byteCharacters = atob(base64Data);
            let bytesLength = byteCharacters.length;
            let slicesCount = Math.ceil(bytesLength / sliceSize);
            let byteArrays = new Array(slicesCount);

            for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                let begin = sliceIndex * sliceSize;
                let end = Math.min(begin + sliceSize, bytesLength);

                let bytes = new Array(end - begin);
                for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, {
                type: contentType
            });
        }

        function handlingError(msg, err) {
            return exception.catcher(msg)(err);
        }
    }
})();