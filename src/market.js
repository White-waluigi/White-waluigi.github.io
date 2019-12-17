var market

class Market{

	constructor(){
		this.loadStocks()
	}

	getRandomStock(date){
		var stock=null
		while(stock==null || stock.start>date || stock.id=="BANK")
		{
			var keys = Object.keys(this.stocks)
			stock= this.stocks[keys[ keys.length * Math.random() << 0]];
		}
		return stock
	}

	getStock(id,date){
		var retval= this.stocks[id];

		if(retval.start>date)
			alert("stock not yet available")

		return retval
	}
	loadStocks(){
		d3.csv("stocks/index.csv").then(function(data) {

			var promises = [];
			data.forEach(function(d){


				promises.push(
					new Promise((resolve,reject)=>{
						var combo=[]

						combo.push(d3.csv("stocks/"+d.ID+".csv"));
						combo.push(d3.csv("stocks/"+d.ID+"_DIV.csv"));

						return Promise.all(combo).then(results=>{
							resolve( {meta : d, result : results.shift(),dividend : results.shift()} )
						})
					})
				)

			})
			return Promise.all(promises).then(results => {
				var lookup = results.reduce((prev, curr) => {
					
					prev[curr.meta.ID] = new Stock(curr.meta.ID,curr.meta.text,curr.meta.start,curr.meta.end,curr.result,curr.dividend);

					return prev;
				}, {});
				market.stocks=lookup
				lineGraph.start()
			})
		})
	}
}
