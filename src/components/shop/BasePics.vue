<template>
    <div id="upload-pic__container">

        <div class="imgList">
            <div class="imgBox" v-for="(imgs,index) in currentPicList" :key="index" v-dragging="{item:imgs,list:currentPicList,group:type,index:index}">
                <img :src="imgs.id_product_kkh_url" alt="">
                <div class="imgFuns">
                    <i @click.stop="viewImg(imgs.id_product_kkh_url,index)" class="el-icon-zoom-in"></i>
                    <i @click.stop="deleteImg(imgs.id_product_kkh_url,index)" class="el-icon-delete"></i>
                </div>
            </div>
            <div class="imgbox imgInput">
                <img src="../../../static/img/ordrefuse.jpg">
                <input type="file" accept="image/jpg,image/jpeg,image/png" @change="selectImg"/>
            </div>
            
        </div>

        <div class="viewBox">
            <el-dialog title="查看" :visible.sync="dialogVisible" width="50%">
                <span>
                    <img :src="dialogImageUrl" alt="">
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {
            currentPicList: [],   // 当前组件img list
            dialogImageTitle: '',
            dialogImageUrl: '',  // 查看大图src地址
            dialogVisible: false,  // 显示查看大图
            // getImgList: [],
            beforeChangeIndex: null,
            afterChangeIndex: null,
            changeUrl: null
        }
    },

    props: ['picList', 'type'],

    created() {
        this.currentPicList = Array.from(this.picList);
    },

    methods: {
        // 上传图片
        selectImg(event){
			const file = event.target.files[0];
			var formData = new FormData();
            formData.append('file',file);
            let _fileName = file.name
			var _this = this;
			this.http('POST',formData,function(res){
				if(res.data){
                    let _imgUrl = [{name:_fileName,url:res.data.image_url}];
					          // _this.getImg(res.data.image_url);
                    _this.clearInputFile(event.target);
                    _this.currentPicList = [..._this.currentPicList, ..._imgUrl];
                    _this.$emit('updatePicList', _this.type, Array.from(_this.currentPicList))
				}else{
					_this.$message.warning('图片上传失败，请重新上传')
                }
                
			})
        },
        // 图片http请求，返回src
        http(method,data,callback){
			var xhr = new XMLHttpRequest();
			xhr.open(method, 'http://admin-api.test.kangkanghui.com/upload/file');
			xhr.onreadystatechange = function() {  
			    if (xhr.readyState === 4)  
			        if ((xhr.status >=200 && xhr.status < 300) || xhr.status == 304)  
			        	callback(JSON.parse(xhr.responseText)); 
			}  
			xhr.send(data); 
			
        },
        // 上传完成后清空input file
        clearInputFile(f){
			if(f.value){
	            try{
	                f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
	            }catch(err){
	            }
	            if(f.value){ //for IE5 ~ IE10
	                var form = document.createElement('form'), ref = f.nextSibling;
	                form.appendChild(f);
	                form.reset();
	                ref.parentNode.insertBefore(f,ref);
	            }
	        }
		},
        // getImg(url) {
        //     let _src = url;
        //     this.getImgList.push(_src)
        // },
        deleteImg(url,index) {
            let _inx = index;
            this.currentPicList.splice(_inx,1)
            this.$emit('updatePicList', this.type, Array.from(this.currentPicList))
        },
        viewImg(url,index) {
            this.dialogVisible = true;
            this.dialogImageUrl = url;
        }
    },
    mounted () {
        // 拖拽时触发，回调里面有一个参数
        this.$dragging.$on('dragged', ({ value }) => {
            // console.log(value.index)
            // console.log(value.item.url)
            this.beforeChangeIndex = value.index
            this.changeUrl = value.item.name

            
        })
        // 停止拖拽后触发，回调无参数
        this.$dragging.$on('dragend', (res) => {
            
            if(this.currentPicList.length>0){
                console.log(JSON.stringify(this.currentPicList))
                this.$emit('updatePicList', this.type, Array.from(this.currentPicList))
                this.currentPicList.forEach((item,index)=>{
                    if(item.name == this.changeUrl){
                        this.afterChangeIndex = index
                    }
                })
                // console.log('changeName - ' + this.changeUrl)
                // console.log('beforeChange - ' + this.beforeChangeIndex)
                // console.log('afterChange - ' + this.afterChangeIndex)
                
            }else{
                return ;
            }
            
        })
    },
    computed: {
        c_currentPicList() {
            console.log('computed', this.currentPicList)
            return this.currentPicList
        }
    }
}
</script>

<style scoped>
.imgList{
    display: flex;
    flex-wrap: wrap;
    min-height: 160px;
}

.imgList .imgBox{
    width: 148px;
    height: 148px;
    overflow: hidden;
    margin: 10px 10px;
    position: relative;
}
.imgList .imgBox img{
    width: 100%;
    height: 100%;
    border:1px solid #ccc;
    box-sizing: border-box;
}
.imgList .imgInput{
    position: relative;
    margin: 10px 10px;
}
.imgList .imgInput img{
    position: absolute;
    z-index: 1;
    width: 148px;
    height: 148px;
    cursor: pointer;
}
.imgList .imgInput input{
	position: absolute;
	width: 148px;
    height: 148px;
	opacity: 0;
	z-index: 2;
    top: 0;
    left: 0;
    cursor: pointer;
}
.imgList .imgFuns{
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    width: 148px;
    height: 148px;
    color:#fff;
    font-size: 16px;
}
.imgList .imgFuns:hover{
    opacity: 1;
    background:rgba(0,0,0,.3);
    z-index: 2;
}
.imgList .imgFuns i{
    margin-top: 10px;
    margin-left: 10px;
    cursor: pointer;
}

.viewBox img{
    width: 100%;
}
</style>
