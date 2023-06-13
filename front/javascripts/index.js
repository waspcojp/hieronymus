import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// mount all the global components found in this page

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
