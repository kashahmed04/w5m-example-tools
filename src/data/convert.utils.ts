import { Guess, GuessData, HalfDay } from "./guess.types";

export const convertGuess = (guess: Guess): GuessData => {

  const daySplit = guess.day.split('/')

  const timeData = convertTime(guess.time)

  const birth = new Date(`${guess.day}/2024 ${guess.time}`)

  const submitTime = new Date(guess.submitTime)
  const guessData: GuessData = {
    submitTime,
    submitMS: submitTime.getTime(),
    birthMS: birth.getTime(),
    id: guess.id,
    month: parseInt(daySplit[0]),
    day: parseInt(daySplit[1]),
    ...timeData,
    pounds: guess.pounds,
    ounces: guess.ounces,
    length: guess.length,
  }

  return guessData;
}

export const convertTime = (time: string): Pick<GuessData, 'hour' | 'hour24' | 'minute' | 'minuteBand' | 'halfDay'> => {
  const timeSplit = time.split(' ')
  const numberSplit = timeSplit[0].split(':')
  const halfDay = timeSplit[1] === 'AM' ? 'AM' : 'PM'

  const hour = parseInt(numberSplit[0])
  const hour24 = convertHour12To24(hour, halfDay)
  const minute = parseInt(numberSplit[1])
  const minuteBand = Math.floor(minute/10)

  return {
    hour,
    hour24,
    minute,
    minuteBand,
    halfDay,
  }
}

export const convertHour12To24 = (hour: number, halfDay: HalfDay): number => {
  if (halfDay === 'AM') { return hour }
  if (hour === 12) { return hour }
  return hour + 12
}

export const convertHour24To12 = (hour: number): {hour: number, halfDay: HalfDay} => {
  const resultHour = hour > 12 ? hour - 12 : hour
  const resultHalfDay = hour >= 12 ? 'PM' : 'AM'

  return {
    hour: resultHour,
    halfDay: resultHalfDay,
  }
}