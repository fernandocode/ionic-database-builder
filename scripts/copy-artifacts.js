const fs = require('fs')
const path = require('path')
const artifacts = ['CONTRIBUTING.md', 'LICENSE.md']
artifacts.forEach(file => {
  let fromPath = path.resolve(__dirname, '..', 'projects/ionic-database-builder/', file)
  let destPath = path.resolve(__dirname, '..', 'dist/ionic-database-builder/', file)
  fs.readFile(fromPath, 'utf-8', (err, data) => {
    if (err) {
      console.log('An error occured:', err)
      return
    }
    fs.writeFile(destPath, data, (err) => {
      if (err) {
        console.log('An error occured:', err)
        return
      }
      console.log(`Copied ${file}:`)
    })
  })
})