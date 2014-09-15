// JavaScript Document
(function(){
	//测试数据
	//draw_charts_copy({'id':'indexCon','city':'北京','place':'全城区','yData1':[0.4,1.3,3,2,1.4,1.9,1,3,0.4,1.3,3,2,1.4,1.9,1,3,0.4,1.3,3,2,1.4,1.9,1,3,1],'yData2':[4,1.3,3,2,1.4,1.9,1,3,0].reverse(),'maxData':100});//模块ID,城市,区域,上周今日数据,今日数据,Y轴最大值
var aDay=['日','一','二','三','四','五','六'];
window.draw_charts_copy=function(obj){
	var id=obj.id,city=obj.city,place=obj.place,yData1=obj.yData1,yData2=obj.yData2,maxData=obj.maxData;
	var oDate=new Date();
	var iY=oDate.getFullYear();
	var iM=oDate.getMonth();
	var iD=oDate.getDate();
	var iDay=aDay[oDate.getDay()];
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
			text:'四维交通指数'	
		},
		xAxis:{
			tickInterval:3*3600000,
			labels:{
				style:{'font-size':'8px'}	
			},
			type:'datetime'
		},
		yAxis:{
			tickPositions:(function(){
					if(maxData==2){
						return [0, 2]
					}else if(maxData==4){
						return [0, 2, 4]
					}else if(maxData==7){
						return [0, 2, 4,7]
					}else if(maxData==10){
						return [0, 2, 4,7,10]
					}else if(maxData==18){
						return [0, 2, 4,7,10,18]
					}else if(maxData>18){
						return [0, 2, 4,7,10,18,maxData]
					};
				})(),
			minorGridLineWidth: 0,
			gridLineWidth: 0,
			alternateGridColor: null,//去掉参考线
			lineWidth:1,
			min:0,
			max:maxData,
			allowDecimals:false,
			title:{
				style:{'display':'none'}	
			},
			labels:{
				style:{'font-size':'9px'},
				y:3,
				x:-5,
			},
			plotBands:(function(){
				var signDate=[];
				var dataArea1={
					  from: 0,
					  to: 2,
					  color: 'rgba(0,136,0,0.3)',
					  label: {
						  text: '畅通',
						  style: {
							  color: '#666'
						  }
					  }
				};
				var dataArea2={
					  from: 2,
					  to: 4,
					  color: 'rgba(153,220,0,0.3)',
					  label: {
						  text: '基本畅通',
						  style: {
							  color: '#666'
						  }
					  }
				};
				var dataArea3={
					  from: 4,
					  to: 7,
					  color: 'rgba(255,255,1,0.3)',
					  label: {
						  text: '缓慢',
						  style: {
							  color: '#666'
						  }
					  }
				};
				var dataArea4={
					  from: 7,
					  to: 10,
					  color: 'rgba(255,187,0,0.3)',
					  label: {
						  text: '拥堵',
						  style: {
							  color: '#666'
						  }
					  }
				};
				var dataArea5={
					  from: 10,
					  to: 18,
					  color: 'rgba(254,2,1,0.3)',
					  label: {
						  text: '严重拥堵',
						  style: {
							  color: '#666'
						  }
					  }
				};
				if(maxData==2){
					signDate=[dataArea1];
				}else if(maxData==4){
					signDate=[dataArea1,dataArea2];
				}else if(maxData==7){
					signDate=[dataArea1,dataArea2,dataArea3];
				}else if(maxData==10){
					signDate=[dataArea1,dataArea2,dataArea3,dataArea4];
				}else if(maxData==18){
					signDate=[dataArea1,dataArea2,dataArea3,dataArea4,dataArea5];
				}else if(maxData>18){
					var dataArea6={
						  from: 18,
						  to: maxData,
						  color: 'rgba(139,1,1,0.3)',
						  label: {
							  text: '路网瘫痪',
							  style: {
								  color: '#666'
							  }
						  }
					};
					signDate=[dataArea1,dataArea2,dataArea3,dataArea4,dataArea5,dataArea6];
				};
				  return signDate;
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