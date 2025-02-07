{#if ( count > 0 ) }
<div class="card">
  <div class="card-header">
    <h3 class="card-title">承認待ち</h3>
  </div>
  <div class="card-body">
    <div class="row">
    	<ul class="list-group">
        <li class="list-group-item">
          件数: {count}
        </li>
      </ul>
    </div>
	  <div class="row full-height" style="overflow-y: scroll;">
		  <table class="table table-bordered">
        <thead>
          <th scope="col" colspan="2">
            日付 / 伝番
          </th>
          <th scope="col" style="width: 100px;">
            作成者
          </th>
          <th scope="col" style="width: 100px;">
            更新者
          </th>
        </thead>
        <tbody>
          {#each slips as line}
          <tr>
            <td style="width:20px;text-align:center;">
              {line.month}/{line.day}
            </td>
            <td style="width:20px;" class='number'>
              <a href="#" data-no={line.no} on:click={openSlip}>
                {line.no}
              </a>
            </td>
            <td class="">
              {line.creater ? line.creater.name: ''}
            </td>
            <td class="">
              {line.updater ? line.updater.name: ''}
            </td>
          </tr>
          {/each}
        </tbody>              
      </table>
    </div>
  </div>
</div>
{/if}
<CrossSlipModal
	slip={slip}
	bind:modal={modal}
	term={term}
	user={user}
	accounts={accounts}
	bind:init={init}
	on:close={close_}></CrossSlipModal>

<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();
import CrossSlipModal from '../cross-slip/cross-slip-modal.svelte';
import Modal from 'bootstrap/js/dist/modal';
import {set_accounts} from '../../javascripts/cross-slip';

export let term;
export let toast;
export let user;

let count = 0;
let slips = [];
let slip = {
  lines:[]
};
let init = true;
let accounts;
let modal;

const setupAccount = () => {
	accounts = [];
	axios.get(`/api/accounts`).then((res) => {
		accounts = res.data;
		set_accounts(accounts);
	});
}

const close_ = (event) => {
	getSlips();
}

const openSlip = (event) => {
  event.preventDefault();
	let no = event.target.dataset.no;

	//console.log('openSlip', no, slips);

  let thisSlip = null;
	for ( let i = 0; i < slips.length; i ++ ) {
		if ( slips[i].no == no ) {
			thisSlip = slips[i];
			break;
		}
	}
  if  ( slip )  {
    axios.get(`/api/cross_slip/${thisSlip.year}/${thisSlip.month}/${thisSlip.no}`).then((result) => {
      slip = result.data;
      init = true;
      //console.log('slip', slip);
      modal.show();
    })
  }
}

const getSlips = () => {
  axios.get('/api/cross_slips/not_approved').then((result) => {
    slips = result.data;
    count = slips.length;
  })
}

onMount(() => {
  if  ( !accounts ) {
    setupAccount();
  }
  getSlips();
  modal = new Modal(document.getElementById('cross-slip-modal'));
})
</script>