import path from 'path'
import util from 'util'

import chalk from 'chalk'

import { Async } from './deps'

// strfmt :: (...a) -> Str
export const strfmt = (...args) => util.formatWithOptions({ colors: true }, ...args)

// errorStdOut :: Error -> Str
export const errorStdOut = e => chalk.red(
  [ util.format(chalk.inverse(' %s '), e.name, e.message) ]
    .concat(e.stack ? e.stack.split('\n').slice(1) : []).join('\n')
)

// getCurrentDirectory :: Obj -> Str
export const getCurrentDirectory = importMeta =>
  path.dirname(importMeta.url).slice(7)

// asyncImport :: Str -> Async Error Obj
export const asyncImport = Async.fromPromise(path => import(path))
