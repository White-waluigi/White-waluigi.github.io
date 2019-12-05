class Investor{


	constructor(name,strategy){
		this.strategy=strategy
		this.name=name
		this.portfolio=new Portfolio(undefined,this)
		this.name=name
	}


	doInvestments(from, to){

		var dataset=[]
		var date=from

		while(date<to){
			this.portfolio.date=date	

			var savings=this.portfolio.collectPaycheck()
			//			this.portfolio.invest(market.getRandomStock(from),10000)
			this.strategy(this,from,10000)

			this.portfolio.collectDividends()

			dataset.push(this.portfolio.clone())
			var temp=date.clone()

			date=temp.add(12,"months")
		}
		return dataset

	}


	static getInvestors(){
		var x=[]


		x.push(new Investor("Constantin",function(investor,date,money){	
			investor.portfolio.invest(market.getStock("BANK",date),money)
		}))
		x.push(new Investor("Winston",function(investor,date,money){	
			console.log(investor.preferred)

			if(investor.preferred==undefined)
				investor.preferred=market.getRandomStock(date)
			investor.portfolio.invest(investor.preferred,money)
		}))

		x.push(new Investor("Ludwig",function(investor,date,money){	
			console.log(investor.preferred)

			if(investor.preferred==undefined||Math.random()<.1)
				investor.preferred=market.getRandomStock(date)
			investor.portfolio.invest(investor.preferred,money)
		}))
		x.push(new Investor("Gamble",function(investor,date,money){	
			investor.portfolio.invest(market.getRandomStock(date),money)
		}))
		return x

	}
}
