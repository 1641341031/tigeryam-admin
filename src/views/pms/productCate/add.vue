<template> 
  <product-cate-detail :is-edit='false'></product-cate-detail>
</template>
<script>
  import ProductCateDetail from './components/ProductCateDetail.vue'
  export default {
    name: 'addProductCate',
    components: { ProductCateDetail }
  }
</script>