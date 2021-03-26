<template>
  <div>
    <h1>signin</h1>
    <input v-model="username" placeholder="username" />
    <input v-model="password" placeholder="password" type="password" />
    <button @click="initLogin()">SignIn</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { mapMutations } from 'vuex'
import signInMutation from '../apollo/mutations/signIn'
import getUserMutation from '../apollo/mutations/getUser'

@Component({
  setup() {
    // const { signIn, getUser } = require('../apollo/mutations')
    const { signIn } = new signInMutation()
    const { getUser } = new getUserMutation()

    return { signIn, getUser }
  },
  methods: {
    ...mapMutations(['setUser']),
  },
})
export default class SignIn extends Vue {
  public signIn!: any
  public setUser!: any
  public getUser!: any

  username = ''
  password = ''

  initLogin() {
    this.signIn({ username: this.username, password: this.password })
      .then(async (res: any) => {
        const user = await this.getUser()
        this.setUser(user.data.getMyUser)
      })
      .catch((err: any) => {
        console.log(err)
      })
    // console.log(res)
  }
}
</script>
