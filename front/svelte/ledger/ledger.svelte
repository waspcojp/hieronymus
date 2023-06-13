<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
		<a class="navbar-brand" href="#">元帳</a>
		<ul class="navbar-nav me-auto mb-2">
			{#each fields as field, index}
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" href="#" id="field_{index}" rolw="button" data-bs-toggle="dropdown" aria-expanded="false">
					{field.title}
				</a>
				<ul class="dropdown-menu" aria-labelledby="field_{index}">
					{#each field.accounts as account}
					<li>
						<a class="dropdown-item" href="/ledger/{term}/{account.code}">{account.name}</a>
					</li>
					{/each}
				</ul>
			</li>
			{/each}
		</ul>
		<ul class="navbar-nav ms-auto">
			<li class="nav-item">
				<a href="/forms/general_ledger/{term}" download="総勘定元帳.xlsx">
					総勘定元帳
				</a>
			</li>
		</ul>
	</div>
</nav>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
		{#if (account)}
		<a class="navbar-brand" href="/ledger/{term}/{account.accountCode}">
			{ account ? account.name : ''}
		</a>
		{/if}
		{#if (account && (account.SubAccounts.length > 0))}
		<ul class="navbar-nav me-auto">
			{#each account.SubAccounts as sub}
			<li class="nav-item">
				<a class="nav-link{sub.SubAccountCode == sub_account_code ? ' active' : ''}"
						href="/ledger/{term}/{account.accountCode}/{sub.subAccountCode}">
					{sub.name}
				</a>
			</li>
			{/each}
		</ul>
		<ul class="navbar-nav ms-auto">
			<li class="nav-item">
				<a href="/forms/subsidiary_ledger/{term}" download="補助元帳.xlsx">
					補助元帳
				</a>
			</li>
		</ul>
		{/if}
	</div>
</nav>
<div class="row body-height">
	<LedgerList
		modal={modal}
		account={account}
		pickup={pickup}
		sums={sums}
		lines={lines}
		accounts={accounts}
		term={term}
		on:open={openSlip}></LedgerList>
</div>
<CrossSlipModal
	slip={slip}
	bind:modal={modal}
	term={term}
	user={user}
	accounts={accounts}
	bind:init={init}
	on:close={updateList}></CrossSlipModal>

<style>
</style>

<script>

import axios from 'axios';
import Modal from 'bootstrap/js/dist/modal';
import {set_accounts, find_account} from '../../javascripts/cross-slip';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import parse_account_code from 'parse_account_code';

import LedgerList from './ledger-list.svelte';
import CrossSlipModal from '../cross-slip/cross-slip-modal.svelte';
import {ledger_lines} from '../../../libs/ledger';

export let term;
export let user;

let accounts;
let account_code;
let account;
let sub_account_code;
let fields;
let details;
let remaining;
let modal;
let slip;
let pickup;
let sums;
let lines;
let init;

beforeUpdate(() => {
	console.log('ledger beforeUpdate');
	let args = location.pathname.split('/');
	term = args[2];
	account_code = args[3];
	sub_account_code = args[4];

	if	( !accounts )	{
		accounts = [];
		fields = [];
		axios.get(`/api/accounts`).then((res) => {
			accounts = res.data;
			set_accounts(accounts);
		}).then(() => {
			fields = [
				{
					title: '資産',
					accounts: []
				},{
					title: '負債',
					accounts: []
				},{
					title: '純資産',
					accounts: []
				},{
					title: '売上高',
					accounts: []
				},{
					title: '売上原価',
					accounts: []
				},{
					title: '営業外',
					accounts: []
				}];
			for ( let i = 0; i < accounts.length; i ++ ) {
				let account = accounts[i];
				switch (parse_account_code.field(account.code)) {
				  case '1':
				  case '2':
					fields[0].accounts.push(account);
					break;
				  case '3':
				  case '4':
					fields[1].accounts.push(account);
					break;
				  case '5':
					fields[2].accounts.push(account);
					break;
				  case '6':
					fields[3].accounts.push(account);
					break;
				  case '7':
					fields[4].accounts.push(account);
					break;
				  default:
					fields[5].accounts.push(account);
					break;
				}
			}
		});
	}
	if	( !account )	{
		axios.get(`/api/account/${account_code}`).then((result) => {
			account = result.data;
			console.log('account', account);
			remaining = [];
			let pr;
			if ( sub_account_code > 0 ) {
				pr = axios.get(`/api/remaining/${term}/${account_code}/${sub_account_code}`);
			} else {
				pr = axios.get(`/api/remaining/${term}/${account_code}`);
			}
			pr.then((result) => {
				remaining = result.data;
				console.log('remaining', remaining);
				details = [];
				updateList();
			});
		});
	}
	if	( !slip )	{
		slip = {
			year: 0,
			month: 0,
			lines: []
		}
	}
});

let openModal = false;
afterUpdate(() => {
	if	( !modal )	{
		modal = new Modal(document.getElementById('cross-slip-modal'));
		console.log('modal new')
	}
	if	( openModal )	{
		modal.show();
		openModal = false;
	}
});

const updateList = () => {
	console.log('updateList', term, account_code, sub_account_code);
	let pr;
	if ( sub_account_code > 0 ) {
		console.log('with sub_account');
		pr = axios.get(`/api/ledger/${term}/${account_code}/${sub_account_code}`);
	} else {
		pr = axios.get(`/api/ledger/${term}/${account_code}`);
	}
	pr.then((result) => {
		details = result.data;
		console.log('details', details);
		let ret = ledger_lines(account_code, sub_account_code,
				remaining, details);
		console.log('ret', ret);
		lines = ret.lines;
		sums = ret.sums;
		pickup = ret.pickup;
	});
}
const openSlip = (event) => {
	let dataset = event.detail;
	axios.get(`/api/cross_slip/${dataset.year}/${dataset.month}/${dataset.no}`).then((result) => {
		let data = result.data;
		console.log('slip', data);
		slip = {
				year: data.year,
				month: data.month,
				day: data.day,
				no: data.no,
				createdBy: data.createdBy,
				approvedAt: data.approvedAt ? new Date(data.approvedAt): null,
				createrName: data.creater ? data.creater.name: '',
				approverName: data.approver ? data.approver.name : '',
				lines: data.lines
		};
		openModal = true;
		init = true;
		console.log('slip', slip);
	});
}
</script>