<div class="row">
    <div class="col-5" style="padding:10px;">
        <SelectTerm
            term={term}>
        </SelectTerm>
    </div>
    <div class="col-3" style="padding:10px;">
        <FormPrint
            term={term}>
        </FormPrint>
    </div>
</div>

<script>

import  FormPrint from './form-print.svelte';
import  SelectTerm from './term.svelte';

export	let	term;
</script>
    