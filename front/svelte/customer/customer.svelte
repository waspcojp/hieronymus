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
import axios from 'axios';
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
  if  ( !event )  {
    customer = null;
    state = 'new';
      window.history.pushState(
        null, "", `/customer/new`);
  } else {
    console.log('open', event.detail);
    customer = event.detail;
    if ( !customer.id )	{
      state = 'new';
      window.history.pushState(
        null, "", `/customer/new`);
    } else {
      state = 'entry';
      window.history.pushState(
        null, "", `/customer/entry/${customer.id}`);
    }
  }
  //console.log('invoice', invoice)
};

const closeEntry = (event) => {
  console.log('close');
  state = 'list';
}

beforeUpdate(()	=> {
  checkPage();
});
afterUpdate(() => {
})
const checkPage = () => {
  let args = location.pathname.split('/');
  // /customer/26
  // /customer/
  console.log('checkPage', {args});
  if  (( args[2] === '') ||
       ( args[2] === 'list' ))  {
    state = 'list';
  } else
  if  ( args[2] === 'new' ) {
    customer = {};
    state = 'new';
  } else {
    state = 'entry';
    if  ( !customer ) {
      customer = {};
      axios(`/api/customer/${args[2]}`).then((result) => {
        customer = result.data.customer;
        console.log({customer});
      });
    }
  }
}

onMount(() => {
  console.log('customer onMount');
	window.onpopstate = (event) => {
    console.log('maybe back');
    customer = null;
    checkPage();
	}

})
</script>
