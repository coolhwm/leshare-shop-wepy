export default {
  id: 1,
  name: '店铺首页',
  components: [
    // 1. 顶部搜索栏
    {
      id: 1,
      type: 1 // 1-搜索栏
    },
    // 2. 轮播图
    {
      id: 2,
      name: '轮播图',  // 橱窗名称
      type: 2, // 轮播图
      count: 5, // 一共有几个图片
      data: [
        {
          seq: 1, // 排序号
          url: 'http://ostb6zm4z.bkt.clouddn.com/FrqEyVf52LcOyqFI80Vo6On82DKH', // 图片
          action: 1, // 0-无动作，1-跳转商品，2-跳转分类，3-跳转页面
          targetId: ''  // 对应商品ID/分类ID/页面ID
        },
        {
          seq: 1, // 排序号
          url: 'http://ostb6zm4z.bkt.clouddn.com/FrqEyVf52LcOyqFI80Vo6On82DKH', // 图片
          action: 1, // 0-无动作，1-跳转商品，2-跳转分类，3-跳转页面
          targetId: ''  // 对应商品ID/分类ID/页面ID
        }
      ]
    },
    // 3. 导航菜单
    {
      id: 3,
      name: '首页菜单',
      type: 3,  // 图片橱窗
      count: 4, // 一共几个图片
      data: [
        {
          seq: 1, // 排序号
          url: 'http://ostb6zm4z.bkt.clouddn.com/FrqEyVf52LcOyqFI80Vo6On82DKH', // 图片
          action: 1, // 0-无动作，1-跳转商品，2-跳转分类，3-跳转页面
          targetId: ''  // 对应商品ID/分类ID/页面ID
        },
        {
          seq: 2, // 排序号
          url: 'http://ostb6zm4z.bkt.clouddn.com/FrqEyVf52LcOyqFI80Vo6On82DKH', // 图片
          action: 1, // 0-无动作，1-跳转商品，2-跳转分类，3-跳转页面
          targetId: ''  // 对应商品ID/分类ID/页面ID
        },
        {
          seq: 3, // 排序号
          url: 'http://ostb6zm4z.bkt.clouddn.com/FrqEyVf52LcOyqFI80Vo6On82DKH', // 图片
          action: 1, // 0-无动作，1-跳转商品，2-跳转分类，3-跳转页面
          targetId: ''  // 对应商品ID/分类ID/页面ID
        },
        {
          seq: 4, // 排序号
          url: 'http://ostb6zm4z.bkt.clouddn.com/FrqEyVf52LcOyqFI80Vo6On82DKH', // 图片
          action: 1, // 0-无动作，1-跳转商品，2-跳转分类，3-跳转页面
          targetId: ''  // 对应商品ID/分类ID/页面ID
        }
      ]
    },
    // 4. 推荐商品分类
    {
      id: 3,
      title: '热销商品',
      type: 4, // 商品分类橱窗,
      count: 5, // 展示的商品最大数量
      layout: 1, // 1-横向单个商品；2-方形单个商品；3-一行2个方形商品；4-一行3个方形商品；
      categoryId: -1, // 分类ID
      isTitle: true, // 是否展现分类标题
      isMore: true, // 是否展现更多按钮
      isCart: true, // 是否展现加入购物车
      isPrice: true, // 是否展现价格
      isName: true, // 是否展现商品名称
      data: []  // 商品数据
    },
    // 5. 其他推荐商品
    {
      id: 3,
      title: '店长推荐',
      type: 4, // 商品分类橱窗,
      count: 5, // 展示的商品最大数量
      layout: 1, // 1-横向单个商品；2-方形单个商品；3-一行2个方形商品；4-一行3个方形商品；
      categoryId: -1, // 分类ID
      isTitle: true, // 是否展现分类标题
      isMore: true, // 是否展现更多按钮
      isCart: true, // 是否展现加入购物车
      isPrice: true, // 是否展现价格
      isName: true, // 是否展现商品名称
      data: []  // 商品数据
    }
  ]
};
