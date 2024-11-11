<div class="entry">
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <h5 class="entry-title">証憑情報</h5>
    </div> 
  </nav>
  <div class="row full-height fontsize-12pt">
    <div class="entry-content">
      <div class="entry-body">
        {#if !ok }
        <div class="border rounded border-danger mb-3 ms-2 me-2 p-3">
          <h5 class="fs-5 text-danger"><i class="bi bi-exclamation-triangle-fill"></i>&nbsp;エラー</h5>
          <ul>
            {#each errorMessages as errorMessage}
              <li class="text-danger">{errorMessage}</li>
            {/each}
          </ul>
        </div>
        {/if}
        <VoucherInfo
          bind:init={init}
          bind:voucher={voucher}
          bind:files={files}></VoucherInfo>
      </div>
      <div class="entry-footer">
        <button type="button" class="btn btn-secondary"
          on:click={close_}
          >もどる</button>
        {#if ( voucher && voucher.id && voucher.id > 0 )}
          <button type="button" class="btn btn-danger"
              on:click={delete_}
                  id="delete-button">Delete</button>
        {/if}
        <button type="button" class="btn btn-primary"
            on:click={save}
            id="save-button">保存&nbsp;<i class="bi bi-save"></i></button>
      </div>
    </div>
  </div>
</div>
<script>
/*
  voucherに関する処理をここで行い、voucher_fileに関する処理をVoucherInfoで行うのは、なんか変である。
  voucher_fileに関する処理もここに移した方が良いかも知れない。
*/
import axios from 'axios';
import {numeric, formatDate} from '../../javascripts/cross-slip';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();
import VoucherInfo from './voucher-info.svelte';


export	let	voucher;
export	let init;

let	files;
let update;
let ok = true;
let errorMessages = [];

const create_voucher = async (_voucher) => {
  let result = await axios.post('/api/voucher', _voucher);
  console.log(result);
  return	(result);
}
const update_voucher = async (_voucher) => {
  console.log('save_voucher', _voucher);
  let result = await axios.put('/api/voucher', _voucher);
     
  console.log(result);
  return	(result);
}
const delete_voucher = async (voucher) => {
  console.log('delete_voucher', voucher);
  let result = await axios.delete('/api/voucher', {
    data: {
      id: voucher.id
    }
  });
  console.log(result);
}
const bind_file = async(file) => {
  console.log('bind_file', file.id, file.voucherId);
  let	result = await axios.put('/api/voucher/bind', {
    id: file.id,
    voucherId: file.voucherId
  });
  return	(result);
}

const validateForm = () => {
  ok = true;
  errorMessages = [];
  if ( voucher.customerId === undefined ) {
    ok = false;
    errorMessages.push("相手先が未入力もしくは、取引先に存在しない相手先が入力されました。");
  }
  return ok;
}
const save = (event) => {
  console.log('voucher', voucher);
  if ( !validateForm() ){
    return ;
  }
  if	( voucher.type )	{
    voucher.type = parseInt(voucher.type);
  }
  if	( voucher.customerId )	{
    voucher.customerId = parseInt(voucher.customerId);
  }
  if	( voucher.amount )	{
    voucher.amount = numeric(voucher.amount);
  }
  if	( voucher.tax )	{
    voucher.tax = numeric(voucher.tax);
  }
  voucher.taxClass = parseInt(voucher.taxClass);
  voucher.update = undefined;
  voucher.files = undefined;
  console.log('input', voucher);
  try {
    let	pr;
    console.log(voucher)
    if ( voucher.id  ) {
      voucher.id = parseInt(voucher.id);
      pr = update_voucher(voucher);
    } else {
      pr = create_voucher(voucher);
    }
    pr.then((result) => {
      update = true;
      console.log('result', result);
      console.log('files', files.length);
      for	( let i = 0; i < files.length ; i += 1 )	{
        console.log('voucherId', files[i].voucherId);
        if	( !files[i].voucherId )	{
          files[i].voucherId = result.data.id;
          bind_file(files[i]);
        }
      }
      close_();
    });
  }
  catch(e) {
    console.log(e);
    // can't save
    //	TODO alert
  }
};


const clean_popup = () => {
  voucher = null;
  files = [];
  ok = true;
  errorMessages = [];
}

const	close_ = (event) => {
  clean_popup();
  dispatch('close', update);
}

beforeUpdate(() => {
  console.log('voucher-entry beforeUpdate', voucher, init);
  update = false;
  init = init;
  if	( !voucher )	{
    voucher = {
      issueDate: formatDate(new Date()),
      paymentDate: null,
      amount: "0",
      taxClass: "-1",
      tax: "0",
      type: "-1"
    };
  } else {
    if	( voucher.type )	{
      voucher.type = voucher.type.toString();
    }
    voucher.taxClass = voucher.taxClass.toString();
  }
});

const	delete_ = (event) => {
  try {
    console.log('delete');
    delete_voucher(voucher).then(() => {
      close_();
    });
  }
  catch(e) {
    console.log(e);
    // can't delete
    //	TODO alert
  }
}
</script>
