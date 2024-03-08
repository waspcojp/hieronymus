<div class="d-flex justify-content-between mb-3 mt-3">
  <h1 class="fs-3">証票一覧</h1>
  <button type="button" class="btn btn-primary"
    on:click={openModal}
    id="voucher-info">証票入力&nbsp;<i class="bi bi-pencil-square"></i></button>
</div>
<ul class="nav me-auto mb-2">
  {#each dates as date}
    <li class="nav-item">
      {#if (date.ym == current_month)}
      <button type="button" class="btn btn-primary disabled me-2"
        on:click={openMonth}
        data-month="{date.year}-{date.month}">
        {date.month}&nbsp;月
      </button>
      {:else}
      <button type="button" class="btn btn-outline-primary me-2"
        on:click={openMonth}
        data-month="{date.year}-{date.month}">
        {date.month}&nbsp;月
      </button>
      {/if}
    </li>
  {/each}
  <li class="nav-item">
    {#if ( !current_month  )}
    <button type="button" class="btn btn-primary disabled me-2"
      data-month=""
      on:click={openMonth}>
      ALL
    </button>
    {:else}
    <button type="button" class="btn btn-outline-primary me-2"
      data-month=""
      on:click={openMonth}>
      ALL
    </button>
    {/if}
  </li>
</ul>
<VoucherList
  term={term}
  vouchers={vouchers}
  on:open={openModal}
  on:openSlip={openSlip}
  on:selectVoucherType={selectVoucherType}
  on:selectCustomerId={selectCustomer}
  on:selectAmount={selectAmount}
  ></VoucherList>
<VoucherModal
	modal={modal}
	term={term}
	bind:init={init}
	bind:voucher={voucher}
	on:close={closeModal}>
</VoucherModal>

<CrossSlipModal
	slip={slip}
	bind:modal={slipModal}
	term={term}
	bind:init={init}
	accounts={accounts}
	on:close={updateVouchers}></CrossSlipModal>

<style>
</style>

<script>
import axios from 'axios';
import Modal from 'bootstrap/js/dist/modal';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import VoucherModal from './voucher-modal.svelte';
import VoucherList from './voucher-list.svelte';
import CrossSlipModal from '../cross-slip/cross-slip-modal.svelte';
import {numeric} from '../../javascripts/cross-slip';

let	voucher;
let	term;
let	modal;
let slipModal;
let init;
let vouchers;
let accounts;
let slip;
let dates;
let current_month;
let current_params = new Map();


const selectVoucherType = (event) => {
	let	voucherType = event.detail;
	console.log({voucherType});
	updateVouchers({
		type: voucherType
	});
}
const selectCustomer = (event) => {
	let	customerId = event.detail;
	console.log({customerId});
	updateVouchers({
		customer: customerId
	});
}
const selectAmount = (event) => {
	let amounts = event.detail;
	console.log({amounts});
	updateVouchers({
		upper: numeric(amounts.upperAmount),
		lower: numeric(amounts.lowerAmount)
	});
}

const updateVouchers = (_params) => {
	if	( _params )	{
		Object.keys(_params).map((key) => {
			if	( !_params[key] )	{
				current_params.delete(key);
			} else {
				current_params.set(key,_params[key]);
			}
		});
	}
	console.log('current_params', current_params);
	let _array = [];
	current_params.forEach((value, key) => {
		console.log('key, value', key, value);
		_array.push(encodeURI(`${key}=${value}`));
	});
	let param = _array.join('&');
	console.log('param', param);
	axios.get(`/api/voucher?${param}`).then((result) => {
		vouchers = result.data;
		console.log('vouchers', vouchers);
	});
	if	( _params )	{
		window.history.pushState(
				current_params, "", `${location.pathname}?${param}`);
	}
};

const openMonth = (event) => {
    event.preventDefault();
	let month = event.currentTarget.dataset.month;
	gotoMonth(month);
}
const gotoMonth = (month) => {
	console.log('month', month);
	updateVouchers({
		month: month
	});
	current_month = month;
}

const	openSlip = (event)	=> {
	console.log('openSlip', event.detail);
	slip = event.detail;
	init = true;
	console.log('slip', slip)
	slipModal.show();
};

const	openModal = (event)	=> {
	console.log('open', event.detail);
	voucher = event.detail;
	if ( !voucher.id )	{
		voucher = null;
	}
	init = true;
	console.log('voucher', voucher)
	modal.show();
};

const closeModal = (event) => {
	console.log('close', event.detail);
	updateVouchers();
}

onMount(() => {
	console.log('voucher onMount')
})

beforeUpdate(()	=> {
	console.log('voucher beforeUpdate');
	let args = location.pathname.split('/');
	let _params = location.search.substr(1);
	console.log('_params', _params);
	let params = [];
	if  ( _params )	{
		_params.split('&').map((item) => {
			let kv = item.split('=');
			params[decodeURI(kv[0])] = decodeURI(kv[1]);
		});
		console.log({params});
	}
	term = parseInt(args[2]);
	console.log('term', term);
	if	( !dates )	{
		window.onpopstate = (event) => {
			if	( window.history.state )	{
				current_params = window.history.state;
				console.log({current_params});
				current_month = current_params.get('month');
				updateVouchers();
			}
		}
		dates = [];
		axios.get(`/api/term/${term}`).then((result) => {
			let fy = result.data;
			term = fy.term;
			for ( let mon = new Date(fy.startDate); mon < new Date(fy.endDate); ) {
				dates.push({
					year: mon.getFullYear(),
					month: mon.getMonth()+1,
					ym: `${mon.getFullYear()}-${mon.getMonth()+1}`
				});
				mon.setMonth(mon.getMonth() + 1);
			}
			dates = dates;
		});
		console.log('dates', dates);
	}
	if	( !vouchers )	{
		vouchers = [];
		gotoMonth(params['month']);
	}
	if	( !accounts )	{
		axios.get(`/api/accounts`).then((res) => {
			accounts = res.data;
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
afterUpdate(() => {
	console.log('voucher afterUpdate');
	if	( !modal )	{
		modal = new Modal(document.getElementById('voucher-modal'));
	}
	if	( !slipModal )	{
		slipModal = new Modal(document.getElementById('cross-slip-modal'));
	}
})
</script>
