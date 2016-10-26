export default name => {
  switch(name) {
    case 'lib':
    case 'server':
      return 'node'
    default:
      return 'web'
  }
}
