const pageSet = (name, title = "") => {
    return {
        [`${name}`] : {
            entry: `src/pages/${name}/app.js`,
            template: `public/${name}.html`,
            filename: `${name}.html`,
            title: title ? title: name
        }
    }
}

const pages = {
    ...pageSet('init'),
    ...pageSet('admin'),
    ...pageSet('filmy'),
}

module.exports = {
    lintOnSave         : false,
    productionSourceMap: false,
    parallel           : require('os').cpus().length > 1,
    runtimeCompiler    : true,
    pages
}