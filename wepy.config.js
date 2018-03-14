const prod = process.env.NODE_ENV === 'production';
module.exports = {
  wpyExt: '.wpy',
  cliLogs: true,
  build: {
    web: {
    }
  },
  eslint: true,
  compilers: {
    sass: {
      outputStyle: 'compact'
    },
    babel: {
      sourceMap: false,
      presets: [
        'es2015',
        'stage-1'
      ],
      plugins: [
        'transform-export-extensions',
        'syntax-export-extensions',
        'transform-decorators-legacy'
      ]
    }
  },
  plugins: {
    'autoprefixer': {
      filter: /\.(wxss|css)$/,
      config: {
        browsers: ['last 11 iOS versions']
      }
    }
  }
};

if (prod) {
  delete module.exports.compilers.babel.sourcesMap;
  // 压缩sass
  module.exports.compilers['sass'] = {outputStyle: 'compressed'};

  // 压缩js
  module.exports.plugins = {
    autoprefixer: {
      filter: /\.(wxss|css)$/,
      config: {
        browsers: ['last 11 iOS versions']
      }
    },
    uglifyjs: {
      filter: /\.js$/,
      config: {
      }
    },
    imagemin: {
      filter: /\.(jpg|png|jpeg)$/,
      config: {
        jpg: {
          quality: 80
        },
        png: {
          quality: 80
        }
      }
    },
    filemin: {
      filter: /\.(wxml)$/
    }
  }
}
