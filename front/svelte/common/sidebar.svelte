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
				<a class={pathname.match(/\/journal\//)  ? 'nav-link active': 'nav-link'}
                        href="/journal/{startDate.getFullYear()}/{startDate.getMonth()+1}">
                    <i class="nav-icon fas fa-circle"></i>
                    仕訳日記帳
                </a>
			</li>
			<li class="nav-item">
				<a class={pathname.match(/\/ledger\//)  ? 'nav-link active': 'nav-link'}
				        href="/ledger/{term}/1000000">
                    <i class="nav-icon fas fa-circle"></i>
                    元帳
                </a>
			</li>
			<li class="nav-item">
				<a class={pathname.match(/\/bank-ledger\//)  ? 'nav-link active': 'nav-link'}
				        href="/bank-ledger/{term}">
                    <i class="nav-icon fas fa-circle"></i>
                    銀行元帳
                </a>
			</li>
    		<li class="nav-item">
				<a class={pathname.match(/\/trial-balance\//)  ? 'nav-link active': 'nav-link'}
                        href="/trial-balance/{term}">
                    <i class="nav-icon fas fa-circle"></i>
                    残高試算表
                </a>
			</li>
    		<li class="nav-item">
				<a class={pathname.match(/\/voucher/)  ? 'nav-link active': 'nav-link'}
                        href="/voucher/{term}">
                    <i class="nav-icon fas fa-circle"></i>
                    証票管理
                </a>
			</li>
			<li class="nav-item">
				<a class={pathname.match(/\/accounts\//)  ? 'nav-link active': 'nav-link'}
                        href="/accounts/{term}">
                    <i class="nav-icon fas fa-circle"></i>
                    勘定科目管理
                </a>
			</li>
            {/if}
            {#if ( user && user.customer_management ) }
    		<li class="nav-item">
				<a class={pathname.match(/\/customer/)  ? 'nav-link active': 'nav-link'}
                    href="/customer/">
                    <i class="nav-icon fas fa-circle"></i>
                    取引先管理
                </a>
			</li>
            {/if}
            {#if ( user && user.administrable ) }
			<li class="nav-item">
				<a class={pathname.match(/\/users\//)  ? 'nav-link active': 'nav-link'}
                        href="/users/">
                    <i class="nav-icon fas fa-circle"></i>
                    ユーザ管理
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

let pathname;
let startDate = new Date();
let endDate;

beforeUpdate(() => {
	if	( !pathname )	{
    	pathname = location.pathname;
        console.log('term', term);
    	axios.get(`/api/term/${term}`).then((res) => {
        	let fy = res.data;
        	startDate = new Date(fy.startDate);
        	endDate = new Date(fy.endDate);
    	});
	}
})

beforeUpdate(() => {
});
</script>
