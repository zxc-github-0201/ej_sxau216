<template>
    <div>
        <!-- 按钮 -->
        <el-button type="success" size="small" @click="toAddHandler">添加</el-button>
        <el-button type="danger" size="small">批量删除</el-button>
        <!-- 按钮 -->
        <!-- 表格 -->
        <el-table :data="categorys">
            <el-table-column fixed="left" prop="id" label="编号"></el-table-column>
            <el-table-column prop="name" label="栏目名称"></el-table-column>
            <el-table-column prop="num" label="序号"></el-table-column>
            <el-table-column prop="parentId" label="父栏目"></el-table-column>
            <el-table-column fixed="right" label="操作">
                <template v-slot="slot">
                    <a href="" @click.prevent="toDeleteHandler(slot.row.id)">删除</a>
                    <a href="" @click.prevent="toUpdateHandler(slot.row)">修改</a>
                </template>
            </el-table-column>
        </el-table>
        <!-- /表格 -->
        <!-- 分页开始 -->
          <!-- <el-pagination
             layout="prev, pager, next"
             :total="50">
          </el-pagination> -->
        <!-- /分页结束 -->        
<!-- 模态框 -->
        <el-dialog
            :title="title"
            :visible.sync="visible"
            width="60%">         
            <el-form :model="form" label-width="80px">
                <el-form-item label="栏目名称">
                    <el-input v-model="form.name"/>
                </el-form-item>
                <el-form-item label="序号">
                    <el-input v-model="form.num"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeModalHandler">取 消</el-button>
                <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
            </span>
        </el-dialog>
        <!-- /模态框 -->    </div>
</template>


<script>
import request from '@/utils/request'
import querystring from 'querystring'
export default {  
    //用于存放页面中需要调用的方法
    methods:{
    loadData(){
        let url="http://123.56.247.188:6677/category/findAll";
        request.get(url).then((response)=>{
            this.categorys = response.data;
        })
    },
        submitHandler(){
            
            let url = "http://123.56.247.188:6677/category/saveOrUpdate";
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
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            //调用后台接口，完成删除操作
            let url = "http://123.56.247.188:6677/category/deleteById?id="+id;
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
            this.form = row ;
            this.visible = true;
        },
        closeModalHandler(){
            this.visible = false;
        },  
        toAddHandler(){
            this.form ={
                type:"categorys"
            }
            this.visible = true;
        }
    },
    //用于存放要向网页中存放的数据
    data(){
        return{
            title:"录入地址信息",
            visible:false,
            categorys:[],
            form:{
                type:"categorys"
            }
        }
    },
    created(){
        this.loadData();
    }
  
    
}
</script>

<style scoped>

</style>

