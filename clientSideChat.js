let myWebSocket = new WebSocket("ws://localhost:8000");
let myMsg = document.getElementById("myMsg");
let messagesSection = document.getElementById("chatSection");
let sendMsgBtn = document.getElementById("sendMsg");
let onlineUsers = document.getElementById("onlineUsers");

let name = prompt("Enter Your Name");

let myTargetUser = "All Users";
myWebSocket.onopen = function (ev) {
    let LogedInUser = { "type": "login", "text": name }
    myWebSocket.send(JSON.stringify(LogedInUser));
}

sendMsgBtn.onclick = (e) => {
    e.preventDefault();
    if (myTargetUser == "All Users") {
        let serverMessage = { "type": "chat", "text": myMsg.value, "sender": name };
        myWebSocket.send(JSON.stringify(serverMessage));
    }
    else {
        let serverMessage = { "type": "privateChat", "text": myMsg.value, "sender": name, "targetUser": myTargetUser };
        myWebSocket.send(JSON.stringify(serverMessage));
    }
    myMsg.value = "";
}

myWebSocket.onmessage = (ev) => {
    let serverResponse = (JSON.parse(ev.data));
    if (serverResponse.type == "chat")
        messagesSection.innerHTML += `${serverResponse.sender} (Everyone) : ${serverResponse.value}\n`;

    if (serverResponse.type == "connectedUsers") {
        onlineUsers.innerHTML = "";
        if(myTargetUser == "All Users")
            $("#onlineUsers").append("<li class='selectedUser'>All Users</li>");
        else
            $("#onlineUsers").append("<li>All Users</li>");
        serverResponse.value.forEach((connectedUser) => {
            if (connectedUser.username != name) {
                let myLiComponent = document.createElement("LI");
                let myLiData = document.createTextNode(connectedUser.username);
                myLiComponent.appendChild(myLiData);
                onlineUsers.appendChild(myLiComponent);
                if(connectedUser.username == myTargetUser)
                    $(myLiComponent).addClass("selectedUser");
            }
        })
    }
    if (serverResponse.type = "privateChat") {
        if (serverResponse.targetUser == name) {
            messagesSection.innerHTML += `${serverResponse.sender} (Private Char) : ${serverResponse.value}\n`;
        }
    }

}

$("ul").on("click", (e) => {
    let SelectedUser = $(e.target);
    $(".selectedUser").removeClass("selectedUser");
    SelectedUser.addClass("selectedUser")
    myTargetUser = SelectedUser.text();
    console.log(myTargetUser);
})