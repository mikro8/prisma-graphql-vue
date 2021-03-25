<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/signup">SignUp</router-link>
      <!-- <router-link to="/signin">SignIn</router-link> -->

      <div class="user">
        <div v-if="loading">Auto sign in ...</div>
        <div v-else-if="!user">
          <router-link to="/signin">SignIn</router-link>
        </div>
        <div v-else>
          <span>Logged in as: {{ user.person.fullname }} |</span>
          <button class="logout" @click="logout()">Logout</button>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import { mapState, mapMutations } from 'vuex'
import 'vue-cookies'

@Component({
  setup() {
    const { mutate: getUser } = useMutation(gql`
      query getUser2 {
        getMyUser {
          username
          person {
            fullname
          }
        }
      }
    `)

    return { getUser }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapMutations(['setUser', 'setUserNull']),
  },
})
export default class App extends Vue {
  public getUser!: any
  private loading: boolean = true
  public user!: any
  public setUser!: any
  public setUserNull!: any

  logout() {
    this.$cookies.remove('Authorization')
    this.setUserNull()
  }

  mounted() {
    // this.setUser(this.result.getMyUser)
    this.loading = true
    this.getUser().then((d: any) => {
      const user = d.data.getMyUser
      this.setUser(user)
    }).catch((e: any) => {
      console.error(e)
    }).finally(() => this.loading = false)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  display: flex;
  justify-content: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  margin: 0 10px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#nav .user {
  display: inline-block;
}

#nav .user .logout {
  font-weight: bold;
  color: #2c3e50;
  /* margin: 0 10px; */
  border: none;
  background: transparent;
}
</style>
