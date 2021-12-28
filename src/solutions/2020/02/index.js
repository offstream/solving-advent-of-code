import { applyTo, chain, compose, flip, split } from  '../../../lib/deps'
import { readSiblingInputFile, strfmt } from '../../../lib/helpers'
import {
  countFirstPolicyValidPasswords,
  countSecondPolicyValidPasswords,
} from './logic'

const splitToLines = split('\n')

const solvePartOne = input => [
  'Part One:',
  strfmt('  Found %d valid password/s', countFirstPolicyValidPasswords(input)),
]

const solvePartTwo = input => [
  'Part Two:',
  strfmt('  Found %d valid password/s', countSecondPolicyValidPasswords(input)),
]

const solveAll = compose(flip(chain, [ solvePartOne, solvePartTwo ]), applyTo)

export default () =>
  readSiblingInputFile(import.meta)
    .map(splitToLines)
    .map(solveAll)
