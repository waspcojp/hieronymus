import 'bootstrap';

import Ledger from '../svelte/ledger/index.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');

const ledger = new Ledger({
	target: document.getElementById('ledger'),
    props: {
        term: parseInt(term)
    }
});

export default ledger;
