<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
		<a class="navbar-brand" href="#">科目管理</a>
		<ul class="navbar-nav me-auto mb-2">
			<li class="nav-item">
			</li>
		</ul>
	</div>
</nav>
<div class="row body-height">
	<AccountsList
		term={term}
		lines={lines}
		accounts={accounts}
		on:open={openAccount}>
	</AccountsList>
</div>
<AccountModal
	account={account}
	sub_account={sub_account}
	mode={mode}
	term={term}
	modal={modal}
	on:close={update}>
</AccountModal>

<style>
</style>

<script>
import axios from 'axios';
import Modal from 'bootstrap/js/dist/modal';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import AccountsList from './accounts-list.svelte';
import AccountModal from './account-modal.svelte';
import {set_accounts, find_account, find_sub_account_by_code, element_index, numeric} from 'cross-slip';

let	term;
let fy;
let dates;
let accounts;
let	lines;
let modal;
let	mode;
let	account = {};
let	sub_account = {};

const ready = () => {
	lines = [];
	let last_account = {};
	for ( let i = 0; i < accounts.length; i ++ ) {
		let account = accounts[i];
		let new_line = {
			acl_id: account.acl_id,
			acl_code: account.acl_code
		};
		if ( last_account.major_name != account.major_name ) {
			new_line.major_name = account.major_name;
		} else {
			new_line.major_name = '';
		}
		if ( last_account.middle_name != account.middle_name ) {
			new_line.middle_name = account.middle_name;
		} else {
			new_line.middle_name = '';
		}
		if ( last_account.minor_name != account.minor_name ) {
			new_line.minor_name = account.minor_name;
		} else {
			new_line.minor_name = '';
		}
		if		(( new_line.major_name != '') ||
				 ( new_line.middle_name != '' ) ||
				 ( new_line.minor_name != '' )) {
			lines.push(new_line);
		}
		if	( account.name && ( account.name != '' ) )	{
			lines.push({
				major_name: '',
				middle_name: '',
				minor_name: '',
				account_name: account.name,
				sub_account_name: '',
				tax_class: 0,
				key: account.key ? account.key : '',
				debit: account.debit ? numeric(account.debit) : 0,
				credit: account.credit ? numeric(account.credit) : 0,
				remaining: account.balance ? numeric(account.balance) : 0,
				sub_code: -1,
				code: account.code
			});
			if ( account.subAccounts && account.subAccounts.length > 0 ) {
				for ( let j = 0; j < account.subAccounts.length; j ++) {
					let sub = account.subAccounts[j];
					lines.push({
						major_name: '',
						middle_name: '',
						minor_name: '',
						account_name: '',
						sub_account_name: sub.name,
						tax_class: sub.taxClass,
						key: sub.key,
						debit: sub.debit ? numeric(sub.debit) : 0,
						credit: sub.credit ? numeric(sub.credit) : 0,
						remaining: sub.balance ? numeric(sub.balance) : 0,
						sub_code: sub.code,
						code: account.code
					});
				}
			}
		}
		last_account = account;	 
	}
}


const	update = () => {
	axios.get(`/api/accounts/${term}`).then((result) => {
		accounts = result.data;
		console.log('accounts', accounts);
		set_accounts(accounts);
		ready();
	});
}
beforeUpdate(() => {
	term = location.pathname.split('/')[2];

	if	( !lines )	{
		lines = [];
		dates = [];
		axios.get(`/api/term/${term}`).then((result) => {
			fy = result.data;
		}).then(() => {
			update();
		});
	}
});

let openModal = false;
afterUpdate(() => {
	if	( !modal )	{
		modal = new Modal(document.getElementById('account-modal'));
	}
	if	( openModal )	{
		modal.show();
		openModal = false;
	}
});
const	openAccount = (event) => {
	let	args = event.detail;
	console.log({args});
	mode = args.mode;
	account = args.account;
	sub_account = args.sub_account;
	openModal = true;
}
</script>
