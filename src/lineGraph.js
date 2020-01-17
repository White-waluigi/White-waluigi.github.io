class LineGraph{


	constructor(){
		market=new Market(this)
		this.ready=false
		this.graph=null
	}

	start(){

		var portfolios=[]
		Investor.getInvestors().forEach(function(d){
			portfolios.push(d.doInvestments(moment("1975-01-01"),moment("2020-01-02")))
		})


		this.pf=portfolios
		this.drawGraph()

		this.ready=true;
	}

	drawGraph(){
		this.graph={}


		$("#my_dataviz").empty()

		this.drawAxis()
		this.setUpBrush()
		this.drawLines()

		this.drawEvents()
		this.drawButtons()

	}

	drawAxis(){


		this.graph.margin = {top: 40, right: 40, bottom: 40, left: 40}
		this.graph.width =	$("#my_dataviz").width()-80
		this.graph.height =	$("#my_dataviz").height()-80

		this.graph.gGraph=d3.select("#my_dataviz").append("svg")
			.attr("width", $("#my_dataviz").width())
			.attr("height", $("#my_dataviz").height())

		var max=d3.max(this.pf,(d)=>d3.max(d,(dd)=>dd.getValue()))

		this.graph.axis={}

		this.graph.axis.xScale = d3.scaleTime()
			.domain([new Date("1975-01-01"),new Date("2020-01-01")])
			.range([60, this.graph.width]); // output


		this.graph.axis.yScale = d3.scaleLinear()
			.domain([0,max])
			.range([this.graph.height, 40]) // output 


		this.graph.axis.gxAxis=this.graph.gGraph.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + this.graph.height + ")")
			.call(d3.axisBottom(this.graph.axis.xScale))

		// 4. Call the y axis in a group tag
		this.graph.axis.gyAxis=this.graph.gGraph.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(60,0)")
			.call(d3.axisLeft(this.graph.axis.yScale).tickFormat(Tools.getAbb)); // Create an axis component with d3.axisLeft

		this.graph.inner=this.graph.gGraph.append("g")
			.style("width", "100%" )
			.style("height", "100%")
			.style("padding","50px")

		//		var clip = this.graph.gGraph.append("defs").append("svg:clipPath")
		//			.attr("id", "clip")
		//			.append("svg:rect")
		//			.style("width", "100%" )
		//			.style("height", "100%" )

	}


	drawLines(){
		this.graph.lines={}
		this.occ=[]

		var thi=this
		this.graph.lines.lineMaker = d3.line()
			.x(function(d, i) {return thi.graph.axis.xScale(d.date.toDate()); }) // set the x values for the line generator
			.y(function(d) { return thi.graph.axis.yScale(d.getValue()); }) // set the y values for the line generator 

		this.graph.lines.lines=[]
		this.graph.lines.dots=[]
		for(let x of this.pf){
			this.graph.lines.lines.push(this.drawLine(x))
		}

		for(let x of this.pf){
			this.graph.lines.dots.push(this.drawDot(x))
		}
		this.graph.inner.selectAll(".dot").each(function(d, i) {
			$(this).popover({
				html: true,
				title: d.owner.name + ":" + d.date.format("MMMM YYYY"),
				content: Tools.getMoneyTable(d),
				trigger: "hover"  
			}) 
		})
	}
	drawLine(x){
		return	this.graph.inner.append("path")
			.datum(x) // 10. Binds data to the line 
			.attr("class", "line") // Assign a class for styling 
			.attr("stroke",a=>a[0].owner.color)
			.attr("d",this.graph.lines.lineMaker)
	}
	drawDot(x){
		var thi=this
		return this.graph.inner.selectAll(".dot."+x[0].owner.name)
			.data(x)
			.enter()
			.append("circle") // Uses the enter().append() method
			.style("fill",a=>a.owner.color)
			.attr("class", "dot") // Assign a class for styling
			.attr("cx", function(d, i) {
				return thi.graph.axis.xScale(d.date.toDate())
			})
			.attr("cy", function(d) {
				var x=thi.graph.axis.yScale(d.getValue())

				if(thi.occ[d.date.toDate()]==undefined)
					thi.occ[d.date.toDate()]=[]

				var ctv=1
				while(thi.occ[d.date.toDate()].some(a=>Math.abs(a-x)<6) ){
					x-=1;
				}

				thi.occ[d.date.toDate()].push(x);
				if(x==NaN)
					console.log(x)
				return x; 
			})
			.attr("data-booked", "true")
			.attr("r", 6)
			.on("mouseover", function(a, b, c) {
				d3.select(this).attr('class', 'focus')
			})
			.on("mouseout", function() {
				d3.select(this).attr('class', 'dot')
			});
	}



	setUpBrush() {

		// A function that set idleTimeOut to null
		var idleTimeout
		function idled() { idleTimeout = null; }

		var inode=this.graph
		// Add brushing
		var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
			.extent( [ [60,0], [inode.width,inode.height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
			.on("end", zoom)               // Each time the brush selection changes, trigger the 'updateChart' function

		// Add the brushing
		this.graph.inner
			.append("g")
			.attr("class", "brush")
			.call(brush);

		var thi=this
		function zoom(extent,pthi){
			if(extent==undefined)
				extent = d3.event.selection


			if(!extent){
				if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
			}else{
				var from=thi.graph.axis.xScale.invert(extent[0])
				var to=thi.graph.axis.xScale.invert(extent[1])
				thi.graph.axis.xScale.domain([ from, to ])
				thi.graph.inner.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
				var max=d3.max(thi.pf,(d)=>d3.max(d.filter((dd)=>(dd.date<to&&dd.date>from))  ,(dd)=>dd.getValue()))
				thi.graph.axis.yScale.domain([0,max])
				thi.graph.axis.xAxis = d3.axisBottom(thi.graph.axis.xScale)
				var line = d3.line()
					.x(function(d, i) {return thi.graph.axis.xScale(d.date.toDate()); }) // set the x values for the line generator
					.y(function(d) { return thi.graph.axis.yScale(d.getValue()); }) // set the y values for the line generator 

				for(let x of thi.graph.lines.lines){
					x
						.transition()
						.duration(1000)
						.attr("d",line)
				}
				for(let x of thi.graph.lines.dots){
					x
						.transition()
						.duration(1000)
						.attr("cx", function(d, i) {
							return thi.graph.axis.xScale(d.date.toDate())
						})
						.attr("cy", function(d) {
							var x=thi.graph.axis.yScale(d.getValue())

							return x; 
						})
				}



				thi.graph.axis.gxAxis
					.transition()
					.duration(1000)
					.call(d3.axisBottom(thi.graph.axis.xScale))

				thi.graph.axis.gyAxis
					.transition()
					.duration(1000)
					.call(d3.axisLeft(thi.graph.axis.yScale).tickFormat(Tools.getAbb)); // Create an axis component with d3.axisLeft
			}


		}
		this.zoom=zoom
	}
	drawEvents(){
		var wevents=[
			{
				name:"Fall of Soviet Union",
				date:new Date("1991-12-25")
			},
			{
				name:"Financial Crisis",
				date:new Date("2008-09-15")
			},
			{
				name:"Recession",
				date:new Date("1981-07-01")
			}]

		//		this.graph.inner.selectAll(".events")
		//			.data(wevents)
		//			.enter()
		//			.append("line") // Uses the enter().append() method
		//			.style("stroke","red")
		//			.attr("x1",(d)=>this.graph.axis.xScale(d.date))
		//			.attr("x2",(d)=>this.graph.axis.xScale(d.date))
		//			.attr("y2",0)
		//			.attr("y1",this.graph.height+30)


	}
	drawButtons(){
		var thi=this
		var buttons=[
			{
				label:"I",
				func:function()
				{
					$("#modal").modal("show")
				}

			},
			{
				label:"H",
				visi:true,
				func:function()
				{
					var v="visible"
					if(this.visi){
						v="hidden"

					}
					for(let x of thi.graph.lines.dots){
						x.style("visibility",v)
					}

					this.visi=!this.visi
				}

			},
			{
				label:"S",
				func:function()
				{
					lineGraph.start()
				}

			},
			{
				label:"R",
				func:function()
				{
					var s=thi.graph.axis.xScale
					
					var extent=[s(new Date("1975-01-01")),s(new Date("2020-01-01"))]
					thi.zoom(extent)
				}

			}
		]
		var divs=this.graph.inner.selectAll(".buttons")
			.data(buttons)
			.enter()
			.append("g")
			.attr("transform",(d,i)=>"translate("+(80*i+100)+",60)")


		divs.append("circle")
			.style("fill","blue")
			.attr("class","dot")
			.attr("r",26)
			.on("click",(d)=>d.func())

		divs.append("text")
			.text((d)=>d.label)
			.attr("y",10)
			.attr("text-anchor","middle")
			.attr("fill","white")
			.attr("font-size","30")
			.on("click",(d)=>d.func())



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
