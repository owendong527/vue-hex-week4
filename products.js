import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import pagination from "./components/pagination.js";
import ProductModal from "./components/ProductModal.js";
import delProductModal from "./components/delProductModal.js";

const site = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "owen-hexschool";



const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: [], //多圖
      },
      pages: {},
      modalProduct: null, //給productModal 所使用的
      modalDel: null, // 給 delModal 所使用的
      isNew: false,
    }
  },
  methods: {
    getProducts(page = 1){  // 參數預設值
      const api = `${site}/api/${apiPath}/admin/products?page=${page}`; //products有分頁的，products/all 是全部且沒有分頁
      // console.log(api);
      axios.get(api)
        .then(res =>{
          // console.log(res);
          this.products = res.data.products;
          this.pages = res.data.pagination
        })
    },
    openModal(status, product){
      if(status === 'new'){
        this.tempProduct = {
          imagesUrl:[]
        };
        this.isNew = true; //是新的
        //賦予之後就可以使用實體後的方法
        // this.modalProduct.show(); 移到 ProductModal.js的元件了
        this.$refs.pModal.openModal1();

      }else if(status ==='edit'){
        this.tempProduct = {...product}
        if(!Array.isArray(this.tempProduct.imagesUrl)){
          this.tempProduct.imagesUrl =[]
        }
        this.isNew = false; //不是新的
        // this.modalProduct.show()
        this.$refs.pModal.openModal1();
      } else if(status ==='delete') {
        this.tempProduct = {...product}
        this.isNew = false
        // this.modalDel.show()
        this.$refs.dModal.openModal();
      }
    },
    updateProduct(){
      //新增
      let api = `${site}/api/${apiPath}/admin/product`; 
      let method = 'post';
      //更新(不是新的就是編輯，編輯後就是更新)
      if (!this.isNew) {
        api = `${site}/api/${apiPath}/admin/product/${this.tempProduct.id}`; 
        method = 'put';
      }

      axios[method](api, {data: this.tempProduct})
        .then(res =>{

          //建立產品後 要再重新取得產品的內容
          this.getProducts();
          // 新增成功後要關掉頁面 
          // this.modalProduct.hide();
          this.$refs.pModal.closeModal1();
          // 新增完要把輸入匡清除
          this.tempProduct={};
        });
    },
    delProduct(){
      const api = `${site}/api/${apiPath}/admin/product/${this.tempProduct.id}`; 

      axios.delete(api)
        .then(res =>{

          //刪除產品後 要再重新取得產品的內容
          this.getProducts();

          // this.modalDel.hide();
          this.$refs.dModal.deleteModal()
        });
    }
  },
  mounted(){
    // 取得 在登入頁面寫入cookie的Token 這裡拿出來用
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexVueToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // console.log(token);
    //因為登入的頁面是管理者登入的 而必須帶入 token，而這token 須帶在header裡面
    axios.defaults.headers.common["Authorization"] = token;
    this.getProducts();

    // 用ref 來抓DOM 元素
    //console.log(this.$refs) //確認有設定 ref的有在這裡面
    // this.modalProduct =  new bootstrap.Modal(this.$refs.productModal); 移到ProductModal 元件裡
    // this.modalDel =  new bootstrap.Modal(this.$refs.delProductModal);  //移到delProductModal 元件裡
  },
  components:{
    pagination,
    ProductModal,
    delProductModal,
  }
})

app.mount('#app')

