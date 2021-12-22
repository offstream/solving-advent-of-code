import path from 'path'
import util from 'util'
import { readFile } from 'fs/promises'

import chalk from 'chalk'

import {
  Async,
  and,
  curry,
  equals,
  fanout,
  flip,
  gte,
  length,
  lte,
  match,
  replace,
} from './deps'

// dot :: (b -> c) -> (a -> b) -> c
export const dot = curry(
  (f, g, a) => f(g(a))
)

// strfmt :: (...a) -> Str
export const strfmt = (...args) => util.formatWithOptions({ colors: true }, ...args)

// errorStdOut :: Error -> Str
export const errorStdOut = e => chalk.red(
  [ util.format(chalk.inverse(' %s '), e.name, e.message) ]
    .concat(e.stack ? e.stack.split('\n').slice(1) : []).join('\n')
)

// stringBefore :: Str -> Str -> Str
export const stringBefore = curry(
  str => replace(RegExp(`${str}.*`), '')
)

// stringAfter :: Str -> Str -> Str
export const stringAfter = curry(
  str => replace(RegExp(`.+?${str}`), '')
)

// isGte :: Ord a => a -> a -> Bool
export const isGte = flip(gte)

// isLte :: Ord a => a -> a -> Bool
export const isLte = flip(lte)

// withinRange :: Ord a => a -> a -> a -> Bool
export const withinRange = curry(
  (min, max) => and(isGte(min), isLte(max))
)

// charAt :: Int -> Str -> Str
export const charAt = curry(
  (idx, str) => str.charAt(idx)
)

// lengthIs :: Int -> Array -> Bool
export const lengthIs = curry(
  n => dot(equals(n), length)
)

// charAtIs :: Int -> Str -> Str -> Bool
export const charAtIs = curry(
  (idx, char) => dot(equals(char), charAt(idx))
)

// countCharMatch :: Str -> Str -> Bool
export const countCharMatch = curry(
  char => dot(length, match(RegExp(char, 'g')))
)

// splitToPair :: Str -> Str -> Pair Str Str
export const splitToPair = curry(
  sep => fanout(stringBefore(sep), stringAfter(sep))
)

// pairToArray :: Pair a b -> [ a, b ]
export const pairToArray = pair => pair.toArray()

// getCurrentDirectory :: Obj -> Str
export const getCurrentDirectory = importMeta =>
  path.dirname(importMeta.url).slice(7)

// getPathToSiblingFile :: Obj -> Str -> Str
export const getPathToSiblingFile = curry(
  (importMeta, sibling) => path.join(getCurrentDirectory(importMeta), sibling)
)

// asyncImport :: Str -> Async Error Obj
export const asyncImport = Async.fromPromise(path => import(path))

// asyncReadFile :: (Str, ?(Str|Obj)) -> Async e Buffer
export const asyncReadFile = Async.fromPromise(readFile)

// readSiblingInputFile :: (Obj, ?Str) -> Async e Str
export const readSiblingInputFile =
  (inputMeta, sibling = 'input.txt') =>
    asyncReadFile(getPathToSiblingFile(inputMeta, sibling), 'utf-8')
