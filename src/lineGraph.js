class LineGraph{

	constructor(){
		market=new Market(this)
	}
	start(){

		var portfolios=[]
		Investor.getInvestors().forEach(function(d){
			portfolios.push(d.doInvestments(moment("1975-01-01"),moment("2020-01-02")))
		})

		this.drawGraph(portfolios)

	}
	drawAxis(pf){

		// 2. Use the margin convention practice 
		var margin = {top: 40, right: 40, bottom: 40, left: 40}
			, width =	1100 
			, height =	500 ;

		//same for every graph, 45 years of work
		var n = pf[0].length;

		//Highest income achieved
		var max=pf.reduce(function(a,p){
			return Math.max(p.reduce(function(b,q){
				return Math.max(q.getValue(),b)
			},0),a)
		},0)

		// 5. X scale will use the index of our data
		var xScale = d3.scaleLinear()
			.domain([new Date("1975-01-01"),new Date("2020-01-01")])
			.range([60, width]); // output

		// 6. Y scale will use the randomly generate number 
		var yScale = d3.scaleLinear()
			.domain([0,max])
			.range([height, 0]); // output 

		// 7. d3's line generator

		// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
		//var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })
		// 1. Add the SVG to the page and employ #2
		var svg = d3.select("#my_dataviz").append("svg")
			.attr("id","mainGraph")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")


		var xAxis = d3.axisBottom(xScale)
			.tickFormat(d3.timeFormat("%Y"))
		// 3. Call the x axis in a group tag
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)

		// 4. Call the y axis in a group tag
		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(60,0)")
			.call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

		var svg = d3.select("#mainGraph")
		var line = d3.line()
			.x(function(d, i) {return xScale(d.date.toDate()); }) // set the x values for the line generator
			.y(function(d) { return yScale(d.getValue()); }) // set the y values for the line generator 

		var c=["red","green","blue","black"]
		for(let x of pf){
			svg.append("path")
				.datum(x) // 10. Binds data to the line 
				.attr("class", "line") // Assign a class for styling 
				.attr("d", line) // 11. Calls the line generator 
				.attr("stroke",c.pop())

		}
		var x=pf.flat(1);
		// 12. Appends a circle for each datapoint 
		svg.selectAll(".dot")
			.data(x)
			.enter().append("circle") // Uses the enter().append() method
			.attr("class", "dot") // Assign a class for styling
			.attr("cx", function(d,i) { return xScale(d.date.toDate()) })
			.attr("cy", function(d) {return yScale(d.getValue()) })
			.attr("data-booked","true")
			.attr("r", 6)
			.on("mouseover", function(a, b, c) { 
				d3.select(this).attr('class', 'focus')
			})
			.on("mouseout", function() {
				d3.select(this).attr('class', 'dot')
			}).each(function(d,i){
				$(this).popover({ 
					html: true,
					title: d.owner.name+":"+d.date.format("MMMM YYYY"), 
					content: Tools.getMoneyTable(d),
					trigger:"hover"
				})
			})
	}
	drawGraph(pf){
		this.drawAxis(pf)
	}
}
var lineGraph
$(document).ready(function() {
	lineGraph=new LineGraph()
})
