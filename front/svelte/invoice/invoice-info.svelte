<input type="hidden" id="id" bind:value={invoice.id}>
<div class="container-fluid">
  <div class="row mb-3">
    <div class="col-1">進捗</div>
    <div class="col-11">
      <div class="row">
        <div class="col-3">
          <div class="row">
            <label for="issueDate" class="col-4 col-form-label">発生日</label>
            <div class="col-8">
              <input type="date" class="form-control" id="issueDate"
                bind:value={invoice.issueDate}>
            </div>
          </div>
          {#if ( invoice.id && invoice.issueDate )}
          <div class="row">
            <div class="col-12">
              <a class="btn btn-info" href="/invoice/invoice/{invoice.id}" target="_brank">
                見積書出力
              </a>
            </div>
          </div>
          {/if}
        </div>
        <div class="col-3">
          <div class="row">
            <label for="expiringDate" class="col-4 col-form-label">有効期限</label>
            <div class="col-8">
              <input type="date" class="form-control" id="expiringDate"
                bind:value={invoice.expiringDate}>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row mb-3">
    <div class="col-1"></div>
    <div class="col-2">
      <button type="button" class="btn btn-sm btn-light"
        on:click={copy_down}>
        <i class="fas fa-angle-down"></i>
      </button>
      <button type="button" class="btn btn-sm btn-light"
        on:click={copy_up}>
        <i class="fas fa-angle-up"></i>
      </button>
    </div>
  </div>
  <div class="row mb-3">
    <div class="col-1"></div>
    <div class="col-11">
      <div class="row">
        <div class="col-3">
          <div class="row">
            <label for="orderedDate" class="col-4 col-form-label">受注日</label>
            <div class="col-8">
              <input type="date" class="form-control" id="orderedDate"
                bind:value={invoice.orderedDate}>
            </div>
          </div>
        </div>
        <div class="col-3">
          <div class="row">
            <label for="deliveryDate" class="col-4 col-form-label">納期</label>
            <div class="col-8">
              <input type="date" class="form-control" id="deliveryDate"
                bind:value={invoice.deriveryDate}>
            </div>
          </div>
        </div>
        <div class="col-3">
          <div class="row">
            <label for="billingDate" class="col-4 col-form-label">請求日</label>
            <div class="col-8">
              <input type="date" class="form-control" id="billingDate"
                bind:value={invoice.billingDate}>
            </div>
          </div>
        </div>
        <div class="col-3">
          <div class="row">
            <label for="paymentDate" class="col-4 col-form-label">領収日</label>
            <div class="col-8">
              <input type="date" class="form-control" id="paymentDate"
                bind:value={invoice.paymentDate}>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row mb-3">
    <label class="col-1 col-form-label">相手先</label>
    <div class="col-11">
      <CustomerSelect
        on:startregister
        on:endregister
        register="true"
        input="input"
        bind:customerId={invoice.customerId}
        bind:customerName={invoice.customerName}
        bind:chargeName={invoice.chargeName}
        bind:zip={invoice.zip}
        bind:address1={invoice.address1}
        bind:address2={invoice.address2}
      />
    </div>
  </div>
  <div class="row mb-3">
    <label for="subject" class="col-1 col-form-label">件名</label>
    <div class="col-sm-11">
      <input type="text" class="form-control" id="subject"
        bind:value={invoice.subject} />
    </div>
  </div>
  <div class="row mb-3">
    <InvoiceDetails
      bind:details={invoice.lines}
      bind:sum={sum}
      on:sum={computeTax}
    ></InvoiceDetails>
  </div>
  <div class="row mb-3">
    <label for="paymentMethod" class="col-1 col-form-label">支払方法</label>
    <div class="col-sm-3">
      <input type="text" class="form-control" id="paymentMethod"
        bind:value={invoice.paymentMethod} />
    </div>
  </div>
  <div class="row mb-3">
    <label for="taxClass" class="col-1 col-form-label">消費税</label>
    <div class="col-sm-1">
      <select class="form-control" id="taxClass"
        bind:value={invoice.taxClass}>
        {#each TAX_CLASS as ent}
        <option value={ent[1]}>{ent[0]}</option>
        {/each}
      </select>
    </div>
    <div class="col-sm-2">
      {#if ( parseInt(invoice.taxClass) === 9 )}
      <input type="text" class="form-control number" id="tax"
        bind:value={invoice.tax}>
      {:else}
      <input type="text" class="form-control number" id="tax" disabled="true"
        value={invoice.tax.toLocaleString()}>
      {/if}
    </div>
  </div>
  <div class="row mb-3">
    <label for="amount" class="col-1 col-form-label">金額</label>
    <div class="col-sm-3">
      <input type="text" class="form-control number" id="amount" disabled="true"
        value={invoice.amount.toLocaleString()}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="description" class="col-1 col-form-label">備考</label>
    <div class="col-sm-10">
      <textarea class="form-control" id="description"
        bind:value={invoice.description} />
    </div>
  </div>
</div>
<style>
.file-item {
  width:90px;
  height:120px;
  border:1px #8CC solid;
  margin:10px;
  padding: 0 10px 10px 10px;
}
.rect-image {
  width:70px;
  position:absolute;
  clip:rect(0,70px,70px,0);
}
</style>

<script>
import {numeric, TAX_CLASS} from '../../javascripts/cross-slip';
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import CustomerSelect from '../components/customer-select.svelte';
import InvoiceDetails from './invoice-details.svelte';

export let invoice;

let	original_customers;
let customerKey;
let sum = 0;

beforeUpdate(() => {
  console.log('invoice-info beforeUpdate',invoice);
  computeTax();
});

const copy_down = (event) => {
  invoice.orderedDate = invoice.issueDate;
}
const copy_up = (event) => {
  invoice.issueDate = invoice.orderedDate;
}

const computeTax = (event) => {
  console.log('computeTax');
  switch	(parseInt(invoice.taxClass))	{
    case	0:
      invoice.tax = 0;
      break;
    case	1:
      invoice.tax = Math.round(sum / 110 * 10);
      invoice.amount = sum;
      break;
    case	2:
      invoice.tax = Math.round(sum * 0.1);
      invoice.amount = sum + invoice.tax;
      break;
    case  9:
      invoice.amount = sum + parseInt(invoice.tax);
      break;
  }
}
const focusout = (event) => {
  console.log('focusout');
  invoice.amount = numeric(invoice.amount).toLocaleString();
  computeTax();
}
const focusin = (event) => {
  console.log('focusin');
  invoice.amount = numeric(invoice.amount);
}

onMount(() => {
  console.log('invoice-info onMount', invoice);
  if	( invoice.id )	{
    customerKey = invoice.customerName;
  } else {
    customerKey = '';
  }
  axios.get(`/api/customer/`).then((result) => {
    original_customers = result.data;
    console.log('customer update', original_customers);
  });
});

</script>
