import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }

var height = 400 - margin.top - margin.bottom

var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-3c')
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

let radius = 75

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
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

var colorScale = d3
  .scaleLinear()
  .domain([38, 83])
  .range(['#B6D5E3', '#FDC0CC'])

var xPositionScale = d3.scalePoint().range([0, width])

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])
  var cities = datapoints.map(d => d.city)
  // console.log(cities)

  xPositionScale.domain(cities).padding(0.4)

  var nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)
  //console.log('Chart 3b nested data look like', nested)

  svg
    .selectAll('.arc-graph')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      //console.log(d)
      return 'translate(' + xPositionScale(d.key) + ',' + height / 2 + ')'
    })
    .each(function(d) {
      //console.log(d)
      var container = d3.select(this)
      var datapoints = d.values
      datapoints.push(datapoints[0])
      //console.log('g data look like', datapoints)

      // add graph
      container
        .selectAll('.temp-graph')
        .data(datapoints)
        .enter()
        .append('path')
        .attr('fill', d => colorScale(d.high_temp))
        .attr('d', function(d) {
          // console.log(d)
          return arc(d)
        })
      // add city names
      container
        .append('text')
        .text(d => d.key)
        .attr('x', xPositionScale(d.city))
        .attr('y', height / 2)
        .attr('font-size', 15)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
      //add circle
      container
        .append('circle')
        .attr('r', 2.5)
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('fill', 'black')
    })
}
