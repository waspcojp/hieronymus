<ToastContainer let:data={data}>
  <FlatToast {data} /> <!-- Provider template for your toasts -->
</ToastContainer>
<script>
import { toasts, ToastContainer, FlatToast, BootstrapToast }  from "svelte-toasts";
let toast;
export const show = (title, description, type='success') => {
  toast = toasts.add({
    title: title,
    description: description,
    duration: 10000,
    placement: 'top-center',
    type: type,
    theme: 'dark',
    onClick: () => {},
    onRemove: () => {},
    component: BootstrapToast, 
  });
    // toast.remove()
}
export const remove = () => {
  toast.remove();
}
</script>