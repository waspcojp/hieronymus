<ul class="nav">
    {#each fields as field, index}
    <li class="nav-item dropdown pe-2">
      <a class="btn btn-outline-primary dropdown-toggle" id="field_{index}" rolw="button" data-bs-toggle="dropdown" aria-expanded="false">
        {field.title}
      </a>
      <ul class="dropdown-menu" aria-labelledby="field_{index}">
        {#each field.accounts as account}
        <li>
          <a class="dropdown-item" href={`${href}/${account.code}`}>{account.name}</a>
        </li>
        {/each}
      </ul>
    </li>
    {/each}
</ul>
<script>
import axios from 'axios';
import {beforeUpdate} from 'svelte';
import {set_accounts} from '../../javascripts/cross-slip';
import parse_account_code from '../../../libs/parse_account_code';

export let href;

let fields;
export let accounts;

beforeUpdate(() => {
	if	( !accounts )	{
		accounts = [];
		fields = [];
		axios.get(`/api/accounts`).then((res) => {
			accounts = res.data;
			set_accounts(accounts);
		}).then(() => {
			fields = [
				{
					title: '資産',
					accounts: []
				},{
					title: '負債',
					accounts: []
				},{
					title: '純資産',
					accounts: []
				},{
					title: '売上高',
					accounts: []
				},{
					title: '売上原価',
					accounts: []
				},{
					title: '営業外',
					accounts: []
				}];
			for ( let i = 0; i < accounts.length; i ++ ) {
				let account = accounts[i];
				switch (parse_account_code.field(account.code)) {
					case '1':
					case '2':
						fields[0].accounts.push(account);
						break;
					case '3':
					case '4':
						fields[1].accounts.push(account);
						break;
					case '5':
						fields[2].accounts.push(account);
						break;
					case '6':
						fields[3].accounts.push(account);
						break;
					case '7':
						fields[4].accounts.push(account);
						break;
					default:
						fields[5].accounts.push(account);
						break;
				}
			}
		});
	}
})
</script>