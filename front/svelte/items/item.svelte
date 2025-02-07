{#if ( status.state === 'list' )}
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <span class="navbar-brand">品目一覧</span>
    <ul class="navbar-nav me-auto mb-2">
      <li class="nav-item">
        <button type="button" class="btn btn-primary"
          on:click={openEntry}
          id="item-info">品目入力&nbsp;<i class="bi bi-pencil-square"></i></button>
      </li>
    </ul>
  </div> 
</nav>
<div class="row body-height">
  <ItemList
    items={items}
    bind:status={status}
    on:selectItemClass={selectItemClass}
    on:keyInput={keyInput}
    on:open={openEntry}
    ></ItemList>
</div>
{:else if ( status.state === 'entry' || status.state === 'new' )}
  <ItemEntry
    bind:status={status}
    on:close={closeEntry}>
  </ItemEntry>
{/if}
<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import ItemEntry from './item-entry.svelte';
import ItemList from './item-list.svelte';

export let user;
export let status;

let items;
let current_params = new Map();

const selectItemClass = (event) => {
  updateItems({
    itemClassId: event.detail
  });
}

const keyInput = (event) => {
  let key = event.detail;
  updateItems({
    key: key
  });
}

const updateItems = (_params) => {
  if	( _params )	{
    Object.keys(_params).map((key) => {
      if	( !_params[key] )	{
        current_params.delete(key);
      } else {
        current_params.set(key,_params[key]);
      }
    });
  }
  //console.log('current_params', current_params);
  let _array = [];
  current_params.forEach((value, key) => {
    console.log('key, value', key, value);
    _array.push(encodeURI(`${key}=${value}`));
  });
  let param = _array.join('&');
  console.log('param', param);
  axios.get(`/api/item?${param}`).then((result) => {
    items = result.data;
    console.log('items', items);
  });
  if	( _params )	{
    window.history.pushState(
      status, "", `${location.pathname}?${param}`);
  }
};

const	openEntry = (event)	=> {
  console.log('open', event.detail);
  status.item = event.detail;
  if ( !status.item.id )	{
    status.item = null;
    status.state = 'new';
    window.history.pushState(
      status, "", `/item/new`);
  } else {
    status.state = 'entry';
    window.history.pushState(
      status, "", `/item/entry/${status.item.id}`);
  }
  console.log({status})
};

const closeEntry = (event) => {
  console.log('close', event.detail);
  status.state = 'list';
  window.history.pushState(
      status, "", `/item/`);
  updateItems();
}

const checkPage = () => {
  let args = location.pathname.split('/');
  //console.log({args});
  if  (( !args[2] ) ||
       ( args[2] === '') ||
       ( args[2] === 'list' ))  {
    status.state = 'list';
  } else
  if  ( args[2] === 'entry' ) {
    status.state = 'entry';
    if  ( !status.item ) {
      axios(`/api/item/${args[3]}`).then((result) => {
        status.item = result.data;
        console.log({status});
      });
    }
  } else
  if  ( args[2] === 'new' ) {
    status.state = 'new';
  }
  //console.log({status});
}

onMount(() => {
  checkPage();
  console.log('item onMount')
})

beforeUpdate(()	=> {
  //console.log('item beforeUpdate');
  //checkPage();
  let _params = location.search.substr(1);
  //console.log('_params', _params);
  let params = [];
  if  ( _params )	{
    _params.split('&').map((_item) => {
      let kv = _item.split('=');
      params[decodeURI(kv[0])] = decodeURI(kv[1]);
    });
    console.log({params});
  }
  if  ( !status.classes )  {
    axios.get('/api/item/classes').then((result) => {
      console.log(result);
      status.classes = result.data;
    })
  }
  if	( !items )	{
    items = [];
    updateItems();
  }
});
afterUpdate(() => {
  //console.log('item afterUpdate');
})
</script>
