<div class="entry">
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <h5 class="entry-title">見積請求情報</h5>
      {#if invoice.no}
      <span>管理番号:&nbsp;{invoice.no}</span>
      {:else}
      <span>新規</span>
      {/if}
    </div> 
  </nav>
  <div class="row full-height fontsize-12pt">
    <div class="entry-content">
      <div class="entry-body">
        <InvoiceInfo
          on:startregister={() => { disabled = true}}
          on:endregister={() => { disabled = false}}
          bind:invoice={invoice}></InvoiceInfo>
      </div>
      <div class="entry-footer">
        <button type="button" class="btn btn-secondary" disabled={disabled}
          on:click={back}>もどる</button>
        {#if ( invoice && invoice.id && invoice.id > 0 )}
        <button type="button" class="btn btn-danger" disabled={disabled}
          on:click={delete_}
          id="delete-button">削除</button>
        <button type="button" class="btn btn-info" disabled={disabled}
          on:click={() => {
              invoice.id = undefined;
              save()
            }
          }
          id="create-button">複製</button>
        {/if}
        <button type="button" class="btn btn-primary" disabled={disabled}
          on:click={save}
          id="save-button">保存</button>
      </div>
    </div>
  </div>
</div>
<script>
import axios from 'axios';
import {numeric, formatDate} from '../../javascripts/cross-slip';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();
import InvoiceInfo from './invoice-info.svelte';


export	let	invoice;

let update;
let disabled = false;

const create_invoice = async (_invoice) => {
  let result = await axios.post('/api/invoice', _invoice);
  console.log(result);
  return	(result);
}
const update_invoice = async (_invoice) => {
  console.log('save_invoice', _invoice);
  let result = await axios.put('/api/invoice', _invoice);
     
  console.log(result);
  return	(result);
}
const delete_invoice = async (invoice) => {
  console.log('delete_invoice', invoice);
  let result = await axios.delete(`/api/invoice/${invoice.id}`);
  console.log(result);
}

const save = () => {
  //console.log('input', invoice);
  if	( invoice.customerId )	{
    invoice.customerId = parseInt(invoice.customerId);
  }
  if	( invoice.amount )	{
    invoice.amount = numeric(invoice.amount);
  }
  if	( invoice.tax )	{
    invoice.tax = numeric(invoice.tax);
  }
  invoice.taxClass = parseInt(invoice.taxClass);
  try {
    let	pr;
    if ( invoice.id  ) {
      invoice.id = parseInt(invoice.id);
      pr = update_invoice(invoice);
    } else {
      pr = create_invoice(invoice);
    }
    pr.then((result) => {
      update = true;
      if  ( !result.data.code ) {
        invoice = result.data;
      }
      console.log('result', result);
    });
  }
  catch(e) {
    console.log(e);
    // can't save
    //	TODO alert
  }
};

const clean = () => {
  invoice = null;
}

const	back = (event) => {
  clean();
  dispatch('close', update);
}

beforeUpdate(() => {
  //console.log('invoice-entry beforeUpdate', invoice);
  update = false;
  if	( !invoice )	{
    invoice = {
      no: null,
      issueDate: formatDate(new Date()),
      expiringDate: null,
      orderedDate: null,
      deliveryDate: null,
      billingDate: null,
      paymentDate: null,
      amount: "0",
      taxClass: 2,
      tax: "0",
      subject: '',
      paymentMethod: '',
      lines: [{
        itemName: '',
        itemSpec: '',
        unitPrice: 0,
        itemNumber: 0,
        amount: 0,
        description: ''
      }]
    };
  }
});

const	delete_ = (event) => {
  try {
    console.log('delete');
    delete_invoice(invoice).then(() => {
      back();
    });
  }
  catch(e) {
    console.log(e);
    // can't delete
    //	TODO alert
  }
}
</script>
