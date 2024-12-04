<input type="hidden" id="id" value={customer.id}>
<div class="container-fluid">
  <div class="row mb-3">
    <label for="name" class="col-2 col-form-label">取引先種別</label>
    <div class="col-sm-10">
      <select class="form-control" id="type" bind:value={customer.type}>
        {#each customerClasses as customerClass }
        <option value={customerClass[1]}>{customerClass[0]}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="row mb-3">
    <label for="name" class="col-2 col-form-label">名前</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="name" bind:value={customer.name}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="ruby" class="col-2 col-form-label">フリガナ</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="ruby" bind:value={customer.ruby}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="key" class="col-2 col-form-label">呼び出しキー</label>
    <div class="col-sm-3">
      <input type="text" class="form-control" id="key" bind:value={customer.key}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="key" class="col-2 col-form-label">インボイス番号</label>
    <div class="col-sm-3">
      <input type="text" class="form-control" id="key" bind:value={customer.invoiceNo}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="zip" class="col-2 col-form-label">郵便番号</label>
    <div class="col-sm-3">
      <input type="text" class="form-control" id="zip" bind:value={customer.zip}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="address1" class="col-2 col-form-label">住所</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="address1" bind:value={customer.address1}>
      <input type="text" class="form-control" id="address2" bind:value={customer.address2}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="closingDate" class="col-2 col-form-label">締め日</label>
    <div class="col-2">
      <input type="text" class="form-control" id="closingDate" bind:value={customer.closingDate}>
    </div>
    <label for="paymentDate" class="col-2 col-form-label">支払日</label>
    <div class="col-2">
      <input type="text" class="form-control" id="paymentDate" bind:value={customer.paymentDate}>
    </div>
  </div>
  <div class="row mb-3">
    <div class="col-2">口座情報</div>
    <div class="col-10">
      <div class="row">
        <label for="bankName" class="col-3 col-form-label">金融機関名</label>
        <label for="banBranchkName" class="col-3 col-form-label">支店名</label>
        <label for="accountType" class="col-2 col-form-label">口座種別</label>
        <label for="accountNo" class="col-3 col-form-label">口座番号</label>
      </div>
      <div class="row">
        <div class="col-3">
          <input type="text" class="form-control" id="bankName" bind:value={customer.bankName}>
        </div>
        <div class="col-3">
          <input type="text" class="form-control" id="bankBranchName" bind:value={customer.bankBranchName}>
        </div>
        <div class="col-2">
          <select class="form-control" id="accountType" bind:value={customer.accountType}>
            <option value="">未設定</option>
            <option value="1">普通</option>
            <option value="2">当座</option>
            <option value="9">その他</option>
          </select>
        </div>
        <div class="col-3">
          <input type="text" class="form-control" id="accountNo" bind:value={customer.accountNo}>
        </div>
      </div>
    </div>
  </div>
  <div class="row mb-3">
    <label for="telNo" class="col-2 col-form-label">電話</label>
    <div class="col-3">
      <input type="text" class="form-control" id="telNo" bind:value={customer.telNo}>
    </div>
    <label for="faxNo" class="col-2 col-form-label">FAX</label>
    <div class="col-3">
      <input type="text" class="form-control" id="faxNo" bind:value={customer.faxNo}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="email" class="col-2 col-form-label">E-Mail</label>
    <div class="col-4">
      <input type="text" class="form-control" id="email" bind:value={customer.email}>
    </div>
    <label for="url" class="col-2 col-form-label">ホームページ</label>
    <div class="col-4">
      <input type="text" class="form-control" id="url" bind:value={customer.url}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="chargeName" class="col-2 col-form-label">担当者名</label>
    <div class="col-sm-3">
      <input type="text" class="form-control" id="chargeName" bind:value={customer.chargeName}>
    </div>
  </div>
  <div class="row mb-3">
    <label for="description" class="col-2 col-form-label">備考</label>
    <div class="col-sm-10">
      <textarea class="form-control" id="description" bind:value={customer.description} />
    </div>
  </div>
</div>

<style>
</style>
<script>
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';

export	let	customer;

const customerClasses = [
    [ '未設定',			0],
    [ '税金公共料金等',	 1],
    [ '国内購買先',		11],
    [ '海外購買先',		12],
    [ '国内外注',		21],
    [ '海外外注',		22],
    [ '国内顧客',		31],
    [ '海外顧客',		32],
    [ '金融機関明細',	99]
];

beforeUpdate(() => {

});
</script>
