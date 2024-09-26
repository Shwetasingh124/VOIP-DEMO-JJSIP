function message() {
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

  userAgent.start();
  setTimeout(function () {
    const textBox = document.getElementById("msg");
    const content = document.getElementById("msg").value;

    const span1 = document.getElementById("localMessage");
    var newMessage = document.createElement("li");
    newMessage.innerHTML = content;
    span1.appendChild(newMessage);
    textBox.value = "";
    userAgent.sendMessage(`sip:1012@192.168.0.85:5062`, content);

    userAgent.on("newMessage", (data) => {
      const message = data.request.body;
      const span2 = document.getElementById("remoteMessage");
      var newMessage = document.createElement("li");
      newMessage.innerHTML = data.request.body;
      span2.appendChild(newMessage);
    });
  }, 1000);
}
