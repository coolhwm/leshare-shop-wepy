export default {
  id: 1,
  name: '店铺首页',
  components: [
    // 1. 顶部搜索栏
    {
      id: 1,
      type: 'SEARCH_BAR', // SEARCH_BAR-搜索栏
      logoText: '蔬菜侠',  // 商家名称，展现在搜索栏前面，二选一
      logoUrl: null,  // 商家LOGO，展现在搜索栏前面，二选一,
      placeholder: '请输入搜索内容...'
    },
    // 2. 轮播图
    {
      id: 2,
      name: '轮播图',  // 橱窗名称
      type: 'SWIPER', // SWIPER-轮播图
      height: '250px',
      count: 2, // 一共有几个图片
      data: [
        {
          seq: 1, // 排序号
          url: 'http://img.leshare.shop/shop-demo/swiper-1.jpg', // 图片
          action: 'GOODS', // NONE-无动作，GOODS-跳转商品，GATEGORY-跳转分类，FUNCTION-跳转页面
          targetId: '240'  // 商品ID
        },
        {
          seq: 2, // 排序号
          url: 'http://img.leshare.shop/shop-demo/swiper-2.jpg', // 图片
          action: 'GOODS', //  NONE-无动作，GOODS-跳转商品，GATEGORY-跳转分类，FUNCTION-跳转页面
          targetId: '266'  // 商品ID
        }
      ]
    },
    // 3. 导航菜单
    {
      id: 3,
      name: '首页菜单',
      type: 'IMAGE_BOX',  // 图片橱窗
      count: 4, // 一共几个图片
      heigth: '66px',
      width: '66px',
      isTitle: true,
      data: [
        {
          seq: 1, // 排序号
          title: '分类购买',
          url: 'http://img.leshare.shop/index-1.png',
          action: 'GOODS_ALL',  // 全部商品
          switchTo: true,
          targetId: null
        },
        {
          seq: 2, // 排序号
          title: '签到有礼',
          url: 'http://img.leshare.shop/index-2.png',
          action: 'MEMBER_SIGN', // 打卡
          targetId: null
        },
        {
          seq: 3, // 排序号
          title: '优惠券',
          url: 'http://img.leshare.shop/index-3.png', // 图片
          action: 'COUPON_OWN',
          targetId: null  // 我的优惠券
        },
        {
          seq: 4, // 排序号
          title: '会员特权',
          url: 'http://img.leshare.shop/index-4.png', // 图片
          action: 'MEMBER_DETAIL',  // 会员详情
          targetId: null //
        }
      ]
    },
    {
      id: 5,
      title: '当季热销',
      type: 'GOODS_BOX', // 商品分类橱窗,
      count: 9, // 展示的商品最大数量
      source: 'GOODS',  // 数据来源，GOODS-商品；CATEGORY-分类ID；
      layout: 'TIGHT', // ROW-横向单个商品；BIG-方形单个商品；GRID-一行2个方形商品；TIGHT-一行3个方形商品；
      categoryId: null, // 分类ID
      isSales: true,  // 是否展现销量
      isTitle: true, // 是否展现分类标题
      isMore: true, // 是否展现更多按钮
      isCart: true, // 是否展现加入购物车
      isPrice: true, // 是否展现价格3
      isName: true, // 是否展现商品名称
      data: [
        {
          'id': 239,
          'uuid': 'c3aa167b-2846-4e58-8b8b-76810203083f',
          'name': '海贼王三兄弟奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 0.01,
          'sellPrice': 0.01,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-02 10:50:58',
          'updateTime': '2017-11-20 15:42:51',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 239,
              'sku': '中杯',
              'stock': 87
            },
            {
              'goodsId': 239,
              'sku': '大杯',
              'stock': 81
            }
          ],
          'salesVolume': 44,
          'favoriteCount': 0,
          'totalStock': 168,
          'images': [
            {
              'id': 1959,
              'url': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56',
              'createTime': '2017-11-20 15:42:51'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 0.01,
                  'imageUrl': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 12,
                  'imageUrl': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 12,
          'minPrice': 0.01,
          'priceLable': 0.01,
          'num': 0
        },
        {
          'id': 240,
          'uuid': 'cb9dfb48-5165-4009-bd68-dd68ed0b9bb7',
          'name': '万事屋招牌港式奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 13,
          'sellPrice': 13,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-02 10:51:17',
          'updateTime': '2017-11-02 10:51:17',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 240,
              'sku': null,
              'stock': 70
            }
          ],
          'salesVolume': 35,
          'favoriteCount': 0,
          'totalStock': 70,
          'images': [
            {
              'id': 1960,
              'url': 'http://img.leshare.shop/FlA4QSagvz80EnkYmEkFBqk6bO4a',
              'createTime': '2017-11-02 10:51:17'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': null,
          'imageUrl': 'http://img.leshare.shop/FlA4QSagvz80EnkYmEkFBqk6bO4a/medium',
          'priceLable': 13,
          'num': 0
        },
        {
          'id': 241,
          'uuid': 'dee2af78-d644-4bea-9e8d-6c5a85a96402',
          'name': '经典红茶奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 8,
          'sellPrice': 8,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-06 17:50:52',
          'updateTime': '2017-11-06 21:09:54',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 241,
              'sku': '中杯',
              'stock': 96
            },
            {
              'goodsId': 241,
              'sku': '大杯',
              'stock': 74
            }
          ],
          'salesVolume': 32,
          'favoriteCount': 0,
          'totalStock': 170,
          'images': [
            {
              'id': 1961,
              'url': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04',
              'createTime': '2017-11-06 21:09:54'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 8,
                  'imageUrl': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 10,
                  'imageUrl': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 10,
          'minPrice': 8,
          'priceLable': 8,
          'num': 0
        },
        {
          'id': 248,
          'uuid': 'aae7d784-5fe6-44eb-a255-11b0bf74a4c2',
          'name': '小埋之燕麦奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 9,
          'sellPrice': 9,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-06 19:59:03',
          'updateTime': '2017-11-06 21:10:10',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 248,
              'sku': '中杯',
              'stock': 96
            },
            {
              'goodsId': 248,
              'sku': '大杯',
              'stock': 92
            }
          ],
          'salesVolume': 11,
          'favoriteCount': 0,
          'totalStock': 188,
          'images': [
            {
              'id': 1968,
              'url': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7',
              'createTime': '2017-11-06 21:10:10'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 9,
                  'imageUrl': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 11,
                  'imageUrl': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 11,
          'minPrice': 9,
          'priceLable': 9,
          'num': 0
        },
        {
          'id': 279,
          'uuid': '2338885c-adb2-4719-9d11-6d2cc29eed73',
          'name': 'RE拉姆西柚气泡水',
          'shopId': 6,
          'status': 0,
          'originalPrice': 10,
          'sellPrice': 10,
          'innerCid': 50,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-06 20:50:05',
          'updateTime': '2017-11-06 21:10:23',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 279,
              'sku': '中杯',
              'stock': 98
            },
            {
              'goodsId': 279,
              'sku': '大杯',
              'stock': 98
            }
          ],
          'salesVolume': 2,
          'favoriteCount': 0,
          'totalStock': 196,
          'images': [
            {
              'id': 1999,
              'url': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx',
              'createTime': '2017-11-06 21:10:23'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 10,
                  'imageUrl': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 12,
                  'imageUrl': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 12,
          'minPrice': 10,
          'priceLable': 10,
          'num': 0
        },
        {
          'id': 239,
          'uuid': 'c3aa167b-2846-4e58-8b8b-76810203083f',
          'name': '海贼王三兄弟奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 0.01,
          'sellPrice': 0.01,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-02 10:50:58',
          'updateTime': '2017-11-20 15:42:51',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 239,
              'sku': '中杯',
              'stock': 87
            },
            {
              'goodsId': 239,
              'sku': '大杯',
              'stock': 81
            }
          ],
          'salesVolume': 44,
          'favoriteCount': 0,
          'totalStock': 168,
          'images': [
            {
              'id': 1959,
              'url': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56',
              'createTime': '2017-11-20 15:42:51'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 0.01,
                  'imageUrl': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 12,
                  'imageUrl': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 12,
          'minPrice': 0.01,
          'priceLable': 0.01,
          'num': 0
        },
        {
          'id': 240,
          'uuid': 'cb9dfb48-5165-4009-bd68-dd68ed0b9bb7',
          'name': '万事屋招牌港式奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 13,
          'sellPrice': 13,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-02 10:51:17',
          'updateTime': '2017-11-02 10:51:17',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 240,
              'sku': null,
              'stock': 70
            }
          ],
          'salesVolume': 35,
          'favoriteCount': 0,
          'totalStock': 70,
          'images': [
            {
              'id': 1960,
              'url': 'http://img.leshare.shop/FlA4QSagvz80EnkYmEkFBqk6bO4a',
              'createTime': '2017-11-02 10:51:17'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': null,
          'imageUrl': 'http://img.leshare.shop/FlA4QSagvz80EnkYmEkFBqk6bO4a/medium',
          'priceLable': 13,
          'num': 0
        },
        {
          'id': 241,
          'uuid': 'dee2af78-d644-4bea-9e8d-6c5a85a96402',
          'name': '经典红茶奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 8,
          'sellPrice': 8,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-06 17:50:52',
          'updateTime': '2017-11-06 21:09:54',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 241,
              'sku': '中杯',
              'stock': 96
            },
            {
              'goodsId': 241,
              'sku': '大杯',
              'stock': 74
            }
          ],
          'salesVolume': 32,
          'favoriteCount': 0,
          'totalStock': 170,
          'images': [
            {
              'id': 1961,
              'url': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04',
              'createTime': '2017-11-06 21:09:54'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 8,
                  'imageUrl': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 10,
                  'imageUrl': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 10,
          'minPrice': 8,
          'priceLable': 8,
          'num': 0
        },
        {
          'id': 248,
          'uuid': 'aae7d784-5fe6-44eb-a255-11b0bf74a4c2',
          'name': '小埋之燕麦奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 9,
          'sellPrice': 9,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-06 19:59:03',
          'updateTime': '2017-11-06 21:10:10',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 248,
              'sku': '中杯',
              'stock': 96
            },
            {
              'goodsId': 248,
              'sku': '大杯',
              'stock': 92
            }
          ],
          'salesVolume': 11,
          'favoriteCount': 0,
          'totalStock': 188,
          'images': [
            {
              'id': 1968,
              'url': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7',
              'createTime': '2017-11-06 21:10:10'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 9,
                  'imageUrl': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 11,
                  'imageUrl': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 11,
          'minPrice': 9,
          'priceLable': 9,
          'num': 0
        },
        {
          'id': 279,
          'uuid': '2338885c-adb2-4719-9d11-6d2cc29eed73',
          'name': 'RE拉姆西柚气泡水',
          'shopId': 6,
          'status': 0,
          'originalPrice': 10,
          'sellPrice': 10,
          'innerCid': 50,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-06 20:50:05',
          'updateTime': '2017-11-06 21:10:23',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 279,
              'sku': '中杯',
              'stock': 98
            },
            {
              'goodsId': 279,
              'sku': '大杯',
              'stock': 98
            }
          ],
          'salesVolume': 2,
          'favoriteCount': 0,
          'totalStock': 196,
          'images': [
            {
              'id': 1999,
              'url': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx',
              'createTime': '2017-11-06 21:10:23'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 10,
                  'imageUrl': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 12,
                  'imageUrl': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 12,
          'minPrice': 10,
          'priceLable': 10,
          'num': 0
        }
      ]  // 商品数据
    },
    // 4. 推荐商品分类
    {
      id: 4,
      title: '店长推荐',
      type: 'GOODS_BOX', // 商品分类橱窗,
      count: 5, // 展示的商品最大数量
      source: 'GOODS',  // 数据来源，GOODS-商品；CATEGORY-分类ID；
      layout: 'ROW', // ROW-横向单个商品；BIG-方形单个商品；GRID-一行2个方形商品；TIGHT-一行3个方形商品；
      categoryId: null, // 分类ID
      isTitle: true, // 是否展现分类标题
      isMore: true, // 是否展现更多按钮
      isCart: true, // 是否展现加入购物车
      isPrice: true, // 是否展现价格
      isName: true, // 是否展现商品名称
      data: [
        {
          'id': 239,
          'uuid': 'c3aa167b-2846-4e58-8b8b-76810203083f',
          'name': '海贼王三兄弟奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 0.01,
          'sellPrice': 0.01,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-02 10:50:58',
          'updateTime': '2017-11-20 15:42:51',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 239,
              'sku': '中杯',
              'stock': 87
            },
            {
              'goodsId': 239,
              'sku': '大杯',
              'stock': 81
            }
          ],
          'salesVolume': 44,
          'favoriteCount': 0,
          'totalStock': 168,
          'images': [
            {
              'id': 1959,
              'url': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56',
              'createTime': '2017-11-20 15:42:51'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 0.01,
                  'imageUrl': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 12,
                  'imageUrl': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 12,
          'minPrice': 0.01,
          'priceLable': 0.01,
          'num': 0
        },
        {
          'id': 240,
          'uuid': 'cb9dfb48-5165-4009-bd68-dd68ed0b9bb7',
          'name': '万事屋招牌港式奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 13,
          'sellPrice': 13,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-02 10:51:17',
          'updateTime': '2017-11-02 10:51:17',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 240,
              'sku': null,
              'stock': 70
            }
          ],
          'salesVolume': 35,
          'favoriteCount': 0,
          'totalStock': 70,
          'images': [
            {
              'id': 1960,
              'url': 'http://img.leshare.shop/FlA4QSagvz80EnkYmEkFBqk6bO4a',
              'createTime': '2017-11-02 10:51:17'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': null,
          'imageUrl': 'http://img.leshare.shop/FlA4QSagvz80EnkYmEkFBqk6bO4a/medium',
          'priceLable': 13,
          'num': 0
        },
        {
          'id': 241,
          'uuid': 'dee2af78-d644-4bea-9e8d-6c5a85a96402',
          'name': '经典红茶奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 8,
          'sellPrice': 8,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-06 17:50:52',
          'updateTime': '2017-11-06 21:09:54',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 241,
              'sku': '中杯',
              'stock': 96
            },
            {
              'goodsId': 241,
              'sku': '大杯',
              'stock': 74
            }
          ],
          'salesVolume': 32,
          'favoriteCount': 0,
          'totalStock': 170,
          'images': [
            {
              'id': 1961,
              'url': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04',
              'createTime': '2017-11-06 21:09:54'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 8,
                  'imageUrl': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 10,
                  'imageUrl': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 10,
          'minPrice': 8,
          'priceLable': 8,
          'num': 0
        },
        {
          'id': 248,
          'uuid': 'aae7d784-5fe6-44eb-a255-11b0bf74a4c2',
          'name': '小埋之燕麦奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 9,
          'sellPrice': 9,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-06 19:59:03',
          'updateTime': '2017-11-06 21:10:10',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 248,
              'sku': '中杯',
              'stock': 96
            },
            {
              'goodsId': 248,
              'sku': '大杯',
              'stock': 92
            }
          ],
          'salesVolume': 11,
          'favoriteCount': 0,
          'totalStock': 188,
          'images': [
            {
              'id': 1968,
              'url': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7',
              'createTime': '2017-11-06 21:10:10'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 9,
                  'imageUrl': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 11,
                  'imageUrl': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 11,
          'minPrice': 9,
          'priceLable': 9,
          'num': 0
        },
        {
          'id': 279,
          'uuid': '2338885c-adb2-4719-9d11-6d2cc29eed73',
          'name': 'RE拉姆西柚气泡水',
          'shopId': 6,
          'status': 0,
          'originalPrice': 10,
          'sellPrice': 10,
          'innerCid': 50,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-06 20:50:05',
          'updateTime': '2017-11-06 21:10:23',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 279,
              'sku': '中杯',
              'stock': 98
            },
            {
              'goodsId': 279,
              'sku': '大杯',
              'stock': 98
            }
          ],
          'salesVolume': 2,
          'favoriteCount': 0,
          'totalStock': 196,
          'images': [
            {
              'id': 1999,
              'url': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx',
              'createTime': '2017-11-06 21:10:23'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 10,
                  'imageUrl': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 12,
                  'imageUrl': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 12,
          'minPrice': 10,
          'priceLable': 10,
          'num': 0
        }
      ]  // 商品数据
    },
    // 4. 热销商品
    {
      id: 4,
      title: '热销商品',
      type: 'GOODS_BOX', // 商品分类橱窗,
      count: 5, // 展示的商品最大数量
      source: 'GOODS',  // 数据来源，GOODS-商品；CATEGORY-分类ID；
      layout: 'GRID', // ROW-横向单个商品；BIG-方形单个商品；GRID-一行2个方形商品；TIGHT-一行3个方形商品；
      categoryId: null, // 分类ID
      isTitle: true, // 是否展现分类标题
      isMore: true, // 是否展现更多按钮
      isCart: true, // 是否展现加入购物车
      isPrice: true, // 是否展现价格
      isName: true, // 是否展现商品名称
      data: [
        {
          'id': 239,
          'uuid': 'c3aa167b-2846-4e58-8b8b-76810203083f',
          'name': '海贼王三兄弟奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 0.01,
          'sellPrice': 0.01,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-02 10:50:58',
          'updateTime': '2017-11-20 15:42:51',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 239,
              'sku': '中杯',
              'stock': 87
            },
            {
              'goodsId': 239,
              'sku': '大杯',
              'stock': 81
            }
          ],
          'salesVolume': 44,
          'favoriteCount': 0,
          'totalStock': 168,
          'images': [
            {
              'id': 1959,
              'url': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56',
              'createTime': '2017-11-20 15:42:51'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 0.01,
                  'imageUrl': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 12,
                  'imageUrl': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/FnhRZF-MCHfl8GPZEfVTPZkQuV56/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 12,
          'minPrice': 0.01,
          'priceLable': 0.01,
          'num': 0
        },
        {
          'id': 240,
          'uuid': 'cb9dfb48-5165-4009-bd68-dd68ed0b9bb7',
          'name': '万事屋招牌港式奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 13,
          'sellPrice': 13,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-02 10:51:17',
          'updateTime': '2017-11-02 10:51:17',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 240,
              'sku': null,
              'stock': 70
            }
          ],
          'salesVolume': 35,
          'favoriteCount': 0,
          'totalStock': 70,
          'images': [
            {
              'id': 1960,
              'url': 'http://img.leshare.shop/FlA4QSagvz80EnkYmEkFBqk6bO4a',
              'createTime': '2017-11-02 10:51:17'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': null,
          'imageUrl': 'http://img.leshare.shop/FlA4QSagvz80EnkYmEkFBqk6bO4a/medium',
          'priceLable': 13,
          'num': 0
        },
        {
          'id': 241,
          'uuid': 'dee2af78-d644-4bea-9e8d-6c5a85a96402',
          'name': '经典红茶奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 8,
          'sellPrice': 8,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-06 17:50:52',
          'updateTime': '2017-11-06 21:09:54',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 241,
              'sku': '中杯',
              'stock': 96
            },
            {
              'goodsId': 241,
              'sku': '大杯',
              'stock': 74
            }
          ],
          'salesVolume': 32,
          'favoriteCount': 0,
          'totalStock': 170,
          'images': [
            {
              'id': 1961,
              'url': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04',
              'createTime': '2017-11-06 21:09:54'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 8,
                  'imageUrl': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 10,
                  'imageUrl': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/FoGTRzYOO_w2-JwY6fyNbKBpqU04/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 10,
          'minPrice': 8,
          'priceLable': 8,
          'num': 0
        },
        {
          'id': 248,
          'uuid': 'aae7d784-5fe6-44eb-a255-11b0bf74a4c2',
          'name': '小埋之燕麦奶茶',
          'shopId': 6,
          'status': 0,
          'originalPrice': 9,
          'sellPrice': 9,
          'innerCid': 46,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-06 19:59:03',
          'updateTime': '2017-11-06 21:10:10',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 248,
              'sku': '中杯',
              'stock': 96
            },
            {
              'goodsId': 248,
              'sku': '大杯',
              'stock': 92
            }
          ],
          'salesVolume': 11,
          'favoriteCount': 0,
          'totalStock': 188,
          'images': [
            {
              'id': 1968,
              'url': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7',
              'createTime': '2017-11-06 21:10:10'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 9,
                  'imageUrl': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 11,
                  'imageUrl': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/Fk14TMeF4LduFJ4HtUQHp7JC9xj7/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 11,
          'minPrice': 9,
          'priceLable': 9,
          'num': 0
        },
        {
          'id': 279,
          'uuid': '2338885c-adb2-4719-9d11-6d2cc29eed73',
          'name': 'RE拉姆西柚气泡水',
          'shopId': 6,
          'status': 0,
          'originalPrice': 10,
          'sellPrice': 10,
          'innerCid': 50,
          'innerCategoryName': null,
          'globalCid': 1,
          'isRecommend': 1,
          'isDeleted': 0,
          'createTime': '2017-11-06 20:50:05',
          'updateTime': '2017-11-06 21:10:23',
          'postType': 0,
          'postFee': 0,
          'deliveryTemplateFee': null,
          'deliveryTemplateId': 0,
          'deliveryTemplateName': null,
          'goodsStocks': [
            {
              'goodsId': 279,
              'sku': '中杯',
              'stock': 98
            },
            {
              'goodsId': 279,
              'sku': '大杯',
              'stock': 98
            }
          ],
          'salesVolume': 2,
          'favoriteCount': 0,
          'totalStock': 196,
          'images': [
            {
              'id': 1999,
              'url': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx',
              'createTime': '2017-11-06 21:10:23'
            }
          ],
          'goodsDetails': null,
          'goodsSkuInfo': {
            'prop1': '规格',
            'value1': '中杯,大杯',
            'prop2': null,
            'value2': null,
            'prop3': null,
            'value3': null,
            'goodsSkuDetails': [
              {
                'sku': '中杯',
                'goodsSkuDetailBase': {
                  'price': 10,
                  'imageUrl': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx'
                }
              },
              {
                'sku': '大杯',
                'goodsSkuDetailBase': {
                  'price': 12,
                  'imageUrl': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx'
                }
              }
            ]
          },
          'imageUrl': 'http://img.leshare.shop/FsUaWGxPc7OjOrqguL_5tfaVt9Kx/medium',
          'labels': [
            {
              'key': '规格',
              'value': [
                '中杯',
                '大杯'
              ]
            }
          ],
          'maxPrice': 12,
          'minPrice': 10,
          'priceLable': 10,
          'num': 0
        }
      ]  // 商品数据
    }
  ]
};
