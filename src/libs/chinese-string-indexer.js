import Model from 'min-model'
import { pullWordAPIHost } from '@/configs'

class ChineseStringIndexer extends Model.BaseIndexer {
  get async () {
    return true
  }

  indexMapper (val) {
    if(!val) return ""
    const url =
      `//${pullWordAPIHost}/get.php?source=${encodeURIComponent(val)}&param1=0.8&param2=0&json=1`

    return fetch(url, {method: 'GET'})
      .then(res => {
          return (res.json())
      })
      .then(json =>{
          return json.map(i=> i.t)
      })
      .catch(() => [val])
  }
}

export default ChineseStringIndexer
