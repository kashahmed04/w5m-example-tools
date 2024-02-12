import './styles/reset.css'
import './styles/styles.css'

import { section01 } from './data/section01.data'
import { section04 } from './data/section04.data'
import { convertGuess, convertHour24To12 } from './data/convert.utils'
import { computeGroupAverage } from './data/average.utils'
import { GuessData } from './data/guess.types'
import { recountPoints, scoreGuessData } from './data/score.utils'
import { renderRow } from './table'

const section01data = section01.map(convertGuess)
const section01average = computeGroupAverage(section01data, 'avg01')

const section04data = section04.map(convertGuess)
const section04average = computeGroupAverage(section04data, 'avg04')

const dateTimeInput =
  document.querySelector<HTMLInputElement>('#datetime-input')
const poundInput = document.querySelector<HTMLInputElement>('#pound-input')
const ounceInput = document.querySelector<HTMLInputElement>('#ounce-input')
const inchInput = document.querySelector<HTMLInputElement>('#inch-input')

const classAvg = document.querySelector<HTMLElement>('.classes')
classAvg!.innerHTML = `
<p>Section 01 Average : ${new Date(section01average.birthMS).toLocaleDateString()} at ${Math.round(section01average.pounds)} lbs. ${Math.round(section01average.ounces)} oz. and ${Math.round(section01average.length)}"</p>
<p>Section 04 Average : ${new Date(section04average.birthMS).toLocaleDateString()} at ${Math.round(section04average.pounds)} lbs. ${Math.round(section04average.ounces)} oz. and ${Math.round(section04average.length)}"</p>
`

const calculatePoints = () => {
  if (
    dateTimeInput!.value !== '' &&
    poundInput!.value !== '' &&
    ounceInput!.value !== '' &&
    inchInput!.value !== ''
  ) {
    const dateTime = new Date(dateTimeInput!.value)
    const hourHalf = convertHour24To12(dateTime!.getHours())
    const correctGuess: GuessData = {
      submitTime: new Date(),
      submitMS: 0,
      birthMS: dateTime!.getTime(),
      id: 'Correct',
      month: dateTime!.getMonth() + 1,
      day: dateTime!.getDate(),
      hour: hourHalf.hour,
      hour24: dateTime!.getHours(),
      minute: dateTime!.getMinutes(),
      minuteBand: Math.floor(dateTime!.getMinutes() / 10),
      halfDay: hourHalf.halfDay,
      pounds: poundInput!.valueAsNumber,
      ounces: ounceInput!.valueAsNumber,
      length: inchInput!.valueAsNumber,
    }

    const points01avg = scoreGuessData(correctGuess, section01average)
    const points04avg = scoreGuessData(correctGuess, section04average)
    const points01students = section01data.map((guess) =>
      scoreGuessData(correctGuess, guess),
    )
    const points04students = section04data.map((guess) =>
      scoreGuessData(correctGuess, guess),
    )

    points01students.sort((a, b) => {
      return a.offBy - b.offBy
    })

    points04students.sort((a, b) => {
      return a.offBy - b.offBy
    })

    const bestClassAvg = points01avg.offBy < points04avg.offBy ? '01' : '04'
    const classWithBestIndividualGuess =
      points01students[0].offBy < points04students[0].offBy ? '01' : '04'

    const tbody = document.querySelector('tbody')
    tbody!.replaceChildren()

    renderRow(tbody!, points01avg)
    renderRow(tbody!, points04avg)

    points01students.forEach((points, index) => {
      points.classAvg = bestClassAvg === '01' ? 1 : 0
      if (classWithBestIndividualGuess === '01') {
        points.class = 2
        if (index === 0) {
          points.best = 5
        }
      }
      recountPoints(points)

      renderRow(tbody!, points)
    })

    points04students.forEach((points, index) => {
      points.classAvg = bestClassAvg === '04' ? 1 : 0
      if (classWithBestIndividualGuess === '04') {
        points.class = 2
        if (index === 0) {
          points.best = 5
        }
      }
      recountPoints(points)

      renderRow(tbody!, points)
    })
  }
}

document.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
  input.addEventListener('input', calculatePoints)
})

/*

Section 1 wants:
before 2/28 (good odds)
later than 1:03 pm (even chances)
lighter than 7 lbs 13 oz (bad odds)
longer than 19.9 inches (slightly favorable)

Section 4 wants:
after 2/28 (bad odds)
earlier than 1:03 pm (even chances)
heavier than 7 lbs 13 oz (good odds)
shorter than 19.9 inches (slightly unfavorable)

*/
