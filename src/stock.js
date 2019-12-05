class Stock{
	constructor(id,text,start,end, values){
		this.id=id;
		this.text=text;
		this.values=values.map(function(x){return {date : moment(x.Date) , price : x.Close}})

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
	getDividend(){
		return 0;	
	}
}
