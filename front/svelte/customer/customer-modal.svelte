<div class="modal" id="customer-modal" tabindex="-1" data-bs-backdrop="static">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="modalLabel">取引先基本情報</h5>
				<button type="button" class="btn-close" on:click={close_} area-label="Close"></button>
			</div>
			<div class="modal-body">
				<CustomerInfo bind:customer={customer}></CustomerInfo>
			</div>
			<div class="modal-footer">
				{#if (customer && customer.id && customer.id > 0)}
					<button type="button" class="btn btn-danger"
									on:click={delete_}>Delete</button>
				{/if}
				<button type="button" class="btn btn-primary"
						on:click={save}>保存&nbsp;<i class="bi bi-save"></i></button>
			</div>
		</div>
	</div>
</div>

<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

import CustomerInfo from './customer-info.svelte';

export	let	customer;
export	let	modal;

const create_customer = async (customer) => {
	console.log('create_customer', customer);
	let result = await axios.post('/api/customer', customer);

	console.log(result);
}
const update_customer = async (customer) => {
	console.log('save_customer', customer);
	let result = await axios.put('/api/customer', customer);
		 
	console.log(result);
}
const delete_customer = async (customer) => {
	console.log('delete_customer', customer);
	let result = await axios.delete('/api/customer', {
		data: {
			id: customer.id
		}
	});
	console.log(result);
}
const save = (event) => {
	customer.type = parseInt(customer.type);
	customer.name = customer.name ? customer.name : '';
	customer.ruby = customer.ruby || '';
	customer.key = customer.key || '';
	customer.zip = customer.zip || '';
	customer.address1 = customer.address1 || '';
	customer.address2 = customer.address2 || '';
	customer.closingDate = customer.closingDate ? parseInt(customer.closingDate) : 0;
	customer.paymentDate = customer.paymentDate ? parseInt(customer.paymentDate) : 0;
	customer.bankName = customer.bankName || '';
	customer.bankBranchName = customer.bankBranchName || '';
	customer.accountType = customer.accountType;
	customer.accountNo = customer.accountNo || '';
	customer.telNo = customer.telNo || '';
	customer.faxNo = customer.faxNo || '';
	customer.email = customer.email || '';
	customer.url = customer.url || '';
	customer.chargeName = customer.chargeName || '';
	customer.description = customer.description || '';
	console.log('input', customer);
	try {
		let	pr;
		if ( customer.id  ) {
			customer.id = parseInt(customer.id);
			pr = update_customer(customer);
		} else {
			pr = create_customer(customer);
		}
		pr.then(() => {
			dispatch('save');
			close_();
		});
	} catch(e) {
		console.log(e);
		// can't save
		//	TODO alert
	}
}

const clean_popup = () => {
	modal.hide();
}

const close_ = (event) => {
	clean_popup();
}

beforeUpdate(() => {
	console.log('beforeUpdate customer-modal');
	if	( !customer )	{
		customer = {
		}
	}
})

const delete_ = (event) => {
	try {
		console.log('delete');
		delete_customer(customer).then(() => {
			dispatch('save');
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
