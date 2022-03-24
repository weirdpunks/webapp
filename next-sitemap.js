module.exports = {
  siteUrl: 'https://weirdpunkscollection.com',
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: ['/bridge', '/migrate', '/tokens'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/'
      }
    ]
  }
}
