import { Points } from './data/guess.types'

export const renderRow = (tbody: HTMLElement, points: Points) => {
  const row = document.createElement('tr')
  row.innerHTML = `
    <td>${points.id}</td>
    <td>${points.offBy}</td>
    <td>${points.day}</td>
    <td>${points.hour}</td>
    <td>${points.halfDay}</td>
    <td>${points.minute}</td>
    <td>${points.pounds}</td>
    <td>${points.ounces}</td>
    <td>${points.inches}</td>
    <td>${points.best}</td>
    <td>${points.class}</td>
    <td>${points.classAvg}</td>
    <td>${points.total}</td>
  `
  tbody.appendChild(row)
}
