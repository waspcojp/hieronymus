const field = (code) => {
	let code_len = code.length;
	return code.substring(code_len - 8, code_len - 6);
};

module.exports = {
	field: field,
	adding: (code) => {
		let code_len = code.length;
		return code.substring(code_len - 5, code_len - 4);
	},
	klass: (code) => {
		let code_len = code.length;
		return code.substring(code_len - 8, code_len - 4);
	},
	seq: (code) => {
		let code_len = code.length;
		return code.substring(code_len - 3, code_len);
	},
	make_klass: (fld, add) => {
		let adding = '000' + add.toString();
		let len = adding.length;
		return	(`${fld}${(adding.substring(len-2, len) )}`);
	},
	dc: (code) => {
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
	},
	numeric: (s) => {
		let ret;
		let sign;
	
		ret = 0;
		if ( s ) {
			if	( s == '' )	{
				ret = 0;
			} else
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
	},
}
