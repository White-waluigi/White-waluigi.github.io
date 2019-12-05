#!/bin/bash
for fn in `cat index`; do
    echo "https://query1.finance.yahoo.com/v7/finance/download/$fn?period1=0&period2=1575068400&interval=1mo&events=history&crumb=O9eR8L5tr6U"
	echo "https://query1.finance.yahoo.com/v7/finance/download/$fn?period1=0&period2=1575068400&interval=1mo&events=div&crumb=O9eR8L5tr6U"
done
#ihttps://query1.finance.yahoo.com/v7/finance/download/JP?period1=1512255600&period2=1575327600&interval=1d&events=history&crumb=O9eR8L5tr6U

#wget "https://query1.finance.yahoo.com/v7/finance/download/JPM?period1=344386800&period2=1575068400&interval=1mo&events=history&crumb=Z2lFs33hJYn"
