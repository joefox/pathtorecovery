function clean(string){
    return string.replace(/[^a-zA-Z0-9]/g,"");
}
cdnurlpiece = "//cdn.rawgit.com/joefox/pathtorecovery/master/";
rawurlpiece = "//rawgit.com/joefox/pathtorecovery/master/";

function chart_consumption(){
var dataset = "https:" + cdnurlpiece + "data/by_state/consumption_all_2.csv"
  d3.csv(dataset, function (error, data) {
      var w = 800;
      var h = 800;
      var x = d3.time.scale().range([45, w-10]);
      var y = d3.scale.linear().range([h-20, 20]);
      var parseDate = d3.time.format("%Y").parse;

  // line function correlating data to x and y
      var line = d3.svg.line()
          .x(function (d) {
          return x(d.year);
      })
          .y(function (d) {
          return y(d.gallons);
      });

  // build the svg
      svg = d3.select("#consumption-chart")
          .append('svg')
          .attr("width",w)
          .attr("height",h);

      svg.append('text')
        .attr({
          "class":"axis-label",
          "x":-h/2,
          "y":20,
          "transform":"rotate(-90)"

        })
        .text('gallons of ethanol per person per year');

  //define the axes


          var color = d3.scale.category20c();

          color.domain(d3.keys(data[0]).filter(function(key){return key !== "year";}));

          data.forEach(function(d){
            d.year = parseDate(d.year);
          });

          var states = color.domain().map(function(name){
            return {
              name:name,
              values: data.map(function(d){
                return {year: d.year, gallons: +d[name]};
              })
            };
          });

      x.domain(d3.extent(data, function(d) { return d.year; }));
      x.range([50,w-85]);
      y.domain([0,8]);


  // create the path for the data
  var state = svg.selectAll(".state")
    .data(states)
    .enter().append("g")
    .attr("class","state");

    state.append("path")
      .attr("class","line")
      .attr("id",function(d){return clean(d.name) + "_line"})
      .attr("d", function(d){return line(d.values);})
      .style("fill","none")
      .on("mouseover", function(d){
        d3.selectAll(".activeline")
        .attr("class","line")
        .style("stroke","gray");


        d3.selectAll(".activelabel")
          .attr("class","label");

        d3.select("#"+clean(d.name)+"_label")
          .attr("class","activelabel");

        focus = d3.select("#"+clean(d.name)+"_line")
          .attr("class","activeline")
          .style("stroke","red");
      focus[0][0].parentNode.parentNode.appendChild(focus[0][0].parentNode);


        });




// PLACE LABELS
  state.append("text")
      .attr("class","label")
      .attr("id",function(d){return clean(d.name)+"_label"})
      .datum(function(d) { return {name:d.name, value: d.values[d.values.length - 1]}; })
      .attr("y", function(d,i) {return ((h-50)/50)*i+10})
      .attr("x", w)
      .attr("dy", ".35em")
      .text(function(d) {var name=d.name;return name; })
      .on("mouseover", function(d){
        d3.selectAll(".activelabel")
          .attr("class","label");

        d3.select(this).attr("class","activelabel");

        d3.selectAll(".activeline")
        .attr("class","line")
        .style("stroke","gray");

      focus = d3.select("#"+clean(d.name)+"_line")
          .attr("class","activeline")
          .style("stroke","red");

      focus[0][0].parentNode.parentNode.appendChild(focus[0][0].parentNode);
      });

      var xAxis = d3.svg.axis()
          .scale(x)
          .ticks(d3.time.year,1)
          .tickFormat(d3.time.format("%y"));

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(8);

  // call the axis
      var xAxisGroup = svg.append("g")
          .call(xAxis)
          .attr("class","axis")
          .attr("transform","translate(0,"+(h-20)+")");

      var yAxisGroup = svg.append("g")
          .call(yAxis)
          .attr("class","axis")
          .attr("transform","translate(50,0)");

// highlight Alaska on load
  var alaska = d3.select("#Alaska_line")
    .attr("class","activeline")
    .style("stroke","red");

   var alaskalabel = d3.selectAll("#Alaska_label")
      .attr("class","activelabel");


  alaska[0][0].parentNode.parentNode.appendChild(alaska[0][0].parentNode);

  });

}

function chart_dependence(){
    dataset= "https:" + cdnurlpiece + "data/past-year-alcohol-dependence.csv"
    dependence_chart_div = "#dependence_chart_div"
    d3.csv(dataset, function (error, data) {
        var w = 400;
        var h = 220;
        var dependence_x = d3.time.scale().range([75, w-50]);
        var dependence_y = d3.scale.linear().range([h-20, 20]);
        var parseDate = d3.time.format("%Y").parse;
      var legendentries = ["Alaska","US"]
      var depedence_legend_colors = d3.scale.ordinal()
        .range(["#1f78b4", "#e31a1c"]);

        var years = d3.keys(data[0]).filter(function(key) { return key !== "type"; });

        data.forEach(function(d) {
          d.years = years.map(function(name) { return {name: name, value: +d[name]}; });
        });

        // dependence_x.domain(d3.extent(data,function(d){return parseDate(years);}));
        dependence_x.domain([parseDate("2009"),parseDate("2012")]);
        dependence_y.domain([0,12]);
        // dependence_y.domain([0,d3.max(data,function(d){return d3.max(d.years,function(d){return d.value;})})]);

     dependence_svg = d3.select(dependence_chart_div)
          .append('svg')
          .attr("width",w)
          .attr("height",h);
  
  //define the axes
      var xAxis = d3.svg.axis()
          .scale(dependence_x)
          .ticks(d3.time.year,1)
          .tickFormat(d3.time.format("%Y"));
          // .tickValues(["2009-10","2010-11","2011-12","2012-13"]);

      var yAxis = d3.svg.axis()
          .scale(dependence_y)
          .orient("left")
          .ticks(4)
          .tickFormat(function(d){return d + "%"});

      var xAxisGroup = dependence_svg.append("g")
          .call(xAxis)
          .attr("class","axis")
          .attr("transform","translate(0,"+(h-20)+")");

      var yAxisGroup = dependence_svg.append("g")
          .call(yAxis)
          .attr("class","axis")
          .attr("transform","translate(40,0)");

// build the columns
      var type = dependence_svg.selectAll(".type")
        .data(data)
        .enter()
        .append("g")
        .attr({
          "class":function(d){return d.type + "_dependence"},
          "transform":function(d,i){return "translate("+(((w/years.length)/3)*(i-1)+i*2)+",0)"}
        });

      type.selectAll("rect")
        .data(function(d){return d.years;})
        .enter()
        .append("rect")
        .attr({
          "value":function(d){return d.value},
          "width":function(d){return (w/years.length)/3;},
          "x":function(d,i){return (dependence_x(parseDate(d.name)));},
          "height":function(d){return h-dependence_y(d.value)-20;},
          "y":function(d){return dependence_y(d.value);}
        });


// LEGEND
      var legend = dependence_svg.selectAll(".legend")
        .data(legendentries)
        .enter().append("g")
        .attr({
          "class":"legend",
          "transform":function(d,i){return "translate(0,"+i*20+")";}
        });

      legend.append("rect")
        .attr({
            "x":w-10,
            "width":10,
            "height":10
        })
        .style("fill",depedence_legend_colors);

      legend.append("text")
        .attr({
          "x":w-16,
          "y":9,
        })
        .style({
          "text-anchor":"end",
          "font-size":"12px"
        })
        .text(function(d){return d;});
  });
}


function chart_arrests(){
    dataset="https:" + cdnurlpiece + "data/arrests-related-to-alcohol-2010.csv";
    arrests_chart_div = "#arrests_chart_div";
    d3.csv(dataset, function (error, data) {
        var w = 800;
        var h = 500;
        var arrests_y = d3.scale.linear().range([20, h-50]);
        var arrests_x = d3.scale.linear().range([20,w-20]);
        var parseDate = d3.time.format("%Y").parse;
      var legendentries = ["Total","Alcohol-related"]
      var arrests_legend_colors = d3.scale.ordinal()
        .range(["#cccccc", "#e31a1c"]);

        // arrests_x.domain(d3.extent(data,function(d){return parseDate(years);}));
        arrests_y.domain([0,data.length]);
        arrests_x.domain([0,d3.max(data,(function(d){return parseInt(d.total);}))]);
        // arrests_y.domain([0,d3.max(data,function(d){return d3.max(d.years,function(d){return d.value;})})]);

     arrests_svg = d3.select(arrests_chart_div)
          .append('svg')
          .attr("width",w)
          .attr("height",h);

// initialize tooltips
    arrests_svg.call(arrest_tip);

  //define the axes
      var xAxis = d3.svg.axis()
          .scale(arrests_x)
          .ticks(8);

      var yAxis = d3.svg.axis()
          .scale(arrests_y)
          .orient("left")
          .ticks(0)
          .tickFormat(d3.format(">")); 

      var xAxisGroup = arrests_svg.append("g")
          .call(xAxis)
          .attr("class","axis")
          .attr("transform","translate(0,"+(h-40)+")");

      var yAxisGroup = arrests_svg.append("g")
          .call(yAxis)
          .attr("class","axis")
          .attr("transform","translate(20,0)");

// build the columns
    var arrest_columns = arrests_svg.selectAll(".arrest_group")
        .append('g')
        .attr('class','arrest_group');

    arrest_columns.data(data).enter()
        .append('rect')
        .attr({
            'class':'hover_zone',
            'y':function(d,i){return arrests_y(i);},
            'x':function(d){return arrests_x(0)},
            'height':function(d,i){return ((h-50)/data.length)-20;},
            'width':function(d){if((arrests_x(d.total)-20) < 50){return 50}else return 0;}
        })        .on('mouseover',arrest_tip.show)
        .on('mouseout',arrest_tip.hide);
    
    arrest_columns.data(data).enter()
        .append('rect')
        .attr({
            'class':'arrest_total_column',
            'id':function(d){return clean(d.offense) + "_column";},
            'y':function(d,i){return arrests_y(i);},
            'x':function(d){return arrests_x(0)},
            'height':function(d,i){return ((h-50)/data.length)-20;},
            'width':function(d){return arrests_x(d.total)-20}


        }).on('mouseover',arrest_tip.show)
        .on('mouseout',arrest_tip.hide);

    arrest_columns.data(data).enter()
        .append('rect')
        .attr({
            'class':'arrest_alcohol_column',
            'id':function(d){return clean(d.offense) + "_alcohol_column";},
            'y':function(d,i){return arrests_y(i);},
            'x':function(d){return arrests_x(0)},
            'height':function(d,i){return ((h-50)/data.length)-20;},
            'width':function(d){return arrests_x(d.alcoholrelated)-20}
        })
        .on('mouseover',arrest_tip.show)
        .on('mouseout',arrest_tip.hide);

    arrest_columns.data(data).enter()
        .append("text")
        .attr({
            'class':'arrest_label',
            'id':function(d){return clean(d.offense);},
            'x':20,
            'y':function(d,i){return arrests_y(i)-3;},
        })
        .text(function(d){return d.offense;});



// LEGEND
      var legend = arrests_svg.selectAll(".legend")
        .data(legendentries)
        .enter().append("g")
        .attr({
          "class":"legend",
          "transform":function(d,i){return "translate(0,"+i*20+")";}
        });

      legend.append("rect")
        .attr({
            "x":w-10,
            "width":10,
            "height":10
        })
        .style("fill",arrests_legend_colors);

      legend.append("text")
        .attr({
          "x":w-16,
          "y":9,
        })
        .style({
          "text-anchor":"end",
          "font-size":"12px"
        })
        .text(function(d){return d;});

  });
}