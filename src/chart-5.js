import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }

var height = 450 - margin.top - margin.bottom

var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 75

let radiusScale = d3
  .scaleLinear()
  .domain([0, 70])
  .range([50, radius])

let months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .angle(d => angleScale(d.month_name))

var xPositionScale = d3.scalePoint().range([0, width])

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var cities = datapoints.map(d => d.city)
  // console.log(cities)

  xPositionScale.domain(cities).padding(0.4)
  var nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)
  // console.log('Chart 5 nested data look like', nested)

  svg
    .selectAll('.radar-graph')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      // console.log(d)
      return 'translate(' + xPositionScale(d.key) + ',' + height / 2 + ')'
    })
    .each(function(d) {
      var container = d3.select(this)
      var datapoints = d.values
      datapoints.push(datapoints[0])

      container
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('fill', '#fa9fb5')
        .attr('opacity', 0.5)
        .attr('stroke', 'none')

      let bands = [20, 40, 60, 80,100]
      let bands_label = [20, 60, 100]

      container
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

      container
        .selectAll('.scale-text')
        .data(bands_label)
        .enter()
        .append('text')
        .text(function(d) {
          // console.log(d)
          return d + '°'
        })
        .attr('font-size', '7.5')
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('dy', -1)

      container
        .append('text')
        .text(d=> {
          // console.log(d)
          return d.key
        })
        .attr('x', 0)
        .attr('y',0)
        .attr('text-anchor','middle')
        .attr('font-weight', 400)
    })
}
