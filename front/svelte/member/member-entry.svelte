<div class="entry">
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <h5 class="entry-title">役職員情報</h5>
    </div> 
  </nav>
  <div class="row full-height fontsize-12pt">
    <div class="entry-content">
      <div class="entry-body">
        <MemberInfo
          classes={classes}
          users={users}
          bind:member={member} />
      </div>
      <div class="entry-footer">
        <button type="button" class="btn btn-secondary" disabled={disabled}
          on:click={back}>もどる</button>
        {#if ( member && member.id && member.id > 0 )}
        <button type="button" class="btn btn-danger" disabled={disabled}
          on:click={delete_}
          id="delete-button">削除</button>
        {/if}
        <button type="button" class="btn btn-primary" disabled={disabled}
          on:click={save}
          id="save-button">保存</button>
      </div>
    </div>
  </div>
</div>

<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();
import MemberInfo from './member-info.svelte';

export  let member;
export  let classes;
export  let users;

let disabled = false;
let update;

onMount(() => {
  console.log('member-entry onMount', member);
})

const create_member = async (_member) => {
  let result = await axios.post('/api/member', _member);
  console.log('create', result);
  return	(result);
}
const update_member = async (_member) => {
  console.log('save_member', _member);
  let result = await axios.put('/api/member', _member);
     
  console.log(result);
  return	(result);
}
const delete_member = async (member) => {
  console.log('delete_member', member);
  let result = await axios.delete('/api/member', {
    data: {
      id: member.id
    }
  });
  console.log(result);
}
const bind_file = async(file) => {
  console.log('bind_file', file.id, file.memberId);
  let	result = await axios.put('/api/member/bind', {
    id: file.id,
    memberId: file.memberId
  });
  return	(result);
}
const save = () => {
  console.log('member', member);
  if	( member.memberClassId )	{
    member.memberClassId = parseInt(member.memberClassId);
  }
  console.log('input', member);
  try {
    let	it;
    let create = false;
    if ( member.id  ) {
      member.id = parseInt(member.id);
      it = update_member(member);
    } else {
      it = create_member(member);
      create = true;
    }
    it.then((result) => {
      update = true;
      //console.log('result', result);
      member = result.data;
      if  ( create )  {
        window.history.pushState(
          null, "", `/member/entry/${member.id}`);
      }
    });
  }
  catch(e) {
    console.log(e);
    // can't save
    //	TODO alert
  }
};


const clean = () => {
  member = null;
}

const	back = (event) => {
  clean();
  dispatch('close', update);
}

beforeUpdate(() => {
  //console.log('member-entry beforeUpdate', member);
  update = false;
  if	( !member )	{
    member = {
      legalName: ''
    };
  }
});

const	delete_ = (event) => {
  try {
    console.log('delete');
    delete_member(member).then(() => {
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
