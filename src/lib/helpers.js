import path from 'path'
import util from 'util'
import { readFile } from 'fs/promises'

import chalk from 'chalk'

import { Async, curry } from './deps'

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

// getPathToSiblingFile :: Obj -> Str -> Str
export const getPathToSiblingFile = curry(
  (importMeta, sibling) => path.join(getCurrentDirectory(importMeta), sibling)
)

// asyncImport :: Str -> Async Error Obj
export const asyncImport = Async.fromPromise(path => import(path))

// readSiblingInputFile :: (Obj, ?Str) -> Async e Str
export const readSiblingInputFile = Async.fromPromise(
  (inputMeta, sibling = 'input.text') =>
    readFile(getPathToSiblingFile(inputMeta, sibling), 'utf-8')
)
