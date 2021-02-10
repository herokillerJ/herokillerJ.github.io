//下拉菜单选择后展示什么东西
function formatState(state) {
	if (!state.id) {
		return state.text;
	}
	var $state = $(
		'<span><span></span></span>'
	);
	// Use .text() instead of HTML string concatenation to avoid script injection issues
	$state.find("span").text(state.text);
	return $state;
};

//选择后返回数据处理
function addData(result) {
	$('.sc-data').removeClass("hidden");
	$('table.location').each(function(index, ele) {
		$(ele).closest('.bootstrap-table.bootstrap4').addClass("hidden");
	});
	$('.btn.localtion input').prop("checked", false);
	$('label.btn.localtion').addClass("hidden").removeClass("active");
	//数据
	var arrayData = eval('(' + "[" + JSON.stringify(result) + "]" + ')');
	$('#baseInfotable').bootstrapTable('load', arrayData);
	$('#descriptiontable').bootstrapTable('load', arrayData);
	if (result.can_buy) {
		$('#shopBuyTableInput').prop("checked", true);
		$('#shopBuyTableInput').parent("label.btn.localtion").addClass("active").removeClass("hidden");
		var buyData = result.shop_buy.filter(item => item.layout_name.indexOf('CryAstro') < 0);
		$('#shopBuyTable').bootstrapTable('destroy');
		if (result.commodity){
			$('#shopBuyTable').bootstrapTable(getCommodityBuyOptions());
		}else{
			$('#shopBuyTable').bootstrapTable(getShopBuyOptions());
		}
		$('#shopBuyTable').bootstrapTable('load', buyData);
	}
	if (result.can_sell) {
		$('#shopSellTableInput').prop("checked", true);
		$('#shopSellTableInput').parent("label.btn.localtion").addClass("active").removeClass("hidden");
		var sellData = result.shop_sell.filter(item => item.layout_name.indexOf('CryAstro') < 0);
		$('#shopSellTable').bootstrapTable('destroy');
		if (result.commodity){
			$('#shopSellTable').bootstrapTable(getCommoditySellOptions());
		}else{
			$('#shopSellTable').bootstrapTable(getShopSellOptions());
		}
		$('#shopSellTable').bootstrapTable('load', sellData);
	}
	if (result.can_rent) {
		$('#shopRentTableInput').prop("checked", true);
		$('#shopRentTableInput').parent("label.btn.localtion").addClass("active").removeClass("hidden");
		var rentData = result.shop_rent.filter(item => item.layout_name.indexOf('CryAstro') < 0);
		$('#shopRentTable').bootstrapTable('load', rentData);
	}

	var checkedbox = $("input:checkbox[name='options']:checked");
	$.each(checkedbox, function(index, ele) {
		var checkedTableId = ele.getAttribute("mapping-table");
		$('#' + checkedTableId).removeClass("hidden")
	})
};

function getShopBuyOptions(){
	var options = {
		pagination: true,
		pageNumber: 1,
		pageSize: 3,
		pageList: [1,3, 5, 10, 50],
		sidePagination: "client",
		sortOrder: 'asc',
		sortName: 'current_price',
		showToggle: true,
		showColumns: true,
		columns: [{
			field: 'current_price',
			title: '购买价格（auec）',
			sortable: true
		},
			{
				field: 'layout_name_cn',
				title: '地点（中）'
			},
			{
				field: 'layout_name',
				title: '地点（英）'
			},
			{
				field: 'shop_inventory',
				title: '初始库存（cSCU）',
				sortable: true
			},
			{
				field: 'shop_max_inventory',
				title: '最大库存（cSCU）',
				sortable: true
			},
			{
				field: 'refresh_per_minute',
				title: '每分钟最大刷新量（cSCU）',
				sortable: true
			}
		]
	}
	return options;
};

function getCommodityBuyOptions(){
	var options = {
		pagination: true,
		pageNumber: 1,
		pageSize: 3,
		pageList: [1,3, 5, 10, 50],
		sidePagination: "client",
		sortOrder: 'asc',
		sortName: 'min_buying_price',
		showToggle: true,
		showColumns: true,
		columns: [{
			field: 'min_buying_price',
			title: '最低购买价格（auec）',
			sortable: true
		},
			{
				field: 'layout_name_cn',
				title: '地点（中）'
			},
			{
				field: 'layout_name',
				title: '地点（英）'
			},
			{
				field: 'shop_inventory',
				title: '初始库存（cSCU）',
				sortable: true
			},
			{
				field: 'shop_max_inventory',
				title: '最大库存（cSCU）',
				sortable: true
			},
			{
				field: 'refresh_per_minute',
				title: '每分钟最大刷新量（cSCU）',
				sortable: true
			}
		]
	}
	return options;
};

function getShopSellOptions(){
	var options = {
		pagination: true,
		pageNumber: 1,
		pageSize: 3,
		pageList: [1,3, 5, 10, 50],
		sidePagination: "client",
		sortOrder: 'asc',
		sortName: 'current_price',
		showToggle: true,
		showColumns: true,
		columns: [{
			field: 'current_price',
			title: '出售价格（auec）',
			sortable: true
		},
			{
				field: 'layout_name_cn',
				title: '地点（中）'
			},
			{
				field: 'layout_name',
				title: '地点（英）'
			},
			{
				field: 'shop_inventory',
				title: '初始库存（cSCU）',
				sortable: true
			},
			{
				field: 'shop_max_inventory',
				title: '最大库存（cSCU）',
				sortable: true
			},
			{
				field: 'refresh_per_minute',
				title: '每分钟最大刷新量（cSCU）',
				sortable: true
			}
		]
	}
	return options;
};

function getCommoditySellOptions(){
	var options = {
		pagination: true,
		pageNumber: 1,
		pageSize: 3,
		pageList: [1,3, 5, 10, 50],
		sidePagination: "client",
		sortOrder: 'desc',
		sortName: 'max_selling_price',
		showToggle: true,
		showColumns: true,
		columns: [{
			field: 'max_selling_price',
			title: '最高出售价格（auec）',
			sortable: true
		},
			{
				field: 'layout_name_cn',
				title: '地点（中）'
			},
			{
				field: 'layout_name',
				title: '地点（英）'
			},
			{
				field: 'shop_inventory',
				title: '初始库存（cSCU）',
				sortable: true
			},
			{
				field: 'shop_max_inventory',
				title: '最大库存（cSCU）',
				sortable: true
			},
			{
				field: 'refresh_per_minute',
				title: '每分钟最大刷新量（cSCU）',
				sortable: true
			}
		]
	}
	return options;
};

(function($) {

	"use strict";

	// PRE LOADER
	$(window).on('load', function() {
		$('.preloader').fadeOut(1000); // set duration in brackets    
	});


	// MENU
	$('.menu-burger').on('click', function() {
		$('.menu-bg, .menu-items, .menu-burger').toggleClass('fs');
		$('.menu-burger').text() == "☰" ? $('.menu-burger').text('✕') : $('.menu-burger').text('☰');
	});


	// ABOUT SLIDER
	$('body').vegas({
		slides: [{
			src: 'https://cdn.jsdelivr.net/gh/herokillerJ/imgur/wftank.cn/home/1th-section.jpg'
		}],
		timer: false,
		transition: ['zoomOut', ]
	});
	
	//表格工具栏改变事件
	$("input:checkbox[name='options']").change(function() {
		  var tableId = this.getAttribute("mapping-table");
			if (this.checked) {
				$('#'+tableId).closest('.bootstrap-table.bootstrap4').removeClass("hidden")
			} else {
				$('#'+tableId).closest('.bootstrap-table.bootstrap4').addClass("hidden")
			}
	});

	//初始化表格
	$('#baseInfotable').bootstrapTable({
		toolbar: '#toolbar',
		columns: [{
				field: 'name_cn',
				title: '名称（中）'
			},
			{
				field: 'type_cn',
				title: '类型（中）'
			},
			{
				field: 'class_des_cn',
				title: '类别（中）'
			},
			{
				field: 'name',
				title: '名称（英）'
			},

			{
				field: 'type',
				title: '类型（英）'
			},
			{
				field: 'class_des',
				title: '类别（英）'
			},
			{
				field: 'size',
				title: '尺寸'
			},
			{
				field: 'grade',
				title: '级别'
			}
		]
	});

	$('#descriptiontable').bootstrapTable({
		columns: [{
				field: 'description_cn',
				title: '描述（中）'
			},
			{
				field: 'description',
				title: '描述（英）'
			}
		]
	});

	$('#shopBuyTable').bootstrapTable(getShopBuyOptions());

	$('#shopSellTable').bootstrapTable(getShopSellOptions);

	$('#shopRentTable').bootstrapTable({
		pagination: true,
		pageNumber: 1,
		pageSize: 3,
		pageList: [1,3, 5, 10, 50],
		sidePagination: "client",
		sortOrder: 'asc',
		sortName: 'rent_price1',
		showToggle: true,
		showColumns: true,
		columns: [{
				field: 'layout_name_cn',
				title: '租赁地点（中）'
			},
			{
				field: 'layout_name',
				title: '租赁地点（英）'
			},
			{
				field: 'rent_price1',
				title: '租价-1天（auec）',
				sortable: true
			},
			{
				field: 'rent_price3',
				title: '租价-3天（auec）',
				sortable: true
			},
			{
				field: 'rent_price7',
				title: '租价-7天（auec）',
				sortable: true
			},
			{
				field: 'rent_price30',
				title: '租价-30天（auec）',
				sortable: true
			},
			{
				field: 'rent_price3_per_day',
				title: '平均每天价格-3天（auec）',
				sortable: true
			},
			{
				field: 'rent_price7_per_day',
				title: '平均每天价格-7天（auec）',
				sortable: true
			},
			{
				field: 'rent_price30_per_day',
				title: '平均每天价格-30天（auec）',
				sortable: true
			}
		]
	});

})(jQuery);
