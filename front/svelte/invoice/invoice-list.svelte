<div class="row full-height fontsize-12pt" style="overflow-y: scroll;">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th scope="col" style="width: 100px;">
          種別
        </th>
        <th scope="col" style="width: 150px;">
          相手先
        </th>
        <th scope="col" style="width: 200px;">
          件名
        </th>
        <th scope="col" style="width: 100px;">
          発生日
        </th>
        <th scope="col" style="width: 100px;">
          受注日
        </th>
        <th scope="col" style="width: 100px;">
          納期
        </th>
        <th scope="col" style="width: 100px;">
          請求日
        </th>
        <th scope="col" style="width: 100px;">
          支払日
        </th>
        <th scope="col" style="width: 100px;">
          金額
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <select class="form-select" id="kind"
            on:input={(event) => { dispatch('selectKind', event.currentTarget.value) }}
            bind:value={kind}>
            <option value={-1}>未設定</option>
            {#each DOCUMENT_KIND as line}
            <option value={line[0]}>{line[1]}</option>
            {/each}
          </select>
        </td>
        <td style="padding:10px 20px;">
          <CustomerSelect
            register=false
            bind:value={customerId}
            on:input={changeCustomer}>
          </CustomerSelect>
        </td>
        <td>
        </td>
        <td>
        </td>
        <td>
        </td>
        <td>
        </td>
        <td>
        </td>
        <td>
        </td>
        <td style="text-align:right;">
          <input type="text" class="number" placeholder="下限" size="12" maxlength="13"
              bind:value={lowerAmount}
              on:keypress={changeAmount} />
          <input type="text" class="number" placeholder="上限" size="12" maxlength="13"
              bind:value={upperAmount}
              on:keypress={changeAmount} />
        </td>
      </tr>
      {#each invoices as line}
      <tr>
        <td>
          {line.kind ? (DOCUMENT_KIND.find((el) => el[0] === line.kind))[1]: '_'}
        </td>
        <td>
          {#if (line.customerId)}
          <a href="/customer/{line.customerId}">
            {line.customerName ? line.customerName : line.customer.name}
          </a>
          {:else}
          {line.customerName ? line.customerName : '__' }
          {/if}
        </td>
        <td>
          <a href="#" on:click|preventDefault={() => {
              openInvoice(line.id)
            }}>
            {line.subject ? line.subject : '__'}
          </a>
        </td>
        <td>
          {formatDate(line.issueDate)}
        </td>
        <td>
          {formatDate(line.orderdDate)}
        </td>
        <td>
          {formatDate(line.deliveryDate)}
        </td>
        <td>
          {formatDate(line.billingDate)}
        </td>
        <td>
          {formatDate(line.paymentDate)}
        </td>
        <td class="number">
          {numeric(line.amount).toLocaleString()}
        </td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
th {
  text-align: center;
}
.file-item {
  width:40px;
  height:40px;
  padding:5px;
  float: left;
}
.rect-image {
  width:40px;
  clip:rect(0,40px,40px,0);
}
</style>

<script>
import CustomerSelect from '../components/customer-select.svelte';

import {numeric, formatDate} from '../../../libs/utils.js';
import {DOCUMENT_KIND} from '../../../libs/transaction-documents';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

export	let	invoices;

let kind;
let customerId;
let upperAmount;
let lowerAmount;


const compDate = (date, year, month, day) => {
  let ymd = date.split('-');
  return	(	( parseInt(ymd[0]) == year )
    &&	( parseInt(ymd[1]) == month )
    &&	( parseInt(ymd[2]) == day ));
}

beforeUpdate(() => {
  //sconsole.log('invoice-list beforeUpdate');
});

const changeCustomer = (event) => {
  let customerId = event.detail;
  console.log({customerId});
  dispatch('selectCustomerId', customerId);
}
const changeAmount = (event) => {
  if	( event.keyCode == 13 )	{
    dispatch('selectAmount', {
      lowerAmount: lowerAmount,
      upperAmount: upperAmount
    });
  }
}

const openInvoice = (id) => {
  let	invoice;

  //console.log('openInvoice', id);
  //console.log('invoices', invoices);

  for ( let i = 0; i < invoices.length; i ++ ) {
    if ( invoices[i].id == id ) {
      invoice = invoices[i];
      break;
    }
  }
  dispatch('open', invoice);
}
</script>
