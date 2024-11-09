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
    <div class="container-fluid" id="home">
      <Home
        user={user}
        term ={term}
        bind:toast={toast}></Home>
      </div>
  </div>
</main>
<footer
    class="main-footer">
    <CommonFooter></CommonFooter>
</footer>
<Toast bind:this={toast}/>

<script>
import axios from 'axios';
import {onMount} from 'svelte';

import NavBar from '../common/nav.svelte';
import CommonFooter from '../common/footer.svelte';
import SideBar from '../common/sidebar.svelte';
import Home from './home.svelte';
import Toast from '../common/toast.svelte';

export let term;

let toast;
let toast_dialog;
let user = {};

onMount(() => {
  user = axios.get('/api/user').then((res) => {
    user = res.data;
  });
})

</script>