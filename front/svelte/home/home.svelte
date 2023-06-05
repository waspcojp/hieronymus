<div class="row">
    <div class="col-6" style="padding:10px;">
        {#if ( user && ( user.accounting || user.fiscal_browsing ) ) }
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
        <Password
            bind:alert={alert}
            bind:alert_level={alert_level}></Password>
    </div>
</div>

<script>

import  FormPrint from './form-print.svelte';
import  SelectTerm from './term.svelte';
import Password from './password.svelte';

export	let	term;
export  let alert;
export  let alert_level;
export  let user;

</script>
    