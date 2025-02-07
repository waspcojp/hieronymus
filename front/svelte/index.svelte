{#if ( status.current === 'login') }
<Login
  bind:current={status.current}></Login>
{:else if ( status.current === 'signup' ) }
<SignUp
  bind:current={status.current}></SignUp>
{:else}
<div class="wrapper">
  <nav class="main-header navbar navbar-expand-lg navbar-light bg-light p-3">
    <NavBar
      term={term}
      user={user.name}></NavBar>
  </nav>
  <aside 
    class="main-sidebar sidebar-bg-dark sidebar-color-primary shadow">
    <SideBar
    	status={status}
      user={user}
      term={term}></SideBar>
  </aside>
  <main class="content-wrapper">
    <div class="content">
      <div class="container-fluid">
        <Alert bind:alert={alert} {alert_level}></Alert>
        {#if ( status.current == 'users' )}
        <Users></Users>
        {:else if ( status.current === 'invoices' || status.current === 'invoice')}
        <Invoices
          bind:status={status}></Invoices>
        {:else if ( status.current === 'items' || status.current === 'item')}
        <Items
        	bind:status={status}
          user={user}></Items>
        {:else if ( status.current === 'members' || status.current === 'member')}
        <Member></Member>
        {:else if ( status.current === 'tasks' || status.current === 'task')}
        <Task
        	bind:status={status}></Task>
        {/if}
      </div>
    </div>
  </main>
  <footer
    class="main-footer">
    <CommonFooter></CommonFooter>
  </footer>
</div>
{/if}
<script>
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import axios from 'axios';

import NavBar from './common/nav.svelte';
import CommonFooter from './common/footer.svelte';
import SideBar from './common/sidebar.svelte';
import Alert from './components/alert.svelte';
import Login from './login/login.svelte';
import SignUp from './login/signup.svelte';
import Users from './users/users.svelte';
import Invoices from './invoice/invoice.svelte';
import Items from './items/item.svelte';
import Member from './member/member.svelte';
import Task from './task/task.svelte';

export let term;

let alert;
let alert_level;
let user ={};

let status = {
  term: term,
  current: 'login'
}

onMount(() => {
  user = axios.get('/api/user').then((res) => {
    user = res.data;
  });
	window.onpopstate = (event) => {
    console.log('maybe back', event);
    let args = location.pathname.split('/');
    status.current = args[1];
	}
})

beforeUpdate(() => {
  let args = location.pathname.split('/');
  status.current = args[1];
})

</script>