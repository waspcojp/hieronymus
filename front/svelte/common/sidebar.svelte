<div class="brand-container">
    <a href="/" class="brand-link text-decoration-none">
        <img src="/public/logo.png" alt="Logo" class="brand-image opacity-80 shadow">
        <span class="brand-text fw-light">Hieronymus</span>
    </a>
</div>
<div class="sidebar">
	<nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column">
      <li class="nav-item">
        <a class="nav-link {pathname == '/' ? 'active' : ''}" href="/">
          <i class="bi bi-house-fill"></i>
          ホーム
        </a>
      </li>
			<li class="nav-item">
				<a class={pathname.match(/\/journal\//)  ? 'nav-link active': 'nav-link'}
                        href="/journal/{startDate.getFullYear()}/{startDate.getMonth()+1}">
                        <i class="bi bi-calendar3"></i>
                    仕訳日記帳
                </a>
			</li>
			<li class="nav-item">
				<a class={pathname.match(/\/ledger\//)  ? 'nav-link active': 'nav-link'}
				        href="/ledger/{term}/1000000">
                    <i class="bi bi-journal"></i>
                    元帳
                </a>
			</li>
			<li class="nav-item">
				<a class={pathname.match(/\/bank-ledger\//)  ? 'nav-link active': 'nav-link'}
				        href="/bank-ledger/{term}">
                    <i class="bi bi-bank"></i>
                    銀行元帳
                </a>
			</li>
    		<li class="nav-item">
				<a class={pathname.match(/\/trial-balance\//)  ? 'nav-link active': 'nav-link'}
                        href="/trial-balance/{term}">
                    <i class="bi bi-bar-chart-fill"></i>
                    残高試算表
                </a>
			</li>
    		<li class="nav-item">
				<a class={pathname.match(/\/customer/)  ? 'nav-link active': 'nav-link'}
                    href="/customer/">
                    <i class="bi bi-building"></i>
                    取引先管理
                </a>
			</li>
    		<li class="nav-item">
				<a class={pathname.match(/\/voucher/)  ? 'nav-link active': 'nav-link'}
                        href="/voucher/{term}">
                    <i class="bi bi-archive-fill"></i>
                    証票管理
                </a>
			</li>
			<li class="nav-item">
				<a class={pathname.match(/\/accounts\//)  ? 'nav-link active': 'nav-link'}
                        href="/accounts/{term}">
                    <i class="bi bi-tag"></i>
                    勘定科目管理
                </a>
			</li>
        </ul>
    </nav>
</div>

<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';

export  let term;

let pathname;
let startDate = new Date();
let endDate;

beforeUpdate(() => {
	if	( !pathname )	{
    	pathname = location.pathname;
      console.log(pathname);
    	axios.get(`/api/term/${term}`).then((res) => {
        	let fy = res.data;
        	startDate = new Date(fy.startDate);
        	endDate = new Date(fy.endDate);
    	});
	}
});
</script>
