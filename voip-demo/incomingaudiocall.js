//const { name } = require("jssip");
function call() {
  var userAgent;
  JsSIP.debug.enable("JsSIP:*");
  var socket = new JsSIP.WebSocketInterface("ws://192.168.0.85:5066");
  var configuration = {
    sockets: [socket],
    uri: "sip:1011@192.168.0.85:5062",
    password: "1234",
    register: true,
    register_expires: 3600,
  };

  userAgent = new JsSIP.UA(configuration);
  //
  //
  setTimeout(function () {
    userAgent.on(
      "newRTCSession",
      function (e) {
        var session = e.session;
        console.log("New session", session);
      },
      2000
    );

    userAgent.start();

    var eventHandlers = {
      progress: function (e) {
        console.log("***********************call is in progress");
      },
      failed: function (e) {
        console.log("***************************call failed with cause: ", e);
      },
      ended: function (e) {
        console.log("********************call ended with cause: ", e);
      },
      confirmed: function (e) {
        console.log("***************************call confirmed", e);
      },
      peerconnection: function (e) {
        console.log("peerconnection***************************", e);
        e.peerconnection.onaddstream = function (event) {
          console.log(" ***************** addstream", event);
          audioElement = document.getElementById("mediaElement");
          document.body.appendChild(audioElement);
          audioElement.srcObject = e.stream;
          audioElement.play();
        };
      },
    };

    var callOptions = {
      eventHandlers: eventHandlers,
      mediaConstraints: {
        audio: true,
        video: false,
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

    //setTimeout(function () {
    userAgent.on("newRTCSession", function (e) {
      console.log("newRTCSession**********************************".e);
      var session = e.session;
      if (session.direction == "incoming") {
        console.log("Answer**********************************");
        session.on("peerconnection", function (e) {
          console.log("peerconnection");
          e.peerconnection.addEventListener("addstream", function (e) {
            audioElement = document.getElementById("mediaElement");
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
  // }, 2000);
}
