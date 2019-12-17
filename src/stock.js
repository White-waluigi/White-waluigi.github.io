class Stock{
	constructor(id,text,start,end, values,dividends){
		this.id=id;
		this.text=text;
		this.values=values.map(function(x){return {date : moment(x.Date) , price : x.Close}})
		this.dividends=dividends.map(function(x){return {date:moment(x.Date),dividend:4*x.Dividend}})

		if(values.length<2)
			throw "not enough stock prices"

		this.start=this.values[0].date
		this.end=this.values[this.values.length-1].date
	}
	getPrice(date){
		var lastEntry
		for(let x of this.values){
			if(x.date>date)
				break
			lastEntry=x
		}
		if(lastEntry==undefined)
		{
			throw "stock not priced yet"
		}
		return lastEntry.price
	}
	getDividend(date){

		var lastEntry
		for(let x of this.dividends){
			if(x.date>date)
				break
			lastEntry=x
		}
		if(lastEntry==undefined)
		{
			//stock not dividended yet"
			return 0
		}
		return lastEntry.dividend

	}
}
