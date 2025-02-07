<input type="text" class="number"
    on:input={onInput}
    value={_value}
    size={size}>

<script>
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();
import {numeric} from '../../../libs/utils.js';
/*
    on:focusout={focusout}
    on:focusin={focusin}
*/
export  let value;
export  let size = "24"

let _value;
beforeUpdate(() => {
    _value = numeric(value).toLocaleString();
    console.log('InputNumber', value);
});

const   onInput = (event) => {
    let target = event.currentTarget;
    console.log('target.value', target.value);
    value = numeric(target.value);
    console.log({value});
    target.value = value.toLocaleString();
}

</script>