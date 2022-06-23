import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import Customer from '../svelte/customer/customer.svelte';
import CommonNav from '../svelte/common/nav.svelte';
import SideBar from '../svelte/common/sidebar.svelte';
import CommonFooter from '../svelte/common/footer.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');
let user = target.getAttribute('user');

const customer = new Customer({
	target: document.getElementById('customer')
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
    customer: customer,
    sidebar: sidebar,
    common: common,
    footer: footer
};
