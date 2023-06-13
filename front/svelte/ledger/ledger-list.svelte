<div class="row full-height" style="overflow-y: scroll;">
	<table class="table table-bordered">
		<thead>
			<tr>
				<th scope="col" colspan="2">
					日付 / 伝番
				</th>
				<th scope="col" style="width: 150px;">
					相手勘定科目<br/>相手補助科目
				</th>
				<th scope="col" style="width: 300px;">
					適用<br/>補助科目
				</th>
				<th scope="col" style="width: 100px;">
					借方金額
				</th>
				<th scope="col" style="width: 100px;">
					貸方金額
				</th>
				<th scope="col" style="width: 100px;">
					残高
				</th>
			</tr>
		</thead>
		<tbody>
			{#if ( pickup )}
			<tr style="height:12px;">
				<td>
				</td>
				<td>
				</td>
				<td>
				</td>
				<td>
					繰越金額
				</td>
				<td class="number">
				</td>
				<td class="number">
				</td>
				<td class="number">
					{pickup.balance.toLocaleString()}
				</td>
			</tr>
			{/if}
			{#each lines as line}
			<tr style="height:36px;">
				<td style="width:50px;text-align:center;">
					<a href="/journal/{line.year}/{line.month}">
						{line.month}/{line.day}
					</a>
				</td>
				<td style="width:50px;" class={'number ' + ( line.approvedAt ? 'bg-body' : 'bg-warning' )}>
					<a href="#" data-no={line.no} data-year={line.year} data-month={line.month}
							on:click={openSlip}>
						{line.no}
					</a>
				</td>
				<td>
					{line.otherAccount}<br/>
					{line.otherSubAccount}
				</td>
				<td>
					<div class="appication">
						{line.application1 ? line.application1 : ''}
					</div>
					<div class="appication">
						{line.application2 ? line.application2 : ''}
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
					{#if (line.subAccount)}
					<div class="application">
						<a href="/ledger/{term}/{account.accountCode}/{line.subAccountCode}">
							{line.subAccount}
						</a>
					</div>
					{/if}
				</td>
				<td class="number">
					{line.thisTaxClass}<br/>
					{#if (line.showDebit)}
					<span>
						{line.pureDebitAmount ? line.pureDebitAmount.toLocaleString(): ''}<br/>
						{line.pureDeitTax ? line.pureDebitTax.toLocaleStrine(): ''}
					</span>
					{/if}
				</td>
				<td class="number">
					{line.otherTaxClass}<br/>
					{#if (line.showCredit)}
					<span>
						{line.pureCreditAmount ? line.pureCreditAmount.toLocaleString(): ''}<br/>
						{line.pureCreditTax ? line.pureCreditTax.toLocaleString() : ''}
					</span>
					{/if}
				</td>
				<td class="number">
					<br/><br/>
					{line.pureBalance.toLocaleString()}
				</td>
			</tr>
			{/each}
			{#if (sums)}
			<tr style="height:36px;">
				<td>
				</td>
				<td>
				</td>
				<td>
				</td>
				<td>
					合計
				</td>
				<td class="number">
					{sums.debitAmount.toLocaleString()}<br/>
					{sums.debitTax.toLocaleString()}
				</td>
				<td class="number">
					{sums.creditAmount.toLocaleString()}<br/>
					{sums.creditTax.toLocaleString()}
				</td>
				<td class="number">
					{sums.balance.toLocaleString()}
				</td>
			</tr>
			{/if}
		</tbody>
	</table>
</div>
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
export	let pickup;
export	let sums;
export	let lines = [];
		
const	openSlip = (event) => {
	event.preventDefault();
	let dataset = event.target.dataset;
	console.log('openSlip', dataset);
	dispatch('open', {
		year: dataset.year,
		month: dataset.month,
		no: dataset.no
	});
}
</script>
