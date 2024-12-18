// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/leaflet'
  ],
  app: {
    head: {
      bodyAttrs: {
        class: 'uninet-body'
      },
      charset: 'utf-8',
      viewport: 'width=100vw, initial-scale=1',
      title: '経路探索'
    }
  }
})