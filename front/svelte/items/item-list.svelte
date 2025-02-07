<div class="row full-height fontsize-12pt" style="overflow-y: scroll;">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th scope="col" style="width: 150px;">
          クラス
        </th>
        <th scope="col" style="width: 150px;">
          検索キー
        </th>
        <th scope="col" style="width: 150px;">
          サムネイル
        </th>
        <th scope="col" style="width: 150px;">
          商品名 / 公的コード
        </th>
        <th scope="col">
          規格
        </th>
        <th scope="col" style="width: 80px;">
          単位
        </th>
        <th scope="col" style="width: 110px;">
          単価
        </th>
      </tr>
      <tr>
        <th style="padding:5px;">
          <select class="form-select" id="itemClass"
            on:input={(event) => { dispatch('selectItemClass', event.currentTarget.value) }}
            bind:value={itemClassId}>
            <option value="-1">未設定</option>
            {#if classes}
            {#each classes as line}
            <option value={line.id}>{line.name}</option>
            {/each}
            {/if}
          </select>
        </th>
        <th style="padding:5px;">
          <input type="text" class="form-control"
            bind:value={key}
            on:input={() => { dispatch('keyInput', key)}}
          />
        </th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each items as line}
      <tr>
        <td>
          {line.itemClass.name}
        </td>
        <td>
          {line.key}
        </td>
        <td>
          {#if line.files && line.files.length > 0 }
          <a data-no={line.id} on:click={openItem} href="#">
            <img src="/item/file/{line.files[0].id}" style="width:180px;" alt="thumb">
          </a>
          {/if}
        </td>
        <td>
          <a data-no={line.id} on:click={openItem} href="#">
            {line.name}<br/>
            {line.globalCode}
          </a>
        </td>
        <td>
          {line.spec}
        </td>
        <td>
          {line.unit}
        </td>
        <td class="number">
          {numeric(line.standardPrice).toLocaleString()}<br/>
          {numeric(line.costPrice).toLocaleString()}
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
import {numeric} from '../../../libs/utils.js';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

export	let	items;
export  let classes;

let itemClassId;
let key = '';

beforeUpdate(() => {
  //console.log('item-list beforeUpdate');
});

const openItem = (event) => {
  event.preventDefault();
  let id = event.currentTarget.dataset.no;
  let	item;

  console.log('items', items);

  for ( let i = 0; i < items.length; i ++ ) {
    if ( items[i].id == id ) {
      item = items[i];
      break;
    }
  }
  dispatch('open', item);
}
</script>
