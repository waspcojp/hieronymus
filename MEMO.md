# 実装メモ

## エラーコード

<dl>
    <dt>-1</dt>
    <dd>レコードがない</dd>
    <dt>-10</dt>
    <dd>権限がない</dd>
</dl>

## Invoiceの正規化について

* taskやcustomerでの正規化はしていません
* taskやcustomerに所属しないinvoiceを作るためです
	* taskやcustomerにある情報と同じ情報をinvoiceには持つ必要があります
* これは必要だからやっていることなので、後々「正規化してないじゃん」と勝手に正規化はしないように