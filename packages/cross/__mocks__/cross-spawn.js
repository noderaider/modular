export default function spawn (command, args, opts) {
  const cbMap = new Map()
  const on = (event, cb) => {
    cbMap.set(event, cb)
  }
  const stream = (
    { on
    }
  )
  const stdout = (
    { pipe: () => {
        const executable = args[0]
        const result = ['npm', 'node'].includes(executable) ? `/usr/bin/${executable}` : ''
        if(result) {
          result.split('/').forEach((chunk, i) => {
            setTimeout(() => {
              cbMap.get('data')(`${i > 0 ? '/' : ''}${chunk}`)
            }, (i + 1) * 20)
          })
        }
        setTimeout(() => {
          cbMap.get('end')()
        }, 200)
        return stream
      }
    }
  )

  return { stdout }
}
