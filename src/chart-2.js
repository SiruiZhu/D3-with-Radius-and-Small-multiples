import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)

var pie = d3
  .pie()
  .value(function(d) {
    return d.minutes
  })
  .sort(null) //not sort

var radius = 75

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

var colorScale = d3.scaleOrdinal().range(['#844da5', '#9ebcda', '#e0ecf4'])

var xPositionScale = d3.scalePoint().range([0, width])

d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  // console.log('chart 2', datapoints)

  var projects = datapoints.map(d => d.project)
  // console.log(projects)

  xPositionScale.domain(projects).padding(0.4)

  var nested = d3
    .nest()
    .key(function(d) {
      return d.project
    })
    .entries(datapoints)
  // console.log('Chart 2 nested data look like', nested)

  svg
    .selectAll('.arc-graph')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      // console.log(d)
      return 'translate(' + xPositionScale(d.key) + ',' + height / 2 + ')'
    })
    .each(function(d) {
      // console.log(d)
      var container = d3.select(this)
      var datapoints = d.values
      // console.log('g data look like', datapoints)

      container
        .append('text')
        .text(d => d.key)
        .attr('x', xPositionScale(d.projects))
        .attr('y', height / 2)
        .attr('font-size', 15)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')

      container
        .selectAll('path')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('d', function(d) {
          // console.log(d)
          return arc(d)
        })
        .style('fill', d => colorScale(d.data.task))
    })
}
