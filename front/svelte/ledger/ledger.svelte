<div class="d-flex justify-content-between mb-3 mt-3">
  <h1 class="fs-3">元帳</h1>
  <a href="/forms/general_ledger/{term}" download="総勘定元帳.xlsx" class="btn btn-primary">
    総勘定元帳.xlsx&nbsp;をダウンロード&nbsp;<i class="bi bi-download"></i>
  </a>
</div>
<ul class="nav">
  {#each fields as field, index}
  <li class="nav-item dropdown pe-2">
    <a class="btn btn-outline-primary dropdown-toggle" href="#" id="field_{index}" rolw="button" data-bs-toggle="dropdown" aria-expanded="false">
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
<nav class="navbar navbar-expand-lg">
  {#if (account)}
  <a class="navbar-brand fs-4" href="/ledger/{term}/{account.accountCode}">
    { account ? account.name : ''}
  </a>
  {/if}
</nav>
{#if (account && (account.SubAccounts.length > 0))}
<div class="d-flex justify-content-between mb-2">
  <div>
    <ul class="nav">
      {#each account.SubAccounts as sub}
        <li class="nav-item pe-2">
          <a class="btn {sub.subAccountCode == sub_account_code ? ' btn-primary disabled' : 'btn-outline-primary'}"
              href="/ledger/{term}/{account.accountCode}/{sub.subAccountCode}">
            {sub.name}
          </a>
        </li>
      {/each}
  </ul>
  </div>
  <div>
    <a href="/forms/subsidiary_ledger/{term}" download="補助元帳.xlsx" class="btn btn-primary">
      補助元帳.xlsx&nbsp;をダウンロード&nbsp;<i class="bi bi-download"></i>
    </a>
  </div>
</div>
{/if}
<LedgerList
  modal={modal}
  account={account}
  pickup={pickup}
  sums={sums}
  lines={lines}
  accounts={accounts}
  term={term}
  on:open={openSlip}></LedgerList>

<CrossSlipModal
	slip={slip}
	modal={modal}
	term={term}
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


let term;
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
		slip = {
				year: data.year,
				month: data.month,
				day: data.day,
				no: data.no,
				lines: data.lines
		};
		openModal = true;
		init = true;
		console.log('slip', slip);
	});
}
</script>