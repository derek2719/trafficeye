// JavaScript Document
(function($){
Highcharts.setOptions({ 
	colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655','#FFF263', '#6AF9C4'] 
}); //自定义栏目颜色
	//测试数据
	//draw_charts({'id':'indexCon','city':'北京','place':'全城区','yData1':[0.4,1.3,3,2,1.4,1.9,1,3,0.4,1.3,3,2,1.4,1.9,1,3,0.4,1.3,3,2,1.4,1.9,1,3,1],'yData2':[4,1.3,3,2,1.4,1.9,1,3,0].reverse(),'maxData':100});//模块ID,城市,区域,上周今日数据,今日数据,Y轴最大值
var aDay=['日','一','二','三','四','五','六'];
window.draw_charts=function(obj){
	var id=obj.id,city=obj.city,place=obj.place,yData1=obj.yData1,yData2=obj.yData2,maxData=obj.maxData;
	var oDate=new Date();
	var iY=oDate.getFullYear();
	var iM=oDate.getMonth();
	var iD=oDate.getDate();
	var iDay=aDay[oDate.getDay()];
	var str = "北京市交通委员会(www.bjjtw.gov.cn)发布的公开数据";
	if (city== "深圳") {
		str = "深圳市交通委员会(szmap.sutpc.com)发布的公开数据";
	}else if(city== "杭州"){
		str = "杭州市综合交通研究中心(www.hzjtydzs.com)发布的公开数据"
	}else if(city== "上海"){
		str = "上海市城乡建设和交通发展研究院(www.jtcx.sh.cn)"
	};
	$('#'+id).highcharts({
		chart:{
			type:'spline',
			//borderRadius:0,
			//borderWidth:1,
			//borderColor:'#333',
			backgroundColor:'#fff',
			plotBackgroundColor:'#ddd',
			marginLeft:23,
			marginRight:12
		},//图表区选项	
		plotOptions: {
          spline: {
              marker: {
                  enabled: false
              },
              pointInterval: 3600000, // one hour
              pointStart: Date.UTC(iY, iM, iD, 0, 0, 0)
          }
		},//数据点选项
		tooltip: {
            xDateFormat: '%m-%d %H:%M',
            shared: true
        },
		title:{
			text:city+place+'交通指数'	
		},
		subtitle:{
			text:str	
		},
		xAxis:{
			//categories:['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00'],
			//tickInterval:3,
			tickInterval:3*3600000,
			labels:{
				style:{'font-size':'8px'}	
			},
			type:'datetime'
		},
		yAxis:{
			minorGridLineWidth: 0,
			gridLineWidth: 0,
			alternateGridColor: null,//去掉参考线
			lineWidth:1,
			min:0,
			tickPositions:(function(){
					if(maxData==5){
						return [0,1,2,3,4,5]
					}else if(maxData==10){
						return [0,2,4,6,8,10]
					}else if(maxData==100){
						return [0,25,50,75,100]
					};
				})(),
			allowDecimals:false,
			title:{
				style:{'display':'none'}	
			},
			labels:{
				style:{'font-size':'9px'},
				y:3,
				x:-5
			},
			plotBands:(function(){
				var signData=[];
				if(maxData==5){
					signData=[{ // Light air
						  from: 0,
						  to: maxData/5,
						  color: 'rgba(2,121,2,0.3)',
						  label: {
							  text: '畅通',
							  style: {
								  color: '#666'
							  }
						  }
					  }, { // Light breeze
						  from: maxData/5,
						  to: maxData/5*2,
						  color: 'rgba(0,255,0,0.3)',
						  label: {
							  text: '基本畅通',
							  style: {
								  color: '#666'
							  }
						  }
					  }, { // Gentle breeze
						  from: maxData/5*2,
						  to: maxData/5*3,
						  color: 'rgba(255,255,0,0.3)',
						  label: {
							  text: '缓行',
							  style: {
								  color: '#666'
							  }
						  }
					  }, { // Moderate breeze
						  from: maxData/5*3,
						  to: maxData/5*4,
						  color: 'rgba(255,102,0,0.3)',
						  label: {
							  text: '轻度拥堵',
							  style: {
								  color: '#666'
							  }
						  }
					  }, { // Fresh breeze
						  from: maxData/5*4,
						  to: maxData,
						  color: 'rgba(204,0,0,0.3)',
						  label: {
							  text: '拥堵',
							  style: {
								  color: '#666'
							  }
						  }
					  }];	
				}else if(maxData==10){
					signData=[{ // Light air
						  from: 0,
						  to: maxData/5,
						  color: 'rgba(2,121,2,0.3)',
						  label: {
							  text: '畅通',
							  style: {
								  color: '#666'
							  }
						  }
					  }, { // Light breeze
						  from: maxData/5,
						  to: maxData/5*2,
						  color: 'rgba(0,255,0,0.3)',
						  label: {
							  text: '基本畅通',
							  style: {
								  color: '#666'
							  }
						  }
					  }, { // Gentle breeze
						  from: maxData/5*2,
						  to: maxData/5*3,
						  color: 'rgba(255,255,0,0.3)',
						  label: {
							  text: '轻度拥堵',
							  style: {
								  color: '#666'
							  }
						  }
					  }, { // Moderate breeze
						  from: maxData/5*3,
						  to: maxData/5*4,
						  color: 'rgba(255,102,0,0.3)',
						  label: {
							  text: '中度拥堵',
							  style: {
								  color: '#666'
							  }
						  }
					  }, { // Fresh breeze
						  from: maxData/5*4,
						  to: maxData,
						  color: 'rgba(204,0,0,0.3)',
						  label: {
							  text: '严重拥堵',
							  style: {
								  color: '#666'
							  }
						  }
					  }];	
				}else if(maxData==100){
					signData=[{ // Light air
						  from: 0,
						  to: maxData/4,
						  color: 'rgba(2,121,2,0.3)',
						  label: {
							  text: '畅通',
							  style: {
								  color: '#666'
							  }
						  }
					  }, { // Light breeze
						  from: maxData/4,
						  to: maxData/4*2,
						  color: 'rgba(0,255,0,0.3)',
						  label: {
							  text: '较畅通',
							  style: {
								  color: '#666'
							  }
						  }
					  }, { // Gentle breeze
						  from: maxData/4*2,
						  to: maxData/4*3,
						  color: 'rgba(255,255,0,0.3)',
						  label: {
							  text: '拥挤',
							  style: {
								  color: '#666'
							  }
						  }
					  }, { // Moderate breeze
						  from: maxData/4*3,
						  to: maxData,
						  color: 'rgba(204,0,0,0.3)',
						  label: {
							  text: '堵塞',
							  style: {
								  color: '#666'
							  }
						  }
					  }]
				};
				  return signData;
				})()
		},
		series:[{
			name:'上周'+iDay+'指数',
			data:yData1||[4,23,3,20,32,19,4,23,3,20,32,19].reverse()	
		},{
			name:'今日指数',
			data:yData2||[11,23,8,17,32,23]	
		}],//数据
		legend:{
			borderWidth:0,
		},//图鉴
		credits:{
			style:{'display':'none'}	
		}//水印
	});
}//绘制图表
})(jQuery);