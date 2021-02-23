/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  root: __dirname,
  mount: {
    src: { url: '/dist' },
    static: { url: '/', static: true },
  },
  plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-typescript'],
  routes: [{ match: 'routes', src: '.*', dest: '/index.snowpack.html' }],
  devOptions: {
    open: 'none',
    port: 5011,
    secure: false,
  },
};
