<input type="hidden" id="id" value={member.id}>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container-fluid">
  <div class="row mb-3">
    <label for="memberClass" class="col-1 col-form-label">種別</label>
    <div class="col-2">
      <select class="form-select" id="memberClass" bind:value={member.memberClassId}>
        <option value="-1">未設定</option>
        {#if classes}
        {#each classes as line}
        <option value={line.id}>{line.title}</option>
        {/each}
        {/if}
      </select>
    </div>
    <label for="user" class="col-1 col-form-label">ユーザー</label>
    <div class="col-3">
      <select class="form-select" id="user" bind:value={member.userId}>
        {#if users}
        <option value={0}>未設定</option>
        {#each users as line}
        <option value={line.id}>{line.name}</option>
        {/each}
        {/if}
      </select>
    </div>
  </div>
  <div class="row mb-3">
    <label class="col-1 col-form-label">名前</label>
    <div class="col-11">
      <div class="row">
        <div class="col-6">
          <div class="row">
            <label for="legalName" class="col-3 col-form-label">戸籍名</label>
            <div class="col-9">
              <input type="text" class="form-control" id="legalName"
                bind:value={member.legalName}>
            </div>
          </div>
          <div class="row">
            <label for="legalRuby" class="col-3 col-form-label">戸籍名(読み)</label>
            <div class="col-9">
              <input type="text" class="form-control" id="legalRuby"
                bind:value={member.legalRuby}>
            </div>
          </div>
        </div>
        <label for="tradingName" class="col-1 col-form-label">通称</label>
        <div class="col-5">
          <input type="text" class="form-control" id="tradingName"
            bind:value={member.tradingName}>
        </div>
      </div>
    </div>
  </div>
  <div class="row mb-3">
    <label for="birthDate" class="col-1 col-form-label">誕生日</label>
    <div class="col-2">
      <input type="date" class="form-control" id="birthDate"
        bind:value={member.birthDate}>
    </div>
    <label for="legalSex" class="col-1 col-form-label">戸籍性別</label>
    <div class="col-2">
      <select class="form-select" id="legalSex" bind:value={member.legalSex}>
        {#each LEGAL_SEX as sex}
        <option value={sex[0]}>{sex[1]}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="row mb-3">
    <label for="dependent" class="col-1 col-form-label">扶養家族</label>
    <div class="col-1">
      <input type="text" class="form-control number" id="dependent"
        bind:value={member.dependent}>
    </div>
    <label class="col-1 col-form-label">人</label>
  </div>
  <div class="row mb-3">
    <label for="joiningDate" class="col-1 col-form-label">入社日</label>
    <div class="col-2">
      <input type="date" class="form-control" id="joiningDate"
        bind:value={member.joiningDate}>
    </div>
    <label for="resignedDate" class="col-1 col-form-label">退職日</label>
    <div class="col-2">
      <input type="date" class="form-control" id="resignedDate"
        bind:value={member.resignedDate}>
    </div>
    <label for="resignReason" class="col-1 col-form-label">退職事由</label>
    <div class="col-2">
      <select class="form-select" id="legalSex" bind:value={member.resignReason}>
        {#each RESIGN_REASON as reason}
        <option value={reason[0]}>{reason[1]}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="row mb-3">
    <label for="zip" class="col-1 col-form-label">郵便番号</label>
    <div class="col-2">
      <input type="text" class="form-control" id="zip" bind:value={member.zip}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="address1" class="col-1 col-form-label">住所</label>
    <div class="col-11">
      <input type="text" class="form-control" id="address1" bind:value={member.address1}>
      <input type="text" class="form-control" id="address2" bind:value={member.address2}>
    </div>
  </div>
  <div class="row mb-3">
    <div class="col-1">口座情報</div>
    <div class="col-11">
      <div class="row">
        <label for="bankName" class="col-3 col-form-label">金融機関名</label>
        <label for="banBranchkName" class="col-3 col-form-label">支店名</label>
        <label for="accountType" class="col-2 col-form-label">口座種別</label>
        <label for="accountNo" class="col-3 col-form-label">口座番号</label>
      </div>
      <div class="row">
        <div class="col-3">
          <input type="text" class="form-control" id="bankName" bind:value={member.bankName}>
        </div>
        <div class="col-3">
          <input type="text" class="form-control" id="bankBranchName" bind:value={member.bankBranchName}>
        </div>
        <div class="col-2">
          <select class="form-control" id="accountType" bind:value={member.accountType}>
            {#each BANK_ACCOUNT_TYPE as bank}
            <option value={bank[0]}>{bank[1]}</option>
            {/each}
          </select>
        </div>
        <div class="col-3">
          <input type="text" class="form-control" id="accountNo" bind:value={member.accountNo}>
        </div>
      </div>
    </div>
  </div>
  <div class="row mb-3">
    <label for="telNo" class="col-1 col-form-label">電話</label>
    <div class="col-3">
      <input type="text" class="form-control" id="telNo" bind:value={member.telNo}>
    </div>
    <label for="email" class="col-1 col-form-label">E-Mail</label>
    <div class="col-4">
      <input type="text" class="form-control" id="email" bind:value={member.email}>
    </div>
  </div>
</div>
<style>
</style>

<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import {LEGAL_SEX, RESIGN_REASON} from '../../../libs/member';
import {BANK_ACCOUNT_TYPE} from '../../../libs/utils';

export	let	member;
export  let classes;
export  let users;
beforeUpdate(() => {
})
onMount(() => {
  console.log('member-info onMount', member);
})

</script>
