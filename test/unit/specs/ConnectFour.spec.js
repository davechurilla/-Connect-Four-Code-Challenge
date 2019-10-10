import Vue from 'vue'
import ConnectFour from '@/components/ConnectFour'

describe('ConnectFour.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(ConnectFour)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .toEqual('Welcome to Connect Four!')
  })
})
