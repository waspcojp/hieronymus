{#if ( state === 'list' )}
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <span class="navbar-brand">役職員一覧</span>
    <ul class="navbar-nav me-auto mb-2">
      <li class="nav-member">
        <button type="button" class="btn btn-primary"
          on:click={openEntry}
          id="member-info">役職員入力&nbsp;<i class="bi bi-pencil-square"></i></button>
      </li>
    </ul>
  </div> 
</nav>
<div class="row body-height">
  <MemberList
    members={members}
    classes={classes}
    on:selectClass={selectClass}
    on:open={openEntry}
    ></MemberList>
</div>
{:else if ( state === 'entry' || state === 'new' )}
  <MemberEntry
    classes={classes}
    users={users}
    bind:member={member}
    on:close={closeEntry}>
  </MemberEntry>
{/if}
<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import MemberEntry from './member-entry.svelte';
import MemberList from './member-list.svelte';

let	member;
let members;
let users;
let current_params = new Map();
let state = 'list';
let classes;

const selectClass = (event) => {
  update({
    memberClassId: event.detail
  });
}

const update = (_params) => {
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
  axios.get(`/api/member?${param}`).then((result) => {
    members = result.data;
    console.log('members', members);
  });
  if	( _params )	{
    window.history.pushState(
      current_params, "", `${location.pathname}?${param}`);
  }
}

const	openEntry = (event)	=> {
  console.log('open', event.detail);
  member = event.detail;
  if ( !member.id )	{
    member = {
      userId: 0,
      officialSex: 0,
      resignReason: 0,
      accountType: 0
    };
    state = 'new';
    window.history.pushState(
      null, "", `/member/new`);
  } else {
    state = 'entry';
    window.history.pushState(
      null, "", `/member/entry/${member.id}`);
  }
  console.log('member', member)
};

const closeEntry = (event) => {
  console.log('close', event.detail);
  state = 'list';
  window.history.pushState(
      null, "", `/member/`);
  update();
}

const checkPage = () => {
  let args = location.pathname.split('/');
  console.log({args});
  if  (( !args[2] ) ||
       ( args[2] === '') ||
       ( args[2] === 'list' ))  {
    state = 'list';
  } else
  if  ( args[2] === 'entry' ) {
    state = 'entry';
    if  ( !member ) {
      axios(`/api/member/${args[3]}`).then((result) => {
        member = result.data;
        console.log({member});
      });
    }
  } else
  if  ( args[2] === 'new' ) {
    state = 'new';
  }
  console.log({state});
}

onMount(() => {
  checkPage();
  console.log('member onMount')
})

beforeUpdate(()	=> {
  //console.log('member beforeUpdate');
  //checkPage();
  let _params = location.search.substr(1);
  //console.log('_params', _params);
  let params = [];
  if  ( _params )	{
    _params.split('&').map((member) => {
      let kv = member.split('=');
      params[decodeURI(kv[0])] = decodeURI(kv[1]);
    });
    console.log({params});
  }
  if  ( !classes )  {
    axios.get('/api/member/classes').then((result) => {
      console.log(result);
      classes = result.data;
    })
  }
  if  ( !users )  {
    axios.get('/api/users').then((result) => {
      users = result.data;
    })
  }
  if	( !members )	{
    members = [];
    update();
  }
});
afterUpdate(() => {
  //console.log('member afterUpdate');
})
</script>
