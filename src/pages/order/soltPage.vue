<template>
    <div class="soltPage">
        <Child>
            <template slot='test_1' slot-scope="child">
                <div>ad: {{child.msg}}</div>
            </template>
            <template slot='arrs' slot-scope="abc">
                <ul>
                    <li v-for="item in abc.data">{{item}}</li>
                </ul>
            </template>
        </Child>
    </div>
</template>
<script>
import Child from '@/components/solt'
export default {
    data() {
        return {
            
        }
    },
    components: {
        Child
    }
}
</script>