const IncomeStatementPage = require('./income_statement_page');
const TrialBalancePage = require('./trial_balance_page');
const {Book} = require('./book');
const TrialBalance = require('../libs/trial_balance');
const SGA = require('./selling_general_and_administrative_expenses_page');

const	aggregate = (lines, code) => {
	let sums = {
		pickup: 0,
		debit: 0,
		credit: 0,
		balance: 0
	}
	for ( line of lines )  {
		if      ( ( ( line.debit != 0 ) ||
					( line.credit != 0 ) ||
					( line.balance != 0 ) ) &&
				  ( line.code.match(code) ) )    {
			sums.pickup += line.pickup;
			sums.debit += line.debit;
			sums.credit += line.credit;
			sums.balance += line.balance;
		}
	}
	return  (sums);

}
const	account_line = (lines, name) => {
	let line;
	for ( let i = 0; i < lines.length; i ++ )  {
		if  ( lines[i].name == name)   {
			line = lines[i];
			break;
		}
	}
	return  (line);
}

const	net_income = (lines) => {
	let sum = [];
	sum[0] = aggregate(lines, /^6/);		//	[ "経常損益", "売上高" ]
	sum[1] = aggregate(lines, /^8/);		//	[ "経常損益", "営業外収益" ]
	sum[2] = aggregate(lines, /^901/);		//	[ "経常損益",	"営業外費用", "特別利益" ]

	sum[3] = aggregate(lines, /^7/);		//	[ "経常損益", "売上原価"]
	sum[4] = aggregate(lines, /^900/);		//	[ "経常損益", "営業外費用", "支払利息"]
	sum[5] = aggregate(lines, /^902/);		//	[ "経常損益", "営業外費用", "特別損失"]
	sum[6] = account_line(lines, '法人税住民税等');

	let line = account_line(lines, '繰越利益剰余金');
	line.credit = ( sum[0].balance + sum[1].balance + sum[2].balance ) -
				  ( sum[3].balance + sum[4].balance + sum[5].balance + sum[6].balance );
	console.log(line);
	line.balance = line.pickup - line.debit + line.credit;
}

module.exports = async (term) => {
	let book = new Book(term);
	let {lines, accounts} = await TrialBalance(term);
	net_income(lines);

	let income_statement_page = new IncomeStatementPage(book, lines, accounts);
	income_statement_page.run();
	let trial_balance_page = new TrialBalancePage(book, lines, accounts);
	trial_balance_page.run();
	let SGA_page = new SGA(book, lines, accounts);
	SGA_page.run();
	return  book.book.xlsx.writeBuffer();
}
