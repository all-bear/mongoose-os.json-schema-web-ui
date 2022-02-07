const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    entry: "./fs_src/index.js",
    output: {
        path: path.resolve(__dirname, "fs"),
        publicPath: "",
        filename: "index.js"
    },
    optimization: {
        minimizer: [new TerserPlugin({
            extractComments: false, // fs size is limited, sorry for this :(
        })],
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "index.css"
        }),
        new CompressionPlugin({
            deleteOriginalAssets: true
        })
    ],
    mode: "production"
};