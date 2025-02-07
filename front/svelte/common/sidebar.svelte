<div class="brand-container">
  <a href="" class="brand-link">
      <img src="/public/logo.png" alt="Logo" class="brand-image">
      <span class="brand-text">Hieronymus(開発版)</span>
  </a>
</div>
<div class="sidebar">
	<nav class="mt-2">
    <ul class="nav nav-pills nav-sidebar flex-column">
      {#if ( user && ( user.accounting || user.fiscal_browsing ) ) }
			<li class="nav-item">
			  <a class={ status.current === 'journal' ? 'nav-link active': 'nav-link'}
            href="/journal/{startDate.getFullYear()}/{startDate.getMonth()+1}">
          <i class="bi bi-calendar3"></i>
          仕訳日記帳
        </a>
			</li>
			<li class="nav-item">
				<a class={ status.current === 'ledger' ? 'nav-link active': 'nav-link'}
				    href="/ledger/{term}/1000000">
          <i class="bi bi-journal"></i>
          元帳
        </a>
			</li>
			<li class="nav-item">
				<a class={ status.current === 'bank-ledger' ? 'nav-link active': 'nav-link'}
				    href="/bank-ledger/{term}">
            <i class="bi bi-bank"></i>
            銀行元帳
        </a>
			</li>
    		<li class="nav-item">
				<a class={ status.current === 'trial-balance' ? 'nav-link active': 'nav-link'}
            href="/trial-balance/{term}">
          <i class="bi bi-bar-chart-fill"></i>
          残高試算表
        </a>
			</li>
			<li class="nav-item">
				<a class={ status.current === 'changes' ? 'nav-link active': 'nav-link'}
				    href="/changes/{term}/6000000">
          <i class="bi bi-journal"></i>
          推移表
        </a>
			</li>
    	<li class="nav-item">
				<a class={ status.current === 'voucher' ? 'nav-link active': 'nav-link'}
            href="/voucher/{term}">
          <i class="bi bi-archive-fill"></i>
          証憑管理
        </a>
			</li>
			<li class="nav-item">
				<a class={ status.current === 'accounts' ? 'nav-link active': 'nav-link'}
            href="/accounts/{term}">
          <i class="bi bi-tag"></i>
          勘定科目管理
        </a>
			</li>
      {/if}
      {#if ( user && user.customerManagement ) }
    	<li class="nav-item">
				<a class={ status.current === 'customer' ? 'nav-link active': 'nav-link'}
            href="/customer/">
          <i class="nav-icon fas fa-circle"></i>
          取引先管理
        </a>
			</li>
    	<li class="nav-item">
				<a class={ status.current === 'task'  ? 'nav-link active': 'nav-link'}
            href="/task/">
          <i class="nav-icon fas fa-circle"></i>
          案件管理
        </a>
			</li>
    	<li class="nav-item">
				<a class={ status.current === 'invoice'  ? 'nav-link active': 'nav-link'}
            href="/invoice/">
          <i class="nav-icon fas fa-circle"></i>
          請求管理
        </a>
			</li>
    	<li class="nav-item">
				<a class={ status.current === 'item' ? 'nav-link active': 'nav-link'}
            href="/item">
          <i class="nav-icon fas fa-circle"></i>
          品目管理
        </a>
			</li>
      {/if}
      {#if ( user && user.administrable ) }
			<li class="nav-item">
				<a class={ status.current === 'users'  ? 'nav-link active': 'nav-link'}
            href="/users/">
          <i class="nav-icon fas fa-circle"></i>
          ユーザ管理
        </a>
			</li>
      {/if}
      {#if ( user && user.personnelManagement ) }
			<li class="nav-item">
				<a class={ status.current === 'member' ? 'nav-link active': 'nav-link'}
            href="/member/">
          <i class="nav-icon fas fa-circle"></i>
          役職員管理
        </a>
			</li>
      {/if}
    </ul>
  </nav>
</div>

<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';

export  let term;
export  let user;
export	let status;

let pathname;
let startDate = new Date();
let endDate;

onMount(() => {
	if	( !pathname )	{
    pathname = location.pathname;
    //console.log('term', term);
    //console.log(pathname);
    axios.get(`/api/term/${term}`).then((res) => {
      let fy = res.data;
      startDate = new Date(fy.startDate);
      endDate = new Date(fy.endDate);
    });
	}
})

beforeUpdate(() => {
  if	( !status )	{
    let args = location.pathname.split('/');
    status = {
      current: args[1]
    }
  }
  //console.log('sidebar', status);
});
</script>
