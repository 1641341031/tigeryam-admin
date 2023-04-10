<template> 
  <brand-detail :is-edit='true'></brand-detail>
</template>
<script>
  import BrandDetail from './components/BrandDetail.vue'
  export default {
    name: 'updateBrand',
    components: { BrandDetail }
  }
</script>