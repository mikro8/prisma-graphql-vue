// clean up generated files
// import fs from 'fs'
import { join } from 'path'
import { rm, access } from 'fs/promises'
import { constants } from 'fs'
const filesToClean = ['../dist']

console.log('Cleaning auto generated files')
for (let filePath of filesToClean) {
  const file = join(__dirname, filePath)
  access(file, constants.R_OK)
    .then(() => {
      rm(file, { recursive: true, force: true }).catch(err => console.log(err))
      console.log(`${file} has been removed`)
    })
    .catch(() => {
      console.log(`${file} is missing, skipping`)
    })
}
