{#if ( state === 'list' )}
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
    classes={classes}
    on:selectItemClass={selectItemClass}
    on:keyInput={keyInput}
    on:open={openEntry}
    ></ItemList>
</div>
{:else if ( state === 'entry' || state === 'new' )}
  <ItemEntry
    classes={classes}
    bind:item={item}
    on:close={closeEntry}>
  </ItemEntry>
{/if}
<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import ItemEntry from './item-entry.svelte';
import ItemList from './item-list.svelte';

export let user;

let	item;
let items;
let current_params = new Map();
let state = 'list';
let classes;

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
      current_params, "", `${location.pathname}?${param}`);
  }
};

const	openEntry = (event)	=> {
  console.log('open', event.detail);
  item = event.detail;
  if ( !item.id )	{
    item = null;
    state = 'new';
    window.history.pushState(
      null, "", `/item/new`);
  } else {
    state = 'entry';
    window.history.pushState(
      null, "", `/item/entry/${item.id}`);
  }
  console.log('item', item)
};

const closeEntry = (event) => {
  console.log('close', event.detail);
  state = 'list';
  window.history.pushState(
      null, "", `/item/`);
  updateItems();
}

const checkPage = () => {
  let args = location.pathname.split('/');
  //console.log({args});
  if  (( !args[2] ) ||
       ( args[2] === '') ||
       ( args[2] === 'list' ))  {
    state = 'list';
  } else
  if  ( args[2] === 'entry' ) {
    state = 'entry';
    if  ( !item ) {
      axios(`/api/item/${args[3]}`).then((result) => {
        item = result.data;
        console.log({item});
      });
    }
  } else
  if  ( args[2] === 'new' ) {
    state = 'new';
  }
  //console.log({state});
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
    _params.split('&').map((item) => {
      let kv = item.split('=');
      params[decodeURI(kv[0])] = decodeURI(kv[1]);
    });
    console.log({params});
  }
  if  ( !classes )  {
    axios.get('/api/item/classes').then((result) => {
      console.log(result);
      classes = result.data;
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
