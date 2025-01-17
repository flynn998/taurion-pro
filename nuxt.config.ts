export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Taurion',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1,user-scalable=no,  maximum-scale=1.0, minimum-scale=1.0'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'xxx'
      },
      {name: 'keywords', content: 'xxx'},
      {name: 'format-detection', content: 'telephone=no'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ],
    script: [
      {
        src: '',
        async: true
      },
    ]
  },

  css: [
    '~/assets/css/font.css',
    '~/assets/css/base.css',
  ],

  plugins: [
    '@/plugins/request',
    '~/plugins/event-bus.js',

    {src: '@/plugins/socket.io', mode: 'client'},
    {src: '~/plugins/toast.js', mode: 'client'},
    { src: '~/plugins/vue-awesome-swiper', mode: 'client' },
    {src: '@/plugins/dialog-plugin', mode: 'client'},
    {src: '@/plugins/loading-plugin.js', mode: 'client'},
    {src: '~/plugins/localStorage.js', mode: 'client'},
    {src: '~/plugins/markdownit.js', mode: 'client'},
    { src: '~/plugins/vue-lazyload', ssr: false },
    {
      src: '~plugins/echarts',
      ssr: false
    }
  ],

  axios: {
    proxy: true,
    baseURL: 'xxx',
  },
  proxy: {
    '/api': {
      target: 'https://api.taurion.ai',
      // target: 'http://54.207.113.59',
      // target: 'https://54.207.113.59',
      // target: 'http://localhost:4000',
      pathRewrite: {
        '^/api': '' // 删除url中的/api
      },
    }
  },
  components: true,
  buildModules: [],
  server: {
    port: 9898, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  // router: {
  //   middleware: ['redirect-mobile']
  // },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/i18n',
  ],
  i18n: {
    // strategy: 'no_prefix',
    locales: [
      {code: 'en', iso: 'en', file: 'en.js'},
      {code: 'zh', iso: 'zh', file: 'zh.js'},
      {code: 'pt-br', iso: 'pt-br', file: 'pt-br.js'},
    ],
    // strategy: 'no_prefix',
    defaultLocale: 'en',
    lazy: true,
    langDir: 'lang/',
    silentTranslationWarn: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'en'
    }
  },
  build: {
    extend(config, { isDev, isClient }) {
      if (isClient) {
        config.module.rules.push({
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        });
      }
    }
  }
}
