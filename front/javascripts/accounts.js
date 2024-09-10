import Accounts from '../svelte/accounts/index.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');

const	accounts = new Accounts({
	target: document.getElementById('accounts'),
    props: {
        term: parseInt(term)
    }
});

export default accounts;
