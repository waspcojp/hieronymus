import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import Customer from '../svelte/customer/index.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');
let user = target.getAttribute('user');

const customer = new Customer({
	target: document.getElementById('customer'),
    props: {
        term: parseInt(term)
    }
});

export default customer;
