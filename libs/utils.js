import {format as DateFormat, parse as DateParse} from '@formkit/tempo';

export const wareki = (date) => {
	const dateTimeFormat = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {year: 'numeric'});
	return dateTimeFormat.format(new Date(date));
}

export const DateString = (d) => {
	return	DateFormat(d, 'YYYY-MM-DD');
}

export const StringDate = (s) => {
	return	DateParse(s, 'YYYY-MM-DD');
}
	