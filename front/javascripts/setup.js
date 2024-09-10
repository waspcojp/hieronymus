import 'bootstrap';

import Setup from '../svelte/setup/setup.svelte';

const setup = new Setup({
    target: document.getElementById('setup')
});


export default {
    setup: setup
};
