<<<<<<< HEAD
<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
		<span class="navbar-brand">銀行勘定帳</span>
		<ul class="navbar-nav me-auto mb-2">
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" href="#"
					rolw="button" data-bs-toggle="dropdown" aria-expanded="false">
					{#if this_account}
					{BANK_ACCOUNTS.find((el) => el[0] == this_account)[1]}
					{:else}
					科目
					{/if}
				</a>
				<ul class="dropdown-menu" aria-labelledby="field">
					{#each BANK_ACCOUNTS as account}
					<li>
						<a class="dropdown-item"
							on:click={openAccount}
							href="#"
							data-account={account[0]}>{account[1]}</a>
					</li>
					{/each}
				</ul>
			</li>
		{#if bank_list }
		{#each bank_list.SubAccounts as bank}
			<li class="nav-item">
				{#if ( sub_account == bank.id )}
				<a class="btn btn-outline-info"
					on:click={openBank}
					href="#"
					data-account={this_account}
					data-id={bank.id}>
					{bank.name}
				</a>
				{:else}
				<a class="btn btn-info"
					on:click={openBank}
					href="#"
					data-account={this_account}
					data-id={bank.id}>
					{bank.name}
				</a>
				{/if}
			</li>
		{/each}
		{/if}
		</ul>
	</div> 
</nav>
<div class="row body-height">
	<div class="row full-height" style="overflow-y: scroll;">
	<table class="table table-bordered">
		<thead>
			<tr>
				<th scope="col" colspan="2">
					日付 / 伝番
				</th>
				<th scope="col" style="width: 150px;">
					相手勘定科目<br/>相手補助科目
				</th>
				<th scope="col" style="width: 300px;">
					適用<br/>補助科目
				</th>
				<th scope="col" style="width: 100px;">
					支払金額
				</th>
				<th scope="col" style="width: 100px;">
					預り金額
				</th>
				<th scope="col" style="width: 100px;">
					残高
				</th>
			</tr>
		</thead>
		<tbody>
		{#each lines as line}
			<tr>
				<td style="width:50px;text-align:center;">
					{line.month} / {line.day}
				</td>
				<td style="width:50px;" class={'number ' + ( line.approvedAt ? 'bg-body' : 'bg-warning' )}>
					<a href="#" data-no={line.no} data-year={line.year} data-month={line.month}
							on:click={openSlip}>
						{line.no}
					</a>
				</td>
				<td>
					{line.otherAccount}<br/>
					{line.otherSubAccount}
				</td>
				<td>
					<div class="appication">
						{line.application1 ? line.application1 : ''}
					</div>
					<div class="appication">
						{line.application2 ? line.application2 : ''}
					</div>
				</td>
				<td class="number">
					{#if line.showCredit }
					{line.pureCreditAmount ? line.pureCreditAmount.toLocaleString(): ''}
					{/if}
				</td>
				<td class="number">
					{#if line.showDebit }
					{line.pureDebitAmount ? line.pureDebitAmount.toLocaleString(): ''}
					{/if}
				</td>
				<td class="number">
					{line.pureBalance.toLocaleString()}
				</td>
			</tr>
		{/each}
		</tbody>
	</table>
=======
<div class="d-flex justify-content-between mb-3 mt-3">
  <h1 class="fs-3">銀行勘定帳</h1>
>>>>>>> main
</div>
<div>
  <ul class="navbar-nav me-auto mb-2">
    <li class="nav-item dropdown">
      <a class="btn btn-outline-primary dropdown-toggle" href="#"
        rolw="button" data-bs-toggle="dropdown" aria-expanded="false">
        {#if this_account}
        {BANK_ACCOUNTS.find((el) => el[0] == this_account)[1]}
        {:else}
        科目
        {/if}
      </a>
      <ul class="dropdown-menu" aria-labelledby="field">
        {#each BANK_ACCOUNTS as account}
        <li>
          <a class="dropdown-item"
            on:click={openAccount}
            href="#"
            data-account={account[0]}>{account[1]}</a>
        </li>
        {/each}
      </ul>
    </li>
  </ul>
</div>
{#if bank_list }
  <div class="mb-2">
    <ul class="nav">
    {#each bank_list.SubAccounts as bank}
      <li class="nav-item pe-2">
        {#if ( sub_account == bank.id )}
        <a class="btn btn-primary disabled"
          on:click={openBank}
          href="#"
          data-account={this_account}
          data-id={bank.id}>
          {bank.name}
        </a>
        {:else}
        <a class="btn btn-outline-primary"
          on:click={openBank}
          href="#"
          data-account={this_account}
          data-id={bank.id}>
          {bank.name}
        </a>
        {/if}
      </li>
    {/each}
    </ul>
  </div>
{/if}
<table class="table table-bordered">
  <thead class="table-light">
    <tr>
      <th scope="col" colspan="2">
        日付 / 伝番
      </th>
      <th scope="col" style="width: 150px;">
        相手勘定科目<br/>相手補助科目
      </th>
      <th scope="col" style="width: 300px;">
        適用<br/>補助科目
      </th>
      <th scope="col" style="width: 100px;">
        支払金額
      </th>
      <th scope="col" style="width: 100px;">
        預り金額
      </th>
      <th scope="col" style="width: 100px;">
        残高
      </th>
    </tr>
  </thead>
  <tbody>
  {#each lines as line}
    <tr>
      <td style="width:50px;text-align:center;">
        {line.month} / {line.day}
      </td>
      <td class="number" style="width:50px;">
        <a href="#" data-no={line.no} data-year={line.year} data-month={line.month}
            on:click={openSlip}>
          {line.no}
        </a>
      </td>
      <td>
        {line.otherAccount}<br/>
        {line.otherSubAccount}
      </td>
      <td>
        <div class="appication">
          {line.application1 ? line.application1 : ''}
        </div>
        <div class="appication">
          {line.application2 ? line.application2 : ''}
        </div>
      </td>
      <td class="number">
        {#if line.showCredit }
        {line.pureCreditAmount ? line.pureCreditAmount.toLocaleString(): ''}
        {/if}
      </td>
      <td class="number">
        {#if line.showDebit }
        {line.pureDebitAmount ? line.pureDebitAmount.toLocaleString(): ''}
        {/if}
      </td>
      <td class="number">
        {line.pureBalance.toLocaleString()}
      </td>
    </tr>
  {/each}
  </tbody>
</table>
<CrossSlipModal
	slip={slip}
	bind:modal={modal}
	term={term}
	user={user}
	accounts={accounts}
	bind:init={init}
	on:close={updateList}></CrossSlipModal>

<style>
.fontsize-12pt {
	font-size: 12pt;
}
.application {
	padding: 0;
}
th {
	text-align: center;
}
</style>

<script>
import axios from 'axios';
import Modal from 'bootstrap/js/dist/modal';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import {ledger_lines} from '../../../libs/ledger';
import {set_accounts} from '../../javascripts/cross-slip';
import CrossSlipModal from '../cross-slip/cross-slip-modal.svelte';

export let term;
export let user;

let	bank_list;
let	this_account;
let	sub_account;
let	slip;
let	lines;
let	modal;
let	accounts;
let init;

const BANK_ACCOUNTS = [
	[ '1010000',	'当座預金' ],
	[ '1010010',	'普通預金' ],
	[ '1010020',	'定期預金' ],
	[ '1010030',	'定期積立' ]
];
const openAccount = (event) => {
    event.preventDefault();
	let dataset = event.currentTarget.dataset;
	console.log('openBank');
	this_account = dataset.account;
	updateAccount(true);
}
const openBank = (event) => {
    event.preventDefault();
	let dataset = event.currentTarget.dataset;
	console.log('openAccount');
	this_account = dataset.account;
	sub_account = dataset.id;
	updateList(true);
}
onMount(() => {
	console.log('onMount');
});
beforeUpdate(()	=> {
	let args = location.pathname.split('/');
	if	( !term )	{
		term = parseInt(args[2]);
		this_account = args[3];
		sub_account = args[4];
		
		window.onpopstate = (event) => {
			if	( window.history.state )	{
				let	state = window.history.state;
				term = state.term;
				this_account = state.account;
				sub_account = state.sub_account;
				lines = undefined;
				bank_list = undefined;
			}
		}
	}
	if	( !accounts )	{
		axios.get('/api/accounts').then((result) => {
			accounts = result.data;
			set_accounts(accounts);
		});
	}
	if	( !bank_list )	{
		updateAccount();
	}
	if	( !lines)	{
		lines = [];
		updateList();
	}
	if	( !slip )	{
		slip = {
			year: 0,
			month: 0,
			lines: []
		}
	}
});

const updateAccount = (forward) => {
	if	( this_account )	{
		axios.get(`/api/account/${this_account}`).then((result) => {
			bank_list = result.data;
		});
		if	( forward )	{
				window.history.pushState({
						term: term,
						account: this_account
					}, "", `/bank-ledget/${term}/${this_account}`);
		}
	}
}

const updateList = (forward) => {
	if	( sub_account )	{
		axios.get(`/api/remaining/${term}/${this_account}/${sub_account}`).then((result) => {
			let remaining = result.data;
			console.log('remaining', remaining);

			axios.get(`/api/ledger/${term}/${this_account}/${sub_account}`).then((result) => {
				let details = result.data;
				let ret = ledger_lines(this_account, sub_account,
												remaining, details);
				lines = ret.lines;
				console.log('lines', lines);
			});
			if	( forward )	{
				window.history.pushState({
						term: term,
						account: this_account,
						sub_account: sub_account
					}, "", `/bank-ledger/${term}/${this_account}/${sub_account}`);
			}
		});
	}

}

let openModal = false;
afterUpdate(() => {
	if	( !modal )	{
		modal = new Modal(document.getElementById('cross-slip-modal'));
		console.log('modal new')
	}
	if	( openModal )	{
		console.log('accounts', accounts);
		modal.show();
		openModal = false;
	}
});

const	openSlip = (event) => {
	event.preventDefault();
	let dataset = event.target.dataset;
	console.log('openSlip', dataset);
	axios.get(`/api/cross_slip/${dataset.year}/${dataset.month}/${dataset.no}`).then((result) => {
		let data = result.data;
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
