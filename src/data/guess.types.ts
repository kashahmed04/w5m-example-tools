export interface Guess {
  submitTime: string
  id: string
  day: string
  time: string
  pounds: number
  ounces: number
  length: number
}

export type HalfDay = 'AM' | 'PM'

export interface GuessData {
  submitTime: Date
  submitMS: number
  birthMS: number
  id: string
  month: number
  day: number
  hour: number
  hour24: number
  minute: number
  minuteBand: number
  halfDay: HalfDay
  pounds: number
  ounces: number
  length: number
}

export interface Points {
  id: string
  offBy: number
  day: number
  hour: number
  halfDay: number
  minute: number
  pounds: number
  ounces: number
  inches: number
  best: number
  class: number
  classAvg: number
  total: number
}
