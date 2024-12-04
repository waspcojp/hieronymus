<input type="hidden" id="id" bind:value={voucher.id} />
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container-fluid"
  on:drop={onDrop}
  on:dragover={onDragOver}>
  <div class="row mb-3">
    <label for="type" class="col-2 col-form-label">種別</label>
    <div class="col-sm-3">
      <select class="form-select" id="type" bind:value={voucher.type}>
        <option value="-1">未設定</option>
        <option value="1">受取請求書</option>
        <option value="2">受取領収書</option>
        <option value="11">差出請求書</option>
        <option value="12">差出領収書</option>
        <option value="99">その他</option>
      </select>
    </div>
  </div>
  <div class="row mb-3">
    <label for="issueDate" class="col-2 col-form-label">発生日</label>
    <div class="col-sm-3">
      <input type="date" class="form-control" id="issueDate" bind:value={voucher.issueDate}>
    </div>
  </div>
  <div class="row mb-3">
    <div class="offset-sm-2 col-sm-3 align-self-center">
      <button type="button" class="btn btn-light"
        on:click={copy_up}>
        <i class="fas fa-angle-up"></i>
      </button>
      <button type="button" class="btn btn-light"
        on:click={copy_down}>
        <i class="fas fa-angle-down"></i>
      </button>
    </div>
  </div>
  <div class="row mb-3">
    <label for="paymentDate" class="col-2 col-form-label">支払日</label>
    <div class="col-sm-3">
      <input type="date" class="form-control" id="paymentDate" bind:value={voucher.paymentDate}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="zip" class="col-2 col-form-label">相手先</label>

    <div class="col-10">
      <CustomerSelect
        on:startregister
        on:endregister
        register=true
        input="view"
        bind:customerId={voucher.customerId}/>
    </div>
  </div>
  <div class="row mb-3">
    <label for="amount" class="col-2 col-form-label">金額</label>
    <div class="col-sm-4">
      <input type="text" class="form-control number" id="amount"
        on:focusout={focusout}
        on:focusin={focusin}
        bind:value={voucher.amount}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="taxClass" class="col-2 col-form-label">消費税</label>
    <div class="col-sm-2">
      <select class="form-control" id="taxClass"
        bind:value={voucher.taxClass}>
        <option value="-1">未選択</option>
        <option value="0">非課税</option>
        <option value="1">内税</option>
        <option value="2">外税</option>
        <option value="9">別計算</option>
      </select>
    </div>
    <div class="col-sm-2">
      <input type="text" class="form-control number" id="tax" bind:value={voucher.tax}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="key" class="col-2 col-form-label">インボイス番号</label>
    <div class="col-sm-3">
      <input type="text" class="form-control" id="key" bind:value={voucher.invoiceNo}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="description" class="col-2 col-form-label">備考</label>
    <div class="col-sm-10">
      <textarea class="form-control" id="description"
        bind:value={voucher.description} />
    </div>
  </div>
  <div class="row mb-3">
    <label class="col-2 col-form-label">ファイル</label>
    <div class="col-sm-10">
      <div class="row">
      {#if files }
      {#each files as file}
      <div class="file-item">
        <div style="margin:10px 0 5px 0;">
          <button type="button" on:click={delete_file} data-id={file.id}>
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <a href="/voucher/file/{file.id}" target="_blank">
          {#if ( file.mimeType.match(/^image\//) ) }
          <img src="data:{file.mimeType};base64,{(file.body)}" class="rect-image"/>
          {:else if ( file.name.match(/\.pdf$/) ) }
          <img src="/public/icons/icon_pdf.png" class="rect-image" />
          {/if}
        </a>
      </div>
      {/each}
      {/if}
      </div>
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
import {numeric} from '../../javascripts/cross-slip';
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();
import CustomerSelect from '../components/customer-select.svelte';

export	let	voucher;
export	let	files;

let	original_customers;
let	customers;
let	field_value;
let customerKey;

beforeUpdate(() => {
  console.log('voucher-info beforeUpdate',voucher);
  computeTax();
});

const copy_up = (event) => {
  voucher.issueDate = voucher.paymentDate;
}
const copy_down = (event) => {
  voucher.paymentDate = voucher.issueDate;
}

const delete_file = (event) => {
  let file_id = event.currentTarget.dataset.id;
  console.log('delete_file', file_id);
  let	new_file = [];
  for	( let i = 0; i < files.length; i += 1 )	{
    let file = files[i];
    if	( file.id == file_id )	{
      axios.delete('/api/voucher/file', {
        data: {
          id: file_id
        }
      });
    } else {
      new_file.push(file);
    }
  }
  files = new_file;
}

const computeTax = (event) => {
  console.log('computeTax');
  switch	(parseInt(voucher.taxClass))	{
    case	0:
    voucher.tax = 0;
    break;
    case	1:
    voucher.tax = (Math.round(numeric(voucher.amount) / 110 * 10)).toLocaleString();
    break;
    case	2:
    voucher.tax = (Math.round(numeric(voucher.amount) * 0.1)).toLocaleString();
    break;
  }
}
const focusout = (event) => {
  console.log('focusout');
  voucher.amount = numeric(voucher.amount).toLocaleString();
  computeTax();
}
const focusin = (event) => {
  console.log('focusin');
  voucher.amount = numeric(voucher.amount);
}

const upload = (file) => {
  return new Promise((done, fail) => {
    console.log(file);
    let id = voucher.id;
    const body = new FormData();
    body.append('file', file);
    let url;
    if	( id )	{
      url = `/api/voucher/upload/${id}`;
    } else {
      url = `/api/voucher/upload`;
    }
    axios.post( url,
      body,
      {
        "content-type": "multipart/form-data"
      }
    ).then(result => {
      console.log('result', result);
      done(result.data);
    }).catch(err => {
      fail(err);
    });
  });
}

onMount(() => {
  console.log('voucher-info onMount');
  if	( voucher.id )	{
      axios.get(`/api/voucher/files/${voucher.id}`).then((result) => {
        files = result.data;
      });
      customerKey = voucher.customer.name;
      voucher.amount = numeric(voucher.amount).toLocaleString();
      voucher.tax = numeric(voucher.tax).toLocaleString();
    } else {
      customerKey = '';
    }

  axios.get(`/api/customer/`).then((result) => {
    original_customers = result.data;
    console.log('customer update', original_customers);
  });
});

const onDragOver = (event) => {
  event.stopPropagation();
    event.preventDefault();
    //console.log("dragover", event);
}

const onDrop = (event) => {
  console.log('onDrop');
    event.stopPropagation();
    event.preventDefault();
    console.log(event);
    console.log(event.dataTransfer.files);
  if ( !files )	{
    files = [];
  }
  if ( event.dataTransfer ) {
        if  ( event.dataTransfer.files.length > 0 ) {
            for (let i = 0; i < event.dataTransfer.files.length; i ++ ) {
                let file = event.dataTransfer.files[i];
                console.log("drop", file);
        upload(file).then((ret) => {
          if	( ret.code == 0 )	{
            console.log('file',ret.file);
            files.push(ret.file);
            files = files;
          }
        });
            }
    }
  }
}

const enterKey = (event) =>	{
  field_value = event.target.value;
}
const leaveKey = (event) =>	{
    
}
const changeKey = (event) =>{
  let target = event.target;
  if	( target.value != field_value )	{
    let key = target.value;
    customers = [];
    for	( let i = 0; i < original_customers.length; i ++ )	{
      if	((( original_customers[i].key ) &&
           ( original_customers[i].key.match(key))) ||
           ( original_customers[i].name.match(key) ))	{
        customers.push(original_customers[i]);
      }
    }
    let select = document.getElementById('customerId');
    if	( select )	{
      select.addEventListener('focusout', customerSelect);
    }
  }
}
const	customerSelect = (event)	=> {
  console.log('target', event.target);
  for	( let i = 0; i < customers.length; i ++ )	{
    if	( customers[i].id == event.target.value)	{
      voucher.customerId = customers[i].id;
      voucher.invoiceNo = customers[i].invoiceNo;
      customerKey = customers[i].name;
      break;
    }
  }
  customers = [];
}
</script>
