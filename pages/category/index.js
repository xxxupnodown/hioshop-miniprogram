var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
    data: {
        navList: [],
        categoryList: [],
        currentCategory: {},
        goodsCount: 0,
        nowIndex: 0,
        nowId: 0,
        list: [{
          list_pic_url: 'xxx',
          is_new: true,
          goods_number: 0,
          name: 'xxxx',
          goods_brief: 'dawdwa',
          min_retail_price: '123'
        },{
          list_pic_url: 'xxx',
          is_new: false,
          goods_number: 2,
          name: 'xxxx',
          goods_brief: 'dawdwa',
          min_retail_price: '123'
        }],
        allPage: 1,
        allCount: 0,
        size: 8,
        hasInfo: 0,
        showNoMore: 0,
        loading: 0,
        index_banner_img:0,
    },
    onLoad: function(options) {
    },
    getChannelShowInfo: function (e) {
        let that = this;
        util.request(api.ShowSettings).then(function (res) {
            if (res.errno === 0) {
                let index_banner_img = res.data.index_banner_img;
                that.setData({
                    index_banner_img: index_banner_img
                });
            }
        });
    },
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading()
        this.getCatalog();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },
    getCatalog: function() {
        //CatalogList
        let that = this;
        // util.request(api.CatalogList).then(function(res) {
        //     that.setData({
        //         navList: res.data.categoryList,
        //     });
        // });
        util.request(api.GoodsCount).then(function(res) {
            that.setData({
                goodsCount: res.data.goodsCount
            });
        });
    },
    getCurrentCategory: function(id) {
        let that = this;
        util.request(api.CatalogCurrent, {
            id: id
        }).then(function(res) {
            that.setData({
                currentCategory: res.data
            });
        });
    },
    onShow: function() {
        this.getChannelShowInfo();
        let id = this.data.nowId;
        let nowId = wx.getStorageSync('categoryId');
        if(id == 0 && nowId === 0){
            return false
        }
        else if (nowId == 0 && nowId === '') {
            this.setData({
                list: [],
                allPage: 1,
                allCount: 0,
                size: 8,
                loading: 1
            })
            this.setData({
                nowId: 0,
                currentCategory: {}
            })
            wx.setStorageSync('categoryId', 0)
        } else if(id != nowId) {
            this.setData({
                list: [],
                allPage: 1,
                allCount: 0,
                size: 8,
                loading: 1
            })
            // this.getCurrentCategory(nowId);
            this.setData({
                nowId: nowId
            })
            wx.setStorageSync('categoryId', nowId)
        }
        
        this.getCatalog();
    },
    switchCate: function(e) {
        let id = e.currentTarget.dataset.id;
        let nowId = this.data.nowId;
        if (id == nowId) {
            return false;
        } else {
            this.setData({
                list: [],
                allPage: 1,
                allCount: 0,
                size: 8,
                loading: 1
            })
            if (id == 0) {
                this.setData({
                    currentCategory: {}
                })
            } else {
                wx.setStorageSync('categoryId', id)
                // this.getCurrentCategory(id);
            }
            wx.setStorageSync('categoryId', id)
            this.setData({
                nowId: id
            })
        }
    },
    onBottom: function() {
        let that = this;
        if (that.data.allCount / that.data.size < that.data.allPage) {
            that.setData({
                showNoMore: 0
            });
            return false;
        }
        that.setData({
            allPage: that.data.allPage + 1
        });
    }
})