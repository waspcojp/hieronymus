<table class="table table-bordered">
  <thead class="table-light">
    <tr>
      <th scope="col" colspan="2">
        年月
      </th>
      <th scope="col">
        金額
      </th>
      <th scope="col">
        累計
      </th>
    </tr>
  </thead>
  <tbody>
    {#each lines as line, i}
    <tr>
      {#if line.month}
      <td style="width:50px;text-align:center;vertical-align:middle;">
        {#if (( i == 0 ) || ( lines[i-1].year !== lines[i].year ))}
        {line.year}
        {/if}
      </td>
      <td style="width:50px;text-align:center;vertical-align:middle;">
        {line.month}
      </td>
      {:else}
      <td style="text-align:center;" colspan="2">
        繰越金額
      </td>
      {/if}
      <td class="number">
        {#if line.month}
        <span>
          {line.pureAmount ? line.pureAmount.toLocaleString(): '0'}
          {#if ( line.taxClass === 1 )}
          <br/>
          ({line.pureTax ? line.pureTax.toLocaleString(): '0'})
          {/if}
        </span>
        {/if}
      </td>
      <td class="number" style="vertical-align:middle;">
        {line.pureBalance.toLocaleString()}
      </td>
    </tr>
    {/each}
  </tbody>
</table>
<style>
.fontsize-12pt {
	font-size: 12pt;
}
.application {
	padding: 0;
}
th {
	text-align: center;
}
</style>

<script>
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

export	let term;
export	let	account;
export	let lines = [];

</script>
