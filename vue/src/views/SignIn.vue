<template>
  <div>
    <h1>signin</h1>
    <input v-model="username" placeholder="username" />
    <input v-model="password" placeholder="password" type="password" />
    <button @click="initLogin()"> SignIn </button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import { mapMutations } from 'vuex'

interface LoginData {
  username: string
  password: string
}

@Component({
  setup(){
    const { mutate: signIn } = useMutation(gql`
    query signIn($username: String!, $password: String!) {
      signin(username: $username, password: $password){
        token
      }
    }
    `)

    const { mutate: getUser } = useMutation(gql`
      query getUser {
        getMyUser {
          username
          person {
            fullname
          }
        }
      }
    `)

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

  initLogin(){
    this.signIn( {username: this.username, password: this.password} ).then(async (res: any) => {
      const user = await this.getUser()
      this.setUser(user.data.getMyUser)
    }).catch((err: any)=> {
      console.log(err)
    })
    // console.log(res)
  }
}
</script>
