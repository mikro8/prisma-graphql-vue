<template>
  <div>
    <h1>signup</h1>
    <input v-model="username" placeholder="username" />
    <input v-model="password1" placeholder="password" type="password" />
    <input v-model="password2" placeholder="password confirm" type="password" />
    <input v-model="id" placeholder="person id" type="number" />
    <button @click="signUp( {id: parseInt(id), username, password1, password2} )"> SignUp </button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@vue/apollo-composable'

@Component({
  setup() {
    const { mutate: signUp } = useMutation(
      gql`
        mutation singUp(
          $id: Int!
          $username: String!
          $password1: String!
          $password2: String!
        ) {
          signup(
            personId: $id
            username: $username
            password_1: $password1
            password_2: $password2
          ) {
            token
          }
        }
      `,
    )

    return { signUp }
  },
})
export default class SignUp extends Vue {
  username = ''
  password1 = ''
  password2 = ''
  id = '1'
}
</script>
