<style>
</style>
<div class="modal" id="cross-slip-modal" tabindex="-1" data-bs-backdrop="static">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="modalLabel">振替伝票</h5>
				<button type="button" class="btn-close" id="close-button" area-label="Close"
					on:click={close_}></button>
			</div>
			<div class="modal-body">
        {#if !ok }
        <div class="border rounded border-danger mb-2 ms-2 me-2 p-3">
          <h5 class="fs-5 text-danger"><i class="bi bi-exclamation-triangle-fill"></i>&nbsp;エラー</h5>
          <ul>
            {#each errorMessages as errorMessage}
              <li class="text-danger">{errorMessage}</li>
            {/each}
          </ul>
        </div>
        {/if}
				<CrossSlip
					bind:slip={slip}
					init={init}
					accounts={accounts}></CrossSlip>
				{#if (vouchers)}
				<table class="table table-striped table-bordered">
					<thead>
						<th style="width:90px;">
							種別
						</th>
						<th style="width:200px;">
							相手先
						</th>
						<th style="width:100px;">
							金額
						</th>
						<th>
							説明
						</th>
					</thead>
					<tbody>
						{#each vouchers as line}
						<tr
							on:dragstart={onDragStart}
							on:dragend={onDragEnd}
							draggable="true"
							data-id={line.id}>
							<td>
								{voucherType(line.type)}
							</td>
							<td>
								{line.Customer.name}
							</td>
							<td class="number">
								{numeric(line.amount).toLocaleString()}
							</td>
							<td>
								{line.description || ''}
							</td>
						</tr>
						{/each}
					</tbody>
				</table>
				{/if}
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary"
					on:click={openVouchers}>証票</button>
				{#if ( slip && slip.no > 0) }
					<button type="button" class="btn btn-danger" id="delete-button"
						on:click={delete_}>Delete</button>
				{/if}
				<button type="button" class="btn btn-primary" id="save-button"
						on:click={save}>保存&nbsp;<i class="bi bi-save"></i></button>
			</div>
		</div>
	</div>
</div>
<script>

import {numeric, voucherType} from 'cross-slip.js';
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();
import CrossSlip from './cross-slip.svelte';


export let modal;
export let accounts;
export let slip;
export let term;

export	let init;
let vouchers;
let ok = true;
let errorMessages = [];
const clean_popup = () => {
	dispatch('close');
	modal.hide();
	vouchers = undefined;
  errorMessages = [];
  ok = true;
}
const onDragStart = (event) => {
	event.dataTransfer.dropEffect = 'link';
	event.dataTransfer.setData("id", event.currentTarget.dataset.id);
}
const onDragEnd = (event) => {

}
beforeUpdate(() => {
	console.log('beforeUpdate cross-slip-modal', slip);
});
afterUpdate(() => {
	console.log('afterUpdate cross-slip-modal');
	init = false;
});

const save = (event) => {
  errorMessages = [];
  ok = true;
  let tempDay = slip.day;
	slip.day = parseInt(slip.day);
	if	(	( slip.day )
		&&	( slip.day > 0 )
		&&	( slip.day <= 31 ) )	{
		slip.term = parseInt(term);
		let sums = {
			debit: 0,
			credit: 0
		};
		for	( let i = 0 ; i < slip.lines.length; i ++ )	{
			slip.lines[i].creditAmount = numeric(slip.lines[i].creditAmount);
			slip.lines[i].debitAmount = numeric(slip.lines[i].debitAmount);
			slip.lines[i].creditTax = numeric(slip.lines[i].creditTax);
			slip.lines[i].debitTax = numeric(slip.lines[i].debitTax);
			slip.lines[i].description1 = slip.lines[i].description1 || '';
			slip.lines[i].description2 = slip.lines[i].description2 || '';
			slip.lines[i].debitVoucher = undefined;
			slip.lines[i].creditVoucher = undefined;
			sums.debit += slip.lines[i].debitAmount;
			sums.credit += slip.lines[i].creditAmount;
      if ( slip.lines[i].debitAccount === undefined ){
        ok = false;
        errorMessages.push(`${i+1}行目 : 借方科目に未登録の勘定科目が入力されています。`);
      }
      if( slip.lines[i].debitAccount !== undefined  &&
          slip.lines[i].debitAccount.trim().length === 0 ){
        ok = false;
        errorMessages.push(`${i+1}行目 : 借方科目が未入力です。`);
      }
      if ( slip.lines[i].creditAccount === undefined ) {
        ok = false;
        errorMessages.push(`${i+1}行目 : 貸方科目に未登録の勘定科目が入力されています。`);
      }
      if ( slip.lines[i].creditAccount !== undefined && 
           slip.lines[i].creditAccount.trim().length === 0 ){
        ok = false;
        errorMessages.push(`${i+1}行目 : 貸方科目が未入力です。`);
      }
		}
		if	( sums.debit != sums.credit )	{
			ok = false;
      errorMessages.push("借方の金額と貸方の合計金額が不一致です。");
		}
	} else {
		ok = false;
    slip.day = tempDay;
    errorMessages.push("日付が正しくありません。");
	}
	console.log("save", ok, slip);
	if	( ok )	{
		try {
			let pr;
			if ( slip.no  ) {
				pr = axios.put('/api/cross_slip', slip);
			} else {
				pr = axios.post('/api/cross_slip', slip);
			}
			pr.then(() => {
				close_();
			});
		} catch(e) {
			console.log(e);
			// can't save
			//	TODO alert
		}
	} else {
    errorMessages = errorMessages;
	}
};

const close_ = (event) => {
	clean_popup();
};

const delete_ = (event) => {
	try {
		console.log('delete');
		axios.delete('/api/cross_slip', {
			data: {
				year: slip.year,
				month: slip.month,
				day: slip.day,
				no: slip.no
			}
		}).then((result) => {
			clean_popup();
		});
	} catch(e) {
		console.log(e);
		// can't delete
		//	TODO alert
	}
}

const openVouchers = (event) => {
	if	( vouchers )	{
		vouchers = undefined;
	} else {
		vouchers = [];
		axios.get(`/api/voucher/`, {
			params: {
				date: `${slip.year}-${slip.month}-${slip.day}`
			}
		}).then((result) => {
			vouchers = result.data;
			console.log('vouchers', vouchers);
		})
	}
}
</script>
