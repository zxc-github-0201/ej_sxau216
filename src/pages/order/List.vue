<template>
  <div>
    <!-- 选项卡 -->
    <el-tabs v-model="params.status" @tab-click="loadData">
      <el-tab-pane label="所有订单" name="所有订单"></el-tab-pane>
      <el-tab-pane label="待派单" name="待派单"></el-tab-pane>
      <el-tab-pane label="待接单" name="待接单"></el-tab-pane>
      <el-tab-pane label="待服务" name="待服务"></el-tab-pane>
      <el-tab-pane label="待确认" name="待确认"></el-tab-pane>
      <el-tab-pane label="已完成" name="已完成"></el-tab-pane>
    </el-tabs>
    <!-- /选项卡 -->
    <!-- 表格 -->
    <el-table :data="orders.list">
      <el-table-column prop="id" label="订单编号"></el-table-column>
      <el-table-column width="200" prop="orderTime" label="下单时间"></el-table-column>
      <el-table-column prop="total" label="总价"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="customerId" label="顾客id"></el-table-column>
      <el-table-column prop="waiterId" label="员工id"></el-table-column>
      <el-table-column prop="addressId" label="地址id"></el-table-column>          
      <el-table-column fixed="right" label="操作">
          <template v-slot="slot">
            <a href @click.prevent="getOrderLinesByOrderId">详情</a>
            <a href v-if="slot.row.status === '待派单'" @click.prevent="toSendOrderHandler(slot.row)">派单</a>
          </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <!-- 分页--> 
      <el-pagination
        hide-on-single-page="true"
        layout="prev, pager, next"
        :total="orders.total" 
        @current-change="pageChangeHandler">
       </el-pagination>
    <!-- /分页-->
    <!-- 模态框--> 
        <el-dialog
            title="派单"
            :visible.sync="visible"
            width="60%">
            <div>
              <p> <strong>订单编号：</strong> {{form.id}} </p>
              <p> <strong>订单总价：</strong> {{form.total}} </p>
              <p> <strong>下单时间：</strong> {{form.orderTime}} </p>
              <p>
                <strong>派送员工：</strong>
                  <el-radio-group v-model="waiterId">
                  <el-radio
                    border
                    size="small"
                    v-for="e in employees"
                    :key="e.id"
                    :label="e.id">{{e.realname}}</el-radio>
                </el-radio-group>
              </p>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="small" @click="closeModalHandler">取消</el-button>
              <el-button size="small" type="primary" @click="submitHandler">确定</el-button>
            </span>
        </el-dialog>
        <!-- /模态框-->      
  </div>
</template>
<script>
import request from "@/utils/request";
import querystring from "querystring";
export default {
  methods: {
    //去派单， 将模态框打开，然后选择员工作为派单对象
    toSendOrderHandler(row){
      this.form = row;
      this.visible = true;
    },
    pageChangeHandler(page){
        this.params.page = page-1;
        this.loadData();
    },
    //加载员工信息
    loadEmployees(){
      let url = "http://123.56.247.188:6677/waiter/findAll"
      request.get(url).then(response=>{
        this.employees = response.data;
      })
    },
    //订单详情
    getOrderLinesByOrderId() {
      
    },
    //加载订单信息
    loadData() {
      let url = "http://123.56.247.188:6677/order/queryPage";
      if(this.params.status ==="所有订单"){
        delete this.params.status;
      }
      request({
        url,
        method:"post",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        data:querystring.stringify(this.params)
      }).then((response)=>{
        //orders为一个对象，其中包含了分页信息以及列表信息
          this.orders = response.data;
      });
    },
    submitHandler(){
            let url = "http://123.56.247.188:6677/order/sendOrder";
            // request.post(url,this.form);
            request({
                url,
                method:"GET",
                params:{
                    orderId:this.form.id,
                    waiterId:this.waiterId
                }
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
        closeModalHandler(){
          this.visible = false;
        }
    
  },
  data() {
    return {
      visible: false,
      orders: {},
      form: {}, //当前订单
      params:{
          page:0,
          pageSize:10
      },
      employees:[],
      waiterId:null   //选中员工
    };
  },
  created() {
    //在页面加载出来时加载数据
    this.loadData();
    this.loadEmployees(); //加载员工信息
  }
};
</script>
<style scoped></style>