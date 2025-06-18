const path = require("path");
const HtmlWPP = require("html-webpack-plugin");

module.exports = {
    module: {
        rules: [
            {
                  test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
            }

        ]
    },
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        publicPath: '/'
    },
    devServer: {
        
        contentBase: path.join(__dirname, 'public'), // en lugar de static.directory
        port: 5500,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWPP({
            template: path.resolve(__dirname, "public", "index.html")
        })
    ]
}