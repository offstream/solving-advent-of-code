import {
  add,
  applyTo,
  bimap,
  compose,
  fanout,
  filter,
  flip,
  length,
  map,
  merge,
  psi,
  swap,
} from '../../../lib/deps'

import {
  charAtIs,
  countCharMatch,
  dot,
  lengthIs,
  pairToArray,
  splitToPair,
  stringAfter,
  stringBefore,
  withinRange,
} from '../../../lib/helpers'

// type Password = Str
// type Policy = Str
// type Validator = Policy -> Password -> Bool

// getPassword :: Str -> Password
const getPassword = stringAfter(': ')

// getPolicy :: Str -> Policy
const getPolicy = stringBefore(': ')

// countValidPasswordsWith :: Validator -> [ Str ] -> Int
const countValidPasswordsWith = validator => dot(
  length,
  filter(compose(
    merge(applyTo),
    map(validator),
    fanout(getPassword, getPolicy)
  ))
)

// firstPolicyValidator :: Validator
const fistPolicyValidator = compose(
  merge(dot),
  bimap(
    dot(merge(psi(withinRange, Number)), splitToPair('-')),
    countCharMatch
  ),
  splitToPair(' ')
)

// secondPolicyValidator :: Validator
const secondPolicyValidator = compose(
  preds => compose(lengthIs(1), flip(filter, preds), applyTo),
  merge(map),
  swap(
    compose(
      map(compose(charAtIs, add(-1), Number)),
      pairToArray,
      splitToPair('-')
    ),
    applyTo
  ),
  splitToPair(' ')
)

// countFirstPolicyValidPasswords :: [ Str ] -> Int
export const countFirstPolicyValidPasswords =
  countValidPasswordsWith(fistPolicyValidator)

// countSecondPolicyValidPasswords :: [ Str ] -> Int
export const countSecondPolicyValidPasswords =
  countValidPasswordsWith(secondPolicyValidator)
