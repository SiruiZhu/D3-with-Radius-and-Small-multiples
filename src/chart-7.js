import * as d3 from 'd3'

var margin = { top: 0, left: 0, right: 0, bottom: 0 }
var height = 600 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right

var svg = d3
  .select('#chart-7')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var times = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00'
]
let radius = 300

let radiusScale = d3
  .scaleLinear()
  .domain([0, 90000])
  .range([0, radius])

var line = d3
  .radialArea()
  .innerRadius(radiusScale(40000))
  .outerRadius(d => radiusScale(d.total))
  .angle(d => angleScale(d.time))

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

var colorScale_below = d3.scaleSequential(d3.interpolateCool)

var colorScale_above = d3.scaleSequential(d3.interpolateInferno)

d3.csv(require('./data/time-binned.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])
  // console.log('chart 7 datapoint is', datapoints)

  var all_times = datapoints.map(d => {
    // console.log(d)
    return d.time
  })
  angleScale.domain(all_times)

  var birthMin = d3.min(datapoints, d => +d.total)
  var birthMax = d3.max(datapoints, d => +d.total)
  // console.log(birthMin)
  colorScale_below.domain([birthMin, 40000])
  colorScale_above.domain([40000, birthMax])

  var holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  holder
    .append('mask')
    .attr('id', 'births')
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'white')
    .attr('stroke', 'none')

  holder
    .append('circle')
    .attr('r', d => radiusScale(40000))
    .attr('fill', 'none')
    .attr('stroke', 'orange')
    .attr('cx', 0)
    .attr('cy', 0)
    .lower()

  holder
    .selectAll('.time-label')
    .data(times)
    .enter()
    .append('text')
    .text(d => {
      // console.log(d)
      if (d === '00:00') {
        return 'Midnight'
      } else {
        return d.replace(':00', '')
      }
    })
    .attr('fill', 'gray')
    .attr('font-size', 11)
    .attr('font-wight', 300)
    .attr('y', -radiusScale(51000))
    .attr('transform', d => {
      // console.log(d)
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })
    .attr('text-anchor', 'middle')
    .attr('dy', -5)

  holder
    .selectAll('.time-circle')
    .data(times)
    .enter()
    .append('circle')
    .attr('r', radiusScale(57000))
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('cx', 0)
    .attr('cy', 0)

  // add circles for eact time points
  holder
    .selectAll('.point-circle')
    .data(times)
    .enter()
    .append('circle')
    .attr('r', 0.8)
    .attr('cy', -radiusScale(57000))
    .attr('transform', d => {
      // console.log(d)
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })
    .attr('fill', 'lightgrey')

  // add one more circles for each points make gaps between each
  holder
    .selectAll('.point-circle')
    .data(times)
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('cy', -radiusScale(57000))
    .attr('transform', d => {
      // console.log(d)
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })
    .attr('fill', 'lightgrey')
    .attr('stroke', 'white')
    .attr('stroke-width', 2)

  // var container = holder.append('g')

  let bands = d3.range(0, 90000, 2000)

  holder
    .append('g')
    .attr('mask', 'url(#births)')
    .selectAll('.color-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', d => {
      // console.log(d)
      if (d <= 40000) {
        return colorScale_below(d)
      } else {
        return colorScale_above(d)
      }
    })
    // .attr('stroke', 'lightgrey')
    .lower()

  // add title-texts // 
  holder
    .append('text')
    .text('EVERYONE!')
    .attr('x', 0)
    .attr('y', -20)
    .attr('font-size', 20)
    .attr('font-weight', 800)
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')

  holder
    .append('text')
    .text('is born at 8am')
    .attr('x', 0)
    .attr('y', 0)
    .attr('font-size', 15)
    .attr('font-weight', 600)
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')

  holder
    .append('text')
    .text('(read Macbeth for details)')
    .attr('x', 0)
    .attr('y', 20)
    .attr('font-size', 11)
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
}
