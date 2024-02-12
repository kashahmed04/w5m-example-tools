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

/*
TOOLING: 
help improve developer quality of life (IDE that helps developers)
VS code has a bunch of extnesions and we can set recommended extensions for the workspace 
(everyone in repository should have this installed)
work with VS codes extension.json (shows package names for the recommended extensions and there will be a popup to install
the recommended packages)

how to install tools**

.EDITORCONFIG:
standard configuration for our editor that makes our IDE behave similar to teammates IDE (tab size, line number, etc.)**
we can have multiple config files in our repo that give overrides for folder or sublevel for folders (we set all files with the
star and change the indent size so when we press tab then it moves 6 spaces instead of te regular tab size)
we usually set the tab once then use that instead of resetting every time

PRETTIER:
code formatter that has its own opinions on formats and line breaks and how it should be and we can make it so when we save our file it 
formats it for us and it cleans up our code reveiew**
we configure it with .prettierrc file and we have 2 rules and we say no semi-colons and we use single quotes
we can also change it and we can have semi-colons and single quotes to double quotes and when we save everything gets updated according to
what we put in the prettier file
in our settings.json we have to set the formatter to the prettier and we say editor.formatonsave is true so it changes when we save
and the default formatter is prettier for our file** 
we can also overrride it to make prettier to work on JS or TS files only but for now its used on everything**
if we want to format the way we want to format it (matrix) and if we ran it through prettier then it forms a matrix into one
long line and add the prettier-ignore comment above the thing we dont want prettier to edit**

ESLINT WITH TS-ESLINT PLUGIN:
we have certain aspects of code rather we use var or let or const and it will automatically run those in the editor while we 
are writing and there is a command line tool to**
.eslintrc.json file and we have the root configuration to true for the whole project to be edited and the extends is
the recommended list of settings and TS rules and we use typescript parser that has optinos and pluggins for TS and we set our rule ovverides
and the rules are on their website and they have a lot of rules and on the site there is a link that talks about
the specific rule**

no-var says dont use var and use let or const instead and for each rule it tells us what to not do for a file and it would give
us a red line if we did not follow that rule**

"no-var": [0]- dont do anything [1]- warning [2]- error (only choose one of the options though)**

we can also run in command line by doing npm run lint and it gives us same error for using var**

for the package.json we use "lint": eslint-src command in to use it**

*/
