<div class="row full-height fontsize-12pt" style="overflow-y: scroll;">
	<table class="table table-bordered">
		<thead>
			<tr>
				<th scope="col" style="width:100px;">
					種別
				</th>
				<th scope="col" style="width: 200px;">
					相手先
				</th>
				<th scope="col" style="width: 100px;">
					発生日
				</th>
				<th scope="col" style="width: 100px;">
					支払日
				</th>
				<th scope="col" style="width: 100px;">
					金額
				</th>
				<th scope="col" style="width: 400px;">
					説明
				</th>
			</tr>
		</thead>
		<tbody>
			<tr style="height:25px;">
				<td>
					<select
							on:input={changeInvoiceStatus}
							bind:value={selectInvoiceStatus}>
						<option></option>
						<option value="11">見積</option>
						<option value="21">受注</option>
						<option value="31">請求</option>
						<option value="32">回収</option>
						<option value="99">その他</option>
					</select>
				</td>
				<td>
					<CustomerSelect
							bind:value={customerId}
							on:input={changeCustomer}>
					</CustomerSelect>
				</td>
				<td>

				</td>
				<td>

				</td>
				<td>
					<input type="text" class="number" placeholder="下限" size="12" maxlength="13"
							bind:value={lowerAmount}
							on:keypress={changeAmount} />
					<input type="text" class="number" placeholder="上限" size="12" maxlength="13"
							bind:value={upperAmount}
							on:keypress={changeAmount} />
				</td>
				<td>

				</td>
				<td>

				</td>
			</tr>
			{#each invoices as line}
			<tr>
				<td>
					<a href="#" data-no={line.id} on:click={openInvoice}>
						{invoiceStatus(line.status)}
					</a>
				</td>
				<td>
					{line.Customer.name}
				</td>
				<td>
					{#if (  line.issueDate &&
							( line.details.length > 0 ) &&
							compDate(line.issueDate,
								line.details[0].CrossSlip.year,
								line.details[0].CrossSlip.month,
								line.details[0].CrossSlip.day) ) }
					<a href="#" class="link-primary"
						data-year={line.details[0].CrossSlip.year}
						data-month={line.details[0].CrossSlip.month}
						data-no={line.details[0].CrossSlip.no}
						on:click={openSlip}>
						{formatDate(line.issueDate)}
					</a>
					{:else}
					<a href="#" class="link-danger"
						data-year={new Date(line.issueDate).getFullYear()}
						data-month={new Date(line.issueDate).getMonth()+1}
						data-day={new Date(line.issueDate).getDate()}
						data-id={line.id}
						on:click={openSlip}>
						{formatDate(line.issueDate)}
					</a>
					{/if}
				</td>
				<td>
					{#if (	line.paymentDate &&
							( line.details.length > 0 ) &&
							compDate(line.paymentDate,
							line.details[0].CrossSlip.year,
							line.details[0].CrossSlip.month,
							line.details[0].CrossSlip.day) ) }
					<a href="#"
						data-year={line.details[0].CrossSlip.year}
						data-month={line.details[0].CrossSlip.month}
						data-no={line.details[0].CrossSlip.no}
						on:click={openSlip}>
						{formatDate(line.paymentDate)}
					</a>
					{:else}
					{formatDate(line.paymentDate)}
					{/if}
				</td>
				<td class="number">
					{numeric(line.amount).toLocaleString()}
				</td>
				<td>
					{line.description || ''}
				</td>
			</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
th {
	text-align: center;
}
.file-item {
	width:40px;
	height:40px;
	padding:5px;
	float: left;
}
.rect-image {
	width:40px;
	clip:rect(0,40px,40px,0);
}
</style>

<script>
import axios from 'axios';
import CustomerSelect from '../components/customer-select.svelte';

import {numeric, formatDate} from '../../javascripts/cross-slip';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

export	let	term;
export	let	invoices;

let selectInvoiceStatus;
let customerId;
let upperAmount;
let lowerAmount;


const compDate = (date, year, month, day) => {
	let ymd = date.split('-');
	return	(	( parseInt(ymd[0]) == year )
		&&	( parseInt(ymd[1]) == month )
		&&	( parseInt(ymd[2]) == day ));
}

beforeUpdate(() => {
	console.log('invoice-list beforeUpdate', term);
});

const changeInvoiceStatus = (event) => {
	let value = event.currentTarget.value;
	console.log({value});
	dispatch('selectInvoiceStatus', value);
}
const changeCustomer = (event) => {
	let customerId = event.detail;
	console.log({customerId});
	dispatch('selectCustomerId', customerId);
}
const changeAmount = (event) => {
	if	( event.keyCode == 13 )	{
		dispatch('selectAmount', {
			lowerAmount: lowerAmount,
			upperAmount: upperAmount
		});
	}
}

const openSlip = (event) => {
    event.preventDefault();
	let year = event.target.dataset.year;
	let month = event.target.dataset.month;
	let day = event.target.dataset.day;
	let no = event.target.dataset.no;
	if	( no )	{
		axios.get(`/api/cross_slip/${year}/${month}/${no}`).then((result) => {
			let slip = result.data;
			console.log('slip', slip);
			dispatch('openSlip', slip);
		})
	} else {
		let slip = {
			year: parseInt(year),
			month: parseInt(month),
			day: parseInt(day),
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
		console.log('slip', slip);
		dispatch('openSlip', slip);
	}
}
const openInvoice = (event) => {
    event.preventDefault();
	let id = event.target.dataset.no;
	let	invoice;

	console.log('openInvoice', id);
	console.log('invoices', invoices);

	for ( let i = 0; i < invoices.length; i ++ ) {
		if ( invoices[i].id == id ) {
			invoice = invoices[i];
			break;
		}
	}
	dispatch('open', invoice);
}
</script>
