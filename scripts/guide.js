$(document).ready(function(){
	$("body").css("height","100%")
	$(".card").css({"height":"100%","color":"cornflowerblue"})
	$(".h4").css({"background-color":"burlywood","padding":"5px","color":"black","border-radius":"10px"})
})

$('#connect_btn').click(function(){
	client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");
	client.subscribe($("#topic").val());
	console.log('connect button clicked');
	$("#status").text("Connecting");
	$("#status").removeClass("alert-secondary");
	$("#status").addClass("alert-warning");
	client.on("connect", function(){
		$("#status").text("Successfully connected");
		$("#status").removeClass("alert-warning");
		$("#status").addClass("alert-secondary");
		Swal.fire({
			position: 'top-end',
			type: 'success',
			title: 'Your successfully connect to the broker!',
			showConfirmButton: false,
			timer: 1500
		  })
		console.log("success");
	});

	$(".disconnect_btn").click(function() {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, disconnect!'
		  }).then((result) => {
			if (result.value) {
				client.end();
			  Swal.fire(
				'Disconnected!',
				'Your are disconnected to the broker.',
				'success'
			  );
			  $("#status").text("Disconnected");
				$("#status").removeClass("alert-warning");
				$("#status").addClass("alert-secondary");
			}
		  })
		
	});

	$("#publish_btn").click(function() {
		var topic = $("#topic").val();
		var payload = $("#message").val();
		if (topic == "" && payload == "") {
			client.publish("","");
			Swal.fire({
			  type: 'error',
			  title: 'Oops...',
			  text: 'Please provide inputs!',
			});
		}
		else { 
			client.publish(topic,payload, function(err) {
				  if (err){
					Swal.fire({
						type: 'error',
						title: 'Oops...',
						text: 'An error occurs!',
					  });
				} else {
					console.log("published")
					Swal.fire('Published successfully!')
					
				}
				var row = $("<tr>");
					$("<td>").text(topic).appendTo($(row));
					$("<td>").text(payload).appendTo($(row));
					$("<td>").text(moment().format('MMMM Do YYYY, h:mm:ss a')).appendTo($(row));
					$("#tbl-body-pub").append($(row));
			});
			
			
		}

	});
	$("#subscribe_btn").click(function() {
		var subscribe = $("#topic-sub").val();
		var topic = $("#topic").val();
		if (subscribe != topic) {
			Swal.fire({
			  type: 'error',
			  title: 'Oops...',
			  text: 'Topic is not available!',
			});
		}
		else if (subscribe == topic && topic !== "") {
			client.subscribe(topic, function(err) {
				if(err) {
					Swal.fire({
						type: 'error',
						title: 'Oops...',
						text: 'An error occurs!',
					  });
				} else {
					var row = $("<tr>").attr("id", "mysub");
					$("<td>").text(topic).appendTo($(row));
					$("<td>").text(moment().format('MMMM Do YYYY, h:mm:ss a')).appendTo($(row));
					$("#tbl-body-sub").append($(row));
					Swal.fire('Subscribed successfully!');
				}
			});
			
		}
			
	})
	$("#unsubscribe_btn").click(function() {
			$("#topic-sub").val("");
			$("#mysub").remove();
			Swal.fire("Unsubscribed successfully")
	})
	client.on("message", function (topic, payload) {
		console.log([topic, payload].join(": "));
		var row = $("<tr>");
		$("<td>").text(topic).appendTo($(row));
		$("<td>").text(payload).appendTo($(row));
		$("<td>").text(moment().format('MMMM Do YYYY, h:mm:ss a')).appendTo($(row));
		$("#tbl-body").append($(row));

  })
});
