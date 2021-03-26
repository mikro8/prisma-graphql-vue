import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default class getUserMutation {
  constructor() {}
  get getUser() {
    const { mutate } = useMutation(gql`
      query getUserSignIn {
        getMyUser {
          username
          person {
            fullname
          }
        }
      }
    `)

    return mutate
  }
}
