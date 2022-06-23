import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap';

import Journal from '../svelte/journal/journal.svelte';
import CommonNav from '../svelte/common/nav.svelte';
import SideBar from '../svelte/common/sidebar.svelte';
import CommonFooter from '../svelte/common/footer.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');
let user = target.getAttribute('user');

const journal = new Journal({
	target: document.getElementById('journal')
});

const common = new CommonNav({
    target: document.getElementById('common-nav'),
    props: {
        term: parseInt(term),
        user: user
    }
});
const sidebar = new SideBar({
    target: document.getElementById('sidebar'),
    props: {
        term: parseInt(term),
    }
});
const footer = new CommonFooter({
    target: document.getElementById('common-footer'),
});

export default {
    journal: journal,
    sidebar: sidebar,
    common: common,
    footer: footer
};
