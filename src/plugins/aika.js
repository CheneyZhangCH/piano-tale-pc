// 注册组件
import * as AikaComponents from '../components'

export default /** @type {import('vue').PluginFunction<never>} */ Vue => {
  Object.entries(AikaComponents).forEach(([id, component]) => {
    console.log(id)
    console.log(component)
    Vue.component(`aika-${id}`, component)
  })
}
