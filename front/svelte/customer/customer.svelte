<nav class="navbar navbar-expand-lg">
	<div class="container-fluid">
		<a class="navbar-brand fs-3" href="#">顧客台帳</a>
		<ul class="navbar-nav me-auto mb-2">
			<li class="nav-item">
				<button type="button" class="btn btn-primary"
					on:click={openModal}>顧客入力</button>
			</li>
		</ul>
		<ul class="navbar-nav ms-auto">
			<li class="nav-item">
			</li>
		</ul>
	</div> 
</nav>
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
