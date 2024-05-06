<input type="text" size="12" maxlength="13" autocomplete="off"
	bind:value={acc_key}
	on:change={changeKey}
	on:keyup={changeKey}
	on:focusout={leaveKey}
	on:focusin={enterKey}>
	{#if ( list && list.length > 0 ) }
<select bind:value={code}
	on:focusout={leaveAccountSelect}>
	{#each list as item}
	<option value={item.code}>
		{item.name}
	</option>
	{/each}
</select>
{/if}
<input type="text" size="12" maxlength="13"
	bind:value={sub_key}
	on:change={changeSubKey}
	on:keyup={changeSubKey}
	on:focusout={leaveSubKey}
	on:focusin={enterSubKey}>
{#if ( account && account.subAccounts )}
	{#if ( sub_list && sub_list.length > 0 ) }
	<select bind:value={sub_code}
		on:focusout={leaveSubAccountSelect}>
		{#each sub_list as item}
		<option value={item.code}>{item.name}</option>
		{/each}
	</select>
	{/if}
{/if}

<script>
import {set_accounts, find_account, find_sub_account, element_dc, element_index} from '../../javascripts/cross-slip';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';

export	let	code;
export	let	sub_code;
export	let	accounts;
export	let	init;

let	acc_key;
let list;
let account;

let sub_key;
let sub_list;
let sub_account;

beforeUpdate(() => {
	console.log('beforeUpdate account', init, code, sub_code);
	if	( init )	{
		console.log('init');
		set_accounts(accounts);
		setAccount();
		setSubAccount();
		init = false;
	}
});

const search_account_by_key = (key) => {
	let list = [];
	if	(	( key )
		&&	( key != '' ) )	{
		accounts.forEach((account) => {
			if	((( account.key ) &&
				  ( account.key.match(key) )) ||
			 	( account.name.match(key) ))	{
				list.push({
							name: account.name,
							code: account.code
				 		});
			}
		});
	}
	return (list);
}

const search_sub_account_by_key = (account, key) => {
	let list = [];
	if	( account.subAccounts )	{
		account.subAccounts.forEach((sub_account) => {
			if	((( sub_account.key ) &&
				  ( sub_account.key.match(key) )) ||
				 ( sub_account.name.match(key) ))	{
				list.push({
						 	name: sub_account.name,
							code: sub_account.code
						});
			}
		});
	}
	return (list);
}

const setAccount = () => {
	list = undefined;
	if ( code )	{
		account = find_account(code);
		//console.log('account', account);
		if	( account )	{
			acc_key = account.name;
		} else {
			acc_key = '';
		}
	} else {
		acc_key = '';
	}
}

const setSubAccount = () => {
	sub_list = undefined;
	if	( sub_code )	{
		sub_account = find_sub_account(account, parseInt(sub_code));
		//console.log('sub_account', sub_account);
		if	( sub_account )	{
			sub_key = sub_account.name;
		} else {
			sub_key = '';
		}
	} else {
		sub_key = '';
	}
}


const changeKey = (event) => {
	list = search_account_by_key(acc_key);
	code = ( list && list.length > 0 ) ? list[0].code : undefined;
}
const leaveKey = (event) => {
	//console.log('code', code);
}
const enterKey = (event) => {
	list = [];
}
const changeSubKey = (event) => {
	if	( account )	{
		if	( sub_key.length > 0 )	{
			sub_list = search_sub_account_by_key(account, sub_key);
			sub_code = ( sub_list && sub_list.length > 0 ) ? sub_list[0].code : undefined;
		} else {
			sub_code = undefined;
		}
	}
}
const leaveSubKey = (event) => {
	//console.log('sub_code', sub_code);
}
const enterSubKey = (event) => {
	//console.log('code', code);
	if	( account )	{
		sub_list = search_sub_account_by_key(account, sub_key);
	}
}

const leaveAccountSelect = (event) => {
	setAccount();
}
const leaveSubAccountSelect = (event) => {
	setSubAccount();
}

</script>
