import Vue from 'vue';
import App from './app/App.vue';
import router from './router';
import store from './store';
import ApolloClient from 'apollo-boost'
// import VueApollo from 'vue-apollo'
import { provide } from '@vue/composition-api'
import { DefaultApolloClient } from '@vue/apollo-composable'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

// Vue.use(VueApollo)
const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: 'http://localhost:4000/graphql',
})
// const apolloProvider = new VueApollo({
//   defaultClient: apolloClient,
// })

Vue.config.productionTip = false;


new Vue({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },
  router,
  store,
  // apolloProvider,
  render: h => h(App)
}).$mount('#app');
