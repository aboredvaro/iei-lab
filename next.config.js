module.exports = {
  basePath: '',
  async redirects() {
    return [
      {
        source: '/404',
        destination: '/',
        permanent: true,
      }
    ];
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  webpack5: true
};
