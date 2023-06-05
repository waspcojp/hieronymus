import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap';

import TrialBalance from '../svelte/trial-balance/index.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');

const trialBalance = new TrialBalance({
	target: document.getElementById('trial-balance'),
    props: {
        term: parseInt(term)
    }
});

export default trialBalance;
