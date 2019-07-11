<template>
  <div>
    <div class="wrapper">
      <section class="top">
        <v-head></v-head>
      </section>
      <section class="main aside_style">
        <v-sidebar></v-sidebar>
        <div class="content">
          <transition name="move" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import vHead from '@/components/Header.vue';
  import vSidebar from '@/components/Sidebar.vue';
  export default {
    components: {
      'v-head': vHead,
      'v-sidebar': vSidebar
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom:0;
  }
  .top {
    display: flex;
  }
  .main {
    display: flex;
    flex: 2;
    width: 100%;
    height: 100%;
  }
  .aside_style {
    overflow: auto;
  }
  .ms-doc h3 {
    padding: 9px 10px 10px;
    margin: 0;
    font-size: 14px;
    line-height: 17px;
    background-color: #f5f5f5;
    border: 1px solid #d8d8d8;
    border-bottom: 0;
    border-radius: 3px 3px 0 0;
  }

  .ms-doc article {
    padding: 45px;
    word-wrap: break-word;
    /*background-color: #fff;*/
    border: 1px solid #ddd;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .ms-doc article h1 {
    font-size: 32px;
    padding-bottom: 10px;
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
  }

  .ms-doc article h2 {
    margin: 24px 0 16px;
    font-weight: 600;
    line-height: 1.25;
    padding-bottom: 7px;
    font-size: 24px;
    border-bottom: 1px solid #eee;
  }

  .ms-doc article p {
    margin-bottom: 15px;
    line-height: 1.5;
  }

  .ms-doc article .el-checkbox {
    margin-bottom: 5px;
  }
</style>
