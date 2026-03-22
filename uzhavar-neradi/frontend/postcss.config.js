module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 3,         // enable stable features
      features: {
        'nesting-rules': true,
      },
    }),
  ],
};