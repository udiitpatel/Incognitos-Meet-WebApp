const socket = io('/')
const videoGrid = document.getElementById('video-grid')
let myPeer = null
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true

let userName = prompt("Enter your Name");
const userNamePrint = document.getElementById('user_name_print');
userNamePrint.innerText = "User Name: " + userName;

let peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myPeer = new Peer(undefined, {
    path : '/peerjs',
  host: '/',
  port: '443',
})
myVideoStream = stream;
  addVideoStream(myVideo, stream)
  myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
  })
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    console.log("new user connected", userId)
    connectToNewUser(userId, stream)
  })

  let text = $('input')

  $('html').keydown((e) =>{
   if(e.which == 13 && text.val().length !== 0){
    console.log(text.val())
    socket.emit('message',text.val());
    text.val('')
   }
  })

  socket.on('createMessage', message => {
   console.log("Create message", message);
   $('ul').append(`<li class="message"><b>Anonymous</b><br/>${message}</li>`)
   scrollToBottom()
  // console.log('this come from server',message)
  })


}).catch(error=>{
  console.log("Error: ",error)
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})



function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

// let text = $('input')

// $('html').keydown((e) =>{
//   if(e.which == 13 && text.val().length !== 0){
//     console.log(text.val())
//     socket.emit('message',text.val());
//     text.val('')
//   }
// })

// socket.on('createMessage', message => {
//   console.log("Create message", message);
//   $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`)
//   scrollToBottom()
//   // console.log('this come from server',message)
// })

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

// mute
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if(enabled){
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  }else{
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

 const setMuteButton = () => {
  const html = `
  <i class="fas fa-microphone"></i>
  <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
 }

 const setUnmuteButton = () => {
  const html = `
  <i class="unmute fas fa-microphone-slash"></i>
  <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
 }


 const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

// let chatRoom = document.querySelector(".main__right");
// let chatBtn = document.querySelector("#chat_btn");
// let mainLeft = document.querySelector(".main__left");
// let visible = true;
// chatBtn.addEventListener("click", function() {
//   if ( visible ) {
//     chatRoom.style.visibility = "collapse";
//     mainLeft.style.flex = "1";
//   }
//   else {
//     chatRoom.style.visibility = "visible";
//     mainLeft.style.flex = "0.8"
//   }
//   visible = !visible;
// });
let copyLink = document.querySelector(".meet_link_final");
let leaveMeet = document.querySelector(".leave_meeting");
// console.log(roomId);
copyLink.addEventListener("click", function() {
  let meetLink = JSON.stringify(copyLink.textContent)
  meetLink = meetLink.slice(1, meetLink.length-1);
  meetLink = "https://thawing-refuge-60984.herokuapp.com/" + meetLink;
  navigator.clipboard.writeText(meetLink);
  showSnackbar();
});
leaveMeet.addEventListener("click", function () {
  showSnackbar2();
})

function showSnackbar() {
  // Get the snackbar DIV
  let x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
function showSnackbar2() {
  // Get the snackbar DIV
  let x = document.getElementById("snackbar_leave_meet");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
} 

 function yourFunction(){
    var element = document.getElementById("video-grid");
    var numberOfChildren = element.getElementsByTagName('video').length
    let numberOfUser = document.getElementById("number_of_user")
    numberOfUser.innerText =  numberOfChildren.toString()+" Participants";
    setTimeout(yourFunction, 2000);
}

yourFunction();
