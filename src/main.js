import map from 'crocks/pointfree/map'
import path from 'path'

import {
  Async, assign, compose, filter, identity, isFunction, objOf, sort,
} from './lib/deps'
import { asyncImport, getCurrentDirectory } from './lib/helpers'
import { __each, __logError, __logLines } from './lib/impure'

// ModuleDefaultNotFound :: Str -> Obj
const ModuleDefaultNotFound = message => ({
  name: 'ModuleDefaultNotFound',
  message,
})

// flattenSolutions :: Obj -> [ Obj ]
const flattenSolutions = solnDir => solnDir.flatMap(
  ({ year, days }) => days.map(({ day, name }) => ({ year, day, name }))
)

// assignPathToSolution :: (Str, Str) -> Obj -> Obj
const assignPathToSolution = parent => soln => ({
  ...soln,
  path: path.join(parent, soln.year, soln.day),
})

// makeSolutionSelector :: (Obj, Number) -> Obj -> Boolean
const makeSolutionSelector = ({ all, year, day }, maxYear) => {
  if (all) {
    return () => true
  }
  if (year && day) {
    return ({ year: y, day: d }) => year === y && day === d
  }
  if (year) {
    return ({ year: y }) => year === y
  }
  return ({ year }) => year === String(maxYear)
}

// solutionsSorter :: (Obj, Obj) -> Int
const solutionsSorter = (fst, snd) =>
  Number(fst.year) - Number(snd.year)
  || Number(fst.day) - Number(snd.day)

// loadSolution :: Obj -> Async e Obj
const loadSolution = ({ year, day, path }) =>
  asyncImport(path)
    .map(module => (
      isFunction(module.default)
        ? { run: module.default }
        : { err: ModuleDefaultNotFound(
          `Solution to ${year} Day ${day} must export a default function.`
        ) }
    ))
    .coalesce(objOf('err'), identity)
    .map(assign({ year, day }))

// loadSolution :: [ Obj ] -> Async e [ Obj ]
const loadSolutions = compose(
  Async.all,
  map(loadSolution)
)

// __runSolutions :: !Impure ([ Obj ] -> ())
const __runSolutions = __each(soln => {
  console.log('')
  if (soln.err) {
    __logError(soln.err)
  } else {
    try {
      __logLines(
        soln.run()
      )
    } catch (e) {
      __logError(e)
    }
  }
  console.log('')
})

// (default) :: !Impure (Obj -> ())
export default ({
  props,
  availableSolutions,
}) => {
  const setSolutionPath = assignPathToSolution(
    path.join(getCurrentDirectory(import.meta), 'solutions')
  )

  const isSelected = makeSolutionSelector(
    props,
    Math.max(...availableSolutions.map(({ year }) => Number(year)))
  )

  const solutions = compose(
    sort(solutionsSorter),
    map(setSolutionPath),
    filter(isSelected),
    flattenSolutions
  )(availableSolutions)

  if (solutions.length) {
    loadSolutions(solutions).fork(__logError, __runSolutions)
  } else {
    console.error('Could not find any solution.')
  }
}
