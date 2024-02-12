import { GuessData, Points } from './guess.types'

export const scoreGuessData = (
  correct: GuessData,
  guess: GuessData,
): Points => {
  const result: Points = {
    id: guess.id,
    offBy: Math.abs(guess.birthMS - correct.birthMS),
    day: correct.day === guess.day ? 2 : 0,
    hour: correct.hour24 === guess.hour24 ? 1 : 0,
    halfDay: correct.halfDay === guess.halfDay ? 1 : 0,
    minute: correct.minuteBand === guess.minuteBand ? 1 : 0,
    pounds: correct.pounds === Math.round(guess.pounds) ? 1 : 0,
    ounces: correct.ounces === Math.round(guess.ounces) ? 1 : 0,
    inches: correct.length === Math.round(guess.length) ? 2 : 0,
    best: 0,
    class: 0,
    classAvg: 0,
    total: 0,
  }
  result.total =
    result.day +
    result.hour +
    result.halfDay +
    result.minute +
    result.pounds +
    result.ounces +
    result.inches
  return result
}

export const recountPoints = (points: Points): void => {
  points.total =
    points.day +
    points.hour +
    points.halfDay +
    points.minute +
    points.pounds +
    points.ounces +
    points.inches +
    points.class +
    points.classAvg +
    points.best
}
