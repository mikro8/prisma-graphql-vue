import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default class signUpMutation {
  constructor() {}

  get signUp() {
    const { mutate } = useMutation(
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

    return mutate
  }

}
