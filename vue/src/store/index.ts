import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser(state, newUser){
      // console.log(newUser)
      state.user = newUser;
    },
    setUserNull(state){
      state.user = null;
    }
  },
  actions: {
  },
  modules: {
  }
})
