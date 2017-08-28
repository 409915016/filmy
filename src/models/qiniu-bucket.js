import qiniu from 'qiniu.js'
import crypto from 'crypto-browserify'

const filmyBucket = qiniu.bucket('mather', {
  // url: (qiniuBucketUrl ? qiniuBucketUrl : `${location.protocol}//${location.host}`)
  url: 'http://oq1ecwbwl.bkt.clouddn.com'
})

function getKeys (password) {
  return filmyBucket.getFile(`secret-${password}.json`)
    .then(body => JSON.parse(body))
}
// incorrect region, please use up-z2.qiniu.com
// in qiniu.js
filmyBucket.fetchPutToken = function (password, key = null, keys = null, returnBody = null) {
  return (keys ? Promise.resolve(keys) : getKeys(password))
    .then(keys => {
      const options = {
        // qiniu bucket name
        scope: 'mather' + (key ? `:${key}` : ''),
        deadline: Math.floor(Date.now() / 1000) + 3600
      }

      if (returnBody) options.returnBody = returnBody

      // Signture
      const signture = safeEncode(JSON.stringify(options))

      // Encode Digest
      const encodeDigest = encodeSign(signture, keys.sk)

      // Put token
      const token = `${keys.ak}:${encodeDigest}:${signture}`

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
