class Tools{
	//
	static getMoneyTable(d){
		var values=Object.values(d.stocks)
			.map(
				p => [
					p.stock.text,
					(p.amount*p.stock.getPrice(d.date)),
					(p.gain),
					(p.invested)
					]
			)
		//values.unshift(["cash",Tools.getAbb(d.cash)])
		
		var totalGains=Object.values(d.stocks).reduce((a,b) => b.gain+a,0)
		var totalInvest=Object.values(d.stocks).reduce((a,b) => b.invested+a,0)
		values.push(["<b>total</b>",
					(d.getValue()),
					(totalGains),
					(totalInvest),1])

		var str="<table>"
		str+= values.reduce(
			(a,p) => a+" <tr><td>"+p[0]+"</td>"+
			"<td align=\"right\">"+Tools.getAbb(p[1],p.length==5)+"$</td>"+
			"<td align=\"right\" style='color:"+(p[2]<0?"red":"green")+"'>"+Tools.getAbb(p[2],p.length==5)+"$</td>"+
			"<td align=\"right\">"+Tools.getAbb(p[3],p.length==5)+"$</td>"
			,""
		)
		str+="</table>"
		return $(str);
	}
	static getAbb(val,bold){
		var value=Math.abs(val,bold)
		value=Math.floor(value)
		var newValue = value;
		if (value >= 1000) {
			var suffixes = ["", "K", "M", "B","T"];
			var suffixNum = Math.floor( (""+value).length/3 );
			var shortValue = '';
			for (var precision = 2; precision >= 1; precision--) {
				shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
				var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
				if (dotLessShortValue.length <= 2) { break; }
			}
			if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
			newValue = shortValue+suffixes[suffixNum];
		}
		bold=bold==true
		var before=bold?"<b>":""
		var after=bold?"</b>":""

		return before+(val<0?"-":"")+newValue+after;
	}

}
