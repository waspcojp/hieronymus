<div class="container-fluid">
<<<<<<< HEAD
	<ul class="navbar-nav">
	</ul>
=======
>>>>>>> main
	<span class="havbar-text">
		{#if ( startDate && endDate )}
		第{term}期
		({startDate.getFullYear()}年
		({wareki(startDate)})
        {startDate.getMonth()+1}月
        {startDate.getDate()}日
		〜
		{endDate.getFullYear()}年
		({wareki(endDate)})
        {endDate.getMonth()+1}月
        {endDate.getDate()}日)
    {:else}
      <span class="text-danger fw-bold"><i class="bi bi-exclamation-diamond-fill"></i>&nbsp; 会計年度を選択してください</span>
		{/if}
	</span>
	<ul class="navbar-nav ms-auto">
		<li class="nav-item dropdown">
			<a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" id="user_menu"
					role="button" aria-expanded="false">
				<span class="d-none d-md-inline">{user}</span>
			</a>
			<ul class="dropdown-menu"
					aria-labelledby="user_menu">
				<li>
					<a href="/logout" class="dropdown-item">Sign out</a>
				</li>
			</ul>
		</li>
	</ul>
</div>

<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import {wareki} from '../../../libs/utils';

export	let	term;
export	let	user;

let pathname;
let startDate;
let endDate;

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
