class Portfolio{
	constructor(old,owner){
		if(old===undefined){
			this.cash=0
			this.stocks=[]
			this.owner=owner
		}else{
			this.date=old.date
			this.cash=old.cash
			this.stocks={...old.stocks}
			this.owner=old.owner
		}
	}

	invest(stock,money){
		if (typeof this.stocks[stock.id] === 'undefined') 
			this.stocks[stock.id]={stock:stock , amount:0}


		var old=this.stocks[stock.id]
		if(this.stocks[stock.id].stock!==stock)
			alert("wrong stock")
		if(this.cash<money)
			throw "overdraw"

		var amnt=money/stock.getPrice(this.date);
		var neww={stock:old.stock,amount:old.amount+amnt}
		this.stocks[stock.id]=neww
		this.cash-=money
		//this.stocks[stock]+=amount/stock.getPrice(date)

	}

	collectPaycheck(){
		var d=market.getStock("INFLATION")
		this.cash+=d.getPrice(this.date)*10000
		return 10000
	}
	collectDividends(){
		for(let x in this.stocks){
			x=this.stocks[x]
			var ca =x.stock.getDividend(this.date)*x.amount
			this.cash+=ca
			this.invest(x.stock,ca)
		}
	}
	getValue(){
		var val=this.cash
		for(const id in this.stocks){
			var holding=this.stocks[id]
			val+=holding.stock.getPrice(this.date)*holding.amount
//			console.log(holding.stock.id)
//			console.log(holding.stock.getPrice(this.date))
//			console.log(holding.amount)
//			console.log(this.date.format())
		}
			
		return val
	}
	clone(){
		return new Portfolio(this)
	}

}
