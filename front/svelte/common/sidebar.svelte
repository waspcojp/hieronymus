<div class="brand-container">
    <a href="" class="brand-link">
        <img src="/public/logo.png" alt="Logo" class="brand-image">
        <span class="brand-text fw-light">Hieronymus</span>
    </a>
    <a class="pushmenu mx-1" data-lte-toggle="sidebar-mini" href="#" role="button">
        <i class="fas fa-angle-double-left"></i>
    </a>
</div>
<div class="sidebar">
	<nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column">
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
				<a class={pathname.match(/\/customer/)  ? 'nav-link active': 'nav-link'}
                    href="/customer/">
                    <i class="nav-icon fas fa-circle"></i>
                    取引先管理
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
let user;

onMount(() => {
    user = axios.get('/api/user').then((res) => {
        user = res.data;
    });
})

beforeUpdate(() => {
	if	( !pathname )	{
    	pathname = location.pathname;
    	axios.get(`/api/term/${term}`).then((res) => {
        	let fy = res.data;
        	startDate = new Date(fy.startDate);
        	endDate = new Date(fy.endDate);
    	});
	}
});
</script>
