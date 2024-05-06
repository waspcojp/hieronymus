<div class="modal" id="invoice-modal" tabindex="-1" data-bs-backdrop="static">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="modalLabel">見積請求情報</h5>
				<button type="button" class="btn-close"
					on:click={close_}
					id="close-button" area-label="Close"></button>
			</div>
			<div class="modal-body">
				<InvoiceInfo
					bind:init={init}
					bind:invoice={invoice}></InvoiceInfo>
			</div>
			<div class="modal-footer">
				{#if ( invoice && invoice.id && invoice.id > 0 )}
					<button type="button" class="btn btn-danger"
							on:click={delete_}
									id="delete-button">Delete</button>
				{/if}
				<button type="button" class="btn btn-primary"
						on:click={save}
						id="save-button">Save</button>
			</div>
		</div>
	</div>
</div>
<script>
import axios from 'axios';
import {numeric, formatDate} from '../../javascripts/cross-slip';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();
import InvoiceInfo from './invoice-info.svelte';


export	let	invoice;
export	let	modal;
export	let init;

let	files;
let update;

const create_invoice = async (_invoice) => {
	let result = await axios.post('/api/invoice', _invoice);
	console.log(result);
	return	(result);
}
const update_invoice = async (_invoice) => {
	console.log('save_invoice', _invoice);
	let result = await axios.put('/api/invoice', _invoice);
		 
	console.log(result);
	return	(result);
}
const delete_invoice = async (invoice) => {
	console.log('delete_invoice', invoice);
	let result = await axios.delete('/api/invoice', {
		data: {
			id: invoice.id
		}
	});
	console.log(result);
}

const save = (event) => {
	console.log('invoice', invoice);
	if	( invoice.type )	{
		invoice.type = parseInt(invoice.type);
	}
	if	( invoice.customerId )	{
		invoice.customerId = parseInt(invoice.customerId);
	}
	if	( invoice.amount )	{
		invoice.amount = numeric(invoice.amount);
	}
	if	( invoice.tax )	{
		invoice.tax = numeric(invoice.tax);
	}
	invoice.taxClass = parseInt(invoice.taxClass);
	console.log('input', invoice);
	try {
		let	pr;
		if ( invoice.id  ) {
			invoice.id = parseInt(invoice.id);
			pr = update_invoice(invoice);
		} else {
			pr = create_invoice(invoice);
		}
		pr.then((result) => {
			update = true;
			console.log('result', result);
			console.log('files', files.length);
			close_();
		});
	}
	catch(e) {
		console.log(e);
		// can't save
		//	TODO alert
	}
};


const clean_popup = () => {
	invoice = null;
	files = [];
	modal.hide();
}

const	close_ = (event) => {
	clean_popup();
	dispatch('close', update);
}

beforeUpdate(() => {
	console.log('invoice-modal beforeUpdate', invoice, init);
	update = false;
	init = init;
	if	( !invoice )	{
		invoice = {
			issueDate: formatDate(new Date()),
			paymentDate: null,
			amount: "0",
			taxClass: "-1",
			tax: "0",
			type: "-1"
		};
	} else {
		if	( invoice.type )	{
			invoice.type = invoice.type.toString();
		}
		invoice.taxClass = invoice.taxClass.toString();
	}
});

const	delete_ = (event) => {
	try {
		console.log('delete');
		delete_invoice(invoice).then(() => {
			clean_popup();
		});
	}
	catch(e) {
		console.log(e);
		// can't delete
		//	TODO alert
	}
}
</script>
