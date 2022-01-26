import Element, { Image } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../styles/element-ui.scss'
import '../styles/vars.scss'
import '../styles/element-variables.scss'

export default /** @type {import('vue').PluginFunction<never>} */ Vue => {
  //  扩展ElementUI，添加`referrerPolicy`属性。扩展方法要放在Vue.use(ElementUI)前面
  const oldLoadImage = Image.methods.loadImage
  Image.methods.loadImage = function() {
    const referrer = document.getElementById('referrer')
    if (referrer.content === 'always') {
      referrer.setAttribute('content', 'never')
    }
    oldLoadImage.call(this)
  }

  Vue.use(Element, {
    size: 'small'
  })
}
