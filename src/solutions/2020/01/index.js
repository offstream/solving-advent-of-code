import { applyTo, chain, compose, flip, map, split, trim } from '../../../lib/deps'
import { readSiblingInputFile, strfmt } from '../../../lib/helpers'
import { get2020Pair, get2020Triplet } from './logic'

// solvePartOne :: [ Num ] -> [ Str ]
const solvePartOne = input => {
  const pair = get2020Pair(input)
  return pair ? [
    strfmt('Found pair of values that sum to 2020: %d and %d', ...pair),
    strfmt('Multiplied they are %d', (pair[0] * pair[1])),
  ] : [
    'Could not find a pair that sum to 2020.',
  ]
}

// solvePartTwo :: [ Num ] -> [ Str ]
const solvePartTwo = input => {
  const triplet = get2020Triplet(input)
  return triplet ? [
    strfmt('Found triplet of values that sum to 2020: %d, %d, and %d', ...triplet),
    strfmt('Multiplied they are %d', (triplet[0] * triplet[1] * triplet[2])),
  ] : [
    'Could not find a pair that sum to 2020.',
  ]
}

// processInput :: Str -> [ Num ]
const processInput = compose(map(Number), split('\n'), trim)

// solveAll :: [ Num ] -> [ Str ]
const solveAll = compose(flip(chain, [ solvePartOne, solvePartTwo ]), applyTo)

// (default) :: () -> Async e [ Str ]
export default () =>
  readSiblingInputFile(import.meta)
    .map(processInput)
    .map(solveAll)
