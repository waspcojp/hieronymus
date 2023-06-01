<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
		<a class="navbar-brand" href="#">ユーザ一覧</a>
		<ul class="navbar-nav me-auto mb-2">
			<li class="nav-item">
			</li>
		</ul>
		<ul class="navbar-nav ms-auto">
			<li class="nav-item">
			</li>
		</ul>
	</div> 
</nav>
<div class="row body-height">
	<UserList
			update={list_update}></UserList>
</div>

<style>
</style>

<script>
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import UserList from './user-list.svelte';

let	user;
let	list_update;

const	update = (event) => {
	console.log('update');
	list_update = true;
}

beforeUpdate(()	=> {
});
afterUpdate(() => {
})
</script>
