<div class="modal" id="customer-modal" tabindex="-1" data-bs-backdrop="static">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="modalLabel">取引先基本情報</h5>
				<button type="button" class="btn-close" on:click={close_} area-label="Close"></button>
			</div>
			<div class="modal-body">
        {#if !ok }
        <div class="border rounded border-danger mb-3 ms-2 me-2 p-3">
          <h5 class="fs-5 text-danger"><i class="bi bi-exclamation-triangle-fill"></i>&nbsp;エラー</h5>
          <ul>
            {#each errorMessages as errorMessage}
              <li class="text-danger">{errorMessage}</li>
            {/each}
          </ul>
        </div>
        {/if}
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
let ok = true;
let errorMessages = [];

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
const validateForm = () => {
  ok = true;
  errorMessages = [];
  if ( customer.type === null || customer.type === undefined ){
    ok = false;
    errorMessages.push("取引先種別が選択されていません。");
  }
  if ( customer.name === undefined ){
    ok = false;
    errorMessages.push("名前が未入力です。");
  }
  if ( customer.name !== undefined && customer.name.trim().length === 0 ){
    ok = false;
    errorMessages.push("名前が未入力です。");
  }
  if ( customer.ruby === undefined ){
    ok = false;
    errorMessages.push("フリガナが未入力です。");
  }
  if ( customer.ruby !== undefined && customer.ruby.trim().length === 0 ){
    ok = false;
    errorMessages.push("フリガナが未入力です。");
  }
  if ( customer.key === undefined ){
    ok = false;
    errorMessages.push("呼び出しキーが未入力です。");
  }
  if ( customer.key !== undefined && customer.key.trim().length === 0 ){
    ok = false;
    errorMessages.push("呼び出しキーが未入力です。");
  }
  errorMessages = errorMessages;
  return ok;
}
const save = (event) => {
  if ( !validateForm() ){
    return ;
  }
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
  customer = undefined;
  ok = true;
  errorMessages = [];
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
