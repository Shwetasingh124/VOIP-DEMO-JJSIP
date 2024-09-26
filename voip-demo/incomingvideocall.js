function videoCall() {
  var userAgent;
  JsSIP.debug.enable("JsSIP:*");
  var socket = new JsSIP.WebSocketInterface("ws://192.168.0.85:5066");
  var configuration = {
    sockets: [socket],
    uri: "sip:1011@192.168.0.85:5062",
    password: "1234",
    register_expires: 3600,
  };

  userAgent = new JsSIP.UA(configuration);

  // userAgent.on("connected", function (e) {
  //   console.log("connected", e);
  // });
  // userAgent.on("disconnected", function (e) {
  //   console.log("disconnected", e);
  // });

  setTimeout(function () {
    userAgent.on(
      "newRTCSession",
      function (e) {
        var session = e.session;
        console.log("Call event", session.direction);
      },
      2000
    );

    userAgent.start();
    var eventHandlers = {
      progress: function (e) {
        console.log("call is in progress");
      },
      failed: function (e) {
        console.log("call failed with cause: ", e);
      },
      ended: function (e) {
        console.log("call ended with cause: ", e);
      },
      confirmed: function (e) {
        console.log("call confirmed", e);
      },

      peerconnection: function (e) {
        console.log("peerconnection", e);
        e.peerconnection.onaddstream = function (event) {
          console.log(" *** addstream", event);
          audioElement = document.getElementById("remoteVideo");
          audioElement.srcObject = event.stream;
          audioElement.play();
        };
      },
    };
    var callOptions = {
      mediaConstraints: {
        audio: true,
        video: true,
      },
      sessionTimersExpires: 3600,
      pcConfig: {
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
            ],
          },
        ],
      },
    };
    userAgent.on("newRTCSession", function (e) {
      console.log("newRTCSession**********************************".e);
      var session = e.session;
      if (session.direction == "incoming") {
        console.log("Answer**********************************");
        session.on("peerconnection", function (e) {
          console.log("peerconnection");
          e.peerconnection.addEventListener("addstream", function (e) {
            audioElement = document.getElementById("remoteVideo");
            document.body.appendChild(audioElement);
            console.log("Stream added");
            audioElement.srcObject = e.stream;
            audioElement.play();
          });
        });
        session.answer(callOptions);
      }
    });
  });
}
