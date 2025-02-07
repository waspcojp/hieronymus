{#if ( status.state === 'list' )}
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <span class="navbar-brand">案件一覧</span>
    <ul class="navbar-nav me-auto mb-2">
      <li class="nav-item">
        <button type="button" class="btn btn-primary"
          on:click={() => {
            openEntry(null);
          }}
          id="task-info">新規入力&nbsp;<i class="bi bi-pencil-square"></i></button>
      </li>
    </ul>
  </div> 
</nav>
<div class="row body-height">
  <TaskList
    tasks={tasks}
    on:open={openEntry}
    on:selectKind={selectKind}
    on:selectCustomerId={selectCustomer}
    ></TaskList>
</div>
{:else if ( status.state === 'entry' || status.state === 'new' )}
  <TaskEntry
    users={users}
    bind:status={status}
    bind:task={task}
    on:open={openEntry}
    on:close={closeEntry}>
  </TaskEntry>
{/if}
<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import TaskEntry from './task-entry.svelte';
import TaskList from './task-list.svelte';
import {currentTask, currentInvoice, getStore} from '../../javascripts/current-record.js'

export let status;

let task;
let tasks;
let current_params = new Map();
let users;

const selectKind = (event) => {
  let kind = event.detail;
  updateTasks({
    kind: kind
  });
}
const selectCustomer = (event) => {
  let	customerId = event.detail;
  console.log('selectCustomer', {customerId});
  updateTasks({
    customer: customerId
  });
}
const updateTasks = (_params) => {
  if	( _params )	{
    Object.keys(_params).map((key) => {
      if	( !_params[key] )	{
        current_params.delete(key);
      } else {
        current_params.set(key,_params[key]);
      }
    });
  }
  //console.log('current_params', current_params);
  let _array = [];
  current_params.forEach((value, key) => {
    console.log('key, value', key, value);
    _array.push(encodeURI(`${key}=${value}`));
  });
  let param = _array.join('&');
  console.log('param', param);
  axios.get(`/api/task?${param}`).then((result) => {
    tasks = result.data;
    console.log('tasks', tasks);
  });
  if	( _params )	{
    window.history.pushState(
        status, "", `${location.pathname}?${param}`);
  }
};

const	openEntry = (event)	=> {
  if  ( !event )  {
    task = null;
    status.state = 'new';
      window.history.pushState(
        status, "", `/task/new`);
  } else {
    console.log('open', event.detail);
    task = event.detail;
    if ( !task.id )	{
      status.state = 'new';
      window.history.pushState(
        status, "", `/task/new`);
    } else {
      status.state = 'entry';
      window.history.pushState(
        status, "", `/task/entry/${task.id}`);
    }
  }
  //console.log('task', task)
};
const closeEntry = (event) => {
  status.state = 'list';
  updateTasks();
}

const checkPage = () => {
  let args = location.pathname.split('/');
  // /task
  // /task/entry/23
  //console.log('checkPage', {args});
  if  ( ( args[2] === 'entry' ) ||
			  ( args[2] === 'new'   )) {
    status.state = args[2];
    if  ( !task ) {
      task = {
        issueDate: new Date(),
        tax: 0,
        amount: 0,
        document: {
          descriptionType: 'text'
        },
        lines: [{
          itemName: '',
          itemSpec: '',
          unitPrice: 0,
          itemNumber: 0,
          unit: '',
          amount: 0,
          description: ''
        }]};
      let invoice = getStore(currentInvoice);
      if	( invoice )	{
				task.customerId = invoice.customerId;
        task.customerName = invoice.customerName;
        task.chargeName = invoice.chargeName;
        task.zip = invoice.zip;
        task.address1 = invoice.address1;
        task.address2 = invoice.address2;
        task.subject = invoice.subject;
        task.lines = [...invoice.lines];
        task.taxClass = invoice.taxClass;
        task.tax = invoice.tax;
        task.amount = invoice.amount;

      }
      let value = getStore(currentTask);
      //console.log({value});
      if	( value )	{
        task = value;
      } else {
        if	( status.state === 'entry' )	{
      		axios(`/api/task/${args[3]}`).then((result) => {
        		task = result.data.task;
        		console.log({task});
          	currentTask.set(task);
      		});
        } else {
          currentTask.set(task);
        }
      }
    }
  } else {
    status.state = 'list';
  }
}

onMount(() => {
  console.log('task onMount');
})

beforeUpdate(()	=> {
  //console.log('task beforeUpdate');
  checkPage();
  let _params = location.search.substr(1);
  //console.log('_params', _params);
  let params = [];
  if  ( _params )	{
    _params.split('&').map((item) => {
      let kv = item.split('=');
      params[decodeURI(kv[0])] = decodeURI(kv[1]);
    });
    console.log({params});
  }
  if  ( !users )  {
    users = [];
    axios.get('/api/users/member').then((result) => {
      users = result.data;
    })
  }
  if	( !tasks )	{
    tasks = [];
    updateTasks();
  }
});
afterUpdate(() => {
  //console.log('tasks afterUpdate');
})
</script>
