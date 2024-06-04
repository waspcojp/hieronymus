<table class="table table-bordered">
  <thead class="table-light">
    <tr>
      <th scope="col" style="width: 120px;">
        大分類
      </th>
      <th scope="col" style="width: 120px;">
        中分類
      </th>
      <th scope="col" style="width: 140px;">
        小分類
      </th>
      <th scope="col">
        勘定科目
      </th>
      <th scope="col" style="width: 80px;">
        科目<br/>コード
      </th>
      <th scope="col" style="width: 120px;">
        補助科目
      </th>
      <th scope="col" style="width: 50px;">
        課税区分
      </th>
      <th scope="col" style="width: 60px;">
        検索キー
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
    {#each lines as line}
    <tr>
      <td>
        {line.major_name}
      </td>
      <td>
        {line.middle_name}
      </td>
      <td>
        {#if (line.minor_name != '')}
        {line.minor_name}
        {/if}
      </td>
      <td>
        {#if line.code}
        <a class="account_link" href="#"
            data-code={line.code}
            data-mode="edit-account"
            on:click={openAccount}>
          {line.account_name}
        </a>
        {:else}
        <a class="account_link btn btn-primary btn-sm" href="#"
            data-mode="new-account"
            data-acl={line.acl_id}
            data-aclcode={line.acl_code}
            on:click={openAccount}>
          <i class="bi bi-plus"></i>
        </a>
        {/if}
      </td>
      <td>
        {#if line.code}
        {line.code}
        {/if}
      </td>
      <td>
        {#if ( line.sub_code )}
        {#if (line.sub_code >= 0)}
        <a class="account_link" href="#"
            data-code={line.code}
            data-sub_code={line.sub_code}
            data-mode="edit-sub-account"
            on:click={openAccount}>
          {line.sub_account_name}
        </a>
        {:else}
        <a class="account_link btn btn-primary btn-sm" href="#"
            data-code={line.code}
            data-mode="new-sub-account"
            on:click={openAccount}>
          <i class="bi bi-plus"></i>
        </a>
        {/if}
        {/if}
      </td>
      <td>
        {line.tax_class ? line.tax_class : ''}
      </td>
      <td>
        {line.code ? line.key : ''}
      </td>
      <td class="number">
        {line.code ? line.debit.toLocaleString() : ''}
      </td>
      <td class="number">
        {line.code ? line.credit.toLocaleString() : ''}
      </td>
      <td class="number">
        {line.code ? line.remaining.toLocaleString(): ''}
      </td>
    </tr>
    {/each}
  </tbody>
</table>

<style>
th {
	text-align: center;
}
</style>

<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

export	let	term;
export	let	lines;
export	let	accounts;

beforeUpdate(() => {
	console.log('lines', lines);
})

const	openAccount = async (event) => {
    event.preventDefault();
	let dataset = event.currentTarget.dataset;
	console.log('openAccount',
		dataset.mode,
		dataset.code,
		dataset.sub_code
	);
	let mode = dataset.mode;
	let account;
	if	( dataset.code )	{
		for ( let i = 0; i < accounts.length ; i ++ ) {
			account = accounts[i];
			if ( account.code == dataset.code ) break;
		}
	} else {
		let result = await axios.get(`/api/account-class/${dataset.acl}`);
		let acl = result.data;
		console.log({acl});
		account = {
			code: dataset.aclcode + '****',
			major_name: acl.major,
			middle_name: acl.middle,
			minor_name: acl.minor,
			klass_id: acl.id,
			name: '',
			key: '',
      debit: 0,
      credit: 0,
      balance: 0
		};
	}
	let sub_account = null;
	if ( dataset.sub_code ) {
		for ( let i = 0; i < account.subAccounts.length ; i ++) {
			sub_account = account.subAccounts[i];
			if ( sub_account.code == dataset.sub_code ) break;
		}
	}
	if	( mode == 'new-sub-account' )	{
		sub_account = {
      debit: 0,
      credit: 0,
      balance: 0
    };
	}
	dispatch('open',{
		account: account,
		sub_account: sub_account,
		mode: dataset.mode
	});
}
</script>
