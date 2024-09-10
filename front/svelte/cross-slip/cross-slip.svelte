<div class="container-fluid">
	<div class="row mb-2">
		<div class="col-5">
			<div class="input-group">
				<span class="input-group-text">{slip.year}年{slip.month}月</span>
				<input type="text" autocomplete="off" class="number" name="day" id="slip-day" size="2" maxlength="3"
						bind:value={slip.day}>
				<span class="input-group-text">日</span>
				{#if slip.no}
				<span class="input-group-text">No. {slip.no}</span>
				{/if}
			</div>
		</div>
		<div class="col">
			<div class="row">
				<div class="col-4 input-group-text">
					入力:
					{slip.createrName || ''}
				</div>
				<div class="col-8 input-group-text">
					承認:
					{slip.approverName || ''}
					{#if (slip.approvedAt)}
					({slip.approvedAt.getFullYear()}年
					{slip.approvedAt.getMonth()+1}月
					{slip.approvedAt.getDate()}日)
					{/if}
				</div>
			</div>
		</div>
</div>
	<div class="row">
		<table class="table table-striped table-bordered">
			<thead>
				<th scope="col">
					借方科目
				</th>
				<th scope="col">
					金額
				</th>
				<th scope="col">
					適用
				</th>
				<th scope="col">
					貸方科目
				</th>
				<th scope="col">
					金額
				</th>
				<th scope="col">
				</th>
			</thead>
			<tbody id="cross-slip">
				{#each slip.lines as line, i}
				<tr class=""
					on:drop|preventDefault={onDrop}
					on:dragenter|preventDefault={onDragEnter}
        			on:dragleave|preventDefault={onDragLeave}
					ondragover="return false"
					data-index={i}
					data-id={line.id}>
					<td>
						<Account accounts={accounts}
								bind:init={_init}
								bind:code={ line.debitAccount }
								bind:sub_code={ line.debitSubAccount }></Account>
					</td>
					<td class="number">
						<input type="text" class="number" autocomplete="off" size="12" maxlength="13"
							data-index={i}
							data-dc="d"
							bind:value={line.debitAmount}
							on:focusout={computeTax}>
						{#if find_tax_class(line.debitAccount, line.debitSubAccount) != 0}
						<input type="text" class="number" size="12" maxlength="13"
							bind:value={line.debitTax}
							on:focusout={makeTaxLine}>
						{/if}
					</td>
					<td>
						<input type="text" size="24" maxlength="25"
							bind:value={line.application1}>
						<input type="text" size="24" maxlength="25"
							bind:value={line.application2}>
					</td>
					<td>
						<Account accounts={accounts}
								bind:init={_init}
								bind:code={line.creditAccount}
								bind:sub_code={line.creditSubAccount}></Account>
					</td>
					<td class="number">
						<input type="text" class="number" autocomplete="off" size="12" maxlength="13"
							data-index={i}
							data-dc="c"
							bind:value={line.creditAmount}
							on:focusout={computeTax}>
						{#if find_tax_class(line.creditAccount, line.creditSubAccount) != 0}
						<input type="text" class="number" autocomplete="off" size="12" maxlength="13"
							bind:value={line.creditTax}
							on:focusout={makeTaxLine}>
						{/if}
					</td>
					<td style="width:125px;">
						<button type="button" class="btn btn-primary btn-sm"
							data-index={i}
							on:click={computeSumAndNext}>
							<i class="fas fa-plus"></i>
						</button>
						{#if ( slip.lines.length > 1 )}
						<button type="button" class="btn btn-danger btn-sm"
							data-index={i}
							on:click={computeSumAndDelete}>
							<i class="fas fa-minus"></i>
						</button>
						{/if}
						{#if ( ( line.debitVoucherId ) || ( line.creditVoucherId ))}
						<button type="button" class="btn btn-warning btn-sm"
							data-index={i}
							on:click={unbindVoucher}>
							<i class="fas fa-link-slash"></i>
						</button>
						{/if}
					</td>
				</tr>
				{/each}
				<tr>
					<td>
					</td>
					<td class="number">
						{ sums.debit_amount ? sums.debit_amount.toLocaleString() : ''}<br />
						{ sums.debit_tax ? sums.debit_tax.toLocaleString() : ''}
					</td>
					<td>
						合計
					</td>
					<td>
					</td>
					<td class="number">
						{ sums.credit_amount ? sums.credit_amount.toLocaleString() : ''}<br />
						{ sums.credit_tax ? sums.credit_tax.toLocaleString() : ''}
					</td>
					<td>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<style>
</style>

<script>
import axios from 'axios';
import {numeric, salesTax, find_tax_class} from '../../javascripts/cross-slip';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import Account from './account.svelte';
import {field} from '../../../libs/parse_account_code';

export let accounts;
export let slip;
export let init;
export let fy;

let	sums;
let _init;

const computeSum = () => {
	//console.log('computeSum');
	let debit_amount = 0;
	let	debit_tax = 0;
	let	credit_amount = 0;
	let	credit_tax = 0;
		 
	for ( let i = 0; i < slip.lines.length ; i ++ ) {
		debit_amount += numeric(slip.lines[i].debitAmount);
		debit_tax += numeric(slip.lines[i].debitTax);
		credit_amount += numeric(slip.lines[i].creditAmount);
		credit_tax += numeric(slip.lines[i].creditTax);
	}
	return	({
		debit_amount: debit_amount,
		debit_tax: debit_tax,
		credit_amount: credit_amount,
		credit_tax: credit_tax
	});
}
const updateAccount = (slip) => {
	_init = [];
	for	( let i = 0; i < slip.lines.length; i ++ )	{
		_init.push(false);
	}
}

const computeTax = (event) => {
  let index = event.currentTarget.dataset.index;
	let dc = event.currentTarget.dataset.dc;
	//console.log('index', index, dc);
	if	( dc == 'd' )	{
		if	( ( slip.lines[index].creditAccount ) &&
			    ( slip.lines[index].creditAccount.match(/^114|^308/) ) )	{
		} else {
			let tax_class = find_tax_class(slip.lines[index].debitAccount, slip.lines[index].debitSubAccount);
      if  ( fy.taxIncluded )  {
		    slip.lines[index].debitTax = 0;
      } else {
		    slip.lines[index].debitTax = salesTax(tax_class, slip.lines[index].debitAmount);
      }
	  }
  } else {
		if	( slip.lines[index].creditAmount == '=' )	{
			slip.lines[index].creditAmount = slip.lines[index].debitAmount;
		}
		if	( slip.lines[index].creditAmount == '-' )	{
      let sums = computeSum();
			slip.lines[index].creditAmount = sums.debit_amount - sums.credit_amount;
		}
		if	( ( slip.lines[index].debitAccount ) &&
			    ( slip.lines[index].debitAccount.match(/^114|^308/) )	)	{
  	} else {
			let tax_class = find_tax_class(slip.lines[index].creditAccount, slip.lines[index].creditSubAccount);
      if  ( fy.taxIncluded )  {
		    slip.lines[index].creditTax = 0;
      } else {
		    slip.lines[index].creditTax = salesTax(tax_class, slip.lines[index].creditAmount);
      }
		}
	}
  slip = slip;
}
const makeTaxLine = (event) => {
	if	( !fy.taxIncluded )	{
		for ( let i = 0; i < slip.lines.length ; i ++ ) {
			if	( ( ( slip.lines[i].creditAccount ) &&
				    ( slip.lines[i].creditAccount.match(/^114|^308/) ) ) ||
				  ( ( slip.lines[i].debitAccount ) &&
				    ( slip.lines[i].debitAccount.match(/^114|^308/) ) ) )	{
				slip.lines[i].creditAmount = 0;
				slip.lines[i].debitAmount = 0;
				slip.lines[i].creditTax = 0;
				slip.lines[i].debitTax = 0;
			}
		}
		for ( let i = 0; i < slip.lines.length ; i ++ ) {
			if	( slip.lines[i].debitTax > 0 )	{
				let debit = ( field(slip.lines[i].debitAccount) == '6' ) ? '3080000' : (
						 	( field(slip.lines[i].debitAccount) == '7' ) ? '1140000' : undefined );
			  let gap;
			  for	( let j = i + 1;  j < slip.lines.length ; j += 1 )	{
				  let line = slip.lines[j];
				  if	( ( line.debitAccount == debit ) &&
					      ( line.creditAccount == slip.lines[i].debitAccount ) &&
				  	    ( line.creditSubAccount == slip.lines[i].debitSubAccount ) )	{
					  gap = j;
				  }
			  }
			  if	( !gap )	{
				  gap = slip.lines.length;
				  slip.lines.push({
					  debitAmount: 0,
					  debitTax: 0,
					  creditAmount: 0,
					  creditTax: 0
				  });
			  }
			  slip.lines[gap].debitAccount = debit;
			  slip.lines[gap].debitAmount += numeric(slip.lines[i].debitTax);
			  let tax_class = find_tax_class(slip.lines[i].debitAccount,
  										                 slip.lines[i].debitSubAccount);
	  		if	( tax_class !== 2 ) {
		  	  slip.lines[gap].creditAccount = slip.lines[i].debitAccount;
			    slip.lines[gap].creditSubAccount = slip.lines[i].debitSubAccount;
  			  slip.lines[gap].creditAmount += numeric(slip.lines[i].debitTax);
        }
		  	updateAccount(slip);
		  }
  		if	( slip.lines[i].creditTax > 0 )	{
	  		let credit = ( field(slip.lines[i].creditAccount) == '6' ) ? '3080000' : (
		  				 ( field(slip.lines[i].creditAccount) == '7' ) ? '1140000' : undefined );
  			let gap;
	  		for	( let j = i + 1; j < slip.lines.length ; j += 1 )	{
		  		let line = slip.lines[j];
  				if	( ( line.creditAccount == credit ) &&
	    				  ( line.debitAccount == slip.lines[i].creditAccount ) &&
			  	  	  ( line.debitSubAccount == slip.lines[i].creditSubAccount ) )	{
					  gap = j;
				  }
			  }
  			if	( !gap )	{
	  			gap = slip.lines.length;
		  		slip.lines.push({
  					debitAmount: 0,
  					debitTax: 0,
	  				creditAmount: 0,
		  			creditTax: 0
  				});
	  		}
		  	slip.lines[gap].creditAccount = credit;
  			slip.lines[gap].creditAmount += numeric(slip.lines[i].creditTax);
	  		let tax_class = find_tax_class(slip.lines[i].creditAccount,
		  								                 slip.lines[i].creditSubAccount);
			  if	( tax_class !== 2 ) {
  			  slip.lines[gap].debitAccount = slip.lines[i].creditAccount;
	  		  slip.lines[gap].debitSubAccount = slip.lines[i].creditSubAccount;
		  	  slip.lines[gap].debitAmount += numeric(slip.lines[i].creditTax);
        }
  			updateAccount(slip);
		  }
	  }
  }
}
const computeSumAndNext = (event) => {
	//console.log('computeSumAndNext');
	let index = parseInt(event.currentTarget.dataset.index);

	computeSum();
	//console.log(index, slip.lines.length);
	slip.lines.splice(index + 1, 0, {});
	updateAccount(slip);
	slip = slip;
}
const computeSumAndDelete = (event) => {
	//console.log('computeSumAndNext');
	let index = parseInt(event.currentTarget.dataset.index);

	//console.log(index, slip.lines.length);
	slip.lines.splice(index, 1);
	computeSum();
	updateAccount(slip);
	slip = slip;
}

const unbindVoucher = (event) => {
	let i = parseInt(event.currentTarget.dataset.index);
	slip.lines[i].debitVoucherId = undefined;
	slip.lines[i].creditVoucherId = undefined;
	slip = slip;
}
const bindVoucher = (i, voucher_id) => {
	axios.get(`/api/voucher/${voucher_id}`).then((result) => {
		return(result.data);
	}).then((voucher) => {
		//console.log('voucher', voucher);
		let detail = slip.lines[i];
		switch	(voucher.type)	{
		  case	1:	//	受取請求書
			slip.lines[i].debitVoucherId = voucher.id;
			detail.debitAmount = voucher.amount;
			detail.debitTax = voucher.tax;
			break;
		  case	2:	//	受取領収書
			slip.lines[i].debitVoucherId = voucher.id;
			detail.debitAmount = voucher.amount;
			detail.debitTax = voucher.tax;
			break;
		  case	11:	//	差出請求書
			slip.lines[i].creditVoucherId = voucher.id;
			detail.creditAmount = voucher.amount;
			detail.creditTax = voucher.tax;
			break;
		  case	12:	//	差出領収書
			slip.lines[i].creditVoucherId = voucher.id;
			detail.creditAmount = voucher.amount;
			detail.creditTax = voucher.tax;
			break;
		}
		slip.lines[i].application2 = voucher.Customer.name;
		slip.lines[i].debitAmount = detail.debitAmount != null ? numeric(detail.debitAmount).toLocaleString() : '';
		slip.lines[i].debitTax = detail.debitTax != null ? numeric(detail.debitTax).toLocaleString() : '';
		slip.lines[i].creditAmount = detail.creditAmount != null ? numeric(detail.creditAmount).toLocaleString() : '';
		slip.lines[i].creditTax =  detail.creditTax != null ? numeric(detail.creditTax).toLocaleString() : '';
	})
}

const onDrop = (event) => {
	let index = event.currentTarget.dataset.index;
	let voucher_id = event.dataTransfer.getData('id');
	//console.log('onDrop', voucher_id);
  if  ( voucher_id )  {
	  bindVoucher(index, voucher_id);
  }
	event.currentTarget.classList.remove('over');
	event.stopPropagation();
}

const onDragEnter = (event) => {
	event.currentTarget.classList.add('over');
	event.stopPropagation();
}
const onDragLeave = (event) => {
	event.currentTarget.classList.remove('over');
	event.stopPropagation();
}
beforeUpdate(() => {
	//console.log('cross-slip beforeUpdate', init);
	sums = computeSum();
	//console.log('sums', sums);
	if	( init )	{
		_init = [];
		for	( let i = 0; i < slip.lines.length; i ++ )	{
			_init.push(false);
		}
	}
});
afterUpdate(() => {
})
</script>
