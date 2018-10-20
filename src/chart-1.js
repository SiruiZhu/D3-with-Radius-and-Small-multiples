import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// pie generator
var pie = d3.pie().value(function(d) {
  return d.minutes
})
// At the very least you'll need scales, and
var radius = 150

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

var labelArc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(350)

var colorScale = d3.scaleOrdinal().range(['#844da5', '#9ebcda', '#e0ecf4'])
// you'll need to read in the file. And you'll need
d3.csv(require('./data/time-breakdown.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))
// and svg, too, probably.

function ready(datapoints) {
  var container = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
  // console.log(datapoints)

  container
    .selectAll('.arc')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('d', function(d) {
      // console.log(d)
      return arc(d)
    })
    .attr('fill', d => colorScale(d.data.task))

  container
    .selectAll('.angle-text')
    .data(pie(datapoints))
    .enter()
    .append('text')
    .text(d => d.data.task)
    .attr('dy', '.50em')
    .attr('text-anchor', function(d) {
      if (d.startAngle > Math.PI) {
        return 'end'
      } else {
        return 'start'
      }
    })
    .attr('transform', function(d) {
      // console.log(d)
      return 'translate(' + labelArc.centroid(d) + ')'
    })
}
