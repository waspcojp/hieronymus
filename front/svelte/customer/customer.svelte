<div class="d-flex justify-content-between mb-3 mt-3">
  <h1 class="fs-3">顧客台帳</h1>
  <button type="button" class="btn btn-primary"
    on:click={openModal}>顧客入力&nbsp;<i class="bi bi-pencil-square"></i></button>
</div>
<CustomerList
    update={list_update}
    on:open={openModal}></CustomerList>

<CustomerModal
	modal={modal}
	on:save={update}
	customer={customer}>
</CustomerModal>

<style>
</style>

<script>
import axios from 'axios';
import Modal from 'bootstrap/js/dist/modal';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import CustomerModal from './customer-modal.svelte';
import CustomerList from './customer-list.svelte';

let	modal;
let	customer;
let	list_update;

const	update = (event) => {
	console.log('update');
	list_update = true;
}

const	openModal = (event)	=> {
	console.log('open', event.detail);
	if	( typeof event.detail === 'object' )	{
		customer = event.detail;
	}
	console.log('customer', customer)
	modal.show();
};
beforeUpdate(()	=> {
});
afterUpdate(() => {
	if	( !modal )	{
		modal = new Modal(document.getElementById('customer-modal'));
	}
})
</script>
