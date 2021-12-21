import test from 'ava'
import { __readSiblingInputFile } from '../../../lib/impure'
import { get2020Pair, get2020Triplet } from './logic'

const input = [ 1721, 979, 366, 299, 675, 1456 ]
const problem = __readSiblingInputFile(import.meta).split('\n').map(Number)

test('getPair - find a pair of numbers in a list with a sum of 2020', t => {
  const pair = get2020Pair(input)
  t.is(2, pair.length)
  t.true(pair.includes(1721))
  t.true(pair.includes(299))
})

test('get2020Triplet - find a triplet of numbers in a list with a sum of 2020', t => {
  const triplet = get2020Triplet(input)
  t.is(3, triplet.length)
  t.true(triplet.includes(979))
  t.true(triplet.includes(366))
  t.true(triplet.includes(675))
})

test('solve pair', t => {
  const [ fst, snd ] = get2020Pair(problem)
  t.is(2020, fst + snd)
  t.true(problem.includes(fst))
  t.true(problem.includes(snd))
})

test('solve triplet', t => {
  const [ fst, snd, tri ] = get2020Triplet(problem)
  t.is(2020, fst + snd + tri)
  t.true(problem.includes(fst))
  t.true(problem.includes(snd))
  t.true(problem.includes(tri))
})
