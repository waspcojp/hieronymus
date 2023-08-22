{#if ( current === 'login') }
    <Login
        bind:current={current}></Login>
{:else if ( current === 'signup' ) }
    <SignUp
        bind:current={current}></SignUp>
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
            user={user}
            term={term}></SideBar>
    </aside>
    <main class="content-wrapper">
        <div class="content">
            <div class="container-fluid">
                <Alert bind:alert={alert} {alert_level}></Alert>
                {#if ( current == 'users' )}
                <Users></Users>
                {:else if ( current == 'invoices' )}
                <Invoices
                    term={term}></Invoices>
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

export let term;

let alert;
let alert_level;
let user ={};
let current = 'login';

onMount(() => {
    user = axios.get('/api/user').then((res) => {
                console.log('user', res);
                user = res.data;
            });
})

beforeUpdate(() => {
	let args = location.pathname.split('/');
    current = args[1];
})

</script>