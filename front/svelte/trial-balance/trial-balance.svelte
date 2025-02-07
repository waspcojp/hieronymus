<div class="d-flex justify-content-between mb-3 mt-3">
  <h1 class="fs-3">残高試算表</h1>
  <a href="/forms/trial_balance/{term}/{current_month}" download="残高試算表.xlsx" class="btn btn-primary">
    残高試算表&nbsp;をダウンロード&nbsp;<i class="bi bi-download"></i>
  </a>
</div>
<ul class="nav me-auto mb-2">
  <li class="nav-item">
    {#if ( !current_month  )}
    <button type="button" class="btn btn-primary disabled me-2"
      data-month=""
      on:click={openMonth}>
      年度
    </button>
    {:else}
    <button type="button" class="btn btn-outline-primary me-2"
      data-month=""
      on:click={openMonth}>
      年度
    </button>
    {/if}
  </li>
  {#each dates as date}
  <li class="nav-item">
    {#if (date.ym == current_month)}
    <button type="button" class="btn btn-primary disabled me-2"
      on:click={openMonth}
      data-month="{date.year}-{date.month}">
      {date.month}&nbsp;月
    </button>
    {:else}
    <button type="button" class="btn btn-outline-primary me-2"
      on:click={openMonth}
      data-month="{date.year}-{date.month}">
      {date.month}&nbsp;月
    </button>
    {/if}
  </li>
  {/each}
</ul>
<div class="row body-height">
  <TrialBalanceList
    term={term}
    lines={lines}>
  </TrialBalanceList>
</div>
<style>
</style>

<script>
import axios from 'axios';

import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import TrialBalanceList from './trial-balance-list.svelte';
import {numeric} from '../../../libs/utils.js';
import {dc} from '../../../libs/parse_account_code';

export let term;
export let user;
export let alert;
export let alert_level;

let lines = [];
let dates = [];
let current_month;

const openMonth = (event) => {
  event.preventDefault();
  let month = event.currentTarget.dataset.month;
  updateLines(month);
  current_month = month;
  if  ( current_month ) {
    window.history.pushState(
      current_month, "", `/trial-balance/${term}/${current_month}`);
  } else {
    window.history.pushState(
      current_month, "", `/trial-balance/${term}`);
  }
}

const updateLines = (month) => {
  lines = [];
  let url;
  if  ( month ) {
    url = `/api/trial-balance/${term}/${month}`;
  } else {
    url = `/api/trial-balance/${term}`;
  }
  axios.get(url).then((result) => {
    let data = result.data;
    //console.log('trial-balance update', data);
    let trial_balance = data;
    let last_account = {};
    for ( let i = 0; i < trial_balance.length; i ++ ) {
      let account = trial_balance[i];
      if	( !account.code ) continue;
      if	( account.code.length > 7 ) continue;
      let new_line = {
        name: account.name,
        pickup: numeric(account.pickup),
        debit: numeric(account.debit),
        credit: numeric(account.credit),
        code: account.code
      };
      //console.log('new_line', new_line);
      if ( dc(account.code) == 'D' ) {
        new_line.balance = new_line.pickup + new_line.debit - new_line.credit;
      } else {
        new_line.balance = new_line.pickup - new_line.debit + new_line.credit;
      }

      if ( last_account.middle_name != account.middle_name ) {
        lines.push({
          name: `【${account.middle_name}】`
        });
      }
      if ( last_account.minor_name != account.minor_name ) {
        lines.push({
          name: account.minor_name
        });
      }
      if	(( new_line.pickup != 0 ) ||
         ( new_line.debit  != 0 ) ||
         ( new_line.credit != 0 ) ||
         ( new_line.balance != 0 )) {
        lines.push(new_line);
      }
      last_account = account;	 
    }
    //console.log('lines', lines);
    lines = lines;
  });
}

onMount(() => {
  let args = location.pathname.split('/');
  term = parseInt(args[2]);
  //console.log({term});
  if  ( args[3] ) {
    current_month = args[3];
  }
  dates = [];
  axios.get(`/api/term/${term}`).then((result) => {
    let fy = result.data;
    for ( let mon = new Date(fy.startDate); mon < new Date(fy.endDate); ) {
      dates.push({
        year: mon.getFullYear(),
        month: mon.getMonth()+1,
        ym: `${mon.getFullYear()}-${mon.getMonth()+1}`
      });
      mon.setMonth(mon.getMonth() + 1);
    }
    dates = dates;
  });
  window.onpopstate = (event) => {
    if	( window.history.state )	{
      current_params = window.history.state;
      console.log({current_params});
      current_month = current_params.get('month');
      updateVouchers();
    }
  }

  updateLines();
})

</script>
