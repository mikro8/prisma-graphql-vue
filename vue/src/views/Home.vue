<template>
  <h1 v-if="loading">Loading...</h1>
  <div v-else-if="error">
    <h1>ERROR</h1>
    <h2 v-if="errorHas401(error)">Unauthorized!</h2>
    <div v-else>{{ error }}</div>
  </div>
  <div v-else>
    <h1>HOME</h1>
    <div class="person label">
      <div class="id">ID</div>
      <div class="name">FULLNAME</div>
      <div class="employmentDate">EMPLOYMENT DATE</div>
      <div class="salary">SALARY</div>
    </div>
    <div class="person" v-for="el in result.listPersons" :key="el.id">
      <div class="id">{{ el.id }}</div>
      <div class="name">{{ el.fullname }}</div>
      <div class="employmentDate">{{ processDate(el.employmentDate) }}</div>
      <div class="salary">{{ el.salary }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@vue/apollo-composable'
// import "vue-apollo";

@Component({
  setup() {
    const { result, loading, error } = useQuery(gql`
      query getPersons {
        listPersons {
          id
          fullname
          employmentDate
          salary
        }
      }
    `)

    return { result, loading, error }
  },
})
export default class Home extends Vue {
  // result = null

  errorHas401(error: any): boolean {
    return error.toString().includes('code 401')
  }

  data() {
    return {
      listPersons: null,
    }
  }

  processDate(dateString: string): string {
    const date = new Date(dateString)

    const day = `0${date.getDate()}`.slice(-2)
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const year = date.getFullYear().toString()

    return `${day}-${month}-${year}`
  }
}
</script>

<style scoped>
.person {
  max-width: 800px;
  margin: 5px auto;
  /* border: 1px solid black; */
  padding: 5px;
  display: flex;
}

.person:hover {
  background-color: #333;
  color: azure;
}

.person.label{
  background: black;
  color: white;
}

.person * {
  width: 100%;
}

.person .employmentDate{
  width: 300px;
}

.person .id {
  width: 30px;
}

.person .salary {
  width: 80px;
}

.person .name {
  width: 100%;
}
</style>
