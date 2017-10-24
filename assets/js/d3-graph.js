'use strict';

var d3 = require('d3');
var $ = require('jquery');

function initD3Graph() {

  $.getJSON('/public/dataGraph.json', function(json) {

    var data = [];
    var labels = {
      '1': '1. Never have, never will',
      '2': '2. Was online, but no longer',
      '3': '3. Willing and unable',
      '4': '4. Reluctantly online',
      '5': '5. Learning the ropes',
      '6': '6. Task specific',
      '7': '7. Basic online skills',
      '8': '8. Confident',
      '9': '9. Expert'
    };
    for (var key in json) {
      let obj = {};
      obj.name = labels[key];
      obj.value = json[key];
      data.push(obj);
    }

    var margin = {top: 60, right: 30, bottom: 80, left: 40},
        width = 900 - margin.left - margin.right,
        height = 230 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], -0.05);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var chart = d3.select(".chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    chart.append("text")
      .attr("class", "graph-title")
      .attr("x", 320)
      .attr("y", -35)
      .text("All participants");

    chart.append("text")
      .attr("class", "graph-title-below")
      .attr("x", 310)
      .attr("y", 150)
      .text("Digital Inclusion Scale");

    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(-34," + height + ")")
      .call(xAxis)
      .selectAll(".tick text")
      .call(wrap, x.rangeBand());

    var bar = chart.selectAll(".bar")
      .data(data)
      .enter();

      bar.append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", 30);

      bar.append("text")
        .attr("class", "graph-text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) { return x(d.name) + 15; })
        .attr("y", function(d) { return y(d.value) + 3; })
        .attr("dy", "-0.7em")
        .text(function(d) { return d.value; });

    function type(d) {
      d.value = +d.value; // coerce to number
      return d;
    }
  });

  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width-10) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }
}

module.exports = initD3Graph;