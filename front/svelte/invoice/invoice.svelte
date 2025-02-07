{#if ( status.state === 'list' )}
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <span class="navbar-brand">見積 / 請求書一覧</span>
    <ul class="navbar-nav me-auto mb-2">
      <li class="nav-item">
        <button type="button" class="btn btn-primary"
          on:click={() => {
            openEntry(null);
          }}
          id="invoice-info">新規入力&nbsp;<i class="bi bi-pencil-square"></i></button>
      </li>
    </ul>
  </div> 
</nav>
<div class="row body-height">
  <InvoiceList
    invoices={invoices}
    on:open={openEntry}
    on:selectKind={selectKind}
    on:selectCustomerId={selectCustomer}
    on:selectAmount={selectAmount}
    ></InvoiceList>
</div>
{:else if ( status.state === 'entry' || status.state === 'new' )}
  <InvoiceEntry
    bind:status={status}
    bind:invoice={invoice}
    bind:users={users}
    on:open={openEntry}
    on:close={closeEntry}>
  </InvoiceEntry>
{/if}
<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import InvoiceEntry from './invoice-entry.svelte';
import InvoiceList from './invoice-list.svelte';
import {numeric} from '../../../libs/utils.js';
import {currentInvoice, currentTask, getStore} from '../../javascripts/current-record.js'

export let status;

let invoice;
let invoices;
let users;

const selectKind = (event) => {
  let kind = event.detail;
  updateInvoices({
    kind: kind
  });
}
const selectCustomer = (event) => {
  let	customerId = event.detail;
  console.log({customerId});
  updateInvoices({
    customer: customerId
  });
}
const selectAmount = (event) => {
  let amounts = event.detail;
  console.log({amounts});
  updateInvoices({
    upper: numeric(amounts.upperAmount),
    lower: numeric(amounts.lowerAmount)
  });
}

const updateInvoices = (_params) => {
  if	( !status.current_params )	{
    status.current_params = new Map();
  }
  if	( _params )	{
    Object.keys(_params).map((key) => {
      if	( !_params[key] )	{
        status.current_params.delete(key);
      } else {
        status.current_params.set(key,_params[key]);
      }
    });
  }
  //console.log('current_params', status.current_params);
  let _array = [];
  status.current_params.forEach((value, key) => {
    console.log('key, value', key, value);
    _array.push(encodeURI(`${key}=${value}`));
  });
  let param = _array.join('&');
  //console.log('param', param);
  axios.get(`/api/invoice?${param}`).then((result) => {
    invoices = result.data;
    //console.log('invoices', invoices);
  });
  if	( _params )	{
    window.history.pushState(
        status, "", `${location.pathname}?${param}`);
  }
};

const	openEntry = (event)	=> {
  if  ( !event )  {
    invoice = null;
    status.state = 'new';
      window.history.pushState(
        status, "", `/invoice/new`);
  } else {
    console.log('open', event.detail);
    invoice = event.detail;
    if ( !invoice.id )	{
      status.state = 'new';
      window.history.pushState(
        status, "", `/invoice/new`);
    } else {
      status.state = 'entry';
      axios(`/api/invoice/${invoice.id}`).then((result) => {
        invoice = result.data.invoice;
      	window.history.pushState(
        	status, "", `/invoice/entry/${invoice.id}`);
      });
    }
  }
  //console.log('invoice', invoice)
};
const closeEntry = (event) => {
  status.state = 'list';
  updateInvoices();
}
const checkPage = () => {
  let args = location.pathname.split('/');
  // /invoice/14
  // /invoice/entry/23
  //console.log('checkPage', {args});
  if  ( ( args[2] === 'entry' ) ||
			  ( args[2] === 'new'   )) {
    status.state = args[2];
    if	 ( !invoice )	{
      invoice = {
        issueDate: new Date(),
        tax: 0,
        amount: 0,
        lines: [{
          itemId: null,
          itemName: '',
          itemSpec: '',
          unitPrice: 0,
          itemNumber: 0,
          unit: '',
          amount: 0,
          description: ''
        }]};
      let task = getStore(currentTask);
      if	( task )	{
        invoice.taskId = task.id;
				invoice.customerId = task.customerId;
        invoice.customerName = task.customerName;
        invoice.chargeName = task.chargeName;
        invoice.zip = task.zip;
        invoice.address1 = task.address1;
        invoice.address2 = task.address2;
        invoice.subject = task.subject;
        invoice.lines = [...task.lines];
        invoice.taxClass = task.taxClass;
        invoice.tax = task.tax;
        invoice.amount = task.amount;
      }
    	let value = getStore(currentInvoice);
    	console.log({value});
    	if	( value )	{
	      invoice = value;
	    } else {
      	if	( status.state === 'entry' )	{
      		axios(`/api/invoice/${args[3]}`).then((result) => {
        		console.log('new load', result.data);
        		invoice = result.data.invoice;
        		currentInvoice.set(invoice);
          });
      	} else {
          currentInvoice.set(invoice);
      	}
      }
    }
    //console.log({invoice});
  } else {
    status.state = 'list';
  }
}

onMount(() => {
  console.log('invoice onMount');
})

beforeUpdate(()	=> {
  checkPage();
  let _params = location.search.substr(1);
  //console.log('_params', _params);
  let params = [];
  if  ( _params )	{
    _params.split('&').map((item) => {
      let kv = item.split('=');
      params[decodeURI(kv[0])] = decodeURI(kv[1]);
    });
  	//console.log({params});
	}
  if  ( !users )  {
  	users = [];
    axios.get('/api/users/member').then((result) => {
      users = result.data;
    })
  }
  if	( !invoices )	{
    invoices = [];
  	updateInvoices();
  }
});
afterUpdate(() => {
  //console.log('invoices afterUpdate');
})
</script>
