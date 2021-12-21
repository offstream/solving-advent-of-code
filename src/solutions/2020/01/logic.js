// type Tuple a = [a, a]
// getPairWithSum :: (Num, [ Num ]) => Null | Tuple Num
const getPairWithSum = (sum, list) => {
  if (list.length < 2) {
    return null
  }

  const [ head, ...tail ] = list
  const next = sum - head

  if (tail.includes(next)) {
    return [ head, next ]
  }

  return getPairWithSum(sum, tail)
}

// type Triple a = [a, a, a]
// getTripletWithSum :: (Num , [ Num ]) => Null | Triple Num
const getTripletWithSum = (sum, list) => {
  if (list.length < 3) {
    return null
  }

  const [ head, ...tail ] = list
  const otherPair = getPairWithSum(sum - head, tail)

  if (otherPair) {
    return [ head, ...otherPair ]
  }

  return getTripletWithSum(sum, tail)
}

// get2020Pair :: [ Num ] => Null | Tuple Num
export const get2020Pair = getPairWithSum.bind(null, 2020)

// get2020Triplet :: [ Num ] => Null | Triple number
export const get2020Triplet = getTripletWithSum.bind(null, 2020)
