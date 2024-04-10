<<<<<<< HEAD
<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
		<a class="navbar-brand" href="#">残高試算表</a>
		<ul class="navbar-nav me-auto mb-2">
			<li class="nav-item">
			</li>
		</ul>
		<ul class="navbar-nav ms-auto">
			<li class="nav-item">
				<a href="/forms/trial_balance/{term}" download="残高試算表.xlsx">
					残高試算表
				</a>
			</li>
		</ul>
	</div>
</nav>
<div class="row body-height">
	<TrialBalanceList
		term={term}
		lines={lines}>
	</TrialBalanceList>
=======
<div class="d-flex justify-content-between mb-3 mt-3">
  <h1 class="fs-3">残高試算表</h1>
  <a href="/forms/trial_balance/{term}" download="残高試算表.xlsx" class="btn btn-primary">
    残高試算表.xlsx&nbsp;をダウンロード&nbsp; <i class="bi bi-download"></i>
  </a>
>>>>>>> main
</div>
<TrialBalanceList
  term={term}
  lines={lines}>
</TrialBalanceList>
<style>
</style>

<script>
import axios from 'axios';

import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import TrialBalanceList from './trial-balance-list.svelte';
import {numeric} from 'cross-slip';
import {dc} from 'parse_account_code';

let term;
let lines;

beforeUpdate(() => {
	term = location.pathname.split('/')[2];
	if	( !lines )	{
		lines = [];
		axios.get(`/api/trial-balance/${term}`).then((result) => {
			let data = result.data;
			console.log('trial-balance update', data);
			let trial_balance = data;
			let last_account = {};
			for ( let i = 0; i < trial_balance.length; i ++ ) {
				let account = trial_balance[i];
				let is_data = false;
				if	( !account.code ) continue;
				if	( account.code.length > 7 ) continue;
				let new_line = {
					name: account.name,
					pickup: numeric(account.pickup),
					debit: numeric(account.debit),
					credit: numeric(account.credit),
					code: account.code
				};
				console.log('new_line', new_line);
				if ( dc(account.code) == 'D' ) {
					new_line.balance = new_line.pickup + new_line.debit - new_line.credit;
				} else {
					new_line.balance = new_line.pickup - new_line.debit + new_line.credit;
				}

				if ( last_account.middle_name != account.middle_name ) {
					lines.push({
						name: `【${account.middle_name}】`
					});
				}
				if ( last_account.minor_name != account.minor_name ) {
					lines.push({
						name: account.minor_name
					});
				}
				if	(( new_line.pickup != 0 ) ||
					 ( new_line.debit  != 0 ) ||
					 ( new_line.credit != 0 ) ||
					 ( new_line.balance != 0 )) {
					lines.push(new_line);
				}
				last_account = account;	 
			}
			console.log('lines', lines);
			lines = lines;
		});
	}
})
</script>
