<div class="table-responsive">
	<table class="table table-bordered">
		<thead class="table-light">
			<tr>
				<th scope="col" colspan="2">
					日付 / 伝番
				</th>
				<th scope="col" style="width: 100px;">
					借方金額
				</th>
				<th scope="col" style="width: 150px;">
					借方科目<br/>補助科目
				</th>
				<th scope="col">
					適用
				</th>
				<th scope="col" style="width: 150px;">
					貸方科目<br/>補助科目
				</th>
				<th scope="col" style="width: 100px;">
					貸方金額
				</th>
			</tr>
		</thead>
		<tbody>
			{#each lines as line}
			<tr>
				<td style="width:50px;text-align:center;">
					{line.month}/{line.day}
				</td>
				<td class="number" style="width:50px;">
					<a href="#" data-no={line.no} on:click={openSlip}>
						{line.no}
					</a>
				</td>
				<td class="number">
					{line.debitAmount}<br/>
					{line.debitTax}
				</td>
				<td>
					{line.debitAccount}<br/>
					{line.debitSubAccount}
				</td>
				<td>
					<div class="appication">
						{line.application1}
					</div>
					<div class="appication">
						{line.application2}
					</div>
					<div class="application">
						{#if (line.debitVoucher )}
						{#each line.debitVoucher.files as file}
						<a href="/voucher/file/{file.id}" target="_blank">
							<i class="fas fa-file"></i>
						</a>
						{/each}
						{/if}
						{#if (line.creditVoucher )}
						{#each line.creditVoucher.files as file}
						<a href="/voucher/file/{file.id}" target="_blank">
							<i class="fas fa-file"></i>
						</a>
						{/each}
						{/if}
					</div>
				</td>
				<td>
					{line.creditAccount}<br/>
					{line.creditSubAccount}
				</td>
				<td class="number">
					{line.creditAmount}<br/>
					{line.creditTax}
				</td>
			</tr>
			{/each}
			{#if sums }
			<tr>
				<td>
				</td>
				<td>
				</td>
				<td class="number">
					{sums.debitAmount.toLocaleString()}<br/>
					{sums.debitTax.toLocaleString()}
				</td>
				<td>
				</td>
				<td>
					合計
				</td>
				<td>
				</td>
				<td class="number">
					{sums.creditAmount.toLocaleString()}<br/>
					{sums.creditTax.toLocaleString()}
				</td>
			</tr>
			{/if}
		</tbody>
	</table>
</div>

<style>
th {
	text-align: center;
}
.application {
	padding: 0;
}
.file-item {
	height:20px;
	padding:0 5px;
}
.rect-image {
	width:20px;
	clip:rect(0,20px,20px,0);
}
</style>

<script>
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

export	let accounts;
export	let year;
export	let month;

export	let	lines;
export	let sums;
export	let	slips;

let slip;

const openSlip = (event) => {
    event.preventDefault();
	let no = event.target.dataset.no;

	console.log('openSlip', no, slips);

	for ( let i = 0; i < slips.length; i ++ ) {
		if ( slips[i].no == no ) {
			slip = slips[i];
			break;
		}
	}

	console.log('slip', slip);
	dispatch('open', slip);
}
</script>
