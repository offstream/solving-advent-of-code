import path from 'path'
import chalk from 'chalk'

import {
  Async, assign, chain, compose, filter, isFunction, isSameType, objOf, map, sort,
} from './lib/deps'
import { asyncImport, getCurrentDirectory } from './lib/helpers'
import { __each, __logError, __logLines } from './lib/impure'

// flattenSolutions :: Obj -> [ Obj ]
const flattenSolutions = solnDir => solnDir.flatMap(
  ({ year, days }) => days.map(
    ({ day, title, isCurrent }) => ({ year, day, title, isCurrent })
  )
)

// assignPathToSolution :: (Str, Str) -> Obj -> Obj
const assignPathToSolution = parent => soln => ({
  ...soln,
  path: path.join(parent, soln.year, soln.day),
})

// makeSolutionSelector :: (Obj, Number) -> Obj -> Boolean
const makeSolutionSelector = ({ all, current, year, day }, maxYear) => {
  if (all) {
    return () => true
  }
  if (current) {
    return ({ isCurrent }) => isCurrent
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

// noDefaultFnMsg :: Obj -> Str
const noDefaultFnMsg = meta =>
  `Solution to ${meta.year} Day ${meta.day} must export a default function.`

// nonAsyncReturnMsg :: Obj -> Str
const nonAsyncReturnMsg = meta =>
  `Solution to ${meta.year} Day ${meta.day} default function must return an Async.`

// loadSolution :: Obj -> Async Obj Obj
const loadSolution = meta =>
  asyncImport(meta.path)
    .chain(module => {
      try {
        if (!isFunction(module.default)) {
          throw TypeError(noDefaultFnMsg(meta))
        }
        const solution = module.default()
        if (!isSameType(Async, solution)) {
          throw TypeError(nonAsyncReturnMsg(meta))
        }
        return solution
      } catch (e) {
        return Async.Rejected(e)
      }
    })
    .coalesce(objOf('err'), objOf('msg'))
    .map(assign({ meta }))

// loadSolutions :: [ Obj ] -> Async Error [ Obj ]
const loadSolutions = compose(
  chain(
    res => res.length
      ? Async.Resolved(res)
      : Async.Rejected(Error('Could not find any solution'))
  ),
  Async.all,
  map(loadSolution)
)

// __logSolutions :: !Impure ([ Obj ] -> ())
const __logSolutions = __each(soln => {
  const { year, day, title } = soln.meta
  console.log('')
  console.log(chalk.inverse(` Year ${year}, Day ${day} `), title)
  console.log('='.repeat(80))
  if (soln.err) {
    __logError(soln.err)
  } else {
    __logLines(soln.msg)
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

  const selectSolutions = compose(
    loadSolutions,
    sort(solutionsSorter),
    map(setSolutionPath),
    filter(isSelected),
    flattenSolutions
  )

  selectSolutions(availableSolutions)
    .fork(__logError, __logSolutions)
}
