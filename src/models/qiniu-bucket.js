import qiniu  from 'qiniu.js'
import crypto from 'crypto-browserify'
import { bucketName, qiniuBucketDomainName,
    qiniuAccessKey as ak, qiniuSecretKey as sk,
    qiniuUploadUrl as uploadUrl } from '@/configs'

qiniu.config({
    uploadUrl
});

const filmyBucket = qiniu.bucket(bucketName, {
    // url: (qiniuBucketUrl ? qiniuBucketUrl : `${location.protocol}//${location.host}`)
    url: `//${ qiniuBucketDomainName }`
})

function getKeys (password) {
    // return filmyBucket.getFile(`filmy/secret-${password}.json`)
    //   .then(body => JSON.parse(body))
    // return ak sk
    return {ak, sk}
}

filmyBucket.fetchPutToken = function (password, key = null, keys = null, returnBody = null) {
    return (keys ? Promise.resolve(keys) : getKeys(password))
      .then(keys => {
          const options = {
              scope   : bucketName + (key ? `:${ key }` : ''),
              deadline: Math.floor(Date.now() / 1000) + 3600
          }

          if (returnBody) options.returnBody = returnBody

          // Signture
          const signture = safeEncode(JSON.stringify(options))

          // Encode Digest
          const encodeDigest = encodeSign(signture, keys.sk)

          // Put token
          const token = `${ keys.ak }:${ encodeDigest }:${ signture }`

          debugger

          return token
      })
}

function safeEncode (str) {
    return btoa(str).replace(/\//g, '_').replace(/\+/g, '-')
}

function encodeSign (str, key) {
    return crypto
      .createHmac('sha1', key)
      .update(str)
      .digest('base64')
      .replace(/\//g, '_')
      .replace(/\+/g, '-')
}

export default filmyBucket
