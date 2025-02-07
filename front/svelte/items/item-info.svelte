<input type="hidden" id="id" value={status.item.id}>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container-fluid">
  <div class="row mb-3">
    <label for="itemClass" class="col-2 col-form-label">種別</label>
    <div class="col-sm-3">
      <select class="form-select" id="itemClass"
      	bind:value={status.item.itemClassId}>
        <option value="-1">未設定</option>
        {#if status.classes}
        {#each status.classes as line}
        <option value="{line.id}">{line.name}</option>
        {/each}
        {/if}
      </select>
    </div>
  </div>
  <div class="row mb-3">
    <label for="name" class="col-2 col-form-label">名前</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="name"
      	bind:value={status.item.name}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="normalName" class="col-2 col-form-label">正式名前</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="normalName"
      	bind:value={status.item.normalName}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="key" class="col-2 col-form-label">呼び出しキー</label>
    <div class="col-sm-3">
      <input type="text" class="form-control" id="key"
      	bind:value={status.item.key}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="" class="col-2 col-form-label">コード</label>
    <div class="col-3">
      <label for="globalCode" class="col-form-label">公的コード</label>
      <input type="text" class="form-control" id="globalCode"
      	bind:value={status.item.globalCode}>
    </div>
    <div class="col-3">
      <label for="strageCode" class="col-form-label">倉庫コード</label>
      <input type="text" class="form-control" id="storageCode"
      	bind:value={status.item.storateCode}>
    </div>
    <div class="col-3">
      <label for="strageCode" class="col-form-label">社内コード</label>
      <input type="text" class="form-control" id="localCode"
      	bind:value={status.item.localCode}>
    </div>
  </div>

  <div class="row mb-3">
    <label for="spec" class="col-2 col-form-label">規格</label>
    <div class="col-10">
      <input type="text" class="form-control" id="spec"
      	bind:value={status.item.spec}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="unit" class="col-2 col-form-label">単位</label>
    <div class="col-sm-3">
      <input type="text" class="form-control" id="unit"
      	bind:value={status.item.unit}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="unit_price" class="col-2 col-form-label">単価</label>
    <div class="col-2">
      <label for="standardPrice" class="col-form-label">標準価格</label>
      <input type="text" class="form-control number" id="globalCode"
      	bind:value={status.item.standardPrice}>
    </div>
    <div class="col-2">
      <label for="costPrice" class="col-form-label">原価</label>
      <input type="text" class="form-control number" id="costPrice"
      	bind:value={status.item.costPrice}>
    </div>
    <div class="col-2">
      <label for="taxClass" class="col-form-label">消費税</label>
      <select class="form-control" id="taxClass"
          bind:value={status.item.taxClass}>
        {#each TAX_CLASS as ent}
        <option value={ent[1]}>{ent[0]}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="row mb-3">
    <label for="description" class="col-2 col-form-label">説明</label>
    <div class="col-sm-10">
      <div class="row mb-3">
        <DocumentFormat
          bind:type={status.item.descriptionType}></DocumentFormat>
      </div>
      <div class="row mb-3">
        <Editor
          type={status.item.descriptionType}
          bind:value={status.item.description}
        />
      </div>
    </div>
  </div>
  <div class="row mb-3" style="min-height:200px;">
    <label class="col-2 col-form-label">ファイル</label>
    <div class="col-10">
      <div class="row h-100"
        on:drop={onDrop}
        on:dragover={onDragOver}>
        {#if !files || files.length === 0}
        <div class="mt-3 p-3 border rounded h-100">
          アップロードされた画像はありません。
        </div>
        {:else}
        {#each files as file}
        <div class="col-3">
          <div style="margin:10px 0 5px 0;">
            <button type="button" on:click={delete_file} data-id={file.id}>
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <a href="/item/file/{file.id}" target="_blank">
            {#if ( file.mimeType.match(/^image\//) ) }
            <img src="/item/file/{file.id}" class="w-100"/>
            {:else if ( file.name.match(/\.pdf$/) ) }
            <img src="/public/icons/icon_pdf.png" class="w-100" />
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
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import Editor from '../components/editor.svelte';
import DocumentFormat from '../components/document-format.svelte';
import {TAX_CLASS} from '../../../libs/utils.js';

export	let	status;
export  let	files;

onMount(() => {
  console.log('item-info onMount', status);
})

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
const delete_file = (event) => {
  let file_id = event.currentTarget.dataset.id;
  console.log('delete_file', file_id);
  let	new_file = [];
  for	( let i = 0; i < files.length; i += 1 )	{
    let file = files[i];
    if	( file.id == file_id )	{
      axios.delete('/api/item/file', {
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
const upload = (file) => {
  return new Promise((done, fail) => {
    console.log(file);
    let id = status.item.id;
    const body = new FormData();
    body.append('file', file);
    let url;
    if	( id )	{
      url = `/api/item/upload/${id}`;
    } else {
      url = `/api/item/upload`;
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

</script>
