const http = new XMLHttpRequest();


window.onload = () => {
    if(localStorage.getItem("token") != null) {
        listRooms();
    } else {
        document.getElementById("alertbox").style.display="none";
        document.getElementById("goback").style.display="none";
        document.getElementById("menu").style.display="block";
    }
}

function login() {
    document.getElementById("alertbox").style.display="none";
    document.getElementById("alertbox").innerHTML = '';
    
    let username = document.getElementById("username_login").value;
    let password = document.getElementById("password_login").value;
    let data = "username=" + encodeURIComponent(username) + "&pass=" + encodeURIComponent(password);
    
    if(username.length < 1) {
        document.getElementById("alertbox").innerHTML += "Username can't be empty";
        document.getElementById("alertbox").style.display="block";
    } else if(password.length < 1) {
        document.getElementById("alertbox").innerHTML += "Password can't be empty";
        document.getElementById("alertbox").style.display="block";
    } else {
        http.open('PATCH', 'http://gilito.com.pt/concord/auth_user.php?');
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); //content type of the request
        http.setRequestHeader('Accept', '*/*');
        http.onload = function() {
            if (http.readyState === 4 && http.status === 200) {
                console.log(http.responseText);
                let res = JSON.parse(http.responseText); // res é um array
                console.log(res);
                if(res.err == 0){
                    localStorage.setItem("name",res.user.u_name);
                    localStorage.setItem("username",res.user.u_username);
                    localStorage.setItem("avatar",res.user.u_avatar);
                    localStorage.setItem("token",res.user.u_token);
                    localStorage.setItem("password", password);
                    listRooms();
                } else{
                    document.getElementById("alertbox").innerHTML += "Wrong username or password"
                    document.getElementById("alertbox").style.display="block";
                }
            } else if (http.status !== 200) { // o que fazer em caso de erro
                console.error('Falhou! - ' + http.status);
            }
        };
        http.send(data);
    }
}

function userForm() {
    document.getElementById("menu").style.display="none";
    document.getElementById("goback").style.display="block";
    document.getElementById("signup").style.display="block";
}

function signUp() {
    document.getElementById("alertbox2").style.display="none";
    document.getElementById("alertbox2").innerHTML = '';
    
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let name = document.getElementById("name").value;
    let picture = document.getElementById("avatar").value;
    let data = "name=" + encodeURIComponent(name) + "&username=" + encodeURIComponent(username) + "&pass=" + encodeURIComponent(password) + "&avatar=" + encodeURIComponent(picture);
    
    if(username.length < 6) {
        document.getElementById("alertbox2").innerHTML += "Username must have at least 6 characters";
        document.getElementById("alertbox2").style.display="block";
    } else if(password.length < 6) {
        document.getElementById("alertbox2").innerHTML += "Password must have at least 6 characters";
        document.getElementById("alertbox2").style.display="block";
    } else if(name.length < 2) {
        document.getElementById("alertbox2").innerHTML += "Name must have at least 2 characters";
        document.getElementById("alertbox2").style.display="block";
    } else if(picture.length < 1) {
        document.getElementById("alertbox2").innerHTML += "All fields are required";
        document.getElementById("alertbox2").style.display="block";
    } else {
        http.open('POST', 'http://gilito.com.pt/concord/add_user.php?');
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        http.setRequestHeader('Accept', '*/*');
        http.onload = function() {
            if (http.readyState === 4 && http.status === 200) {
                let res = JSON.parse(http.responseText); 
                console.log(res);
                if(res.err == 0){
                    document.getElementById("alertbox2").innerHTML += "Account created! Go to login page";
                    document.getElementById("alertbox2").style.display="block";
                } else{
                    document.getElementById("alertbox2").innerHTML += "Username already exists";
                    document.getElementById("alertbox2").style.display="block";
                }
            } else if (http.status !== 200) {
                console.error('Falhou! - ' + http.status);
            }
        };
        http.send(data);
    }
}

function listRooms() {
    document.getElementById("profile").innerHTML = '';
    document.getElementById("roomlist").innerHTML = '';
    http.open('GET', 'http://gilito.com.pt/concord/get_rooms.php?');
    http.setRequestHeader("Authorization", localStorage.getItem("token"));
    http.setRequestHeader('Accept', '*/*'); 
    http.onload = function() {
        if (http.readyState === 4 && http.status === 200) {
            let res = JSON.parse(http.responseText);
            console.log(res);
            if(res.err == 0){
                document.getElementById("menu").style.display="none";
                document.getElementById("rooms").style.display="block";
                document.getElementById("profile").style.display="block";
                document.getElementById("goback").style.display="block";
                document.getElementById("profile").innerHTML +=  "<input type='button' id='viewprofile' value='View profile' onclick='showProfile()'><input type='button' id='logout' value='logout' onclick='logout()'><img src='" + localStorage.getItem("avatar") + "' id='avatarimage'><br>"
                res.rooms.forEach(element => {
                    if(element.r_name != null && element.r_name != "") {
                        document.getElementById("roomlist").innerHTML += "<p id='room'><input type='button' id='joinroombutton' value='Join room' onclick='enterRoom(" + element.r_id + ")'>" + element.r_name + " Created by: " + element.u_username +"</p>"
                    }
                });
            } else{
                console.error(res.err_txt);
            }
        } else if (http.status !== 200) {
            console.error('Falhou! - ' + http.status);
        }
    };
    http.send(); 
}

function addRoomPage() {
    document.getElementById("rooms").style.display="none";
    document.getElementById("addroompage").style.display="block";
}

function addRoom() {
    
    document.getElementById("alertbox3").style.display="none";
    document.getElementById("alertbox3").innerHTML = '';
    
    let roomname = document.getElementById("room_name").value;
    let data = "name=" + encodeURIComponent(roomname);
    
    if(roomname.length < 1) {
        document.getElementById("alertbox3").innerHTML += "Name can't be empty";
        document.getElementById("alertbox3").style.display="block";
    } else {
        http.open('POST', 'http://gilito.com.pt/concord/add_room.php?');
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        http.setRequestHeader("Authorization", localStorage.getItem("token"));
        http.setRequestHeader('Accept', '*/*');
        http.onload = function() {
            if (http.readyState === 4 && http.status === 200) {
                let res = JSON.parse(http.responseText); 
                console.log(res);
                if(res.err == 0){
                    document.getElementById("alertbox3").innerHTML += "Room successfully added";
                    document.getElementById("alertbox3").style.display="block";
                } else{
                    document.getElementById("alertbox3").innerHTML += "There was a problem. Try again";
                    document.getElementById("alertbox3").style.display="block";
                    console.error(res.err_txt);
                }
            } else if (http.status !== 200) { 
                console.error('Falhou! - ' + http.status);
            }
        };
        http.send(data);
    }
    
}

function enterRoom(roomid) {
    setInterval(function(){
        document.getElementById("selectedroom").innerHTML = '';
        let avatarimg = '';
        http.open('GET', 'http://gilito.com.pt/concord/get_messages.php?rid=' + roomid);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        http.setRequestHeader("Authorization", localStorage.getItem("token"));
        http.setRequestHeader('Accept', '*/*');
        http.onload = function() {
            if (http.readyState === 4 && http.status === 200) {
                let res = JSON.parse(http.responseText);
                console.log(res);
                if(res.err == 0){
                    document.getElementById("rooms").style.display="none";
                    document.getElementById("selectedroom").style.display="block";
                    res.messages.forEach(element => {
                        if(element.m_message != null && element.m_message != "") {
                            try {
                                if(element.u_avatar.length > 0) {
                                    avatarimg = element.u_avatar;
                                } else {
                                    avatarimg = "https://www.osso.pt/wp-content/uploads/2013/03/765-default-avatar.png";
                                }
                            }catch(error) {
                                avatarimg = "https://www.osso.pt/wp-content/uploads/2013/03/765-default-avatar.png";
                            }
                            if(element.u_username != localStorage.getItem("username") ) {
                                if(element.m_active == 1) {
                                    document.getElementById("selectedroom").innerHTML += "<p id='message'><img src='" + avatarimg + "' id='avatarimagemsg'> " + element.m_message + "</p>";
                                } else {
                                    document.getElementById("selectedroom").innerHTML += "<p id='message' >Message removed by " + element.u_username + "</p>";
                                } 
                            } else {
                                if(element.m_active == 1) {
                                    document.getElementById("selectedroom").innerHTML += "<p id='mymessage'>" + element.m_message + "<input type='button' id='deletemessage' value='X' onclick='deleteMessage(" + roomid + ", " + element.m_id + ")'></p>";
                                } else {
                                    document.getElementById("selectedroom").innerHTML += "<p id='mymessage'>Message removed by " + element.u_username + "</p>";
                                } 
                            }
                        }
                    });
                    document.getElementById("selectedroom").innerHTML += "<input type='text' id='my_message' placeholder='message here'><input type='button' id='sendmessage' value='SEND' onclick='sendMessage(" + roomid + ")'>"
                    document.getElementById("selectedroom").scrollTop = document.getElementById("selectedroom").scrollHeight;
                } else{
                    console.error(res.err_txt);
                }
                
            } else if (http.status !== 200) {
                console.error('Falhou! - ' + http.status);
            }
        };
        http.send();
    }, 10000)
    
    
}

function reloadMessages(roomid, reslength) {
    let avatarimg = '';
    http.open('GET', 'http://gilito.com.pt/concord/get_messages.php?rid=' + roomid);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    http.setRequestHeader("Authorization", localStorage.getItem("token"));
    http.setRequestHeader('Accept', '*/*');
    http.onload = function() {
        if (http.readyState === 4 && http.status === 200) {
            let res = JSON.parse(http.responseText);
            console.log(res);
            if(res.err == 0){
                if(res.messages.length > reslength) {
                    document.getElementById("rooms").style.display="none";
                    document.getElementById("selectedroom").style.display="block";
                    res.messages.forEach(element => {
                        if(element.m_message != null && element.m_message != "") {
                            if(element.u_avatar.length > 0) {
                                avatarimg = element.u_avatar;
                            } else {
                                avatarimg = "https://www.osso.pt/wp-content/uploads/2013/03/765-default-avatar.png";
                            }
                            if(element.u_username != localStorage.getItem("username") ) {
                                if(element.m_active == 1) {
                                    document.getElementById("selectedroom").innerHTML += "<p id='message'><img src='" + avatarimg + "' id='avatarimagemsg'> " + element.m_message + "</p>";
                                } else {
                                    document.getElementById("selectedroom").innerHTML += "<p id='message' >Message removed by " + element.u_username + "</p>";
                                } 
                            } else {
                                if(element.m_active == 1) {
                                    document.getElementById("selectedroom").innerHTML += "<p id='mymessage'>" + element.m_message + "<input type='button' id='deletemessage' value='X' onclick='deleteMessage(" + roomid + ", " + element.m_id + ")'></p>";
                                } else {
                                    document.getElementById("selectedroom").innerHTML += "<p id='mymessage'>Message removed by " + element.u_username + "</p>";
                                } 
                            }
                        }
                    });
                    document.getElementById("selectedroom").innerHTML += "<input type='text' id='my_message' placeholder='message here'><input type='button' id='sendmessage' value='SEND' onclick='sendMessage(" + roomid + ")'>"
                } else {
                    console.log("Sem mensagens novas");
                }  
            } else{
                console.error(res.err_txt);
            }
            
        } else if (http.status !== 200) {
            console.error('Falhou! - ' + http.status);
        }
    };
    http.send();
}

function sendMessage(roomid) {
    var message = document.getElementById("my_message").value;
    let data = "&message=" + encodeURIComponent(message);
    if(message.length > 0) {
        http.open('POST', 'http://gilito.com.pt/concord/add_message.php?rid=' + roomid);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        http.setRequestHeader("Authorization", localStorage.getItem("token"));
        http.setRequestHeader('Accept', '*/*');
        http.onload = function() {
            if (http.readyState === 4 && http.status === 200) {
                let res = JSON.parse(http.responseText);
                console.log(res);
                if(res.err == 0){
                    enterRoom(roomid);
                } else{
                    console.error(res.err_txt);
                }
            } else if (http.status !== 200) {
                console.error('Falhou! - ' + http.status);
            }
        };
        http.send(data);
    }
}

function deleteMessage(roomid, messageid) {
    http.open('DELETE', 'http://gilito.com.pt/concord/delete_message.php?rid=' + roomid + '&mid=' + messageid);
    http.setRequestHeader("Authorization", localStorage.getItem("token"));
    http.setRequestHeader('Accept', '*/*'); 
    
    http.onload = function() {
        if (http.readyState === 4 && http.status === 200) {
            let res = JSON.parse(http.responseText);
            console.log(res);
            if(res.err == 0){
                enterRoom(roomid);
            } else{
                console.error(res.err_txt);
            }
        } else if (http.status !== 200) {
            console.error('Falhou! - ' + http.status);
        }
    };
    http.send();
}

function showProfile() {
    document.getElementById("editprofile").innerHTML = '';
    document.getElementById("alertbox4").style.display="none";
    document.getElementById("addroompage").style.display="none";
    document.getElementById("selectedroom").style.display="none";
    document.getElementById("rooms").style.display="none";
    document.getElementById("myprofile").style.display="block";
    document.getElementById("profileshow").innerHTML = '';
    document.getElementById("profileshow").innerHTML += "<p><img src='" + localStorage.getItem("avatar") + "' id='avatarimage'></img><input type='button' id='editav' value='EDIT' onclick='showEditAvatar()'></p><br>"
    document.getElementById("profileshow").innerHTML += "<p>USERNAME: " + localStorage.getItem("username") + "</p><br>"
    document.getElementById("profileshow").innerHTML += "<p>NAME: " + localStorage.getItem("name") + "<input type='button' id='editna' value='EDIT' onclick='showEditName()'></p><br>"
    document.getElementById("profileshow").innerHTML += "<br><input type='button' id='editpass' value='CHANGE PASSWORD' onclick='showEditPassword()'><br>"
}

function showEditName() {
    document.getElementById("editprofile").innerHTML = '';
    document.getElementById("editprofile").innerHTML += "<input type='text' id ='newname' placeholder='New name'><input type='button' id='ok' value='OK' onclick='editProfile(1)'>";
}

function showEditAvatar() {
    document.getElementById("editprofile").innerHTML = '';
    document.getElementById("editprofile").innerHTML += "<input type='text' id ='newavatar' placeholder='New avatar'><input type='button' id='ok' value='OK' onclick='editProfile(2)'>";
}
function showEditPassword() {
    document.getElementById("editprofile").innerHTML = '';
    document.getElementById("editprofile").innerHTML += "<input type='text' id ='oldpassword' placeholder='Old password'> <input type='text' id ='newpassword' placeholder='New password'><input type='button' id='ok' value='OK' onclick='editProfile(3)'>";
}

function editProfile(variable) {
    document.getElementById("alertbox4").style.display="none";
    document.getElementById("alertbox4").innerHTML = '';
    console.log(variable);
    if(variable == 1) {
        let newname = document.getElementById("newname").value;
        if(newname.length > 3) {
            localStorage.setItem("name", newname);
            document.getElementById("alertbox4").innerHTML += "Name changed";
            document.getElementById("alertbox4").style.display="block";
        } else {
            document.getElementById("alertbox4").innerHTML += "Name must be at least 3 characters";
            document.getElementById("alertbox4").style.display="block";
        }
    } else if(variable == 2) {
        let newavatar = document.getElementById("newavatar").value;
        if(newavatar.length > 0) {
            localStorage.setItem("avatar", newavatar);
            document.getElementById("alertbox4").innerHTML += "Avatar changed";
            document.getElementById("alertbox4").style.display="block";
        } else {
            document.getElementById("alertbox4").innerHTML += "Field can't be empty";
            document.getElementById("alertbox4").style.display="block";
        }
    } else {
        let newpassword = document.getElementById("newpassword").value;
        let oldpassword = document.getElementById("oldpassword").value;
        if(newpassword.length > 6) {
            if(oldpassword == localStorage.getItem("password")) {
                localStorage.setItem("password", newpassword);
                document.getElementById("alertbox4").innerHTML += "Password changed";
                document.getElementById("alertbox4").style.display="block";
            } else {
                document.getElementById("alertbox4").innerHTML += "Old password is wrong";
                document.getElementById("alertbox4").style.display="block";
            }
        } else {
            
            document.getElementById("alertbox4").innerHTML += "Password must be at least 6 characters";
            document.getElementById("alertbox4").style.display="block";
        }
    } 
    
    let data = "name=" + encodeURIComponent(localStorage.getItem("name")) + "&username=" + encodeURIComponent(localStorage.getItem("username")) + "&pass=" + encodeURIComponent(localStorage.getItem("password")) + "&avatar=" + encodeURIComponent(localStorage.getItem("avatar"));
    http.open('PUT', 'http://gilito.com.pt/concord/edit_user.php');
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    http.setRequestHeader("Authorization", localStorage.getItem("token"));
    http.setRequestHeader('Accept', '*/*');
    http.onload = function() {
        if (http.readyState === 4 && http.status === 200) {
            let res = JSON.parse(http.responseText); 
            console.log(res);
            if(res.err == 0){
                console.table(res);
            } else{
                console.error(res.err_txt);
            }
        } else if (http.status !== 200) { 
            console.error('Falhou! - ' + http.status);
        }
    };
    http.send(data);
}

function logout() {
    http.open('PATCH', 'http://gilito.com.pt/concord/logout_user.php?');
    http.setRequestHeader("Authorization", localStorage.getItem("token"));
    http.setRequestHeader('Accept', '*/*'); 
    http.onload = function() {
        if (http.readyState === 4 && http.status === 200) {
            let res = JSON.parse(http.responseText); 
            console.log(res);
            if(res.err == 0){
                localStorage.clear();
                document.getElementById("alertbox").style.display="none";
                document.getElementById("rooms").style.display="none";
                document.getElementById("selectedroom").style.display="none";
                document.getElementById("logout").style.display="none";
                document.getElementById("goback").style.display="none";
                document.getElementById("profile").style.display="none";
                document.getElementById("myprofile").style.display="none";
                document.getElementById("menu").style.display="block";
            } else{
                console.error(res.err_txt);
            }
        } else if (http.status !== 200) {
            console.error('Falhou! - ' + http.status);
        }
    };
    http.send();
}