{#if ( state === 'list' )}
<div class="d-flex justify-content-between mb-3 mt-3">
  <h1 class="fs-3">顧客台帳</h1>
  <button type="button" class="btn btn-primary"
    on:click={openEntry}>顧客入力&nbsp;<i class="bi bi-pencil-square"></i></button>
</div>
<CustomerList
    update={list_update}
    on:open={openEntry}></CustomerList>
{:else}
<CustomerEntry
	on:save={update}
  on:close={closeEntry}
	customer={customer}>
</CustomerEntry>
{/if}

<style>
</style>

<script>
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import CustomerEntry from './customer-entry.svelte';
import CustomerList from './customer-list.svelte';

let	customer;
let	list_update;
let state = 'list';

const	update = (event) => {
	console.log('update');
	list_update = true;
  state = 'list';
}

const	openEntry = (event)	=> {
	console.log('open', event.detail);
	if	( typeof event.detail === 'object' )	{
		customer = event.detail;
	} else {
    customer = {};
  }
	console.log('customer', customer)
  state = 'entry';
};
const closeEntry = (event) => {
  console.log('close');
  state = 'list';
}

beforeUpdate(()	=> {
});
afterUpdate(() => {
})
onMount(() => {
  let args = location.pathname.split('/');
  if  (( args[2] === '') ||
       ( args[2] === 'list' ))  {
    state = 'list';
  } else {
    state = 'entry';
  }
  console.log('customer onMount')
})
</script>
