# Filmy

> 在这一章中，我们会以一个名为 Filmy 的个人摄影网站为开发项目，从整体功能设计、功能模块分隔等角度详细说明其开发过程。——《实战 ES2015》 P129

本项目原自 [iwillwen/filmy](https://github.com/iwillwen/filmy)，
是书籍[《实战 ES2015》](http://www.broadview.com.cn/book/3621)第4章的实践案例，非常感谢原作者**小问**。

## Table of contents

 - [Why](#why)
 - [Quick start](#quick-start)
 - [FAQ](#faq)
 
## Why

作为书上实践案例，原版使用了相对于现在过时了的框架版本 `vue 1.0` 和 `vue-router 0.7`,
落后的语法使得学习的语法与 [Vue.js 文档](https://cn.vuejs.org/v2/guide/) 中说明的相差甚远。

所以本项目缘由是使用较新的 `Vue & Vue-Router 2.x` 语法对原项目作修改，并修复了一写小问题。
如有错漏，敬请斧正。

## Quick start

基于 `vue-cli` 构建，建议使用 [Yarn](https://yarnpkg.com/zh-Hans/) 来解决依赖问题（或者 NPM）。

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build

```

1. 修改储存域名
 
- 构建生产版本时，请修改 `src/*.html` 中的 `window.qiniuBucketUrl` 为您的储存域名。
按照原文具有三个入口：
   - `init.html` 
   - `admin.html` 
   - `index.html` 
 
  ``` javascript
  //src/*.html
  window.qiniuBucketUrl = 'http://oq1ecwbwl.bkt.clouddn.com'
  =>
  window.qiniuBucketUrl = 'http://example.bkt.clouddn.com'
  ```

-  修改 `src\models\qiniu-bucket.js` 中 **4行 20行** 为您的储存域名。

  ``` javascript
  //src\models\qiniu-bucket.js
   mather 
   => 
   yourBucketName
  ```

2. 制作上传凭证 

请上传一个名为 `secret-<password>.json` 的文件到您的储存空间中，用于项目中登陆、修改的验证
`<password>` 是项目的管理密码。

 ``` javascript
 //secret-<password>.json
 {
   "ak": "<ACCESS KEY>",
   "sk": "<SECRET KEY>"
 }
 ```
 
 `ACCESS KEY` 和 `SECRET KEY` 可以在 [七牛云个人中心 > 密钥管理](https://portal.qiniu.com/user/key)中找到。
 
 
## FAQ

####　error incorrent zone, please use up-z2.qiniu.com

七牛云储存空间与上传域名不匹配的 Http Request 报错，
根据 [存储区域](https://developer.qiniu.com/kodo/manual/1671/region-endpoint)，
将 `node_modules\qiniu.js\dist\qiniu.js` 2108 行中 `up.qiniu.com` 为改为储存空间相对应的上传域名：

``` javascript
uploadUrl: 'up-z2.qiniu.com'
```
如果你使用的是**华南**区域，使用 `src/libs/qiniu.js` 中我为你修改好的文件覆盖即可。
    


