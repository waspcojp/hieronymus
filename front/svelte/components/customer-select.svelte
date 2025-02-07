{#if ( status === 'select' )}
  <div class="row mb-3">
    <div class="col-10">
      <input type="text" autocomplete="off"
        class="form-control"
        placeholder="検索キー"
        bind:value={customerKey}
        on:change={changeKey}
        on:keyup={changeKey}
        on:focusin={enterKey}
        />
      {#if ( customers && customers.length > 0 ) }
        <select id="customerId" class="col-12 form-control" style="margin-top:5px;"
          bind:value={_customerId}
          on:focusout={(e) => {
            customerDecide(_customerId);
          }}>
          {#each customers as customer}
            <option value={customer.id}>
              {customer.name}
            </option>
          {/each}
        </select>
      {/if}
    </div>
    <div class="col-2">
      {#if (register === 'true') }
        <button type="button" class="btn btn-primary"
          on:click={openEntry}>
          登録
        </button>
      {#if (!customerId)}
      <button type="button" class="btn btn-danger" disabled=true>
        未登録
      </button>
    	{/if}
      {/if}
    </div>
  </div>
  {#if ( input === 'view' || input === 'input') }
    <div class="row mb-2">
      <label for="customerName" class="col-1 col-form-label">相手先名</label>
      <div class="col-11">
        <input type="text" id="customerName" class="form-control"
          bind:value={customerName} disabled={( input === 'view' ) ? true : false}/>
        </div>
      </div>
    <div class="row mb-2">
      <label for="zip" class="col-1 col-form-label">郵便番号</label>
      <div class="col-2">
        <input type="text" id="zip" class="form-control"
          bind:value={zip} disabled={( input === 'view' ) ? true : false}>
      </div>
    </div>
    <div class="row mb-2">
      <label for="address1" class="col-1 col-form-label">住所</label>
      <div class="col-11">
        <input type="text" id="address1" class="form-control"
          bind:value={address1} disabled={( input === 'view' ) ? true : false}>
      </div>
    </div>
    <div class="row mb-2">
      <label for="address2" class="col-1 col-form-label" style="height:38px;"></label>
      <div class="col-11">
        <input type="text" id="address2" class="form-control"
          bind:value={address2} disabled={( input === 'view' ) ? true : false}>
      </div>
    </div>
    <div class="row mb-2">
      <label for="chargeName" class="col-1 col-form-label">担当者</label>
      <div class="col-11">
        <input type="text" id="chargeName" class="form-control"
          bind:value={chargeName} disabled={( input === 'view' ) ? true : false}>
      </div>
    </div>
  {/if}
{:else}
  <CustomerEntry
    inline=true
	  on:save={update}
    on:close={closeEntry}
	  bind:customer={customer}>
  </CustomerEntry>
{/if}

<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();
import CustomerEntry from '../customer/customer-entry.svelte';

export let customerId;
export let register;
export let input;
export let style;
export let customerName;
export let chargeName;
export let zip;
export let address1;
export let address2;

let	original_customers;
let	field_value;
let customerKey;
let	customers;
let customer = {};
let status = 'select';
let _customerId;

const update = (event) => {
  //console.log('update', customer);
  customerId = customer.id;
  customerName = customer.name;
  chargeName = customer.chargeName;
  zip = customer.zip;
  address1 = customer.address1;
  address2 = customer.address2;
}
const enterKey = (event) =>	{
  field_value = event.target.value;
}

const closeEntry = (event) => {
  status = 'select';
  dispatch('endregister');
}
const	openEntry = async (event)	=> {
	console.log('open', customerId);
  customer = {
    name: customerName,
    chargeName: chargeName,
    zip: zip,
    address1: address1,
    address2: address2
  };
  if  ( customerId )  {
    let result = await axios.get(`/api/customer/${customerId}`);
    console.log({result});
    if  ( result.data ) {
      customer = result.data.customer;
    }
  }
  dispatch('startregister');
	//console.log('customer', customer)
	status = 'entry';
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
    console.log({customers});
    console.log({customerId});
  }
}
const customerDecide = (id) => {
  console.log('customerDecide', id);
  if  ( customers )   {
    for	( let i = 0; i < customers.length; i ++ )	{
      if	( customers[i].id == id )	{
        let customer = customers[i];
        //console.log(customer)
        customerId = customer.id;
        customerName = customer.name;
        chargeName = customer.chargeName;
        zip = customer.zip;
        address1 = customer.address1;
        address2 = customer.address2;
        customerKey = customerName;
        dispatch('input', customerId);
        customers = [];
        break;
      }
    }
  } else {
    customerKey = '';
  }
}
const	customerSelect = (event)	=> {
  customerDecide(event.target.value);
  customers = [];
  dispatch('input', customerId);
}
beforeUpdate(() => {
  //console.log({customerId});
})
onMount(() => {
  //console.log('customer-select onMount');
  axios.get(`/api/customer/`).then((result) => {
    original_customers = result.data;
    customers = original_customers;
    //console.log('customer update', original_customers);
    customerDecide(customerId);
    customers = undefined;
  });
})
</script>