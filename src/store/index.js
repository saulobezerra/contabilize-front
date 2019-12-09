import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
import modulos from './modulos'

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      modulos
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })
  
  return Store
}
