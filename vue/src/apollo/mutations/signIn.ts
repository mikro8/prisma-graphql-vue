import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default class signInMutation {
  constructor() {}

  get signIn() {
    const { mutate } = useMutation(gql`
      query signIn($username: String!, $password: String!) {
        signin(username: $username, password: $password) {
          token
        }
      }
    `)

    return mutate
  }
}
