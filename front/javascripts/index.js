import 'bootstrap';

import Index from '../svelte/index.svelte';

let target = document.getElementById('body');
let term = parseInt(target.getAttribute('term'));
console.log({term});

const index = new Index({
    target: document.getElementById('index'),
    props: {
        term: term
    }
});

export default index;
