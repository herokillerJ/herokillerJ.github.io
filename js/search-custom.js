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
//初始化搜索框,匹配器
function initSelect2(data){
	$.fn.select2.amd.require(['select2/diacritics'], function (DIACRITICS) {
	  // stripDiacritics code copied from select2
	  function stripDiacritics (text) {
	    // Used 'uni range + named function' from http://jsperf.com/diacritics/18
	    function match(a) {
	      return DIACRITICS[a] || a;
	    }
	    return text.replace(/[^\u0000-\u007E]/g, match);
	  }
	
	  function customMatcher(params, data) {
	  	// Always return the object if there is nothing to compare
	  	if (params.term == null || params.term.trim() === '') {
	  		return data;
	  	}
	  	// Do a recursive check for options with children
	  	if (data.children && data.children.length > 0) {
	  		// Clone the data object if there are children
	  		// This is required as we modify the object to remove any non-matches
	  		var match = $.extend(true, {}, data);
	  
	  		// Check each child of the option
	  		for (var c = data.children.length - 1; c >= 0; c--) {
	  			var child = data.children[c];
	  
	  			var matches = customMatcher(params, child);
	  
	  			// If there wasn't a match, remove the object in the array
	  			if (matches == null) {
	  				match.children.splice(c, 1);
	  			}
	  		}
	  
	  		// If any children matched, return the new object
	  		if (match.children.length > 0) {
	  			return match;
	  		}
	  
	  		// If there were no matching children, check just the plain object
	  		return customMatcher(params, match);
	  	}
		//匹配算法
	    //去掉特殊符号之后的原文
	  	var original = stripDiacritics(data.text).toUpperCase();
		if (original == null || original.trim() === '') {
			return null;
		}
	  	var pinyinOriginal = stripDiacritics($(data.element).data("pinyin")).toUpperCase();
		//去掉特殊符号之后的输入关键字
	  	var term = stripDiacritics(params.term).toUpperCase();
		//支持中文英文拼音
	  	if (original.indexOf(term) > -1 || pinyinOriginal.indexOf(term) > -1) {
	  		return data;
	  	}
	  	// If it doesn't contain the term, don't return anything
	  	return null;
	  }
	  $('#keywords').select2({
	  	placeholder: '请输入中/英/拼音（例：箭头/arrow/jiantou）',
	  	theme: "bootstrap4",
	  	matcher: customMatcher,
	  	width: '400px',
	  	templateSelection: formatState
	  });
	});
}

function getData(url) {
	var def = $.Deferred();
	$.ajax({
		//请求方式
		type: "GET",
		async: true,
		dataType: "json",
		//请求地址
		url: url
	}).then(function (data) {
		def.resolve(data);//data 将作为参数传递到Then中.
	}, function () {
		def.reject();
	})
	return def.promise();
}

function getLocalData(url) {
	var def = $.Deferred();
	$.getJSON(url).then(function (data) {
		def.resolve(data);//data 将作为参数传递到Then中.
	}, function () {
		def.reject();
	})
	return def.promise();
}

function mapIndexData(arrayData){
	var data = $.map(arrayData, function(obj) {
		var text = obj.name_cn + "[" + obj.name + "]";
		obj.text = text;
		var pinyin =PinyinHelper.convertToPinyinString(obj.name_cn, '', PinyinFormat.WITHOUT_TONE);
		pinyin = pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
		$('#keywords').append('<option data-pinyin="'+pinyin+'" data-path="'+ obj.path +'" value="'+obj.name+'">'+text+'</option>');
		return obj;
	});
	return data;
}

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
		if (result.commodity) {
			$('#shopBuyTable').bootstrapTable(getCommodityBuyOptions());
		} else {
			$('#shopBuyTable').bootstrapTable(getShopBuyOptions());
		}
		$('#shopBuyTable').bootstrapTable('load', buyData);
	}
	if (result.can_sell) {
		$('#shopSellTableInput').prop("checked", true);
		$('#shopSellTableInput').parent("label.btn.localtion").addClass("active").removeClass("hidden");
		var sellData = result.shop_sell.filter(item => item.layout_name.indexOf('CryAstro') < 0);
		$('#shopSellTable').bootstrapTable('destroy');
		if (result.commodity) {
			$('#shopSellTable').bootstrapTable(getCommoditySellOptions());
		} else {
			$('#shopSellTable').bootstrapTable(getShopSellOptions());
		}
		$('#shopSellTable').bootstrapTable('load', sellData);
	}
	if (result.can_rent) {
		$('#shopRentTableInput').prop("checked", true);
		$('#shopRentTableInput').parent("label.btn.localtion").addClass("active").removeClass("hidden");
		var rentData = result.shop_rent.filter(item => item.layout_name.indexOf('CryAstro') < 0);
		$('#shopRentTable').bootstrapTable('load', rentData);
		$('#shopRentTable').closest('.bootstrap-table.bootstrap4').removeClass("hidden");
	}

	var checkedbox = $("input:checkbox[name='options']:checked");
	$.each(checkedbox, function(index, ele) {
		var checkedTableId = ele.getAttribute("mapping-table");
		$('#' + checkedTableId).removeClass("hidden")
	})
};

function getShopBuyOptions() {
	var options = {
		pagination: true,
		pageNumber: 1,
		pageSize: 3,
		pageList: [1, 3, 5, 10, 50],
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

function getCommodityBuyOptions() {
	var options = {
		pagination: true,
		pageNumber: 1,
		pageSize: 3,
		pageList: [1, 3, 5, 10, 50],
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

function getShopSellOptions() {
	var options = {
		pagination: true,
		pageNumber: 1,
		pageSize: 3,
		pageList: [1, 3, 5, 10, 50],
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

function getCommoditySellOptions() {
	var options = {
		pagination: true,
		pageNumber: 1,
		pageSize: 3,
		pageList: [1, 3, 5, 10, 50],
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
			$('#' + tableId).closest('.bootstrap-table.bootstrap4').removeClass("hidden")
		} else {
			$('#' + tableId).closest('.bootstrap-table.bootstrap4').addClass("hidden")
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
		pageList: [1, 3, 5, 10, 50],
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
