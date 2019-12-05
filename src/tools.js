class Tools{
	static getMoneyTable(d){
		var values=Object.values(d.stocks)
			.map(
				p => [p.stock.id,Math.floor(p.amount*p.stock.getPrice(d.date))]
			)
		values.unshift(["cash",Math.floor(d.cash)])
		values.push(["total",Math.floor(d.getValue())])

		var str="<table>"
		str+= values.reduce(
			(a,p) => a+" <tr><td>"+p[0]+"</td><td align=\"right\">"+p[1]+"$</td></tr>"
			,""
		)
		str+="</table>gay"
		return $(str);
	}
}
