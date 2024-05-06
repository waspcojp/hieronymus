<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
		<span class="navbar-brand">請求書一覧</span>
		<ul class="navbar-nav me-auto mb-2">
			<li class="nav-item">
				<button type="button" class="btn btn-primary"
					on:click={openModal}
					id="invoice-info">請求書入力</button>
			</li>
		</ul>
	</div> 
</nav>
<div class="row body-height">
	<InvoiceList
		term={term}
		invoices={invoices}
		on:open={openModal}
		on:selectInvoiceType={selectInvoiceType}
		on:selectCustomerId={selectCustomer}
		on:selectAmount={selectAmount}
		></InvoiceList>
</div>
<InvoiceModal
	modal={modal}
	term={term}
	bind:init={init}
	bind:invoice={invoice}
	on:close={closeModal}>
</InvoiceModal>

<script>
import axios from 'axios';
import Modal from 'bootstrap/js/dist/modal';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import InvoiceModal from './invoice-modal.svelte';
import InvoiceList from './invoice-list.svelte';
import {numeric} from '../../javascripts/cross-slip';

export let term;
export let user;

let	invoice;
let	modal;
let init;
let invoices;
let dates;
let current_params = new Map();


const selectInvoiceType = (event) => {
	let	invoiceType = event.detail;
	console.log({invoiceType});
	updateInvoices({
		type: invoiceType
	});
}
const selectCustomer = (event) => {
	let	customerId = event.detail;
	console.log({customerId});
	updateInvoices({
		customer: customerId
	});
}
const selectAmount = (event) => {
	let amounts = event.detail;
	console.log({amounts});
	updateInvoices({
		upper: numeric(amounts.upperAmount),
		lower: numeric(amounts.lowerAmount)
	});
}

const updateInvoices = (_params) => {
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
	axios.get(`/api/invoice?${param}`).then((result) => {
		invoices = result.data;
		console.log('invoices', invoices);
	});
	if	( _params )	{
		window.history.pushState(
				current_params, "", `${location.pathname}?${param}`);
	}
};

const	openModal = (event)	=> {
	console.log('open', event.detail);
	invoice = event.detail;
	if ( !invoice.id )	{
		invoice = null;
	}
	init = true;
	console.log('invoice', invoice)
	modal.show();
};

const closeModal = (event) => {
	console.log('close', event.detail);
	updateInvoices();
}

onMount(() => {
	console.log('invoice onMount')
})

beforeUpdate(()	=> {
	console.log('invoice beforeUpdate');
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
				updateInvoices();
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
	if	( !invoices )	{
		invoices = [];
		updateInvoices();
	}
});
afterUpdate(() => {
	console.log('invoices afterUpdate');
	if	( !modal )	{
		modal = new Modal(document.getElementById('invoice-modal'));
	}
})
</script>
