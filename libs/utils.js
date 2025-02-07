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

export const age = (s) => {
  let today = new Date();
  let birthDate = parseInt(s.replaceAll('-', ''));
  let today10000 = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return (Math.floor((today10000 - birthDate) / 10000));
}

export const numeric = (s) => {
  let ret;
  let sign;
  
  if ( s ) {
    if ( typeof s == 'number' ) {
    ret = s;
    } else {
    if ( s.length > 0 ) {
      if ( s[0] == '-' ) {
      sign = -1;
      } else {
      sign = 1;
      }
      let ss = s.replace(/[\D,\s]/g,'');
      if ( ss.length > 0 ) {
      ret = parseInt(ss) * sign;
      } else {
      ret = 0;
      }
    } else {
    ret = 0;
    }
    }
  } else {
    ret = 0;
  }
  return ret;
}

export const formatDate = (_date) => {
  let date;
  if ( _date )	{
    date = new Date(_date);
    return	`${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
  } else {
    return	('');
  }
}

export const BANK_ACCOUNT_TYPE = [
  [ 0, '未設定'],
  [ 1, '普通'],
  [ 2, '当座'],
  [ 9, 'その他']
]

export const TAX_CLASS = [
  [ '未選択', -1],
  [ '非課税', 0],
  [ '内税',   1],
  [ '外税',   2],
  [ '別計算', 9]
];
