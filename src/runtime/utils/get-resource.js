import stack from 'callsite'


export default () => stack()[2].getFileName() || ''
