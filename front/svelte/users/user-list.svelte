<div class="row full-height fontsize-12pt" style="overflow-y: scroll;">
	<table class="table table-bordered">
		<thead>
			<tr>
				<th scope="col">
					名前
				</th>
				<th scope="col">
					管理者
				</th>
				<th scope="col">
					承認可能
				</th>
				<th scope="col">
					在庫管理
				</th>
			</tr>
		</thead>
		<tbody>
			{#await get then result}
			{#each result.data as line}
			<tr class="fontsize-12pt">
				<td>
					<a href="#" data-no={line.id}>
						{line.name}
					</a>
				</td>
				<td>
					{line.administrable}
				</td>
				<td>
					{line.approvable}
				</td>
				<td>
					{line.inventory}
				</td>
			</tr>
			{/each}
			{/await}
		</tbody>
	</table>
</div>

<style>
th {
	text-align: center;
}
</style>

<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';

export	let	update;

let	get;

onMount(() => {

});
beforeUpdate(() => {
	get = axios.get(`/api/users/`);
});
</script>
