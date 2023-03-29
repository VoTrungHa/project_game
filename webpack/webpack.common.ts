import path from 'path';
import webpack from 'webpack';
const src = path.join(__dirname, '../src/');

const common: webpack.Configuration = {
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(ts|tsx)?$/,
        loader: 'eslint-loader',
        exclude: [path.resolve(__dirname, 'node_modules')],
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        exclude: /node_modules/,
        use: 'json-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader'],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: [path.resolve(__dirname, '../src/components')],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {},
          },
          'sass-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: {
                'primary-color': '#333333',
              },
              // lessOptions: {
              //   modifyVars: {
              //     'primary-color': '#333333', // primary color for all components
              //     'link-color': '#00548f', // link color
              //     'success-color': '#52c41a', // success state color
              //     'warning-color': '#faad14', // warning state color
              //     'error-color': '#ff0000', // error state color
              //     'font-size-base': '14px', // major text font size
              //     'heading-color': 'rgba(0, 0, 0, 0.85)', // heading text color
              //     'text-color': 'rgba(0, 0, 0, 0.65)', // major text color
              //     'text-color-secondary': 'rgba(0, 0, 0, 0.45)', // secondary text color
              //     'disabled-color': 'rgba(0, 0, 0, 0.25)', // disable state color
              //     'border-radius-base': '2px', // major border radius
              //     'border-color-base': '#d9d9d9', // major border color
              //     'box-shadow-base': `0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)`,
              //   },
              //   javascriptEnabled: true,
              // },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.(mp4)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {},
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {},
      },
    ],
  },
  resolve: {
    modules: [src, 'node_modules'],
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].[chunkhash].bundle.js',
    chunkFilename: '[name].[chunkhash].bundle.js',
    publicPath: '/',
  },
};

export default common;
