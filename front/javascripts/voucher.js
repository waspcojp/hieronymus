import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import Voucher from '../svelte/voucher/index.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');

const voucher = new Voucher({
	target: document.getElementById('voucher'),
    props: {
        term: parseInt(term)
    }
});

export default voucher;
