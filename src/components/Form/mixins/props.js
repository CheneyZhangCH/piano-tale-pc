/*
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:27:33
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-05-15 15:28:33
 * @FilePath: \src\components\Form\mixins\props.js
 * @Description: 统一传入参数
 */
const compProps = {
    props: {
        item: {
            type: Object,
            required: true
        },
        form: Object
    }
}

export default compProps
