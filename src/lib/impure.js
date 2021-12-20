import fs from 'fs'
import path from 'path'
import { compose, curry, join } from './deps'
import { errorStdOut, getCurrentDirectory } from './helpers'

// __each :: !IMPURE ((a -> ()) -> [ a ] -> ())
export const __each = curry((cb, arr) => {
  arr.forEach(cb)
})

// __log :: !Impure ((...a) => ())
export const __log = (...args) => {
  console.log(...args)
}

// __logLines :: !Impure ([ a ] -> ())
export const __logLines = compose(__log, join('\n'))

// __logError :: !IMPURE (Obj -> ())
export const __logError = e => {
  console.error(errorStdOut(e))
}

// __readSiblingInputFile :: (String, ?String) -> String
export const __readSiblingInputFile = (metaObj, filename = 'input.text') =>
  fs.readFileSync(
    path.join(getCurrentDirectory(metaObj), filename)
  ).toString('utf-8').split('\n')
