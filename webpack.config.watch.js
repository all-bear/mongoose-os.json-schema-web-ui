const { merge } = require("webpack-merge");
const webpackBuild = require("./webpack.config.build");

module.exports = merge(webpackBuild, {
    watch: true
})