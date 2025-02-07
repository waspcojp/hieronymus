<div class="entry">
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <h5 class="entry-title">品目情報</h5>
    </div> 
  </nav>
  <div class="row full-height fontsize-12pt">
    <div class="entry-content">
      <div class="entry-body">
        <ItemInfo
          bind:files={files}
          bind:status={status} />
      </div>
      <div class="entry-footer">
        <button type="button" class="btn btn-secondary" disabled={disabled}
          on:click={back}>もどる</button>
        {#if ( status.item && status.item.id && status.item.id > 0 )}
        <button type="button" class="btn btn-danger" disabled={disabled}
          on:click={delete_}
          id="delete-button">削除</button>
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
import ItemInfo from './item-info.svelte';

export  let status;

let disabled = false;
let update;
let files;

onMount(() => {
  console.log('item-entry onMount', status);
})

const create_item = async (_item) => {
  let result = await axios.post('/api/item', _item);
  console.log('create', result);
  return	(result);
}
const update_item = async (_item) => {
  console.log('save_item', _item);
  let result = await axios.put('/api/item', _item);
     
  console.log(result);
  return	(result);
}
const delete_item = async (_item) => {
  console.log('delete_item', _item);
  let result = await axios.delete('/api/item', {
    data: {
      id: _item.id
    }
  });
  console.log(result);
}
const bind_file = async(file) => {
  console.log('bind_file', file.id, file.itemId);
  let	result = await axios.put('/api/item/bind', {
    id: file.id,
    itemId: file.itemId
  });
  return	(result);
}
const save = () => {
  let item = status.item;
  console.log('item', item);
  if	( item.itemClassId )	{
    item.itemClassId = parseInt(item.itemClassId);
  }
  if	( item.standardPrice )	{
    item.standardPrice = numeric(item.standardPrice);
  }
  if	( item.costPrice )	{
    item.costPrice = numeric(item.costPrice);
  }
  item.taxClass = parseInt(item.taxClass);
  item.files = undefined;
  console.log('input', item);
  try {
    let	it;
    let create = false;
    if ( item.id  ) {
      item.id = parseInt(item.id);
      it = update_item(item);
    } else {
      it = create_item(item);
      create = true;
    }
    it.then((result) => {
      update = true;
      //console.log('result', result);
      item = result.data;
      if  ( files && files.length > 0 ) {
        console.log('files', files.length);
        for	( let i = 0; i < files.length ; i += 1 )	{
          console.log('itemId', files[i].itemId);
          if	( !files[i].itemId )	{
            files[i].itemId = result.data.id;
            bind_file(files[i]);
          }
        }
      }
      //console.log({create});
      if  ( create )  {
        status.item = item;
        window.history.pushState(
          status, "", `/item/entry/${item.id}`);
      }
    });
  }
  catch(e) {
    console.log(e);
    // can't save
    //	TODO alert
  }
};


const clean = () => {
  status.item = null;
  files = null;
}

const	back = (event) => {
  clean();
  dispatch('close', update);
}

beforeUpdate(() => {
  //console.log('item-entry beforeUpdate', item);
  update = false;
  if	( !status.item )	{
    status.item = {
      name: '',
      normalName: '',
      key: '',
      globalCode: '',
      storageCode: '',
      localCode: '',
      spec: '',
      unit: '',
      standardPrice: 0,
      costPrice: 0,
      taxClass: 2,
      descriptionType: 'markdown',
      description: ''
    };
  } else {
    if  ( !files && status.item.id )  {
		  axios.get(`/api/item/files/${status.item.id}`).then((result) => {
			  files = result.data;
		  })
    }
  }
});

const	delete_ = (event) => {
  try {
    console.log('delete');
    delete_item(item).then(() => {
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
