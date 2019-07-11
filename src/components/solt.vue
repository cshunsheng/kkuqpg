<template>
    <div class="soltTest">
        <p>this is child component</p>
        <slot name='test_1' :msg="messages"></slot>
        <slot name="arrs" :data="arr"></slot>
    </div>
</template>
<script>
export default {
    data() {
        return {
            messages: 'this is test message',
            arr: ['zhangsan','lisi','wanwu','zhaoliu','tianqi','xiaoba']
        }
    },
}
</script>