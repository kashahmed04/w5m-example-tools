import { convertHour24To12 } from './convert.utils'
import { GuessData } from './guess.types'

export const computeGroupAverage = (
  group: GuessData[],
  id: string,
): GuessData => {
  const averages: Pick<
    GuessData,
    | 'submitMS'
    | 'hour24'
    | 'birthMS'
    | 'minute'
    | 'pounds'
    | 'ounces'
    | 'length'
  > = {
    submitMS: 0,
    hour24: 0,
    birthMS: 0,
    minute: 0,
    pounds: 0,
    ounces: 0,
    length: 0,
  }

  group.forEach((guess) => {
    averages.submitMS += guess.submitMS
    averages.hour24 += guess.hour24
    averages.birthMS += guess.birthMS
    averages.minute += guess.minute
    averages.pounds += guess.pounds
    averages.ounces += guess.ounces
    averages.length += guess.length
  })

  averages.submitMS /= group.length
  averages.hour24 /= group.length
  averages.birthMS /= group.length
  averages.minute /= group.length
  averages.pounds /= group.length
  averages.ounces /= group.length
  averages.length /= group.length

  const birth: Date = new Date(averages.birthMS)

  const hour12 = convertHour24To12(birth.getHours())

  return {
    submitTime: new Date(averages.submitMS),
    submitMS: averages.submitMS,
    birthMS: averages.birthMS,
    id,
    month: birth.getMonth() + 1,
    day: birth.getDate(),
    hour: hour12.hour,
    hour24: birth.getHours(),
    minute: birth.getMinutes(),
    minuteBand: Math.floor(birth.getMinutes() / 10),
    halfDay: hour12.halfDay,
    pounds: averages.pounds,
    ounces: averages.ounces,
    length: averages.length,
  }
}
