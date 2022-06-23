<div class="row full-height fontsize-12pt" style="overflow-y: scroll;">
	<table class="table table-bordered">
		<thead>
			<tr>
				<th scope="col">
					名前
				</th>
				<th scope="col" style="width: 100px;">
					郵便番号
				</th>
				<th scope="col" style="width: 500px;">
					住所
				</th>
				<th scope="col" style="width: 120px;">
					電話番号
				</th>
				<th scope="col" style="width: 200px;">
					E-mail
				</th>
				<th scope="col" style="width: 200px;">
					担当者名
				</th>
			</tr>
		</thead>
		<tbody>
			{#await get then result}
			{#each result.data as line}
			<tr class="fontsize-12pt">
				<td>
					<a href="#" on:click={openCustomer} data-no={line.id}>
						{line.name}
					</a>
				</td>
				<td>
					{line.zip}
				</td>
				<td>
					{line.address1}<br/>
					{line.address2}
				</td>
				<td>
					{line.telNo}
				</td>
				<td>
					{line.email}
				</td>
				<td>
					{line.chargeName}
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
const dispatch = createEventDispatcher();

export	let	update;

let	get;
let customers;


const openCustomer = (event) => {
    event.preventDefault();
	let	customer;
	let id = event.target.dataset.no;

	console.log('openCustomer', id);
	console.log('customers', customers);

	for ( let i = 0; i < customers.length; i ++ ) {
		if ( customers[i].id == id ) {
			customer = customers[i];
			break;
		}
	}
	dispatch('open', customer);
}

onMount(() => {

});
beforeUpdate(() => {
	if	(	( !customers )
		||	( update ) )	{
		get = axios.get(`/api/customer/`);
		get.then((result) => {
			customers = result.data;
		})
	}
});
</script>
