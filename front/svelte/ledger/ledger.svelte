<div class="d-flex justify-content-between mb-3 mt-3">
  <h1 class="fs-3">元帳</h1>
  <a href="/forms/general_ledger/{term}" download="総勘定元帳.xlsx" class="btn btn-primary">
    総勘定元帳.xlsx&nbsp;をダウンロード&nbsp;<i class="bi bi-download"></i>
  </a>
</div>
<AccountSelect
	bind:accounts={accounts}
	href={`/ledger/${term}`}/>
<nav class="navbar navbar-expand-lg">
  {#if (account)}
  <a class="navbar-brand fs-4" href="/ledger/{term}/{account.accountCode}">
    { account ? account.name : ''}
  </a>
  {/if}
</nav>
{#if (account && (account.subAccounts.length > 0))}
<div class="d-flex justify-content-between mb-2">
  <div>
	<SubAccountSelect
		account={account}
		sub_account_code={sub_account_code}
		href={`/ledger/${term}`} />
  	</div>
  	<div>
		{#if sub_account_code}
    	<a href="/changes/{term}/{account_code}/{sub_account_code}" class="btn btn-info">
			推移表を見る
		</a>
		{:else}
    	<a href="/changes/{term}/{account_code}" class="btn btn-info">
			推移表を見る
		</a>
		{/if}
    	<a href="/forms/subsidiary_ledger/{term}" download="補助元帳.xlsx" class="btn btn-primary">
      		補助元帳.xlsx&nbsp;をダウンロード&nbsp;<i class="bi bi-download"></i>
    	</a>
  	</div>
</div>
{/if}
<LedgerList
  account={account}
  pickup={pickup}
  sums={sums}
  lines={lines}
  term={term}
  on:open={openSlip}></LedgerList>

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
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';

import LedgerList from './ledger-list.svelte';
import CrossSlipModal from '../cross-slip/cross-slip-modal.svelte';
import {ledger_lines} from '../../../libs/ledger';
import AccountSelect from '../components/account-select.svelte';
import SubAccountSelect from '../components/subaccount-select.svelte';

export let term;
export let user;

let accounts;
let account_code;
let account;
let sub_account_code;
let details;
let remaining;
let modal;
let slip = {
		year: 0,
		month: 0,
		lines: []
	};
let pickup;
let sums;
let lines;
let init;

onMount(() => {
	console.log('ledger onMount');
	let args = location.pathname.split('/');
	term = args[2];
	account_code = args[3];
	sub_account_code = args[4] ? parseInt(args[4]) : undefined;
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
})

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