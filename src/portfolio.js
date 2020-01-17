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

	invest(stock,money,dividend){
		if (typeof this.stocks[stock.id] === 'undefined') 
			this.stocks[stock.id]={stock:stock , amount:0,old:0 ,gain:0}


		var old=this.stocks[stock.id]
		if(this.stocks[stock.id].stock!==stock)
			alert("wrong stock")
		if(this.cash<money)
			throw "overdraw"

		var amnt=money/stock.getPrice(this.date);
		var neww={stock:old.stock,amount:old.amount+amnt,invested:0,old:old.old,gain:old.gain}
		if(!dividend)
			neww.invested=money
		//neww.oldval=neww.amount*stock.getPrice(this.date)
		

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


		for(let xx in this.stocks){
			

			var x=this.stocks[xx]

			var ca =x.stock.getDividend(this.date)*x.amount
			this.cash+=ca

			
			this.invest(x.stock,ca,true)

			var val=x.amount*x.stock.getPrice(this.date)
			this.stocks[xx].gain=val-x.old
			this.stocks[xx].old=val
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
