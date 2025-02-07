<table class="table table-striped table-bordered">
  <thead>
    <tr>
      <th scope="col" style="width:200px;">
        商品名
      </th>
      <th scope="col" style="width: 200px;">
        規格
      </th>
      <th scope="col" style="width:110px;">
        単価
      </th>
      <th scope="col" style="width: 100px;">
        数量
      </th>
      <th scope="col" style="width: 80px;">
        単位
      </th>
      <th scope="col" style="width: 110px;">
        金額
      </th>
      <th scope="col">
        説明
      </th>
      <th scope="col" style="width:90px;">
      </th>
      <th scope="col" style="width: 20px;">
        小計
      </th>
    </tr>
  </thead>
  <tbody>
    {#each details as line, i}
    <tr>
      <td>
        {#if ( line.itemId === 0 )}
        <span style="font-size:12pt;">※&nbsp;小計&nbsp;※</span>
        {:else}
        <ItemSelect
          product={true}
          bind:itemId={details[i].itemId}
          bind:itemName={details[i].itemName}
          bind:itemSpec={details[i].itemSpec}
          bind:unitPrice={details[i].unitPrice}
          bind:unit={details[i].unit}
        />
        {/if}
      </td>
      <td>
        {#if ( line.itemId !== 0 )}
        <input type="text" size="25" maxlength="26" class="form-control"
          bind:value={line.itemSpec}>
        {/if}
      </td>
      <td class="number">
        {#if ( line.itemId !== 0 )}
        <input type="text" class="number form-control" size="10" maxlength="11"
          bind:value={line.unitPrice}>
        {/if}
      </td>
      <td>
        {#if ( line.itemId !== 0 )}
        <input type="text" class="number form-control" size="5" maxlength="6"
          bind:value={line.itemNumber}>
        {/if}
      </td>
      <td>
        {#if ( line.itemId !== 0 )}
        <input type="text" class="number form-control" size="4" maxlength="5"
          bind:value={line.unit}>
        {/if}
      </td>
      <td>
        {#if ( line.itemId !== 0 )}
        <input type="text" class="number form-control" size="10" maxlength="11" disabled="true"
          value={numeric(line.amount).toLocaleString()}>
        {:else}
        <input type="text" class="number form-control" size="10" maxlength="11"
          bind:value={line.amount}>
        {/if}
      </td>
      <td>
        <input type="text" size="55" maxlength="56" class="form-control"
          bind:value={line.description}>
      </td>
      <td>
        <button type="button" class="btn btn-primary btn-sm"
          on:click={() => {
            details.splice(i+1, 0, {
              itemName: '',
              itemSpec: '',
              unitPrice: 0,
              itemNumber: 0,
              description: '',
              amount: 0
            });
            details = details;
          }}>
          <i class="fas fa-plus"></i>
        </button>
        {#if ( details.length > 1 )}
        <button type="button" class="btn btn-danger btn-sm"
          on:click={() => {
            details.splice(i,1);
            details = details;
          }}>
          <i class="fas fa-minus"></i>
        </button>
        {/if}
      </td>
      <td>
        <input type="checkbox"
          on:change={(event) => {
            const checked = event.target.checked;
            line.ssum = checked;
            if  ( !checked )  {
              line.itemId = undefined;
              line.unitPrice = 0;
              line.itemNumber = 0;
              line.unit = '';
              line.amount = 0;
            }
          }}
          bind:checked={line.ssum}>
      </td>
    </tr>
    {/each}
    <tr>
      <td colspan="5" style="vertical-align:middle;">
        合計
      </td>
      <td class="number">
        <input type="text" class="number form-control" size="10" maxlength="11" disabled="true"
        value={sum.toLocaleString()}>
      </td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

<script>
import ItemSelect from '../components/item-select.svelte';
import {numeric} from '../../../libs/utils.js';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

export  let details;
export  let sum;

$: {
  console.log('computeSum');
  sum = 0;
  for ( let i = 0 ; i < details.length ; i += 1 ) {
    //console.log(details[i]);
    if  ( details[i].ssum ) {
      details[i].itemId = 0;
    }
    details[i].ssum = false;
    if  ( details[i].itemId === 0 ) {
      details[i].amount = sum;
      details[i].ssum = true;
    } else
    if  ( details[i].itemId ) {
      details[i].amount = parseInt(details[i].unitPrice) * parseFloat(details[i].itemNumber);
      sum += details[i].amount;
    } else {
      sum += numeric(details[i].amount);
    }
  }
  dispatch('sum')
}

beforeUpdate(() => {
  //console.log('invoice-details beforeUpdate', {details});
})
</script>
