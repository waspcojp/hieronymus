<div class="entry">
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <h5 class="entry-title">案件情報</h5>
    </div> 
  </nav>
  <div class="row full-height fontsize-12pt">
    <div class="entry-content">
      <div class="entry-body">
        <FormError
        	messages={errorMessages}></FormError>
        <TaskInfo
          users={users}
          on:startregister={() => { disabled = true}}
          on:endregister={() => { disabled = false}}
          bind:task={task}
          bind:files={files}></TaskInfo>
      </div>
      <div class="entry-footer">
        <button type="button" class="btn btn-secondary" disabled={disabled}
          on:click={back}>もどる</button>
        {#if ( task && task.id && task.id > 0 )}
        <button type="button" class="btn btn-danger" disabled={disabled}
          on:click={delete_}
          id="delete-button">削除</button>
        <button type="button" class="btn btn-primary" disabled={disabled}
          on:click={() => {
              task.id = undefined;
              save()
            }
          }
          id="create-button">複製</button>
        {/if}
        <button type="button" class="btn btn-primary" disabled={disabled}
          on:click={save}
          id="save-button">保存</button>
        {#if ( task && task.id && !invoice)}
        <button type="button" class="btn btn-info"
          on:click={create}
          id="save-button">取引文書作成</button>
				{/if}
      </div>
    </div>
  </div>
</div>
<script>
import axios from 'axios';
import {numeric, formatDate} from '../../../libs/utils.js';
import {bindFile} from '../../javascripts/document';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();
import TaskInfo from './task-info.svelte';
import FormError from '../common/form-error.svelte';
import eventBus from '../../javascripts/event-bus.js';
import {currentTask, currentInvoice, getStore} from '../../javascripts/current-record.js'

export  let users;
export	let	status;
export	let task;

let update;
let disabled = false;
let files;
let invoice;
let errorMessages = [];

const create_task = async (_task) => {
  let result = await axios.post('/api/task', _task);
  console.log(result);
  return	(result);
}
const update_task = async (_task) => {
  console.log('save_task', _task);
  let result = await axios.put('/api/task', _task);
     
  console.log(result);
  return	(result);
}
const delete_task = (_task) => {
  console.log('delete_task', _task);
  let result = axios.delete(`/api/task/${_task.id}`);
  console.log(result);
	return	(result);
}

const save = () => {
  if	( task.customerId )	{
    task.customerId = parseInt(task.customerId);
  }
  try {
    let	pr;
    let create = false;
    if ( task.id  ) {
      task.id = parseInt(task.id);
      pr = update_task(task);
    } else {
      pr = create_task(task);
      create = true;
    }
    pr.then((result) => {
      update = true;
      console.log('result', result);
      if  ( !result.data.code ) {
        task = result.data.task;
        bindFile(files,task.documentId);
      }
      eventBus.emit('taskSelected', task);
      console.log('save', {status})
      if  ( create )  {
        window.history.replaceState(
          status, "", `/task/entry/${task.id}`);
      }
    });
  }
  catch(e) {
    console.log(e);
    // can't save
    //	TODO alert
  }
}

const create = () => {
	currentTask.set(task);
  window.history.pushState(
    status, "", `/invoice/new`);
  status.current = 'invoice';
  status.state = 'new';
}

const	back = (event) => {
  dispatch('close');
  currentTask.set(null);
  errorMessages = [];
  window.history.back();
}

beforeUpdate(() => {
  //console.log('task-entry beforeUpdate', task);
  update = false;
  if	( !task )	{
    task = {
      issueDate: formatDate(new Date()),
      subject: '',
      document: {}
    };
  }
});

onMount(() => {
	invoice = getStore(currentInvoice);
})

const	delete_ = (event) => {
  try {
    console.log('delete');
    delete_task(task).then(() => {
      back();
    });
  }
  catch(e) {
    console.log(e);
    // can't delete
    //	TODO alert
  }
}
</script>
