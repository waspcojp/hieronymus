export const field = (code) => {
	let code_len = code.length;
	return code.substring(code_len - 8, code_len - 6);
};

export const dc = (code) => {
	let f = field(code);
	let ret;

	if	( code == '7020010')	{	//	期末商品棚卸高
		ret = 'C';
	} else
	if (( f == '1' ) ||
		( f == '2' ) ||
		( f == '7' ) ||
		( f == '9' ) ||
		( f == '10' )) {
		ret = 'D';
	} else {
		ret = 'C';
	}
	return ret;
}

export const make_klass = (fld, add) => {
	let adding = '000' + add.toString();
	let len = adding.length;
	return	(`${fld}${(adding.substring(len-2, len) )}`);
}

export const numeric = (s) => {
	let ret;
	let sign;

	ret = 0;
	if ( s ) {
		if	( s == '' )	{
			ret = 0;
		} else
		if ( typeof s === 'number' ) {
			ret = s;
		} else
		if	( typeof s === 'object' )	{
			ret = s.toNumber();
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

export const seq = (code) => {
	let code_len = code.length;
	return code.substring(code_len - 3, code_len);
}
export const klass = (code) => {
	let code_len = code.length;
	return code.substring(code_len - 8, code_len - 4);
}
export const adding = (code) => {
	let code_len = code.length;
	return code.substring(code_len - 5, code_len - 4);
}
export default {
	field: field,
	adding: adding,
	klass: klass,
	seq: seq,
	make_klass: make_klass,
	dc: dc,
	numeric: numeric,
}

