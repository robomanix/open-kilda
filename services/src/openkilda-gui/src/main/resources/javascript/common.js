/*<![CDATA[*/


/*Global Variable Constant*/
var metricVarList = ["bits:Bits/sec","megabytes:MegaBytes/sec","packets:Packets/sec","drops:Drops/sec","errors:Errors/sec", "collisions:Collisions","frameerror:Frame Errors","overerror:Overruns","crcerror:CRC Errors"];

var key = window.location.href;
if(key.includes("isl")) {
	var linkData = localStorage.getItem("linkData");
	var obj = JSON.parse(linkData);
	var srcSwitch = obj.source_switch;
	var srcPort = obj.src_port;
	var targetSwitch = obj.target_switch;
	var targetPort = obj.dst_port;
}

var graphIntervalISL;
var graphIntervalISLName;

var common = {	
		getData:function(apiUrl,requestType){	
		return $.ajax({url : APP_CONTEXT+apiUrl,type : requestType,dataType : "json"});							
		},
		infoMessage:function(msz,type){
		$.toast({heading:(type =='info'?'Information':type), text: msz, showHideTransition: 'fade',position: 'top-right', icon: type, hideAfter : 6000})
		}
}

/** sub menu related code start **/
var urlString = window.location.href;
	$("#menubar-tbn li").each(function(){
	$(this).removeClass();
})

if(urlString.indexOf("topology") != -1 || urlString.indexOf("portdetails") != -1 || urlString.indexOf("isl") != -1){
	$("#topology-menu-id").addClass("active")
}

else if(urlString.indexOf("flows") != -1 || urlString.indexOf("flowdetails") != -1) {
	$("#flows-menu-id").addClass("active")
}

else if( urlString.indexOf("switch") != -1) {
	$("#switch-menu-id").addClass("active")
}

else if(urlString.indexOf("home") != -1) {
	$("#home-menu-id").addClass("active")
}
/** sub menu related code End **/

	
$('.t-logy-icon').click(function(e){
	 e.stopPropagation();
	 $("#topology-txt").slideToggle();
});

$('#topology-txt').click(function(e){
    e.stopPropagation();
});

$(document).click(function(){
    $('#topology-txt').slideUp();
});

var requests = null;
var loadGraph = {	
		loadGraphData:function(apiUrl,requestType,selMetric,domId){	
			requests =  $.ajax({url : APP_CONTEXT+apiUrl,type : requestType,
					dataType : "json",
					error : function(errResponse) {	
						
						if(domId == "check1" && !$("#check2").prop("checked")) {
							$("#waitisl1").css("display", "none");	
						}
						if(domId == "check2" && !$("#check1").prop("checked")) {
							$("#waitisl2").css("display", "none");	
						}
						if(domId == "check1" && $("#check2").prop("checked")) {
							$("#waitisl1").css("display", "none");
							$("#waitisl2").css("display", "none");	
						}
						if(domId == "check2" && $("#check1").prop("checked")) {
							$("#waitisl1").css("display", "none");
							$("#waitisl2").css("display", "none");	
						}if(domId == undefined && domId == undefined){
							$("#waitisl1").css("display", "none");
							$("#waitisl2").css("display", "none");	
						}
						if(!$("#check1").prop("checked") && !$("#check2").prop("checked")) {
							$("#wait1").css("display", "none");
						}
						
						if($("#check1").prop("checked") || $("#check2").prop("checked")) {
							showIslSwitchStats.showIslSwitchStatsData(errResponse,selMetric,null,domId);
						} else{
							showStatsGraph.showStatsData(errResponse,selMetric,null,domId);
						}
					}
				});			
			
		return requests;				
	}
}

var graphAutoReload = {	
		autoreload:function(){
			
			var key = window.location.href;
			
			if(key.includes("isl")) {				
				$("#autoreloadISL").toggle();
				var checkbox =  $("#check").prop("checked");
				if(checkbox == false){
										
					$("#autoreloadISL").val('');
					if($("#check1").prop("checked") || $("#check2").prop("checked")) {
						clearInterval(graphInterval);
						clearInterval(graphIntervalISLName);		
						
						clearInterval(graphIntervalISL);
					} else {
						clearInterval(callIntervalData);
						clearInterval(graphInterval);
					}
					$("#autoreloadId").removeClass("has-error")	
				    $(".error-message").html("");
					$('#wait1').hide();	
				}
			} else {	
				$("#autoreload").toggle();
				var checkbox =  $("#check").prop("checked");
				if(checkbox == false){
					
					$("#autoreload").val('');
					clearInterval(callIntervalData);
					clearInterval(graphInterval);
					$("#autoreloadId").removeClass("has-error")	
				    $(".error-message").html("");
					$('#wait1').hide();	
				}
			}
	}
}


 var showStatsGraph = {	

	showStatsData:function(response,metricVal,graphCode,domId) {
		
		var metric1 = "";
		var metric2 = "";
		var direction1 = "";
		var direction2 = "";
		var data = response;
		var jsonResponse = response.responseJSON;
		var graphData = [];
		 
		 if(data){
			 if(data.length == 0){
					if(graphCode == 0) {
						 var g = new Dygraph(document.getElementById("source-graph_div"), [],
							 	 {
							 		      drawPoints: false,
							 		      labels: "test",	 		      
							 		      colors: ["#495cff","#aad200"],
							 	  });	
						 return;
					}
					if(graphCode == 1) {
						 var g = new Dygraph(document.getElementById("dest-graph_div"), [],
							 	 {
							 		      drawPoints: false,
							 		      labels: "test",	 		      
							 		      colors: ["#495cff","#aad200"],
							 	  });	
						 return;
					}
					if(graphCode == 2) {
						 var g = new Dygraph(document.getElementById("source-graph_div"), [],
							 	 {
							 		      drawPoints: false,
							 		      labels: "test",	 		      
							 		      colors: ["#495cff","#aad200"],
							 	  });	
						 var g = new Dygraph(document.getElementById("dest-graph_div"), [],
							 	 {
							 		      drawPoints: false,
							 		      labels: "test",	 		      
							 		      colors: ["#495cff","#aad200"],
							 	  });	
						 return;
					}
				 
			 var g = new Dygraph(document.getElementById("graphdiv"), [],
				 	 {
				 		      drawPoints: false,
				 		      labels: "test",	 		      
				 		      colors: ["#495cff","#aad200"],
				 	  });	
			 return;
			 } 
		 }
		 
		if(!jsonResponse) {
			
		    	var getValue = data[0].dps;	    	
		    	 metric1 = data[0].metric;	
		    	 
		    	if(data.length == 2) {
		    		var getVal = data[1].dps;
		    		 metric2 = data[1].metric;
		    		 
		    		 if(data[1].tags.direction){
		    			 metric2 = data[1].metric + "("+data[1].tags.direction+")"
		    		 }
		    		 if(data[0].tags.direction){
		    			 metric1 = data[0].metric + "("+data[0].tags.direction+")"
		    		 }
		    	}
		    	    
				    if(!getValue) {
				    	metric1 = "F";
				    	metric2 = "R";		    	
				    } else {
				    	 for(i in getValue) {
						    	
						      var temparr = [];
						      temparr[0] = new Date(Number(i*1000));
						      if(metricVal == "megabytes"){
						    	  temparr[1] = getValue[i] / 1048576;
						      }
						      else{
						    	  temparr[1] = getValue[i]
						      }
						      
						      if(data.length == 2) {
						    	  if(metricVal == "megabytes"){
						    	  	temparr[2] = getVal[i] / 1048576;
						    	  }
						    	  else{
						    			temparr[2] = getVal[i];
						    	  }
						      }
						      graphData.push(temparr)
						 }
				    }
				    if(metric1 && metric2){
				    	var labels = ['Time', metric1,metric2];
				    }else if(metric1){
				    	var labels = ['Time', metric1];
				    }
				    else{
				    	var labels = ['Time', metric2];
				    }	
		}else{
			metric1 = "F";
	    	metric2 = "R";
			var labels = ['Time', metric1,metric2];
		}
		if(graphCode == undefined){
					
			if(domId == "check1") {
				var g = new Dygraph(document.getElementById("source-graph_div"), graphData,
						{
							 		      drawPoints: false,
							 		      labels: labels,	 		      
							 		      colors: ["#495cff","#aad200"],
						});
			}else if(domId == "check2") {
				var g = new Dygraph(document.getElementById("dest-graph_div"), graphData,
						{
							 		      drawPoints: false,
							 		      labels: labels,	 		      
							 		      colors: ["#495cff","#aad200"],
						});
			} else {

			if(!$("#check1").prop("checked") && !$("#check2").prop("checked")) {
				var g = new Dygraph(document.getElementById("graphdiv"), graphData,
						{    										
							 		      drawPoints: false,
							 		      labels: labels,	 		      
							 		      colors: ["#495cff","#aad200"],
						});
			} else {
				       if(domId == undefined) {
				    	   
					        var g1 = new Dygraph(document.getElementById("graphdiv"), graphData,
							{
										 		      drawPoints: false,
										 		      labels: labels,	 		      
										 		      colors: ["#495cff","#aad200"],
							});
				       } 
				       if(domId != undefined && graphCode == null && $("#check1").prop("checked")) {
					       var g1 = new Dygraph(document.getElementById("source-graph_div"), graphData,
									  {
										 		      drawPoints: false,
										 		      labels: labels,	 		      
										 		      colors: ["#495cff","#aad200"],
									  });
				       }
				       if(domId != undefined && graphCode == null && $("#check2").prop("checked")) {
							 var g2 = new Dygraph(document.getElementById("dest-graph_div"), graphData,
									  {
										 		      drawPoints: false,
										 		      labels: labels,	 		      
										 		      colors: ["#495cff","#aad200"],
									 });	
				       }
			     }
		}
	}if(graphCode == 0){
			$("#dest-graph_div").empty();
			   var g = new Dygraph(document.getElementById("source-graph_div"), graphData,
				{
					 		      drawPoints: false,
					 		      labels: labels,	 		      
					 		      colors: ["#495cff","#aad200"],
				});	

		}
		if(graphCode == 1){
			$("#source-graph_div").empty();
			  var g = new Dygraph(document.getElementById("dest-graph_div"), graphData,
				{
					 		      drawPoints: false,
					 		      labels: labels,	 		      
					 		      colors: ["#495cff","#aad200"],
				});	

			
		}
		if(graphCode == 2) {
			 var g1 = new Dygraph(document.getElementById("source-graph_div"), graphData,
			  {
				 		      drawPoints: false,
				 		      labels: labels,	 		      
				 		      colors: ["#495cff","#aad200"],
			  });
			 var g2 = new Dygraph(document.getElementById("dest-graph_div"), graphData,
			  {
				 		      drawPoints: false,
				 		      labels: labels,	 		      
				 		      colors: ["#495cff","#aad200"],
			 });	
		}	
			     
	}
}




var showIslSwitchStats = {	

		showIslSwitchStatsData:function(response,metricVal,graphCode,domId) {
			
			var metric1 = "";
			var metric2 = "";
			var direction1 = "";
			var direction2 = "";
			var data = response;
			var jsonResponse = response.responseJSON;
			var graphData = [];
			 
			 if(data){
				 if(data.length == 0){
						if(graphCode == 0) {
							 var g = new Dygraph(document.getElementById("source-graph_div"), [],
								 	 {
								 		      drawPoints: false,
								 		      labels: "test",	 		      
								 		      colors: ["#495cff","#aad200"],
								 	  });	
							 return;
						}
						if(graphCode == 1) {
							 var g = new Dygraph(document.getElementById("dest-graph_div"), [],
								 	 {
								 		      drawPoints: false,
								 		      labels: "test",	 		      
								 		      colors: ["#495cff","#aad200"],
								 	  });	
							 return;
						}
						if(graphCode == 2) {
							 var g = new Dygraph(document.getElementById("source-graph_div"), [],
								 	 {
								 		      drawPoints: false,
								 		      labels: "test",	 		      
								 		      colors: ["#495cff","#aad200"],
								 	  });	
							 var g = new Dygraph(document.getElementById("dest-graph_div"), [],
								 	 {
								 		      drawPoints: false,
								 		      labels: "test",	 		      
								 		      colors: ["#495cff","#aad200"],
								 	  });	
							 return;
						}
				   } 
			 }
			 
			if(!jsonResponse) {
				
			    	var getValue = data[0].dps;	    	
			    	 metric1 = data[0].metric;	
			    	 
			    	if(data.length == 2) {
			    		var getVal = data[1].dps;
			    		 metric2 = data[1].metric;
			    		 
			    		 if(data[1].tags.direction){
			    			 metric2 = data[1].metric + "("+data[1].tags.direction+")"
			    		 }
			    		 if(data[0].tags.direction){
			    			 metric1 = data[0].metric + "("+data[0].tags.direction+")"
			    		 }
			    	}
			    	    
					    if(!getValue) {
					    	metric1 = "F";
					    	metric2 = "R";		    	
					    } else {
					    	 for(i in getValue) {
							    	
							      var temparr = [];
							      temparr[0] = new Date(Number(i*1000));
							      if(metricVal == "megabytes"){
							    	  temparr[1] = getValue[i] / 1048576;
							      }
							      else{
							    	  temparr[1] = getValue[i]
							      }
							      
							      if(data.length == 2) {
							    	  if(metricVal == "megabytes"){
							    	  	temparr[2] = getVal[i] / 1048576;
							    	  }
							    	  else{
							    			temparr[2] = getVal[i];
							    	  }
							      }
							      graphData.push(temparr)
							 }
					    }
					    if(metric1 && metric2){
					    	var labels = ['Time', metric1,metric2];
					    }else if(metric1){
					    	var labels = ['Time', metric1];
					    }
					    else{
					    	var labels = ['Time', metric2];
					    }	
			}else{
				metric1 = "F";
		    	metric2 = "R";
				var labels = ['Time', metric1,metric2];
			}
			if(graphCode == undefined){
						
				if(domId == "check1") {
					var g = new Dygraph(document.getElementById("source-graph_div"), graphData,
							{
								 		      drawPoints: false,
								 		      labels: labels,	 		      
								 		      colors: ["#495cff","#aad200"],
							});
				}else if(domId == "check2") {
					var g = new Dygraph(document.getElementById("dest-graph_div"), graphData,
							{
								 		      drawPoints: false,
								 		      labels: labels,	 		      
								 		      colors: ["#495cff","#aad200"],
							});
				} else {
					       if(domId != undefined && graphCode == null && $("#check1").prop("checked")) {
						       var g1 = new Dygraph(document.getElementById("source-graph_div"), graphData,
										  {
											 		      drawPoints: false,
											 		      labels: labels,	 		      
											 		      colors: ["#495cff","#aad200"],
										  });
					       }
					       if(domId != undefined && graphCode == null && $("#check2").prop("checked")) {
								 var g2 = new Dygraph(document.getElementById("dest-graph_div"), graphData,
										  {
											 		      drawPoints: false,
											 		      labels: labels,	 		      
											 		      colors: ["#495cff","#aad200"],
										 });	
					       }
				     
			}
		}if(graphCode == 0){
				$("#dest-graph_div").empty();
				   var g = new Dygraph(document.getElementById("source-graph_div"), graphData,
					{
						 		      drawPoints: false,
						 		      labels: labels,	 		      
						 		      colors: ["#495cff","#aad200"],
					});	

			}
			if(graphCode == 1){
				$("#source-graph_div").empty();
				  var g = new Dygraph(document.getElementById("dest-graph_div"), graphData,
					{
						 		      drawPoints: false,
						 		      labels: labels,	 		      
						 		      colors: ["#495cff","#aad200"],
					});	

				
			}
			if(graphCode == 2) {
				 var g1 = new Dygraph(document.getElementById("source-graph_div"), graphData,
				  {
					 		      drawPoints: false,
					 		      labels: labels,	 		      
					 		      colors: ["#495cff","#aad200"],
				  });
				 var g2 = new Dygraph(document.getElementById("dest-graph_div"), graphData,
				  {
					 		      drawPoints: false,
					 		      labels: labels,	 		      
					 		      colors: ["#495cff","#aad200"],
				 });	
			}    
	  }
}


var getMetricDetails = {	
		getFlowMetricData:function(response){
						
			var metricArray = [];			
			metricArray = metricVarList;
			var optionHTML = "";
			for (var i = 0; i < metricArray.length ; i++) {
				
				if(metricArray[i].includes("bits") || metricArray[i].includes("packets") || metricArray[i].includes("megabytes")) {
					optionHTML += "<option value=" + metricArray[i].split(":")[0] + ">"+ metricArray[i].split(":")[1] + "</option>";
				}
			}
			$("select.selectbox_menulist").html("").html(optionHTML);
			$('#menulist').val('packets');
		},
		getPortMetricData:function(response){
			var metricArray = [];			
			metricArray = metricVarList;
			var optionHTML = "";
			for (var i = 0; i < metricArray.length ; i++) {
				
				if(metricArray[i].includes("megabytes") || metricArray[i].includes("latency")) {
				} else{
					optionHTML += "<option value=" + metricArray[i].split(":")[0] + ">"+ metricArray[i].split(":")[1] + "</option>";
				}			
			}
			$("select.selectbox_menulist").html("").html(optionHTML);
			$('#portMenulist').val('bits');
		}
}


var autoVal = {	
			
			reloadValidation:function(callback) {
				
				var key = window.location.href;			
				if(key.includes("isl")){
										
					var autoreload = $("#autoreloadISL").val();
					var numbers = /^[-+]?[0-9]+$/;  
					var checkNo = $("#autoreloadISL").val().match(numbers);
					var checkbox =  $("#check").prop("checked");
					
					if(checkbox) {
						
						if($("#autoreloadISL").val().length > 0) {	
							if(autoreload < 0) {
								$("#autoreloadId").addClass("has-error")	
								$(".error-message").html("Autoreload cannot be negative");
								valid=false;
								clearInterval(graphInterval);
								clearInterval(graphIntervalISL);
								clearInterval(graphIntervalISLName);
								callback(valid)
							} else if(autoreload == 0) {						
								$("#autoreloadId").addClass("has-error")	
								$(".error-message").html("Autoreload cannot be zero");
								valid=false;			
								clearInterval(graphInterval);
								clearInterval(graphIntervalISL);
								clearInterval(graphIntervalISLName);
								callback(valid)
							}else if(!checkNo) {		
								$("#autoreloadId").addClass("has-error")	
								$(".error-message").html("Please enter positive number only");			
								valid=false;
								clearInterval(graphInterval);
								clearInterval(graphIntervalISL);
								clearInterval(graphIntervalISLName);
								callback(valid)
							}
							else{
								valid = true;
								callback(valid)
							}
						}
				   }
				} else {
					
					var autoreload = $("#autoreload").val();
					var numbers = /^[-+]?[0-9]+$/;  
					var checkNo = $("#autoreload").val().match(numbers);
					var checkbox =  $("#check").prop("checked");
				
					if(checkbox) {
						
						if($("#autoreload").val().length > 0) {	
							if(autoreload < 0) {
								$("#autoreloadId").addClass("has-error")	
								$(".error-message").html("Autoreload cannot be negative");
								valid=false;
								clearInterval(graphInterval);
								callback(valid)
							} else if(autoreload == 0) {
								$("#autoreloadId").addClass("has-error")	
								$(".error-message").html("Autoreload cannot be zero");
								valid=false;							
								clearInterval(graphInterval);
								callback(valid)
							}else if(!checkNo) {								
								$("#autoreloadId").addClass("has-error")	
								$(".error-message").html("Please enter positive number only");		
								valid=false;
								clearInterval(graphInterval);
								callback(valid)
							}
							else{
								valid = true;
								callback(valid)
							}
						}
				     }
				}
		 }
	}


var islDetails = {
		
		checkDropdown:function(domObj){
			return $("select.selectbox_menulist option").length;
			
		},
		getIslMetricData:function(domObj) {
			
			var metricArray = [];			
			metricArray = metricVarList;
			var optionHTML = "";
			
			if(parseInt(this.checkDropdown()) < 1){

				for (var i = 0; i < metricArray.length ; i++) {
					
					if( metricArray[i].includes("megabytes")) {
					} else {
						optionHTML += "<option value=" + metricArray[i].split(":")[0] + ">"+ metricArray[i].split(":")[1] + "</option>";
					}
					
				}	
				$("select.selectbox_menulist").html("").html(optionHTML);
				 if (obj.hasOwnProperty("flowid")) {				
						$('#menulist').val('pen.flow.packets');
					} else {
						$('#menulistISL').val('bits');				
					}	
			}
						
			if($("#check1").prop("checked") || $("#check2").prop("checked")){
				$("#islMetric").show();
				$("#graphrowDiv").show();
			}
			
			if(!$("#check1").prop("checked") && !$("#check2").prop("checked")){
				$("#islMetric").hide();
				$("#graphrowDiv").hide();
			}


			if($("#check1").prop("checked") && !$("#check2").prop("checked")){
				
				$(".source-header").show();
				$(".target-header").hide();
		    	$("#source-graph_div").show();
		    	$("#dest-graph_div").hide();
				    if(domObj.id == "check1"){
				    	getISLGraphData(srcSwitch,srcPort,domObj.id);
				    }
					
			}
			
			if(!$("#check1").prop("checked") && $("#check2").prop("checked")){
								
				$(".target-header").show();
				$(".source-header").hide();
				$("#source-graph_div").hide();
		    	$("#dest-graph_div").show();
		    	
				if(domObj.id == "check2"){
			    	getISLGraphData(targetSwitch,targetPort,domObj.id);
			    }
			}
			
			
			if($("#check2").prop("checked") && $("#check1").prop("checked")){
							
				$(".source-header").show();
				$(".target-header").show();
				$("#source-graph_div").show();
		    	$("#dest-graph_div").show();			
		    	getISLGraphData(srcSwitch,srcPort,domObj.id);
				getISLGraphData(targetSwitch,targetPort,domObj.id);
			}
		}
}

function getISLGraphData(switchId,portId,domId) {

	var graphDivCode;
	if($("#check1").prop("checked")){
		$(".source-header").show();
		$(".target-header").hide();
		graphDivCode = 0;
		$("#waitisl2").hide();
		$("#waitisl1").show();
	}

	if($("#check2").prop("checked")) {
		$(".source-header").hide();
		$(".target-header").show();
		graphDivCode = 1;
		$("#waitisl1").hide();
		$("#waitisl2").show();		
	}
	
	if($("#check1").prop("checked") && $("#check2").prop("checked")) {		
		$(".source-header").show();
		$(".target-header").show();
		graphDivCode = 2;
		$("#waitisl1").show();
		$("#waitisl2").show();
	}

	var regex = new RegExp("^\\d+(s|h|m){1}$");
	var currentDate = new Date();
	var startDate = new Date($("#datetimepicker7ISL").val());
	var endDate =  new Date($("#datetimepicker8ISL").val());
	var convertedStartDate = moment(startDate).format("YYYY-MM-DD-HH:mm:ss");	
	var convertedEndDate = moment(endDate).format("YYYY-MM-DD-HH:mm:ss");
	var downsampling = $("#downsamplingISL").val();
	var downsamplingValidated = regex.test(downsampling);
	var selMetric=$("select.selectbox_menulist").val();
	var valid=true;
	
	if(downsamplingValidated == false) {
		
		$("#DownsampleID").addClass("has-error")	
		$(".downsample-error-message").html("Please enter valid input.");		
		valid=false;
		return
	}
	if(startDate.getTime() > currentDate.getTime()) {

		$("#fromId").addClass("has-error")	
		$(".from-error-message").html("From date should not be greater than currentDate.");				
		valid=false;
		return;
	} else if(endDate.getTime() < startDate.getTime()){
		$("#toId").addClass("has-error")	
		$(".to-error-message").html("To date should not be less than from fate.");		
		valid=false;
		return;
	}
	
	var autoreloadISL = $("#autoreloadISL").val();
	var numbers = /^[-+]?[0-9]+$/;  
	var checkNo = $("#autoreloadISL").val().match(numbers);
	var checkbox =  $("#check").prop("checked");
	var test = true;
    autoVal.reloadValidation(function(valid){
	  
	  if(!valid) {
		  test = false;		  
		  return false;
	  }
  });
  
if(test) {
	
	$("#fromId").removeClass("has-error")
    $(".from-error-message").html("");
	
	$("#toId").removeClass("has-error")
    $(".to-error-message").html("");
	
	$("#autoreloadId").removeClass("has-error")
    $(".error-message").html("");
	
  	$("#DownsampleID").removeClass("has-error")
	$(".downsample-error-message").html("");
	
  	   var url = "/stats/switchid/"+switchId+"/port/"+portId+"/"+convertedStartDate+"/"+convertedEndDate+"/"+downsampling+"/"+selMetric;
  	   	   
	   loadGraph.loadGraphData(url,"GET",selMetric,domId).then(function(response) {	   
		if(graphDivCode ==0){
			$("#waitisl1").css("display", "none");
			$('body').css('pointer-events', 'all');
			showIslSwitchStats.showIslSwitchStatsData(response,selMetric,graphDivCode,""); 
		}
		if(graphDivCode ==1){
			$("#waitisl2").css("display", "none");
			$('body').css('pointer-events', 'all');
			showIslSwitchStats.showIslSwitchStatsData(response,selMetric,graphDivCode,""); 
		}
		if(graphDivCode ==2) {
			$("#waitisl1").css("display", "none");
			$("#waitisl2").css("display", "none");
			showIslSwitchStats.showIslSwitchStatsData(response,selMetric,graphDivCode,""); 
		}
		
})
	
			
			if(autoreloadISL){  
				
				if($("#check1").prop("checked") && !$("#check2").prop("checked")) {	
					clearInterval(graphIntervalISL);
					graphIntervalISL = setInterval(function(){
						callIslSwitchIntervalData(srcSwitch,srcPort) 
					}, 1000*autoreloadISL);
				}
				
				if(!$("#check1").prop("checked") && $("#check2").prop("checked")) {
					clearInterval(graphIntervalISL);
					graphIntervalISL = setInterval(function(){
						callIslSwitchIntervalData(targetSwitch,targetPort) 
					}, 1000*autoreloadISL);
				}
				
				if($("#check1").prop("checked") && $("#check2").prop("checked")) {

					clearInterval(graphIntervalISL);
					graphIntervalISL = setInterval(function(){
						callIslSwitchIntervalData(srcSwitch,srcPort) 
					}, 1000*autoreloadISL);
					
					clearInterval(graphIntervalISLName);
					graphIntervalISLName = setInterval(function(){
						callIslSwitchIntervalData(targetSwitch,targetPort) 
					}, 1000*autoreloadISL);
				}
		   }
	}	
}

$(function() {
	
	$("#datetimepicker7ISL,#datetimepicker8ISL,#downsamplingISL,#menulistISL,#autoreloadISL").on("change",function(event) {

		if($("#check1").prop("checked") || $("#check2").prop("checked")) {
			if($("#check1").prop("checked") && !$("#check2").prop("checked")){
				  getISLGraphData(srcSwitch,srcPort);	  
			}
		}
		if(!$("#check1").prop("checked") && $("#check2").prop("checked")){
		    getISLGraphData(targetSwitch,targetPort);
		}
		
		if($("#check1").prop("checked") && $("#check2").prop("checked")){
			getISLGraphData(srcSwitch,srcPort);
			getISLGraphData(targetSwitch,targetPort);
		}
	});
});


function callIslSwitchIntervalData(switchId,portId){ 
	
	var currentDate = new Date();
	var startDate = new Date($("#datetimepicker7ISL").val());
	var convertedStartDate = moment(startDate).format("YYYY-MM-DD-HH:mm:ss");	
	var endDate = new Date()
	var convertedEndDate = moment(endDate).format("YYYY-MM-DD-HH:mm:ss");	
	var downsampling =$("#downsamplingISL").val()
	
	
	var url = "/stats/switchid/"+switchId+"/port/"+portId+"/"+convertedStartDate+"/"+convertedEndDate+"/"+downsampling+"/"+selMetric;
	loadGraph.loadGraphData(url,"GET",selMetric).then(function(response) {
		
	if($("#check1").prop("checked") && !$("#check2").prop("checked")){
		$("#waitisl1").css("display", "none");
		$('body').css('pointer-events', 'all'); 	  
	}
	if(!$("#check1").prop("checked") && $("#check2").prop("checked")){
		$("#waitisl2").css("display", "none");
		$('body').css('pointer-events', 'all'); 	  
	}
	
	if($("#check1").prop("checked") && $("#check2").prop("checked")){
		$("#waitisl1").css("display", "none");
		$("#waitisl2").css("display", "none");
		$('body').css('pointer-events', 'all'); 	  
	}
	showIslSwitchStats.showIslSwitchStatsData(response,selMetric,graphDivCode,""); 
	})
}

var cookie = new function() {
    this.set = function ( name, value, days ) {
        var expires = "";
        if ( days ) {
            var date = new Date();
            date.setTime( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    };

    this.get = function ( name ) {
        var nameEQ = name + "=";
        var ca = document.cookie.split( ';' );
        for ( var i = 0; i < ca.length; i++ ) {
            var c = ca[ i ];
            while ( c.charAt(0) == ' ' ) c = c.substring( 1, c.length );
            if ( c.indexOf( nameEQ ) == 0 ) return c.substring( nameEQ.length, c.length );
        }
        return null;
    };

    this.delete = function ( name ) {
        this.set( name, "", -1 );
    };
}

/* ]]> */