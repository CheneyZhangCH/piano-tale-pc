/**
 * 在组件上添加 $referrer，指向上一条路由
 *
 * @see https://www.npmjs.com/package/@tozd/vue-router-referer
 */

'break jsdoc'

/**
 * @param {import('vue-router').Route} from
 */
const setReferrer = from => /** @param {import ('vue').Component} $vm */ $vm => {
  $vm.$data.$referrer = $vm.$router != null ? from ?? null : null
}

export default /** @type {import('vue').PluginFunction<never>} */ Vue => {
  Vue.mixin({
    data() {
      return {
        $referrer: null
      }
    },

    beforeRouteEnter(_, from, next) {
      next(setReferrer(from))
    },

    beforeRouteUpdate(_, from, next) {
      setReferrer(from)(this)
      next()
    }
  })
}
