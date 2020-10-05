import min         from 'min'
import filmyBucket from './qiniu-bucket'
//import qiniu from 'qiniu-js'
import {isString}  from 'lodash'

import { bucketName, qiniuBucketDomainName, qiniuAccessKey, qiniuSecretKey, qiniuUploadUrl as uploadUrl } from '@/configs'

// 本地存在 核心配置数据 filmy:config 吗？
// 存在 则获取本地数据
// 不存在 则通过七牛云下载 config.json 然后保存在本地 filmy:config

const Config = {
    load (silent = false) {
        return min.exists(`${bucketName}:config`)
          .then(exists => {
              if (exists) {
                  // 从数据库中获取核心配置数据
                  return min.hgetall(`${bucketName}:config`)
              } else {
                   return filmyBucket.getFile(`config.json`)
                    .then(body => {
                        return Promise.resolve(JSON.parse(body))
                    })
                    .then(data => {
                        // 从七牛云获取到的数据存入数据库中
                        try {
                            min.hmset(`${bucketName}:config`, data)
                        } catch (err) {
                            console.error(err)
                        }
                        return data
                    })
              }
          })
          .catch(error => {
              if (!silent) alert(error + 'You must init Filmy with the administrator tools.')
          })
    },

    // 通过七牛云密码来更新七牛云线上文件
    // 核心配置数据:
    // title
    // description
    // author
    // avatar
    // key 是 核心配置数据的键
    // value 是核心配置数据的值
    // ==============================================
    // 先用密码获取 putToken
    // 读取本地配置数据与 putToken 组成数组
    // 根据传入要修改的 key 和 value 修改成新的 config
    // 使用 Blob 构造类二进制文件对象
    // 将文件对象使用 putFile 上传到七牛云
    update (password, update = {}, silent = false) {
        if (!isString(password)) {
            throw new TypeError('Password must be a string')
        }

        return filmyBucket.fetchPutToken(password, 'config.json')
          .then(putToken => {
              return Config.load(silent)
                .then(oldConfig => [oldConfig, putToken])
                .catch(() => [{}, putToken])
          })
          .then(([config, putToken]) => {
              config = config || {}

              for (const key of Object.keys(update)) {
                  config[key] = update[key]
              }

              const fileData = new Blob([JSON.stringify(config)], {type: 'application/json'})
              fileData.name  = 'config.json'

              return filmyBucket.putFile(
                fileData.name,
                fileData,
                {
                    putToken: putToken
                }
              )
          })
    }
}

export default Config
