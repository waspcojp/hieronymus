<div class="entry">
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <h5 class="entry-title">取引文書(見積/請求/取引情報)</h5>
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
        <FormError
        	messages={errorMessages}></FormError>
        <InvoiceInfo
          on:startregister={() => { disabled = true}}
          on:endregister={() => { disabled = false}}
          users={users}
          bind:invoice={invoice}
          bind:status={status}></InvoiceInfo>
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
import {numeric, formatDate} from '../../../libs/utils.js';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();
import InvoiceInfo from './invoice-info.svelte';
import FormError from '../common/form-error.svelte';
import {currentInvoice} from '../../javascripts/current-record.js'
import {bindFile} from '../../javascripts/document';

export	let	status;
export	let invoice;
export	let users;

let update;
let disabled = false;
let errorMessages = [];
let files;

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
  errorMessages = [];
  let ok = true;
  console.log('input', invoice);
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
  console.log('kind', invoice.kind);
  if  ( (!invoice.kind) || (invoice.kind == 0) )	{
    ok = false;
    errorMessages.push('種別を入力してください。');
  }
  if  ( !invoice.handledBy )	{
    ok = false;
    errorMessages.push('弊社担当を入力してください。');
  }
  console.log({ok}, {errorMessages});
  if	( ok )	{
  	try {
    	let	pr;
    	let create = false;
    	if ( invoice.id  ) {
      	invoice.id = parseInt(invoice.id);
      	pr = update_invoice(invoice);
    	} else {
      	pr = create_invoice(invoice);
      	create = true;
    	}
    	pr.then((result) => {
      	console.log('result', result);
      	update = true;
      	if  ( !result.data.code ) {
        	invoice = result.data;
          bindFile(files,invoice.documentId);
      	}
				if	( create )	{
        	window.history.replaceState(
          	status, "", `/invoice/entry/${invoice.id}`);
          axios(`/api/invoice/${invoice.id}`).then((result) => {
        		console.log('new load', result.data);
        		invoice = result.data.invoice;
        		currentInvoice.set(invoice);
          });
      	}
    	});
  	}
  	catch(e) {
    	console.log(e);
    	// can't save
    	//	TODO alert
  	}
  }
};

const	back = (event) => {
  dispatch('close');
  currentInvoice.set(null);
  errorMessages = [];
  window.history.back();
}

beforeUpdate(() => {
  //console.log('invoice-entry beforeUpdate', invoice);
  update = false;
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
