<template lang="pug">
    <div class="app">
        <div class="aside">
            <locationAside/>
        </div>
        <div class="main">
            <searchForm/>
            <toolBar/>
            <locationTable/>
        </div>
        <loading v-if="LOADING" />
    </div>
</template>

<script>
import locationAside from './components/location-aside'
import searchForm from './components/search-form'
import toolBar from './components/tool-bar'
import locationTable from './components/location-table'
import loading from './components/base/loading'
import { mapState } from 'vuex'

export default {
  components: { locationAside, searchForm, toolBar, locationTable, loading },
  computed: {
    ...mapState(['LOADING']),
  },
}
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  padding: 10px;
}
.aside {
  margin-right: 15px;
}
.main {
  width: 100%;
  padding: 10px;
}
</style>
