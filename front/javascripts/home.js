import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// mount all the global components found in this page

import Home from '../svelte/home/index.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');

const home = new Home({
    target: document.getElementById('home'),
    props: {
        term: parseInt(term)
    }
});

export default home;
