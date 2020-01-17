class LineGraph{

	constructor(){
		market=new Market(this)
		this.ready=false
	}
	start(){

		var portfolios=[]
		Investor.getInvestors().forEach(function(d){
			portfolios.push(d.doInvestments(moment("1975-01-01"),moment("2020-01-02")))
		})


		this.drawGraph(portfolios)

		this.pf=portfolios
		this.ready=true;
	}
	drawGraph(pf){

		$("#my_dataviz").empty()


		// 2. Use the margin convention practice 
		var margin = {top: 40, right: 40, bottom: 40, left: 40}
			, width =	$("#my_dataviz").width()-80
			, height =	$("#my_dataviz").height()-80

		//same for every graph, 45 years of work
		var n = pf[0].length;

		//Highest income achieved
		//		var max=pf.reduce(function(a,p){
		//			return Math.max(p.reduce(function(b,q){
		//				return Math.max(q.getValue(),b)
		//			},0),a)
		//		},0)

		var max=d3.max(pf,(d)=>d3.max(d,(dd)=>dd.getValue()))

		// 5. X scale will use the index of our data
		var xScale = d3.scaleTime()
			.domain([new Date("1975-01-01"),new Date("2020-01-01")])
			.range([60, width]); // output

		// 6. Y scale will use the randomly generate number 

		var yScale = d3.scaleLinear()
			.domain([0,max])
			.range([height, 40]) // output 

		// 7. d3's line generator

		// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
		//var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })
		// 1. Add the SVG to the page and employ #2
		var par= d3.select("#my_dataviz").append("svg")
		// Add a clipPath: everything out of this area won't be drawn.
		var clip = par.append("defs").append("svg:clipPath")
			.attr("id", "clip")
			.append("svg:rect")
			.attr("width", width )
			.attr("height", height )
			.attr("x", margin.left)
			.attr("y", margin.top);

		var svg=par.attr("id","mainGraph")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("clip-path", "url(#clip)")


		var xAxis = d3.axisBottom(xScale)
		// 3. Call the x axis in a group tag
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)

		// 4. Call the y axis in a group tag
		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(60,0)")
			.call(d3.axisLeft(yScale).tickFormat(Tools.getAbb)); // Create an axis component with d3.axisLeft

		var line = d3.line()
			.x(function(d, i) {return xScale(d.date.toDate()); }) // set the x values for the line generator
			.y(function(d) { return yScale(d.getValue()); }) // set the y values for the line generator 



		// A function that set idleTimeOut to null
		var idleTimeout
		function idled() { idleTimeout = null; }

		function zoom(){
			var extent = d3.event.selection

			if(!extent){
				if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
				xScale.domain([ 4,8])
			}else{
				var from=xScale.invert(extent[0])
				var to=xScale.invert(extent[1])
				xScale.domain([ from, to ])
				svg.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
				var max=d3.max(pf,(d)=>d3.max(d.filter((dd)=>(dd.date<to&&dd.date>from))  ,(dd)=>dd.getValue()))
				yScale.domain([0,max])
			}

			xAxis = d3.axisBottom(xScale)
			var line = d3.line()
				.x(function(d, i) {return xScale(d.date.toDate()); }) // set the x values for the line generator
				.y(function(d) { return yScale(d.getValue()); }) // set the y values for the line generator 

			for(let x of paths){
				x
					.transition()
					.duration(1000)
					.attr("d",line)
			}

		}
		// Add brushing
		var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
			.extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
			.on("end", zoom)               // Each time the brush selection changes, trigger the 'updateChart' function

		// Add the brushing
		svg
			.append("g")
			.attr("class", "brush")
			.call(brush);

		var paths=[]
		var ctr=-1
		for(let x of pf){
			paths.push(null)
			paths[++ctr]=svg.append("path")
				.datum(x) // 10. Binds data to the line 
				.attr("class", "line") // Assign a class for styling 
				.attr("stroke",a=>a[0].owner.color)
				.attr("d",line)
			var totalLength = paths[ctr].node().getTotalLength();
			//paths[ctr]
			//	.attr("stroke-dasharray", totalLength + " " + totalLength)
			//	.attr("stroke-dashoffset", totalLength)
			//	.transition()
			//	.duration(4000)
			//	.ease(d3.easeLinear)
			//	.attr("stroke-dashoffset", 0)
		}
		var x = pf.flat(1)
		var occ = []
		// 12. Appends a circle for each datapoint 
		var dots = svg.selectAll(".dot")
			.data(x)
			.enter()
			.append("circle") // Uses the enter().append() method
			.style("fill",a=>a.owner.color)
			.attr("class", "dot") // Assign a class for styling
			.attr("cx", function(d, i) {
				return xScale(d.date.toDate())
			})
			.attr("cy", function(d) {
				var x=yScale(d.getValue())

				if(occ[d.date.toDate()]==undefined)
					occ[d.date.toDate()]=[]

				var ctv=1
				while(occ[d.date.toDate()].some(a=>Math.abs(a-x)<6) ){
					x-=1;
				}

				occ[d.date.toDate()].push(x);
				return x; 
			})
			.attr("data-booked", "true")
			.attr("r", 6)
			.attr("opacity", "0")
			.on("mouseover", function(a, b, c) {
				d3.select(this).attr('class', 'focus')
			})
			.on("mouseout", function() {
				d3.select(this).attr('class', 'dot')
			});

		dots.transition()
			.duration(0)
			.delay((d, i) => (xScale(d.date.toDate()) / width) * 4000)
			.attr("visibility", "hidden");

		dots.each(function(d, i) {
			$(this).popover({
				html: true,
				title: d.owner.name + ":" + d.date.format("MMMM YYYY"),
				content: Tools.getMoneyTable(d),
				trigger: "hover"  
			}) 
		})



	}
}
var lineGraph
$(document).ready(function() {

	lineGraph=new LineGraph()
	window.onresize=function(){
		//if(lineGraph.ready)
		//lineGraph.drawGraph(lineGraph.pf)
	}

})
