<template> 
  <brand-detail :is-edit='false'></brand-detail>
</template>
<script>
  import BrandDetail from './components/BrandDetail.vue'
  export default {
    name: 'addBrand',
    components: { BrandDetail }
  }
</script>