const path = require('path');
const process = require("process");



module.exports = (env)=> {
  return({
  mode: "development",
  context: path.resolve(env.context),
  devtool: "inline-source-map",
  entry: {
    main:  path.resolve(env.context,"./src/game/main.ts")
  },
  output: {
    path: path.resolve(env.context,env.target),
    filename: "van.js" // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
})};