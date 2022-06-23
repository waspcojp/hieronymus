const wareki = (date) => {
	if	( date < new Date('1912-07-30') )	{
		return	['大正', date.getFullYear() - 1867];
	} else
	if	( date < new Date('1926-12-26') )	{
		return	['大正', date.getFullYear() - 1911];
	} else
	if	( date < new Date('1989-01-08') )	{
		return	['昭和', date.getFullYear() - 1925];
	} else
	if	( date < new Date('2019-04-01') )	{
		return	['平成', date.getFullYear() - 1988];
	} else {
		return	['令和', date.getFullYear() - 2018];
	}
}

module.exports = {
    wareki: wareki
}