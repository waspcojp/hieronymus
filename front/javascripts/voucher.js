import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import Voucher from '../svelte/voucher/voucher.svelte';

import CommonNav from '../svelte/common/nav.svelte';
import SideBar from '../svelte/common/sidebar.svelte';
import CommonFooter from '../svelte/common/footer.svelte';

let target = document.getElementById('body');
let term = target.getAttribute('term');
let user = target.getAttribute('user');

const voucher = new Voucher({
	target: document.getElementById('voucher')
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
    voucher: voucher,
    sidebar: sidebar,
    common: common,
    footer: footer
};
