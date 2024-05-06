<div class="row full-height" style="overflow-y: scroll;">
	<table class="table table-bordered">
		<thead>
			<tr>
				<th scope="col" style="width: 100px;">
					勘定科目
				</th>
				<th scope="col" style="width: 100px;">
					繰越金額
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
			{#each lines as line, index }
			<tr>
				<td>
					{#if (line.code)}
					<a href="/ledger/{term}/{line.code}">
						__ {line.name}
					</a>
					{:else}
					<span>{line.name}</span>
					{/if}
				</td>
				<td class="number">
					{line.pickup ? line.pickup.toLocaleString(): '0'}
				</td>
				<td class="number">
					{ !!line.debit ? line.debit.toLocaleString(): '0'}
				</td>
				<td class="number">
					{ !!line.credit ? line.credit.toLocaleString() : '0'}
				</td>
				<td class="number">
					{line.balance ? line.balance.toLocaleString(): '0'}
				</td>
			</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
th {
	text-align: center;
}
</style>
<script>

export	let term;
export	let	lines;

</script>
