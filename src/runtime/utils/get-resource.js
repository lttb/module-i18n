import path from 'path'
import stack from 'callsite'


// because of this way: current <- module i18n <- caller
export default (...args) => path.join(path.dirname(stack()[2].getFileName() || ''), ...args)
