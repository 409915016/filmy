import min         from 'min'
import filmyBucket from './qiniu-bucket'
import {isString}  from 'lodash'
import { bucketName } from '@/configs'

const Config = {
    load (silent = false) {
        return min.exists(`${bucketName}:config`)
          .then(exists => {
              if (exists) {
                  // 从数据库中获取核心配置数据
                  return min.hgetall(`${bucketName}:config`)
              } else {
                   return filmyBucket.getFile(`config.json?${new Date().getTime()}`)
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
          .then(({hash, key, config})=>{
            config = config || {}

            for (const key of Object.keys(update)) {
                config[key] = update[key]
            }

            if(hash && key) {
                try {
                    min.hmset(`${bucketName}:config`, config)
                } catch (err) {
                    console.error(err)
                }
            }
            return config
          })
    }
}

export default Config
