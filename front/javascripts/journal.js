import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap';

import Journal from '../svelte/journal/index.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');

const journal = new Journal({
	target: document.getElementById('journal'),
    props: {
        term: parseInt(term)
    }
});


export default journal;
