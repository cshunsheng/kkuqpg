import "babel-polyfill";
import Vue from 'vue'
import App from './App'
import router from './router'
import $api from './api'
import '../static/css/common.css'
//store
import store from './store'
import './utils/filter'

//ui框架
import ElementUI from 'element-ui';
import '../static/css/element_variables.scss'

//富文本编辑
import  VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import VueDND from 'awe-dnd'

Vue.use(VueDND)

Vue.config.productionTip = false


Object.defineProperty(Vue.prototype, '$api', {value: $api})

Vue.use(VueQuillEditor)
Vue.use(ElementUI);


new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>',
    data: {
        eventBus: new Vue()
    }
})
