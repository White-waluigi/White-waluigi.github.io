class Investor{
	constructor(c,name,strategy){
		this.strategy=strategy
		this.name=name
		this.portfolio=new Portfolio(undefined,this)
		this.name=name
		this.color=c;
	}


	doInvestments(from, to){

		var dataset=[]
		var date=from

		while(date<to){
			this.portfolio.date=date	

			var savings=this.portfolio.collectPaycheck()
			//			this.portfolio.invest(market.getRandomStock(from),10000)
			this.portfolio.collectDividends()
			this.strategy(this,from,this.portfolio.cash)

			dataset.push(this.portfolio.clone())
			var temp=date.clone()

			date=temp.add(12,"months")
		}
		return dataset

	}


	static getInvestors(){
		var x=[]


		x.push(new Investor("black","Constantin",function(investor,date,money){	
			investor.portfolio.invest(market.getStock("BANK",date),money)
		}))
		x.push(new Investor("red","Winston",function(investor,date,money){	

			if(investor.preferred==undefined)
				investor.preferred=market.getRandomStock(date)
			investor.portfolio.invest(investor.preferred,money)
		}))

		x.push(new Investor("blue","Ludwig",function(investor,date,money){	

			if(investor.preferred==undefined||Math.random()<.1)
				investor.preferred=market.getRandomStock(date)
			investor.portfolio.invest(investor.preferred,money)
		}))
		x.push(new Investor("green","Gamble",function(investor,date,money){	
			investor.portfolio.invest(market.getRandomStock(date),money)
		}))
		return x

	}
}
