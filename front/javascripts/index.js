import 'bootstrap';

import Index from '../svelte/index.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');

const index = new Index({
    target: document.getElementById('index'),
    props: {
        term: parseInt(term)
    }
});

export default index;
