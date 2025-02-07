import axios from 'axios';

const bind_file = async (file) => {
  console.log('bind_file', file.id, file.documentId);
  let	result = await axios.put('/api/document/bind', {
    id: file.id,
    documentId: file.documentId
  });
  return	(result);
}
  
export const bindFile = (files, documentId) => {
  if  ( files && files.length > 0 ) {
    console.log('files', files.length);
    for	( let i = 0; i < files.length ; i += 1 )	{
      console.log('documentId', files[i].documentId);
      if	( !files[i].documentId )	{
        files[i].documentId = documentId;
        bind_file(files[i]);
      }
    }
  }
}
  