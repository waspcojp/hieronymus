<div class="row full-height fontsize-12pt" style="overflow-y: scroll;">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th scope="col" style="width: 150px;">
          相手先
        </th>
        <th scope="col" style="width: 200px;">
          件名
        </th>
        <th scope="col" style="width: 100px;">
          発生日
        </th>
        <th scope="col" style="width: 100px;">
          終了日
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px 20px;">
          <CustomerSelect
            register=false
            bind:value={customerId}
            on:input={changeCustomer}>
          </CustomerSelect>
        </td>
        <td>
        </td>
        <td>
        </td>
      </tr>
      {#each tasks as line}
      <tr>
        <td>
          {#if (line.customerId)}
          <a href="/customer/{line.customerId}">
            {line.customerName ? line.customerName : line.customer.name}
          </a>
          {:else}
          {line.customerName ? line.customerName : '__' }
          {/if}
        </td>
        <td>
          <a href="#" on:click|preventDefault={() => {
              openTask(line.id)
            }}>
            {line.subject ? line.subject : '__'}
          </a>
        </td>
        <td>
          {formatDate(line.issueDate)}
        </td>
        <td>
          {formatDate(line.endedAt)}
        </td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
th {
  text-align: center;
}
.file-item {
  width:40px;
  height:40px;
  padding:5px;
  float: left;
}
.rect-image {
  width:40px;
  clip:rect(0,40px,40px,0);
}
</style>

<script>
import CustomerSelect from '../components/customer-select.svelte';

import {numeric, formatDate} from '../../../libs/utils.js';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();
import eventBus from '../../javascripts/event-bus.js';

export	let	tasks;

let customerId;

beforeUpdate(() => {
  console.log('task-list beforeUpdate');
});

const changeCustomer = (event) => {
  let customerId = event.detail;
  console.log('changeCustomer', {customerId});
  dispatch('selectCustomerId', customerId);
}

const openTask = (id) => {
  let	task;

  console.log('openTask', id);
  console.log('tasks', tasks);

  for ( let i = 0; i < tasks.length; i ++ ) {
    if ( tasks[i].id == id ) {
      task = tasks[i];
      break;
    }
  }
  dispatch('open', task);
  eventBus.emit('taskSelected', task);
}
</script>
