<div class="row full-height fontsize-12pt" style="overflow-y: scroll;">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th scope="col" style="width: 150px;">
          クラス
        </th>
        <th scope="col" style="width: 150px;">
          名前
        </th>
        <th scope="col" style="width: 100px;">
          入社年度
        </th>
        <th scope="col" style="width: 120px;">
          誕生日(年齢)
        </th>
      </tr>
      <tr>
        <th style="padding:5px;">
          <select class="form-select" id="memberClass"
            on:input={(event) => { dispatch('selectClass', event.currentTarget.value) }}
            bind:value={memberClassId}>
            <option value={-1}>未設定</option>
            {#if classes}
            {#each classes as line}
            <option value={line.id}>{line.title}</option>
            {/each}
            {/if}
          </select>
        </th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each members as line}
      <tr>
        <td>
          {line.memberClass.title}
        </td>
        <td>
          <a href="#" data-no={line.id} on:click={openMember}>
            {line.tradingName ? line.tradingName : line.legalName}
          </a>
        </td>
        <td>
          {#if line.joiningDate}
          {line.joiningDate.replaceAll('-', '/')}
          {/if}
        </td>
        <td>
          {#if line.birthDate}
          {line.birthDate.replaceAll('-', '/')}
          ({age(line.birthDate)})
          {/if}
        </td>
        <td></td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
th {
  text-align: center;
}
</style>

<script>
import {numeric} from '../../javascripts/cross-slip';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();
import {age} from '../../../libs/utils';

export	let	members;
export  let classes;

let memberClassId;

beforeUpdate(() => {
  //console.log('item-list beforeUpdate');
});

const openMember = (event) => {
  event.preventDefault();
  let id = event.currentTarget.dataset.no;
  let	member;

  console.log({members});

  for ( let i = 0; i < members.length; i ++ ) {
    if ( members[i].id == id ) {
      member = members[i];
      break;
    }
  }
  dispatch('open', member);
}
</script>
