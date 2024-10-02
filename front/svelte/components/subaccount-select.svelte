<ul class="nav">
  {#each account.subAccounts as sub}
    <li class="nav-item pe-2">
      <a class="btn {sub.subAccountCode === sub_account_code ? ' btn-primary disabled' : 'btn-outline-primary'}"
          href={`${href}/${account.accountCode}/${sub.subAccountCode}`}>
        {sub.name}
      </a>
    </li>
  {/each}
</ul>
<script>
export let account;
export let sub_account_code;
export let href;

</script>