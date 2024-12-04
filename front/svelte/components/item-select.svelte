  <input type="text" autocomplete="off"
    class="form-control"
    placeholder="検索キー"
    bind:value={itemKey}
    on:input={keyInput}
    />
{#if ( items && items.length > 0 ) }
    <select id="itemId" class="form-control"
      on:focusout={itemSelect}
      bind:value={itemId}>
      {#each items as item}
      <option value={item.id}>
        {item.name}
      </option>
      {/each}
    </select>
{/if}

<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

export let itemId;
export let itemName;
export let itemSpec;
export let unitPrice;
export let unit;
export let product;

let itemKey;
let	items
let current_params = new Map();
let once;

const updateItems = (_params) => {
  if	( _params )	{
    Object.keys(_params).map((key) => {
      if	( !_params[key] )	{
        current_params.delete(key);
      } else {
        current_params.set(key,_params[key]);
      }
    });
  }
  //console.log('current_params', current_params);
  let _array = [];
  if  ( product ) {
    _array.push('product=true')
  }
  current_params.forEach((value, key) => {
    console.log('key, value', key, value);
    _array.push(encodeURI(`${key}=${value}`));
  });
  let param = _array.join('&');
  console.log('param', param);
  axios.get(`/api/item?${param}`).then((result) => {
    items = result.data;
  });
};

const keyInput = (event) => {
  updateItems({
    key: itemKey
  });
}

const itemDecide = (id) => {
  console.log('itemDecide', id);
  console.log('items', items);
  if  ( items )   {
    for	( let i = 0; i < items.length; i ++ )	{
      if	( items[i].id === id )	{
        let item = items[i];
        console.log({item})
        itemId = item.id;
        itemName = item.name;
        itemSpec = item.spec;
        unitPrice = item.standardPrice
        unit = item.unit;
        itemKey = itemName;
        break;
      }
    }
  }
}
const	itemSelect = (event)	=> {
  //console.log('itemSelect', event.target.value);
  itemId = parseInt(event.target.value);
  itemDecide(itemId);
  items = [];
  dispatch('input', itemId);
}
beforeUpdate(() => {
  //console.log({itemId});
  console.log({itemKey});
  if  ( !once )  {
    itemKey = itemName;
    once = true;
  }
})
onMount(() => {
  if  ( itemId && itemId > 0 )  {
    //itemDecide(itemId);
  }
  once = false;
});
</script>