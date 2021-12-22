import test from 'ava'

import {
  countFirstPolicyValidPasswords,
  countSecondPolicyValidPasswords,
} from './logic'

const input = [
  '1-3 a: abcde',
  '1-3 b: cdefg',
  '2-9 c: ccccccccc',
]

test('countFirstPolicyValidPasswords', t => {
  t.is(2, countFirstPolicyValidPasswords(input))
})

test('countSecondPolicyValidPasswords', t => {
  t.is(1, countSecondPolicyValidPasswords(input))
})
