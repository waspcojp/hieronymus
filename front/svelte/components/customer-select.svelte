<input type="text" autocomplete="off" style="width:100%;"
        bind:value={customerKey}
        on:change={changeKey}
        on:keyup={changeKey}
        on:focusout={leaveKey}
        on:focusin={enterKey}>
{#if ( customers && customers.length > 0) }
    <select id="customerId" bind:value={customerId}>
        {#each customers as customer}
        <option value={customer.id}>
            {customer.name}
        </option>
        {/each}
    </select>
{/if}

<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

export let customerId;

let	original_customers;
let	field_value;
let customerKey;
let	customers;

const enterKey = (event) =>	{
	field_value = event.target.value;
}

const leaveKey = (event) =>	{
    let key = event.target.value;
    if  ( key.length == 0 ) {
        customerSelect(event);
    }
}

const changeKey = (event) =>{
	let target = event.target;
    let key = target.value;
    if  ( !key || ( key == '' ))    {
        customers = [];
    } else
	if	( key != field_value )	{
		customers = [];
		for	( let i = 0; i < original_customers.length; i ++ )	{
			if	((( original_customers[i].key ) &&
					 ( original_customers[i].key.match(key))) ||
					 ( original_customers[i].name.match(key) ))	{
				customers.push(original_customers[i]);
			}
		}
        customerId = ( customers.length > 0 ) ? customers[0].id : undefined;
		let select = document.getElementById('customerId');
		if	( select )	{
			select.addEventListener('focusout', customerSelect);
		}
	}
}
const	customerSelect = (event)	=> {
    customerId = undefined;
	for	( let i = 0; i < customers.length; i ++ )	{
		if	( customers[i].id == event.target.value)	{
			customerId = customers[i].id;
			customerKey = customers[i].name;
			break;
		}
	}
	customers = [];
    dispatch('input', customerId);
}

onMount(() => {
	console.log('customer-select onMount');
	axios.get(`/api/customer/`).then((result) => {
		original_customers = result.data;
		console.log('customer update', original_customers);
	});
});
</script>