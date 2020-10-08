/* eslint-disable */
import Vue  from 'vue'
import i18n from '@/libs/i18n'

import filmyBucket     from '@/models/qiniu-bucket'
import Config          from '@/models/Config'
import openSimpleModal from '@/libs/simple-modal'

import { bucketName, qiniuBucketDomainName,
    qiniuAccessKey as ak, qiniuSecretKey as sk,
    qiniuUploadUrl as uploadUrl } from '@/configs'

Vue.filter('i18n', i18n)

new Vue({
    el  : '#init',
    data: {
        ak,
        sk,
        password: 'admin',

        title         : 'Filmy',
        subtitle      : '',
        background    : 'url',
        background_url: 'https://developer.qiniu.com/assets/qvm-free-helper-a354bd93b50256c28547430f05a13e2d736ca656c1b4b46c73d0e6b15508c46f.png'
    },

    mounted () {
        // Config.load(true)
        //   .then(config => {
        //       if (!config) return
        //       const url = `${ location.protocol }//${ location.host }`

        //       openSimpleModal(
        //         'Warning',
        //         'This Filmy is already inited.',
        //         `<a href="${ url }" class="btn btn-primary" role="button">OK</a>`
        //       )

        //       this.$el.remove()
        //   })
    },

    methods: {
        reset () {
            this.password       = ''
            this.title          = ''
            this.subtitle       = ''
            this.background     = 'url'
            this.background_url = ''
        },

        submit (evt) {
            //new Button(evt.target, 'loading')

            filmyBucket.fetchPutToken(this.password, null, {
                ak,
                sk
            })
              .then(putToken => {
                  // 取得壁纸地址
                  switch (this.background) {
                      case 'url':
                          return this.background_url
                    // break
                      case 'file':
                          const file = this.$refs.backgroundfile.files[0]
                          if (!file) {
                              throw new Error('Please select a file.')
                          }

                          const key = `assets/bg-${ Math.random().toString(32).substr(2) }`
                          return filmyBucket.putFile(key, file, {
                              putToken
                          })
                            .then(() => {
                                const asset = filmyBucket.key(key)
                                return asset.url()
                            })
                  }
              })
              .then(backgroundUrl => {
                  const config = {
                      title      : this.title,
                      description: this.subtitle,
                      background : backgroundUrl
                  }

                  return Config.update(this.password, config, true)
              })
              .then(() => {
                  const url      = `${ location.protocol }//${ location.host }`
                  const adminUrl = url + '/admin'

                  openSimpleModal(
                    'Congratulation!',
                    'Your Filmy is ready for use.',
                    `
                          <a href="${ url }" class="btn btn-primary" role="button">Go to Filmy</a>
                          <a href="${ adminUrl }" class="btn" role="button">Go to Admin Tools</a>
                        `
                  )
              })
              .catch(err => {
                  console.log(err)
                  //new Button(evt.target, 'reset')
                  openSimpleModal(
                    'Error',
                    err.message,
                    `<button class="btn btn-primary" role="button">OK</button>`
                  )
              })
        }
    }
})