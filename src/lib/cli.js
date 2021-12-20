import { isDefined, unsetProp, defaultProps } from './deps'

export const getCliArgs = ({ flags = {}, input = [] }) => {
  if (flags.all) {
    return {
      help: false,
      all: true,
      stopOnErrors: flags.stopOnErrors,
    }
  }

  if (isDefined(flags.year)) {
    return flags
  } else if (isDefined(flags.day)) {
    return unsetProp('day', flags)
  }

  if (input.length) {
    const [ year, day ] = input
    return getCliArgs({ flags: defaultProps(flags, { year, day }) })
  }

  return flags
}
