<input type="hidden" id="id" bind:value={invoice.id}>
<div class="container-fluid">
	<div class="row mb-3">
		<div class="col-3">
			<div class="row">
				<label for="type" class="col-4 col-form-label">状態</label>
				<div class="col-8">
					<select class="form-select" id="type" bind:value={invoice.status}>
						<option value="-1">未設定</option>
						<option value="11">見積</option>
						<option value="21">受注</option>
						<option value="31">請求</option>
						<option value="32">回収</option>
						<option value="99">その他</option>
					</select>
				</div>
			</div>
		</div>
		<div class="col-4">
			<div class="row">
				<label for="issueDate" class="col-4 col-form-label">発生日</label>
				<div class="col-sm-8">
					<input type="date" class="form-control" id="issueDate" bind:value={invoice.issueDate}>
				</div>
			</div>
		</div>
		<div class="col-1">
			<button type="button" class="btn btn-sm btn-light"
				on:click={copy_down}>
				<i class="fas fa-angle-right"></i>
			</button>
		</div>
		<div class="col-4">
			<div class="row">
				<label for="paymentDate" class="col-4 col-form-label">支払日</label>
				<div class="col-sm-8">
					<input type="date" class="form-control" id="paymentDate" bind:value={invoice.paymentDate}>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-8">
			<div class="row">
				<label for="customerName" class="col-2 col-form-label">相手先</label>
				<div class="col-sm-10">
					<div class="row">
						<input type="text" autocomplete="off" class="form-control" bind:value={customerKey}
							id="customerName"
							on:change={changeKey}
							on:keyup={changeKey}
							on:focusout={leaveKey}
							on:focusin={enterKey}>
					</div>
					{#if ( customers && customers.length > 0) }
					<div class="row">
						<select id="customerId" bind:value={invoice.customerId}>
							{#each customers as customer}
							<option value={customer.id}>
								{customer.name}
							</option>
							{/each}
						</select>
					</div>
					{/if}
				</div>
			</div>
		</div>
		<div class="col-4">
			<div class="row">
				<label for="zip" class="col-6 col-form-label">郵便番号</label>
				<div class="col-6">
					<input type="text" autocomplete="off" class="form-control" bind:value={customerZip}
					id="zip">
				</div>
			</div>
		</div>
	</div>
	<div class="row mb-3">
		<label for="amount" class="col-2 col-form-label">金額</label>
		<div class="col-sm-4">
			<input type="text" class="form-control number" id="amount"
				on:focusout={focusout}
				on:focusin={focusin}
				bind:value={invoice.amount}>
		</div>
	</div>
	<div class="row mb-3">
		<label for="taxClass" class="col-2 col-form-label">消費税</label>
		<div class="col-sm-2">
			<select class="form-control" id="taxClass"
				bind:value={invoice.taxClass}>
				<option value="-1">未選択</option>
				<option value="0">非課税</option>
				<option value="1">内税</option>
				<option value="2">外税</option>
				<option value="9">別計算</option>
			</select>
		</div>
		<div class="col-sm-2">
			<input type="text" class="form-control number" id="tax" bind:value={invoice.tax}>
		</div>
	</div>
	<div class="row mb-3">
		<label for="description" class="col-2 col-form-label">備考</label>
		<div class="col-sm-10">
			<textarea class="form-control" id="description"
				bind:value={invoice.description} />
		</div>
	</div>
</div>

<style>
.file-item {
	width:90px;
	height:120px;
	border:1px #8CC solid;
	margin:10px;
	padding: 0 10px 10px 10px;
}
.rect-image {
	width:70px;
	position:absolute;
	clip:rect(0,70px,70px,0);
}
</style>

<script>
import {numeric} from '../../javascripts/cross-slip';
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

export	let	invoice;
export	let	init;

let	original_customers;
let	customers;
let	field_value;
let customerKey;
let customerZip;

beforeUpdate(() => {
	console.log('invoice-info beforeUpdate',invoice, init);
	if	( init )	{
		if	( invoice.id )	{
			customerKey = invoice.Customer.name;
			invoice.amount = numeric(invoice.amount).toLocaleString();
			invoice.tax = numeric(invoice.tax).toLocaleString();
		} else {
			customerKey = '';
		}
		init = false;
	}
	computeTax();
});

const copy_up = (event) => {
	invoice.issueDate = invoice.paymentDate;
}
const copy_down = (event) => {
	invoice.paymentDate = invoice.issueDate;
}

const computeTax = (event) => {
	console.log('computeTax');
	switch	(parseInt(invoice.taxClass))	{
	  case	0:
		invoice.tax = 0;
		break;
	  case	1:
		invoice.tax = (Math.round(numeric(invoice.amount) / 110 * 10)).toLocaleString();
		break;
	  case	2:
		invoice.tax = (Math.round(numeric(invoice.amount) * 0.1)).toLocaleString();
		break;
	}
}
const focusout = (event) => {
	console.log('focusout');
	invoice.amount = numeric(invoice.amount).toLocaleString();
	computeTax();
}
const focusin = (event) => {
	console.log('focusin');
	invoice.amount = numeric(invoice.amount);
}

onMount(() => {
	console.log('invoice-info onMount');
	axios.get(`/api/customer/`).then((result) => {
		original_customers = result.data;
		console.log('customer update', original_customers);
	});
});

const enterKey = (event) =>	{
	field_value = event.target.value;
}
const leaveKey = (event) =>	{
		
}
const changeKey = (event) =>{
	let target = event.target;
	if	( target.value != field_value )	{
		let key = target.value;
		customers = [];
		for	( let i = 0; i < original_customers.length; i ++ )	{
			if	((( original_customers[i].key ) &&
					 ( original_customers[i].key.match(key))) ||
					 ( original_customers[i].name.match(key) ))	{
				customers.push(original_customers[i]);
			}
		}
		let select = document.getElementById('customerId');
		if	( select )	{
			select.addEventListener('focusout', customerSelect);
		}
	}
}
const	customerSelect = (event)	=> {
	console.log('taget', event.target);
	for	( let i = 0; i < customers.length; i ++ )	{
		if	( customers[i].id == event.target.value)	{
			invoice.customerId = customers[i].id;
			customerKey = customers[i].name;
			customerZip = customers[i].zip;
			break;
		}
	}
	customers = [];
}
</script>
