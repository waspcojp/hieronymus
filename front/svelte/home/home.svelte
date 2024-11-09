<div class="row">
  <div class="col-7" style="padding:10px;">
    {#if ( user ) }
    <SelectTerm
        term={term}
        user={user}>
    </SelectTerm>
    {/if}
  </div>
  <div class="col-3" style="padding:10px;">
    {#if ( user && ( user.accounting || user.fiscal_browsing ) ) }
    <FormPrint
        term={term}>
    </FormPrint>
    {/if}
  </div>
</div>
<div class="row">
  <div class="col-6" style="padding:10px;">
    <Approve
      term={term}
      user={user}
      bind:toast={toast} />
  </div>
</div>
<div class="row">
  <div class="col-6" style="padding:10px;">
    <Password
      bind:toast={toast}></Password>
  </div>
  {#if ( user &&  user.administrable) }
    <div class="col-4" style="padding:10px;">
      <Backup bind:toast={toast}/>
    </div>
  {/if}
</div>
<script>

import  FormPrint from './form-print.svelte';
import  SelectTerm from './term.svelte';
import Password from './password.svelte';
import Backup from './backup.svelte';
import Approve from './approve.svelte';

export	let	term;
export  let toast;
export  let alert;
export  let alert_level;
export  let user;

</script>
    