<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="row mb-3 w-100 file"
  on:drop={onDrop}
  on:dragover={onDragOver}>
  {#if !files || files.length === 0}
  <div class="mt-3 p-3">
    アップロードされたファイルはありません。
  </div>
  {:else}
  {#each files as file}
  <div class="col-2">
    <div style="margin:10px 0 5px 0;">
      <button type="button" on:click={() => {
        deleteFile(file.id)
      }}>
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div style="text-align:center;">
      {#if ( file.mimeType.match(/^image\//) ) }
      <a href="/api/document/file/{file.id}" target="_blank">
        <img src="/api/document/file/{file.id}" style="max-width: 100%;"/>
      </a>
      {:else}
      <a href="/api/document/file/{file.id}" download={file.name}>
        <img src="/public/file_icons/{fileIcon(file.mimeType)}" class="w-100" />
        <span style="">{file.name}</span>
      </a>
      {/if}
    </div>
  </div>
  {/each}
  {/if}
</div>

<script>
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import axios from 'axios';

export let files;
export let document;

const fileIcon = (mime) => {
  const types = [
    [ "audio/aac",                        "icon_aac.png"],
    [ "video/x-msvideo",                  "icon_avi.png"],
    [ "image/bmp",                        "icon_bmp.png" ],
    [ "chemical/x-chemdraw",              "icon_chm.png" ],
    [ "text/css",                         "icon_css.png" ],
    [ "application/x-msdos-program",      "icon_dll.png" ],
    [ "application/msword",               "icon_doc.png" ],
    [ "application/vnd.dtg.local.flash",  "icon_fla.png" ],
    [ "image/gif",                        "icon_gif.png" ],
    [ "text/html",                        "icon_html.png" ],
    [ "application/java-archive",         "icon_jar.png" ],
    [ "image/jpeg",                       "icon_jpg.png" ],
    [ "text/javascript",                  "icon_js.png" ],
    [ "application/msaccess",             "icon_mdb.png" ],
    [ "video/quicktime",                  "icon_mov.png" ],
    [ "audio/mpeg",                       "icon_mp3.png" ],
    [ "video/mpeg",                       "icon_mpg.png" ],
    [ "application/vnd.oasis.opendocument.presentation",
                                          "icon_odp.png" ],
    [ "application/vnd.oasis.opendocument.spreadsheet",
                                          "icon_ods.png" ],
    [ "application/vnd.oasis.opendocument.text",
                                          "icon_odt.png" ],
    [ "application/pdf",                  "icon_pdf.png" ],
    [ "image/png",                        "icon_png.png" ],
    [ "application/vnd.ms-powerpoint",    "icon_ppt.png" ],
    [ "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                          "icon_ppt.png" ],
    [ "text/x-python",                    "icon_py.png" ],
    [ "application/x-ruby",               "icon_rb.png" ],
    [ "audio/x-pn-realaudio",             "icon_real.png" ],
    [ "application/rtf",                  "icon_rtf.png" ],
    [ "text/rtf",                         "icon_rtf.png" ],
    [ "application/sql",                  "icon_sql.png" ],
    [ "application/vnd.adobe.flash.movie","icon_swf.png" ],
    [ "audio/x-wav",                      "icon_wav.png" ],
    [ "audio/x-ms-wma",                   "icon_wma.png" ],
    [ "video/x-ms-wmv",                   "icon_wmv.png" ],
    [ "application/vnd.ms-excel",         "icon_xls.png" ],
    [ "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                          "icon_xls.png" ],
    [ "text/xml",                         "icon_xml.png" ],
    [ "application/xslt+xml",             "icon_xsl.png" ],
    [ "application/zip",                  "icon_zip.png" ]
  ];
  let match = types.find((el) => el[0] === mime);
  let name;
  if  ( !match ) {
    if	( m = mime.match(/^image\//) ) {
      	name = "icon_image.png"        ;
    } else
    if	( m = mime.match(/^text\//) ) {
      name = "icon_txt.png";
    } else
    if	( m = mime.match(/^audio\//) ) {
      name = "icon_music.png";
    } else
    if	( m = mime.match(/^video\//) ) {
      name = "icon_movie.png";
    } else {
      name = "icon_file.png";
    }
  } else {
    name = match[1];
  }
  return  (name);
}
  
const onDragOver = (event) => {
  event.stopPropagation();
  event.preventDefault();
  //console.log("dragover", event);
}
  
const onDrop = (event) => {
  console.log('onDrop');
  event.stopPropagation();
  event.preventDefault();
  console.log(event);
  console.log(event.dataTransfer.files);
  if ( !files )	{
    files = [];
  }
  if ( event.dataTransfer ) {
    if  ( event.dataTransfer.files.length > 0 ) {
      for (let i = 0; i < event.dataTransfer.files.length; i ++ ) {
        let file = event.dataTransfer.files[i];
        console.log("drop", file);
        upload(file).then((ret) => {
          if	( ret.code == 0 )	{
            console.log('file',ret.file);
            files.push(ret.file);
            files = files;
          }
        });
      }
    }
  }
}
const deleteFile = (file_id) => {
  console.log('deleteFile', file_id);
  let	new_file = [];
  for	( let i = 0; i < files.length; i += 1 )	{
    let file = files[i];
    if	( file.id == file_id )	{
      axios.delete('/api/document/file', {
        data: {
          id: file_id
        }
      });
    } else {
      new_file.push(file);
    }
  }
  files = new_file;
}
const upload = (file) => {
  return new Promise((done, fail) => {
    console.log(file);
    let id = document.id;
    const body = new FormData();
    body.append('file', file);
    let url;
    if	( id )	{
      url = `/api/document/upload/${id}`;
    } else {
      url = `/api/document/upload`;
    }
    axios.post( url,
      body,
      {
        "content-type": "multipart/form-data"
      }
    ).then(result => {
      console.log('result', result);
      done(result.data);
    }).catch(err => {
      fail(err);
    });
  });
}
beforeUpdate(() => {
  console.log('document beforeUpdate', {document})
  if  ( !files && document && document.id )  {
  	axios.get(`/api/document/files/${document.id}`).then((result) => {
    	files = result.data;
  	})
  }
})
</script>
  