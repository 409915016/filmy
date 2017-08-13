import min from 'min'

import isString from './lodash/isString'
import filmyBucket from '/models/qiniu-bucket'


const Config = {
  load() {
    return min.exists('filmy:config')
      .then(exists => {
        if (exists) {
          // 从数据库中获取核心配置数据
          return min.hgetall('filmy:config')
        } else {
          return filmyBucket.getFile('filmy:config')
            .then(body => JSON.parse(body))
            .then(data => {
              // 从七牛云获取到的数据存入数据库中
              min.hmset('filmy:config', data)
              return data
            })
        }
      })
      .catch(error => {
        alert('You must init Filmy with the administrator tools')
      })
  },

  update(password, key, value){
    // 检查密码的变量类型
    if (!isString(password)) {
      throw new TypeError('Password must be a string')
    }

    return filmyBucket.fetchPutToken(password)
      .then(putToken => {
        // 加载旧的配置数据
        return Config.load()
          .then(oldConfig => [oldConfig, putToken])
          // 如果初始化 就传递一个空对象
          .catch(() => [{}, putToken])
      })
      .then(([config, putToken]) => {
        config[key] = value

        // 更新数据
        const fileData = new Blob([JSON.stringify(config)], {type: 'application/json'});
        fileData.name = 'config.json'

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