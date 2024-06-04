<div class="card">
	<div class="card-header">
		<h3 class="card-title">年度選択</h3>
	</div>
    <div class="card-body">
	    <div class="row full-height" style="overflow-y: scroll;">
		    <table class="table table-bordered">
          <thead>
            <th scol="col">
              年度
            </th>
            <th col="col">
              開始年月日
            </th>
            <th col="col">
              終了年月日
            </th>
            <th col="col">
              税込み会計
            </th>
            <th col="col">
              年度末処理
            </th>
          </thead>
          <tbody>
            {#each lines as line}
            <tr>
              <td>
                {#if ( line.term != term)}
                <a href="/home/{line.term}">
                  {line.term}期
                </a>
                {:else}
                <span>
                  <i class="fas fa-check"></i>
                  {line.term}期
                </span>
                {/if}
              </td>
              <td>
                {line.startDate.getFullYear()}年({wareki(line.startDate)})
                {line.startDate.getMonth()+1}月
                {line.startDate.getDate()}日
              </td>
              <td>
                {line.endDate.getFullYear()}年({wareki(line.endDate)})
                {line.endDate.getMonth()+1}月
                {line.endDate.getDate()}日
              </td>
              <td>
                <input type="checkbox" bind:checked={line.taxIncluded}
                  on:change={() => change(line)}>
              </td>
              <td>
                {#if ( user && user.administrable )}
                <a class="btn btn-danger closing" href="/forms/closing/{line.term}">
                  繰越
                </a>
                {/if}
              </td>
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
</div>

<style>
th {
	text-align: center;
	font-weight: bold;
}
td {
    vertical-align: middle;
}
</style>
<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import {wareki} from '../../../libs/utils';

export  let term;
export  let user;

let lines;

const change = (line) => {
  console.log('change', line)
  axios.put(`/api/term/${line.id}`, line).then((result) => {
    lines = undefined;
  })
}

beforeUpdate(() => {
    if  ( !lines )  {
        lines = [];
        axios.get('/api/term').then((res) => {
            let data = res.data;
            for ( let i = 0; i < data.length; i ++ )    {
                let line = data[i];
                lines.push({
                    id: line.id,
                    term: line.term,
                    startDate: new Date(line.startDate),
                    endDate: new Date(line.endDate),
                    taxIncluded: line.taxIncluded
                });
            }
            lines = lines;
            console.log(lines);
        });
    }
});
</script>
