module.exports = {
  plugins: [
    require('@tailwindcss/postcss')({
      configPath: './tailwind.config.js',
    }),
    require('autoprefixer'),
  ],
}