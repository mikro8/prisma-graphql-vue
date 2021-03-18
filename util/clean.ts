// clean up generated files
// import fs from 'fs'
import { join } from 'path'
import { access, unlink } from 'fs/promises'
import { constants } from 'fs'
const filesToClean = ['../api/schema.graphql', '../api/types/nexus.ts']

console.log('Cleaning auto generated files')
for (let filePath of filesToClean) {
  const file = join(__dirname, filePath)
  access(file, constants.R_OK)
    .then(() => {
      unlink(file).catch(err=>console.log(err))
      console.log(`${file} has been removed`)
    })
    .catch(() => {
      console.log(`${file} is missing, skipping`)
    })
}
