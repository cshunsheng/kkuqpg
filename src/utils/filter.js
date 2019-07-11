import Vue from 'vue'

//过滤器：显示前十位
Vue.filter('stringTen', value => {
  let newStr
  if (!value) {
    return ''
  }
  if (value.length > 10) {
    newStr = `${value.substr(0, 10)}...`
  } else {
    ; `${value.substr(0, 10)}`
  }
  return newStr
})

//价格保留一位小数
Vue.filter('price', function (value) {
  value = parseFloat(value).toFixed(1)
  return value
})
Vue.filter('label', function (value, type_id) {
  let obj = {}
  // value = `${type_id}/${value}`
  obj[type_id] = value
  return JSON.stringify(obj)
})
Vue.filter('show', function (value, type_id) {
  if (type_id === 0) {
    value = isShow1
  }
  if (type_id === 1) {
    value = isShow2
  }
  if (type_id === 2) {
    value = isShow3
  }
  return value
})
Vue.filter('putout', function (value) {
  value = value ? '是' : '否'
  return value
})
