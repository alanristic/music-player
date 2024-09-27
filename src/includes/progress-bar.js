import nProgress from 'nprogress'

export default (router) => {
  router.beforeEach((to, from, next) => {
    nProgress.start() // Start the progress bar (it auto-updates as the page loads)
    next()
  })

  router.afterEach(() => {
    nProgress.done()
  })
}
