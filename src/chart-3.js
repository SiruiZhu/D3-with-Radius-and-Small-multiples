import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

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
let radius = 200

var radiusScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range([0, radius])

var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

var arc = d3
  .arc()
  .innerRadius(d => radiusScale(0))
  .outerRadius(d => radiusScale(d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

var colorScale = d3
  .scaleLinear()
  .domain([38, 83])
  .range(['#B6D5E3', '#FDC0CC'])

d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  var container = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  container
    .selectAll('.temp-graph')
    .data(datapoints)
    .enter()
    .append('path')

    .attr('d', function(d) {
      // console.log(d)
      return arc(d)
    })
    .attr('fill', function(d) {
      return colorScale(d.high_temp)
    })

  container
    .append('circle')
    .attr('r', 3)
    .attr('x', width / 2)
    .attr('y', height / 2)
    .attr('fill', 'gray')

  container
    .append('text')
    .text('NYC high temperatures, by month')
    .attr('x', 8)
    .attr('y', -130)
    .attr('font-weight', '600')
    .attr('font-size', 28)
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
}
