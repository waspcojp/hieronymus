import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import Users from '../svelte/ledger/index.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');

const	users = new Users({
	target: document.getElementById('users'),
    props: {
        term: parseInt(term)
    }
});

export default users;
