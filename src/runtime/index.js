import fs from 'fs'
import path from 'path'
import recursive from 'recursive-readdir'

import getResource from './utils/get-resource'
import buildResource from './utils/build-resource'
import buildResources from './utils/build-resources'


export const I18ns = ({ i18n, dict, options = {} } = {}) => {
  const {
    rootDir = process.cwd(),
    filter = ['node_modules', '.git'],
  } = options

  const filterDir = (file, stats) =>
    stats.isDirectory() && filter.includes(path.basename(file))

  return new Promise(resolve => recursive(
    rootDir,
    [filterDir],
    (err, files) => resolve(buildResources({ i18n, dict, files })),
  ))
}

export default ({ i18n = {}, dict } = {}) => {
  const { namespace = 'i18n' } = i18n

  const resource = getResource(namespace)

  return new Promise(resolve => fs.readdir(
    resource,
    (err, files) => resolve(buildResource({ i18n, dict, files }, resource)),
  ))
}
