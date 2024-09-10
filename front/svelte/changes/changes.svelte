<div class="d-flex justify-content-between mb-3 mt-3">
  <h1 class="fs-3">推移表</h1>
</div>
<AccountSelect
	bind:accounts={accounts}
	href={`/changes/${term}`}/>
<nav class="navbar navbar-expand-lg">
  {#if (account)}
  <a class="navbar-brand fs-4" href="/changes/{term}/{account.accountCode}">
    { account ? account.name : ''}
  </a>
  {/if}
</nav>
{#if (account && (account.SubAccounts.length > 0))}
<div class="d-flex justify-content-between mb-2">
  <div>
		<SubAccountSelect
			account={account}
			bind:sub_account_code={sub_account_code}
			href={`/changes/${term}`} />
  	</div>
  	<div>
		{#if sub_account_code}
    	<a href="/ledger/{term}/{account_code}/{sub_account_code}" class="btn btn-info">
			補助元帳を見る
		</a>
		{:else}
    	<a href="/ledger/{term}/{account_code}" class="btn btn-info">
			元帳を見る
		</a>
		{/if}
		<label>
			<input type="checkbox" bind:checked={allYears}
				on:change={termChange}>
			全年度
		</label>
		{#if allYears}
		<label>
			<input type="checkbox" bind:checked={sameMonth}
				on:change={termChange}>
			前年同月比較
		</label>
		{/if}
		</div>
	</div>
{/if}
{#if (lines.length > 0)}
<div class="d-flex justify-content-between mb-2">
	<div></div>
	<div>
		<label>
			<input type="checkbox" bind:checked={Amount} disabled={sameMonth}
				on:change={() => { updateChart() }}>
			金額
		</label>
		<label>
			<input type="checkbox" bind:checked={Balance} disabled={sameMonth}
				on:change={() => {updateChart() }}>
			累計
		</label>
	</div>
</div>
<Line data={chartData} options={{}}/>
{/if}
<ChangesList
  account={account}
  lines={lines}
  term={term}/>
<style>
</style>

<script>

import axios from 'axios';
import {onMount} from 'svelte';

import {Line} from "svelte-chartjs";
import AccountSelect from '../components/account-select.svelte';
import SubAccountSelect from '../components/subaccount-select.svelte';
import ChangesList from './changes-list.svelte';
import {dc, numeric} from '../../../libs/parse_account_code';
import {find_account, find_sub_account_by_code} from '../../javascripts/cross-slip';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  } from 'chart.js';

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale
  );

export let term;

let accounts;
let account_code;
let account;
let sub_account_code;
let details;
let remaining;
let lines = [];
let allYears = false;
let sameMonth = true;
let Amount = true;
let Balance = false;

const colors = [
  "#000",
  //"#EEECE1",
  "#1F497D",
  "#4F81BD",
  "#C0504D",
  "#9BBB59",
  "#8064A2",
  "#4BACC6",
  "#F79646",
  "#C00000",
  "#FF0000",
  "#FFC000",
  "#FFFF00",
  "#92D050",
  "#00B050",
  "#00B0F0",
  "#0070C0",
  "#002060",
  "#7030A0"
];

let chartData;

const termChange = () => {
	console.log({allYears})
	if ( sameMonth )	{
		Balance = false;
	}
	changeAccount();
}

const changeAccount = () => {
	axios.get(`/api/account/${account_code}`).then((result) => {
		account = result.data;
		console.log('account', account);
		remaining = {};
		let pr;
		let thisTerm;
		if	( allYears )	{
			thisTerm = 0;
		} else {
			thisTerm = term;
		}
		if ( sub_account_code > 0 ) {
			pr = axios.get(`/api/remaining/${thisTerm}/${account_code}/${sub_account_code}`);
		} else {
			pr = axios.get(`/api/remaining/${thisTerm}/${account_code}`);
		}
		pr.then((result) => {
			remaining = result.data;
			console.log('remaining', remaining);
			details = [];
			updateList();
		});
	});
}

onMount(() => {
	console.log('changes beforeUpdate');
	let args = location.pathname.split('/');
	term = args[2];
	account_code = args[3];
	sub_account_code = args[4] ? parseInt(args[4]) : undefined;
	changeAccount();
});

const make_lines = (account_code, sub_account_code, remaining, details) => {
	let pureBalance;
	let pureAmount;
	let pureTax;
  if  ( !remaining )  {
		pureBalance = 0;
  } else {
		pureBalance = numeric(remaining.balance);
	}
	let changes = [{
		pureBalance: pureBalance
	}];
	let tax_class;
  if  ( sub_account_code > 0 )      {
    tax_class = find_sub_account_by_code(account_code, sub_account_code).taxClass;
  } else {
    tax_class = find_account(account_code).taxClass;
  }
  for (let i = 0; i < details.length; i++) {
    let detail = details[i];
		//console.log(detail)
		if (dc(account_code) == 'C') {
			pureTax = detail.creditTax;
			if	( tax_class === 1 )	{
				pureAmount = detail.creditAmount - pureTax;
			} else {
				pureAmount = detail.creditAmount;
			}
		} else {
			pureTax = detail.debitTax;
			if	( tax_class === 1 )	{
				pureAmount = detail.debitAmount - pureTax;
			} else {
				pureAmount = detail.debitAmount;
			}
		}
		pureBalance += pureAmount;
		changes.push({
			year: detail.year,
			month: detail.month,
			pureAmount: pureAmount,
			pureTax: pureTax,
			pureBalance: pureBalance,
			texClass: tax_class
		});
	}
	return	(changes);
}

const updateList = () => {
	console.log('updateList', term, account_code, sub_account_code);
	let pr;
	let thisTerm;
	if	( allYears )	{
		thisTerm = 0;
	} else {
		thisTerm = term;
	}
	if ( sub_account_code > 0 ) {
		console.log('with sub_account');
		pr = axios.get(`/api/changes/${thisTerm}/${account_code}/${sub_account_code}`);
	} else {
		pr = axios.get(`/api/changes/${thisTerm}/${account_code}`);
	}
	pr.then((result) => {
		details = result.data;
		//console.log('**details', details);
		//console.log(dc(account_code));
		lines = make_lines(account_code, sub_account_code,
				remaining, details);
		console.log({lines});
		updateChart();
	});
}
const updateChart = () => {
	chartData = {
		datasets: [],
		labels: []
	};
	let index;
	if	( sameMonth )	{
		for	( let i = 1; i < 13; i += 1 )	{
			let line = lines[i];
			chartData.labels.push(`${line.month}`);
		}
		index = -1;
		for	( let i = 1; i < lines.length; i += 1 )	{
			let line = lines[i];
			if	( i % 12 === 1 )	{
				index += 1;
				chartData.datasets[index] = {
					label: `${line.year}度`,
					fill: false,
					borderColor: colors[index],
					data: []
				}
			}
			chartData.datasets[index].data.push(line.pureAmount);
		}
	} else {
		for	( let i = 1; i < lines.length; i += 1 )	{
			let line = lines[i];
			chartData.labels.push(`${line.year}/${line.month}`);
		}
		index = 0;
		if	( Amount )	{
			chartData.datasets[index] = {
				label: '金額',
				fill: false,
				borderColor: colors[index],
				data: []
			};
			for	( let i = 1; i < lines.length; i += 1 )	{
				let line = lines[i];
				chartData.datasets[index].data.push(line.pureAmount);
			}
			index += 1;
		}
		if	( Balance )	{
			chartData.datasets[index] =  {
				label: '累計',
				fill: false,
				borderColor: colors[index],
				data: []
			};
			for	( let i = 1; i < lines.length; i += 1 )	{
				let line = lines[i];
				chartData.datasets[index].data.push(line.pureBalance);
			}
		}
	}
}
</script>