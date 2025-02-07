import { writable, get } from 'svelte/store';

export const currentInvoice = writable();
export const currentTask = writable();
export const getStore = get;