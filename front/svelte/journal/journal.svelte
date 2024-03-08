<div class="d-flex justify-content-between mb-3 mt-3">
  <h1 class="fs-3">仕訳日記帳</h1>
  <a href="/forms/explanatory_journal/{term}" download="仕訳日記帳.xlsx" class="btn btn-primary">
    仕訳日記帳.xlsx&nbsp;をダウンロード&nbsp;<i class="bi bi-download"></i>
  </a>
</div>
<ul class="nav mb-2">
  {#each dates as date}
    <li class="nav-item">
      {#if (date.month == month)}
      <a class="btn btn-primary disabled me-2"
          on:click={openMonth}
          data-year={date.year}
          data-month={date.month}
          href="#">
        {date.month}月
      </a>
      {:else}
      <a class="btn btn-outline-primary me-2"
          on:click={openMonth}
          data-year={date.year}
          data-month={date.month}
          href="#">
        {date.month}月
      </a>
      {/if}
    </li>
  {/each}
</ul>
<div class="d-flex justify-content-between mb-2">
  <div class="fs-4">{year}年 {month}月</div>
  <div>
    <button type="button" class="btn btn-primary" id="open-cross-slip"
    on:click={openSlip}>伝票入力&nbsp;<i class="bi bi-pencil-square"></i></button>
  </div>
</div>
<JournalList
  year={year}
  month={month}
  accounts={accounts}
  slips={slips}
  lines={lines}
  sums={sums}
  on:open={openSlip}></JournalList>

<CrossSlipModal
	slip={slip}
	bind:modal={modal}
	term={term}
	accounts={accounts}
	bind:init={init}
	on:close={close_}></CrossSlipModal>
<style>
</style>

	<script>
import axios from 'axios';
import Modal from 'bootstrap/js/dist/modal';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import JournalList from './journal-list.svelte';
import CrossSlipModal from '../cross-slip/cross-slip-modal.svelte';
import {set_accounts, find_account, find_sub_account_by_code, numeric} from '../../javascripts/cross-slip';

let year;
let month;
let term;
let fy;
let slip;
let dates;
let modal;
let accounts;
let	sums;
let	lines = [];
let slips;
let init;

const openMonth = (event) => {
    event.preventDefault();
	let	dataset = event.currentTarget.dataset;
	year = dataset.year;
	month = dataset.month;
	updateList(true);
}

const close_ = (event) => {
	updateList();
}

const updateList = (forward) => {
	console.log('updateList');
	axios.get(`/api/journal/${year}/${month}`).then((result) => {
		slips = result.data;
		ready(slips);
	});
	if	( forward )	{
		console.log('push', year, month);
		window.history.pushState({
						year: year,
						month: month
					}, "", `/journal/${year}/${month}`);
	}
}

const ready = (slips) => {
	let _lines = [];
	let _sums = {
		debitAmount: 0,
		debitTax: 0,
		creditAmount: 0,
		creditTax: 0
	}
	for ( let i = 0; i < slips.length; i ++ ) {
		let slip = slips[i];
		for ( let j = 0; j < slip.lines.length; j ++ ) {
			let line = slip.lines[j];

			_sums.debitAmount += line.debitAmount != null ? numeric(line.debitAmount) : 0;
			_sums.debitTax += line.debitTax != null ? numeric(line.debitTax) : 0
			_sums.creditAmount += line.creditAmount != null ? numeric(line.creditAmount) : 0;
			_sums.creditTax += line.creditTax != null ? numeric(line.creditTax) : 0;

			_lines.push({
				id: line.id,
				month: slip.month,
				day: slip.day,
				no: slip.no,
				lineNo: line.lineNo,

				debitAmount: line.debitAmount != null ? numeric(line.debitAmount).toLocaleString() : '',
				debitTax: line.debitTax != null ? numeric(line.debitTax).toLocaleString() : '',
				creditAmount: line.creditAmount != null ? numeric(line.creditAmount).toLocaleString() : '',
				creditTax: line.creditTax != null ? numeric(line.creditTax).toLocaleString() : '',
					 
				debitAccount: find_account(line.debitAccount).name,
				debitSubAccount: find_sub_account_by_code(line.debitAccount, line.debitSubAccount).name,

				creditAccount: find_account(line.creditAccount).name,
				creditSubAccount: find_sub_account_by_code(line.creditAccount, line.creditSubAccount).name,

				debitVoucher: line.debitVoucher,
				debitVoucherId: line.debitVoucherId,
				creditVoucher: line.creditVoucher,
				creditVoucherId: line.creditVoucherId,

				application1: line.application1 || '',
				application2: line.application2 || ''
			});
		}
	}
	lines = _lines;
	sums = _sums;
	//console.log('lines', lines);
}

beforeUpdate(() => {
	console.log('journal beforeUpdate');
	let args = location.pathname.split('/');
	year = args[2];
	month = args[3];
	if	( !dates )	{
		dates = [];
		axios.get(`/api/term/${year}/${month}`).then((result) => {
			fy = result.data;
			term = fy.term;
			for ( let mon = new Date(fy.startDate); mon < new Date(fy.endDate); ) {
				dates.push({
					year: mon.getFullYear(),
					month: mon.getMonth()+1
				});
				mon.setMonth(mon.getMonth() + 1);
			}
			dates = dates;
		});
		console.log('dates', dates);
		window.onpopstate = (event) => {
			if	( window.history.state )	{
				let	state = window.history.state;
				year = state.year;
				month = state.month;
			} else {
				let arg = location.pathname.split('/');
				year = arg[2];
				month = arg[3];
			}
			console.log('date', year, month);
			updateList();
		}
	}
	if	( !accounts )	{
		accounts = [];
		axios.get(`/api/accounts`).then((res) => {
			accounts = res.data;
			set_accounts(accounts);
		}).then(() => {
			axios.get(`/api/journal/${year}/${month}`).then((result) => {
				slips = result.data;
				ready(slips);
			});
		});
	}
	if	( !slip )	{
		slip = {
			year: year,
			month: month,
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

const openSlip = (event) => {
	slip = event.detail;
	if	( !slip.no )	{
		slip = {
			year: parseInt(year),
			month: parseInt(month),
			lines: [{
				debitAccount: "",
				debitSubAccount: 0,
				debitAmount: "",
				debitTax: "",
				creditAccount: "",
				creditSubAccount: 0,
				creditAmount: "",
				creditTax: "",
			}]
		};
	}
	console.log('openSlip !!', slip);
	openModal = true;
	init = true;
	slip = slip;
}
</script>
