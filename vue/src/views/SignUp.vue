<template>
  <div>
    <h1>signup</h1>
    <input v-model="username" placeholder="username" />
    <input v-model="password1" placeholder="password" type="password" />
    <input v-model="password2" placeholder="password confirm" type="password" />
    <input v-model="id" placeholder="person id" type="number" />
    <button
      @click="signUp({ id: parseInt(id), username, password1, password2 })"
    >
      SignUp
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { mapMutations } from 'vuex'
import signUpMutation from '../apollo/mutations/signUp'
import getUserMutation from '../apollo/mutations/getUser'

@Component({
  setup() {
    const { signUp } = new signUpMutation()
    const { getUser } = new getUserMutation()
    return { signUp, getUser }
  },
  methods: {
    ...mapMutations(['setUser']),
  },
})
export default class SignUp extends Vue {
  public signUp!: any
  public getUser!: any
  public setUser!: any

  username = ''
  password1 = ''
  password2 = ''
  id = '1'

  initLogin() {
    this.signUp({
      id: parseInt(this.id),
      username: this.username,
      password1: this.password1,
      password2: this.password2,
    })
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
