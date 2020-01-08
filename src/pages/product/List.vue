<template>
    <div>
        <el-button type="success" @click="toAddHandler">添加</el-button>
        <el-button type="danger">批量删除</el-button>

        <!-- 表格 -->
        <el-table :data="products">
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="categoryId" label="所属分类"></el-table-column>
            <el-table-column width="650px" prop="photo" label="图片"></el-table-column>
            <el-table-column fixed="right" label="操作">
                <template v-slot="slot">
                    <a href="" @click.prevent="toDeleteHandler(slot.row.id)">删除</a>
                    <a href="" @click.prevent="toUpdateHandler(slot.row)">修改</a>
                </template>
            </el-table-column>
        </el-table>
        <!-- /表格 -->
         <!-- 模态框--> 
        <el-dialog
            title="添加产品信息"
            :visible.sync="visible"
            width="60%">
            <!-- {{form}} -->
            <el-form :model="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="所属栏目">
                    <el-select v-model="form.categoryId" placeholder="请选择">
                        <el-option v-for="item in options"
                            :key="item.id" 
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload
                        class="upload-demo"
                        action="http://134.175.154.93:6677/file/upload"
                        :on-success = "uploadSuccessHandler"
                        :file-list="fileList"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeModalHandler">取 消</el-button>
            <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
             </span>
        </el-dialog>
        <!-- /模态框--> 
    </div>
</template>
<script>
import request from '@/utils/request'
import querystring from 'querystring'
export default {
    methods:{
        //上传成功的事件处理函数
        uploadSuccessHandler(response){
            let photo = "http://134.175.154.93:8888/group1/"+response.data.id;
            console.log(response);
            //将图片地址设置到form中，便于一起提交给后台
            this.form.photo = photo;
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
         },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
         },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        loadData(){
            let url = "http://123.56.247.188:6677/product/findAll"
            request.get(url).then((response)=>{
            //将查询结果设置到product中,this指向外部函数的this
            this.products = response.data;
        })
        },
        submitHandler(){
            //this.form 对象  ---字符串--->后台{type:'customer,age:12}
            //json字符串 '{"type":"customer","age":12}'
            //request.post(url,this.form)
            //查询字符串 type=customer&age=12
            //通过request与后台进行交互，并且要携带参数
            let url = "http://123.56.247.188:6677/product/saveOrUpdate";
            // request.post(url,this.form);
            request({
                url,
                method:"POST",
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                data:querystring.stringify(this.form)
            }).then((response)=>{
                //模态框关闭
                this.closeModalHandler();
                //刷新
                this.loadData();
                //提示消息
                this.$message({
                    type:"success",
                    message:response.message
                })
            })
        },
        toDeleteHandler(id){
            // 确认
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            //调用后台接口，完成删除操作
            let url = "http://123.56.247.188:6677/product/deleteById?id="+id;
                request.get(url).then((response)=>{
                //1.刷新数据
                this.loadData()
                //2.提示结果
                this.$message({
                type: 'success',
                message: response.message
             });
            })
            })
        },
        toUpdateHandler(row){
            //模态框的表单显示当前行信息
            this.fileList = [];
            this.form = row ;
            
            this.visible = true;
        },
        closeModalHandler(){
            this.visible = false;
        },
        toAddHandler(){
            this.fileList = [];
            let url = "http://123.56.247.188:6677/category/findAll"
            request.get(url).then((response)=>{
                this.options = response.data;
                this.loadData();
            })
            this.form ={
                type:"products"
            }
            this.visible = true;
            
        }
    },
    data(){
        
        return{
            visible:false,
            products:[],
            options:[],
            form:{
                
            },
            fileList:[]
            
        }
    },
    created(){
            //在页面加载出来时加载数据
            this.loadData();
        },
}
</script>
<style scoped>

</style>