import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default class listPersonsQuery {
  constructor() {}

  get listPersons() {
    const { result, loading, error, refetch } = useQuery(gql`
      query listPersons {
        listPersons {
          id
          fullname
          employmentDate
          salary
        }
      }
    `)

    return { result, loading, error, refetch }
  }
}
