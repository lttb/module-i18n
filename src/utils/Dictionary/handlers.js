import fs from 'fs'
import yaml from 'js-yaml'


const handlers = {
  yaml: yaml.load,
  json: JSON.parse,
}

export default (filename, type) => new Promise((resolve, reject) =>
  fs.readFile(filename, 'utf8', (err, data) => {
    err && reject(err)

    resolve(handlers[type](data))
  }))
