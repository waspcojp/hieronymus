import 'bootstrap';

import BankLedger from '../svelte/bank-ledger/index.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');

const bankLedger = new BankLedger({
	target: document.getElementById('bank-ledger'),
    props: {
        term: parseInt(term)
    }
});

export default bankLedger;
