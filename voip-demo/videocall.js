function videoCall() {
  var userAgent;
  JsSIP.debug.enable("JsSIP:*");
  var socket = new JsSIP.WebSocketInterface("ws://192.168.0.85:5066");
  var configuration = {
    sockets: [socket],
    uri: "sip:1000@192.168.0.85",
    password: "1234",
    register_expires: 3600,
  };

  userAgent = new JsSIP.UA(configuration);

  userAgent.on("connected", function (e) {
    console.log("connected", e);
  });
  userAgent.on("disconnected", function (e) {
    console.log("disconnected", e);
  });

  userAgent.on("newRTCSession", function (e) {
    var session = e.session;
    console.log("Call event", session.direction);

    var callOptions = {
      mediaConstraints: {
        audio: true,
        video: true,
      },
    };

    if (session.direction == "incoming") {
      console.log("Answer");
      session.answer(callOptions);
    }
  });

  userAgent.on("registered", function (e) {
    console.log("Registered", e);
  });
  userAgent.on("unregistered", function (e) {
    console.log("Unregistered", e);
  });
  userAgent.on("registrationFailed", function (e) {
    console.log("Registration failed", e);
  });

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

  var options = {
    eventHandlers: eventHandlers,
    mediaConstraints: { audio: true, video: true },
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

  const target = document.getElementById("vcall").value;
  userAgent.call(`sip:${target}@192.168.0.85`, options);
}
