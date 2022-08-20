const wareki = (date) => {
	const dateTimeFormat = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {year: 'numeric'});
	return dateTimeFormat.format(new Date(date));
}

module.exports = {
    wareki: wareki
}