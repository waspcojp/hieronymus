import 'bootstrap';

import Changes from '../svelte/changes/index.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');

const changes = new Changes({
	target: document.getElementById('changes'),
    props: {
        term: parseInt(term)
    }
});

export default changes;
