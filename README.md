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
 
- 构建生产版本时，请修改 `src/*.html` 中的 `window.qiniuBucketUrl` 为您的储存空间域名。
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

-  修改 `src\models\qiniu-bucket.js` 中 **4行 20行** 为您的储存空间名称。

  ``` javascript
  //src\models\qiniu-bucket.js line 4, 20
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

#### error incorrent zone, please use up-z2.qiniu.com

七牛云储存空间与上传域名不匹配的 Http Request 报错，
根据 [存储区域](https://developer.qiniu.com/kodo/manual/1671/region-endpoint)，
将 `node_modules\qiniu.js\dist\qiniu.js` 2108 行中 `up.qiniu.com` 为改为储存空间相对应的上传域名：

``` javascript
//node_modules\qiniu.js\dist\qiniu.js line 2108
uploadUrl: 'up-z2.qiniu.com'
```
如果你使用的是**华南**区域，直接使用 `src/libs` 目录中我为你修改好的 `qiniu.js` 文件覆盖即可。

#### 修改了分类或相册数据，然而在其他设备并没有生效？

本项目使用了 [MinDB](https://github.com/iwillwen/mindb) 作为本地化储存。
若是修改了相册封面或其他设置，在七牛储存空间中的 `*.json` 确实是记录了最后一次修改的数据。

本机修改过后的设置储存在本地即时生效，而七牛云储使用了 CDN 分发，其中又浏览器获取的 `*.json` 是经过缓存的。
而反而获取的是旧的经过缓存的 Local Storage 数据覆盖到本地。解决方案:

 - ~~**程序设计错误**~~
   
   本案例设计的缘由是针对框架和语法学习，相册封面修改也仅仅在本机后立即生效，通过分类 URL 分享到其他设备中查看最新的图片。
   
   清除 Local Storage 数据或许是最优解。由于本地存在了 Local Storage 数据，并不会去重新下载服务器上新的数据了，而是直接使用旧的数据。
   

 - **URL 问号传参刷新** 
   
   查看七牛云文档 [刷新缓存和生效时间](https://developer.qiniu.com/fusion/kb/1325/refresh-the-cache-and-the-effect-of-time)，
   修改 `node_modules\qiniu.js\dist\qiniu.js` **1795行**中 `url` 参数的设置为：
   
   ``` javascript
   //line 1795
   url = utils.format('http://%s.qiniudn.com/%s?v=%s&token=%s', _this3.name, key, time, getToken);
   ```
   
   太麻烦？直接使用 `src/libs` 目录中我为你修改好的 `qiniu.js` 文件覆盖即可。

 - **在七牛云存储上刷新**
   
   见七牛云文档 [刷新缓存和生效时间 - 二、在七牛云存储上刷新](https://developer.qiniu.com/fusion/kb/1325/refresh-the-cache-and-the-effect-of-time)，
  

  
  




