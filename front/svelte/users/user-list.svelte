<div class="row full-height fontsize-12pt" style="overflow-y: scroll;">
	<div class="col-9">
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
						会計
					</th>
					<th scope="col">
						会計(閲覧)
					</th>
					<th scope="col">
						承認可能
					</th>
					<th scope="col">
						顧客管理
					</th>
					<th scope="col">
						在庫管理
					</th>
					<th scope="col">
						人事管理
					</th>
					<th scope="col">
						停止
					</th>
					<th scope="col">
						削除
					</th>
				</tr>
			</thead>
			<tbody>
				{#if data}
				{#each data as line, i}
				<tr class="fontsize-12pt"
						data-id={line.id}>
					<td>
						{line.name}
					</td>
					<td class="checkbox">
						<input type="checkbox" bind:checked={line.administrable}
							data-index={i}
							on:change={change}>
					</td>
					<td class="checkbox">
						<input type="checkbox" bind:checked={line.accounting}
							data-index={i}
							on:change={change}>
					</td>
					<td class="checkbox">
						<input type="checkbox" bind:checked={line.fiscalBrowsing}
							data-index={i}
							on:change={change}>
					</td>
					<td class="checkbox">
						<input type="checkbox" bind:checked={line.approvable}
							data-index={i}
							on:change={change}>
					</td>
					<td class="checkbox">
						<input type="checkbox" bind:checked={line.customerManagement}
							data-index={i}
							on:change={change}>
					</td>
					<td class="checkbox">
						<input type="checkbox" bind:checked={line.inventoryManagement}
							data-index={i}
							on:change={change}>
					</td>
					<td class="checkbox">
						<input type="checkbox" bind:checked={line.personnelManagement}
							data-index={i}
							on:change={change}>
					</td>
					<td class="checkbox">
						{#if ( line.id != 1) }
						{#if (( line.deauthorizedAt === null ) || line.deauthorize < new Date ())}
						<button type="button" class="btn btn-danger btn-sm"
								data-index={i}
								on:click={deauthorize}>
							停止
						</button>
						{:else}
						<button type="button" class="btn btn-primary btn-sm"
								data-index={i}
								on:click={deauthorize}>
							再開
						</button>
						{/if}
						{/if}
					</td>
					<td class="checkbox">
						{#if ( line.id != 1) }
						<button type="button" class="btn btn-danger btn-sm"
							data-index={i}
							on:click={remove}>
							<i class="fas fa-times"></i>
						</button>
						{/if}
					</td>
				</tr>
				{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>

<style>
th {
	text-align: center;
}
td.checkbox {
	width: 100px;
	text-align: center;
}
</style>

<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';

let	data;

const change = (event) => {
	let index = parseInt(event.currentTarget.dataset.index);
	let id = parseInt(event.currentTarget.parentNode.parentNode.dataset.id);
	//console.log('value', index, id, data[index]);
	axios.put(`/api/user/${id}`, data[index]).then((result) => {
		console.log('status', result.data.status);
		if	( result.data.code == 0 ) {
			axios.get(`/api/users/`).then((result) => {
				data = result.data;
			});
		} else {

		}
	})
}

const remove = (event) => {
	let index = parseInt(event.currentTarget.dataset.index);
	let id = parseInt(event.currentTarget.parentNode.parentNode.dataset.id);
	//console.log('value', index, id, data[index]);
	axios.delete(`/api/user/${id}`).then((result) => {
		console.log('status', result.data.status);
		if	( result.data.code == 0 ) {
			axios.get(`/api/users/`).then((result) => {
				data = result.data;
			});
		} else {

		}
	})
}

const deauthorize = (event) => {
	console.log('deauthorize');
	let index = parseInt(event.currentTarget.dataset.index);
	let id = parseInt(event.currentTarget.parentNode.parentNode.dataset.id);
	let at = ( data[index].deauthorizedAt === null ) ? new Date() : null;
	console.log('value', index, id, at);
	axios.put(`/api/user/${id}`, {
		deauthorizedAt: at
	}).then((result) => {
		console.log('status', result.data.code);
		if	( result.data.code == 0 ) {
			axios.get(`/api/users/`).then((result) => {
				data = result.data;
			});
		} else {

		}
	})
}

onMount(() => {
});
beforeUpdate(() => {
	if	( !data )	{
		axios.get(`/api/users/`).then((result) => {
			data = result.data;
		});
	}
});
</script>
