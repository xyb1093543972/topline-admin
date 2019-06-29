import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import 'nprogress/nprogress.css'
import { getUser, removeUser } from '@/utils/auth'
import JSONbig from 'json-bigint'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
axios.defaults.transformResponse = [function(data) {
  try {
    return JSONbig.parse(data)
  } catch (err) {
    return data
  }
}]
axios.interceptors.request.use(config => {
  const user = getUser()
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
axios.interceptors.response.use(response => {
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => {
  if (error.response.status === 401) {
    removeUser()
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})
Vue.use(ElementUI)
Vue.prototype.$http = axios
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
