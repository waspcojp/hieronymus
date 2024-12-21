export const voucherType = (code) => {
    if	( code )	{
      switch	(code)	{
        case	1:
          return	('受取請求書');
        case	2:
          return	('受取領収書');
        case	11:
          return	('差出請求書');
        case	12:
          return	('差出領収書');
        default:
          return	('その他');
      }
    } else {
      return	('未設定');
    }
}