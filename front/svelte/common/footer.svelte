<div class="container">
  <div class="d-flex justify-content-between">
    <div>
      <strong>Copyright &copy; 2020-2024 <a href="https://www.wasp.co.jp/">WASP Co LTD</a>.</strong><br/>
      <strong>Copyright &copy; 2024 <a href="https://www.beesnest-inc.com/">BeesNest LLC</a>.</strong>
       All rights reserved.</div>
    <div>ver {version}</div>
  </div>
</div>
<script>
  import axios from 'axios';
  import {onMount} from 'svelte';

  let version = "";

  onMount(async () => {
    const result = await axios.get('/api/version');
    if ( result.data ){
      version = result.data.version;
    }
  })
</script>