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
            <Accounts
                user={user}
                term ={term}
                bind:alert={alert}
                bind:alert_level={alert_level}></Accounts>
        </div>
    </div>
</main>
<footer
    class="main-footer">
    <CommonFooter></CommonFooter>
</footer>

<script>
import axios from 'axios';
import {onMount} from 'svelte';

import NavBar from '../common/nav.svelte';
import CommonFooter from '../common/footer.svelte';
import SideBar from '../common/sidebar.svelte';
import Alert from '../components/alert.svelte';
import Accounts from './accounts.svelte';

export let term;

let alert;
let alert_level;
let user = {};

onMount(() => {
    user = axios.get('/api/user').then((res) => {
        user = res.data;
    });
})

</script>