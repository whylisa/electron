const qiniu = require('qiniu')
const axios = require('axios')
const fs = require('fs')

class QiniuManager {
    constructor(accessKey, secretKey, bucket ) {
        // generate mac
        this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
        this.bucket = bucket

        // init config class
        this.config = new qiniu.conf.Config()

        // 空间对应的机房
        this.config.zone = qiniu.zone.Zone_z0
        this.bucketManager = new qiniu.rs.bucketManager(this.mac, this.config)

    }

    uploadFile(key, localFilePath) {
        const options = {
            scope: this.bucket + ':'+ key
        }
        const putPolicy = new qiniu.rs.PutPolicy(options)
        const uploadToken = putPolicy.uploadToken(this.mac)
        const formUploader = new qiniu.form_up.formUploader(this.config)
        const putExtra = new qiniu.form_up.PutExtra()
    }
    deleteFile(key) {
        return new Promise((resolve, reject) => {
            this.bucketManager.delete(this.bucket, key,this._handleCallBack(resolve, reject))
        })
    }
}