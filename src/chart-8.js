import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }
let height = 450 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-8')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

let radius = 135
let maxMinutes = 60
let maxPoints = 30
let maxField = 10
let max3point = 5
let maxFree = 10
let maxRebounds = 15
let maxAssists = 10
let maxSteals = 5
let maxBlocks = 5

let radiusScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([0, radius])

var line = d3
  .radialArea()
  .innerRadius(d => radiusScale(0))
  .outerRadius(d => radiusScale(d.value))
  .angle(d => {
    // console.log('the d for anglescale is', d)
    return angleScale(d.category)
  })

d3.csv(require('./data/nba.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  let player = datapoints[0]
  // console.log(player.Name)

  let customDatapoints = [
    { category: 'Minutes', value: player.MP / maxMinutes },
    { category: 'Points', value: player.PTS / maxPoints },
    { category: 'Field Goals', value: player.FG / maxField },
    { category: '3-Point Field Goals', value: player['3P'] / max3point },
    { category: 'Free Throws', value: player.FT / maxFree },
    { category: 'Rebounds', value: player.TRB / maxRebounds },
    { category: 'Assists', value: player.AST / maxAssists },
    { category: 'Steals', value: player.STL / maxSteals },
    { category: 'Blocks', value: player.BLK / maxBlocks }
  ]
  // console.log(customDatapoints)
  customDatapoints.push(customDatapoints[0])

  var categories = customDatapoints.map(d => d.category)
  // console.log(categories)
  angleScale.domain(categories)

  var holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  // add player shape and fix the shape
  holder
    .append('mask')
    .attr('id', 'nba-value')
    .append('path')
    .datum(customDatapoints)
    .attr('d', line)
    .attr('fill', 'white')
    .attr('stroke', 'none')

  // add circle-bands
  let bands = [0.2, 0.4, 0.6, 0.8, 1]

  holder
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', (d, i) => {
      // console.log('Looking at circle number', i)
      if (i % 2 === 0) {
        return '#c94435'
      } else {
        return '#FFB81C'
      }
    })
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('mask', 'url(#nba-value)')
    .lower()

  holder
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', (d, i) => {
      // console.log('Looking at circle number', i)
      if (i % 2 === 0) {
        return '#e8e7e5'
      } else {
        return '#f6f6f6'
      }
    })
    .attr('cx', 0)
    .attr('cy', 0)
    .lower()

  // add categories text-label
  holder
    .selectAll('.category-label')
    .data(categories)
    .enter()
    .append('text')
    .text(d => {
      return d
    })
    .attr('font-size', 12)
    .attr('font-weight', 'bold')
    .attr('y', -radius)
    .attr('transform', d => {
      // console.log(d)
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })
    .attr('text-anchor', 'middle')
    .attr('dy', -14)

  // add a circle in the center
  holder
    .append('circle')
    .attr('r', 3)
    .attr('x', width / 2)
    .attr('y', height / 2)
    .attr('fill', 'black')

  // add band labels
  holder
    .selectAll('.band-label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * 60)
    .attr('font-size', '10')
    .attr('font-weight', 400)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('transform', 'rotate(0)')
    .attr('dy', -1)

  holder
    .selectAll('.band-label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * 30)
    .attr('font-size', '10')
    .attr('font-weight', 400)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('transform', 'rotate(40)')
    .attr('dy', -1)

  holder
    .selectAll('.band-label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * 10)
    .attr('font-size', '10')
    .attr('font-weight', 400)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('transform', 'rotate(80)')
    .attr('dy', -1)

  holder
    .selectAll('.band-label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * 5)
    .attr('font-size', '10')
    .attr('font-weight', 400)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('transform', 'rotate(120)')
    .attr('dy', -1)

  holder
    .selectAll('.band-label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * 10)
    .attr('font-size', '10')
    .attr('font-weight', 400)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('transform', 'rotate(160)')
    .attr('dy', -1)

  holder
    .selectAll('.band-label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * 15)
    .attr('font-size', '10')
    .attr('font-weight', 400)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('transform', 'rotate(200)')
    .attr('dy', -1)

  holder
    .selectAll('.band-label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * 10)
    .attr('font-size', '10')
    .attr('font-weight', 400)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('transform', 'rotate(240)')
    .attr('dy', -1)

  holder
    .selectAll('.band-label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * 5)
    .attr('font-size', '10')
    .attr('font-weight', 400)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('transform', 'rotate(280)')
    .attr('dy', -1)

  holder
    .selectAll('.band-label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * 5)
    .attr('font-size', '10')
    .attr('font-weight', 400)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('transform', 'rotate(320)')
    .attr('dy', -1)

  holder
    .append('text')
    .text('LeBron James')
    .attr('font-size', 18)
    .attr('font-weight', 300)
    .attr('x', 0)
    .attr('y', -200)
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')

  holder
    .append('text')
    .text('Cleveland Cavaliers')
    .attr('font-size', 12)
    .attr('font-weight', 300)
    .attr('x', 0)
    .attr('y', -180)
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
}
