import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }
let height = 400 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-6')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 175

let radiusScale = d3
  .scaleLinear()
  .domain([0, 5])
  .range([0, radius])

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .innerRadius(d => radiusScale(0))
  .outerRadius(d => radiusScale(d.score))
  .angle(d => {
    // console.log('the d for anglescale is', d)
    return angleScale(d.category)
  })

d3.csv(require('./data/ratings.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  var categories = datapoints.map(d => d.category)
  // console.log(categories)
  angleScale.domain(categories)
  var holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  datapoints.push(datapoints[0])

  let bands = [0, 1, 2, 3, 4, 5]

  holder
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('cx', 0)
    .attr('cy', 0)
    .lower()

  holder
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', '#fa9fb5')
    .attr('opacity', 0.5)
    .attr('stoke-width', 1)
    .attr('stroke', 'black')

  holder
    .append('circle')
    .attr('r', 4)
    .attr('x', width / 2)
    .attr('y', height / 2)
    .attr('fill', 'gray')
    .lower()

  // add line for different direction
  holder
    .selectAll('.category-line')
    .data(categories)
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', -radius)
    .attr('stroke-width', 1)
    .attr('stroke', 'lightgray')
    .attr('transform', d => {
      // console.log(d)
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })
    .lower()

  // add text-label
  holder
    .selectAll('.category-label')
    .data(categories)
    .enter()
    .append('text')
    .text(d => {
      // console.log(d)
      return d
    })
    .attr('font-size', 11)
    .attr('font-wight', 300)
    .attr('y', -radius)
    .attr('transform', d => {
      // console.log(d)
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })
    .attr('text-anchor', 'middle')
    .attr('dy', -5)
}
