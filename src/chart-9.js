import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }

let height = 425 - margin.top - margin.bottom
let width = 300 - margin.left - margin.right

var container = d3.select('#chart-9')

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

let radius = 105

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
  // console.log('datapoints look like', datapoints)
  container
    .selectAll('.nba-graph')
    .data(datapoints)
    .enter()
    .append('svg')
    .attr('class', 'nba-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)
    .each(function(d) {
      var line = d3
        .radialArea()
        .innerRadius(d => radiusScale(0))
        .outerRadius(d => radiusScale(d.value))
        .angle(d => {
          // console.log('the d for anglescale is', d)
          return angleScale(d.category)
        })
      var svg = d3.select(this)

      let maxMinutes = 60
      let maxPoints = 30
      let maxField = 10
      let max3point = 5
      let maxFree = 10
      let maxRebounds = 15
      let maxAssists = 10
      let maxSteals = 5
      let maxBlocks = 5

      let longTeamNames = {
        CLE: 'Cleveland Cavaliers',
        GSW: 'Golden State Warriors',
        SAS: 'San Antonio Spurs',
        MIN: 'Minnesota Timberwolves',
        MIL: 'Milwaukee Bucks',
        PHI: 'Philadelphia 76ers',
        OKC: 'Oklahoma City Thunder',
        NOP: 'New Orleans Pelicans',
        HOU: 'Houston Rockets'
      }
      console.log(longTeamNames)

      let customDatapoints = [
        {
          name: d.Name,
          team: d.Team,
          category: 'Minutes',
          value: d.MP / maxMinutes
        },
        {
          name: d.Name,
          team: d.Team,
          category: 'Points',
          value: d.PTS / maxPoints
        },
        {
          name: d.Name,
          team: d.Team,
          category: 'Field Goals',
          value: d.FG / maxField
        },
        {
          name: d.Name,
          team: d.Team,
          category: '3-Point Field Goals',
          value: d['3P'] / max3point
        },
        {
          name: d.Name,
          team: d.Team,
          category: 'Free Throws',
          value: d.FT / maxFree
        },
        {
          name: d.Name,
          team: d.Team,
          category: 'Rebounds',
          value: d.TRB / maxRebounds
        },
        {
          name: d.Name,
          team: d.Team,
          category: 'Assists',
          value: d.AST / maxAssists
        },
        {
          name: d.Name,
          team: d.Team,
          category: 'Steals',
          value: d.STL / maxSteals
        },
        {
          name: d.Name,
          team: d.Team,
          category: 'Blocks',
          value: d.BLK / maxBlocks
        }
      ]
      // console.log(customDatapoints)
      customDatapoints.push(customDatapoints[0])

      var categories = customDatapoints.map(d => d.category)
      // console.log(categories)
      angleScale.domain(categories)

      var maskId = d.Name.replace(' ', '-')
      // console.log(maskId)

      // add player shape and fix the shape
      svg
        .append('mask')
        .attr('id', maskId)
        .append('path')
        .datum(customDatapoints)
        .attr('d', line)
        .attr('fill', 'white')
        .attr('stroke', 'none')

      // add circle-bands
      let bands = [0.2, 0.4, 0.6, 0.8, 1]

      svg
        .append('g')
        .attr('class', d => {
          // console.log(d)
          return d.Team
        })
        .attr('mask', 'url(#' + maskId + ')')
        .selectAll('.scale-band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('cx', 0)
        .attr('cy', 0)
        .lower()

      svg
        .selectAll('.scale-band-bg')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('fill', (d, i) => {
          // console.log(' Looking at circle number', i)
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
      svg
        .selectAll('.category-label')
        .data(categories)
        .enter()
        .append('text')
        .text(d => {
          return d
        })
        .attr('font-size', 9)
        .attr('font-weight', 'bold')
        .attr('y', -radius)
        .attr('transform', d => {
          // console.log(d)
          let degrees = (angleScale(d) / Math.PI) * 180
          return `rotate(${degrees})`
        })
        .attr('text-anchor', 'middle')
        .attr('dy', -16)

      // add band labels
      svg
        .selectAll('.band-label')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d * 60)
        .attr('font-size', '7')
        .attr('font-weight', 400)
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('dy', -1)

      svg
        .selectAll('.band-label')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d * 30)
        .attr('font-size', '7')
        .attr('font-weight', 400)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('transform', 'rotate(40)')
        .attr('dy', -1)

      svg
        .selectAll('.band-label')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d * 10)
        .attr('font-size', '7')
        .attr('font-weight', 400)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('transform', 'rotate(80)')
        .attr('dy', -1)

      svg
        .selectAll('.band-label')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d * 5)
        .attr('font-size', '7')
        .attr('font-weight', 400)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('transform', 'rotate(120)')
        .attr('dy', -1)

      svg
        .selectAll('.band-label')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d * 10)
        .attr('font-size', '7')
        .attr('font-weight', 400)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('transform', 'rotate(160)')
        .attr('dy', -1)

      svg
        .selectAll('.band-label')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d * 15)
        .attr('font-size', '7')
        .attr('font-weight', 400)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('transform', 'rotate(200)')
        .attr('dy', -1)

      svg
        .selectAll('.band-label')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d * 10)
        .attr('font-size', '7')
        .attr('font-weight', 400)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('transform', 'rotate(240)')
        .attr('dy', -1)

      svg
        .selectAll('.band-label')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d * 5)
        .attr('font-size', '7')
        .attr('font-weight', 400)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('transform', 'rotate(280)')
        .attr('dy', -1)

      svg
        .selectAll('.band-label')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d * 5)
        .attr('font-size', '7')
        .attr('font-weight', 400)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('transform', 'rotate(320)')
        .attr('dy', -1)

      // add a circle in the center
      svg
        .append('text')
        .text('0')
        .attr('font-size', '7')
        .attr('font-weight', 400)
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')

      // add title(name and team)
      svg
        .append('text')
        .text(d => d.Name)
        .attr('font-size', 18)
        .attr('font-weight', 300)
        .attr('x', 0)
        .attr('y', -160)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')

      svg
        .append('text')
        .text(d => {
          return longTeamNames[d.Team]
        })
        .attr('font-size', 12)
        .attr('font-weight', 300)
        .attr('x', 0)
        .attr('y', -140)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
    })
}
