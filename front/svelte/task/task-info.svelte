<input type="hidden" id="id" bind:value={task.id}>
<div class="container-fluid">
  <div class="row mb-3">
    <label for="issueDate" class="col-1 col-form-label">発生日</label>
    <div class="col-2">
      <input type="date" class="form-control" id="issueDate"
        bind:value={task.issueDate}>
    </div>
    <label for="deliveryLimit" class="col-1 col-form-label">納期</label>
    <div class="col-2">
      <input type="date" class="form-control" id="deliveryLimit"
        bind:value={task.deliveryLimit}>
    </div>
    <label for="endedAt" class="col-1 col-form-label">終了日</label>
    <div class="col-2">
      <input type="date" class="form-control" id="endedAt"
        bind:value={task.endedAt}>
    </div>
  </div>
  <div class="row mb-3">
    <div class="col-1">
      <label class="col-form-label">相手先</label>
      {#if ( task.customerId && task.id)}
      {#if (customerEditting)}
      <a href="#" on:click|preventDefault={() => {
        customerEditting = false
      }}>
        <i class="bi bi-check"></i>
      </a>
      {:else}
      <a href="#" on:click|preventDefault={() => {
        customerEditting = true
      }}>
        <i class="bi bi-pencil"></i>
      </a>
      {/if}
      {/if}
    </div>
    <div class="col-11">
      {#if (customerEditting || !task.customerId)}
      <CustomerSelect
        on:startregister
        on:endregister
        register="true"
        input="input"
        bind:customerId={task.customerId}
        bind:customerName={task.customerName}
        bind:chargeName={task.chargeName}
        bind:zip={task.zip}
        bind:address1={task.address1}
        bind:address2={task.address2}
      />
      {:else}
      <span>{task.customerName}</span>
      <button type="button" class="btn btn-danger"
      	on:click={() => {
          task.customerId = null;
        }}>
      	変更
    	</button>
  		{/if}
    </div>
  </div>
  <div class="row mb-3">
    <label for="subject" class="col-1 col-form-label">件名</label>
    <div class="col-7">
      <input type="text" class="form-control" id="subject"
        bind:value={task.subject} />
    </div>
    <div class="col-4">
      <label for="handler" class="col-form-label">担当</label>
      <select id="handler" class="form-control" style="display:inline;margin:0 10px;width:200px;"
        bind:value={task.handledBy}>
        {#each users as user}
        <option value={user.id}>{user.name}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="row mb-3">
    <div class="col-1">
      <label class="col-form-label">見積</label>
      {#if (task.id)}
      {#if (viewDetail)}
      <a href="#" on:click|preventDefault={() => {
        viewDetail = false
      }}>
    	  <i class="bi bi-arrows-collapse"></i>
      </a>
      {:else}
      <a href="#" on:click|preventDefault={() => {
        viewDetail = true
      }}>
        <i class="bi bi-arrows-expand"></i>
      </a>
      {/if}
      {/if}
    </div>
    {#if (viewDetail || !task.id)}
    <div class="col-11">
      <TaskDetails
      	bind:details={task.lines}
      	bind:sum={sum}
      	on:sum={computeTax}
    	></TaskDetails>
      <div class="row">
        <div class="row mb-3">
          <label for="taxClass" class="col-1 col-form-label">消費税</label>
          <div class="col-sm-2">
            <select class="form-control" id="taxClass"
              bind:value={task.taxClass}>
              {#each TAX_CLASS as ent}
              <option value={ent[1]}>{ent[0]}</option>
              {/each}
            </select>
          </div>
          <div class="col-sm-2">
            {#if ( parseInt(task.taxClass) === 9 )}
            <input type="text" class="form-control number" id="tax"
              bind:value={task.tax}>
            {:else}
            <input type="text" class="form-control number" id="tax" disabled="true"
              value={task.tax.toLocaleString()}>
            {/if}
          </div>
        </div>
      </div>
    </div>
    {:else}
    <div class="col-11">
      <div class="label" style="width:70px;">
				<span>金額</span>
      </div>
      <div class="disabled">
      	<span>{task.amount.toLocaleString()}</span>
      </div>
      <div class="label" style="width:120px;">
				<span>
      		消費税(
        		{TAX_CLASS.find((item) => item[1] === task.taxClass)[0]}
      		)
        </span>
      </div>
      <div class="disabled">
      	<span>{task.tax.toLocaleString()}</span>
    	</div>
    </div>
    {/if}
  </div>
  <div class="row mb-3">
    <div class="col-1">
      <label for="description" class="col-form-label">備考</label>
      {#if ( documentEditting )}
      <a href="#" on:click|preventDefault={() => {
        documentEditting = false
      }}>
        <i class="bi bi-check"></i>
      </a>
      {:else}
      <a href="#" on:click|preventDefault={() => {
        documentEditting = true;
        viewDescription = true;
        viewFiles = true;
      }}>
        <i class="bi bi-pencil"></i>
      </a>
      {#if ( viewDescription )}
      <a href="#" on:click|preventDefault={() => {
	      viewDescription = false;
  	  }}>
    	  <i class="bi bi-arrows-collapse"></i>
      </a>
      {:else}
      <a href="#" on:click|preventDefault={() => {
        viewDescription = true;
      }}>
        <i class="bi bi-arrows-expand"></i>
      </a>
      {/if}
      {/if}
  	</div>
    <div class="col-11">
      <Document
        editting={documentEditting}
        {viewDescription}
        bind:document={task.document}></Document>
    </div>
  </div>
  <div class="row mb-3">
    <div class="col-1">
      ファイル
      {#if ( viewFiles )}
      <a href="#" on:click|preventDefault={() => {
        viewFiles = false;
      }}>
        <i class="bi bi-arrows-collapse"></i>
      </a>
      {:else}
      <a href="#" on:click|preventDefault={() => {
        viewFiles = true;
      }}>
        <i class="bi bi-arrows-expand"></i>
      </a>
      {/if}
    </div>
    <div class="col-11">
      {#if ( viewFiles )}
      <DocumentFiles
      	document={task.document}
        bind:files={files}></DocumentFiles>
      {/if}
    </div>
  </div>
  <div class="row mb-3">
    
  </div>
</div>
<style>
.disabled {
  background-color: #e9ecef;
  border-radius: 0.375rem;
  padding: .375rem .75rem;
  display: inline-block;
  line-height: 1.5;
  width: 120px;
  text-align: right;
}
.label {
  margin-top:5px;
  display: inline-block;
  line-height: 1.5;
}
</style>

<script>
import {numeric, TAX_CLASS} from '../../../libs/utils';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import CustomerSelect from '../components/customer-select.svelte';
import Document from '../components/document.svelte';
import DocumentFiles from '../components/document-files.svelte';
import TaskDetails from '../invoice/invoice-details.svelte';
const dispatch = createEventDispatcher();

export let task;
export let users;
export let files;

let customerKey;
let customerEditting = false;
let documentEditting = false;
let viewDescription = false;
let viewFiles = false;
let viewDetail = false;
let sum;

$: computeTax();

const computeTax = (event) => {
  //console.log('computeTax', task.taxClass, sum);
  switch	(parseInt(task.taxClass))	{
    case	0:
      task.tax = 0;
      break;
    case	1:
      task.tax = Math.round(sum / 110 * 10);
      task.amount = sum;
      break;
    case	2:
      task.tax = Math.round(sum * 0.1);
      task.amount = sum + task.tax;
      break;
    case  9:
      task.amount = sum + parseInt(task.tax);
      break;
  }
  //console.log(task.tax, task.amount);
}

beforeUpdate(() => {
  //console.log('task-info beforeUpdate',customerEditting, task);
});

onMount(() => {
  console.log('task-info onMount', task);
  if	( task.id )	{
    customerKey = task.customerName;
  } else {
    customerKey = '';
    viewDetail = true;
  }
  let details = task.lines;
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
      sum += details[i].amount;
    }
  }
  computeTax();
});

</script>