// Wallpaper
document.getElementById("desktop").style.backgroundImage = "url('assets/wallpaper.jpeg')";

// Clock
function updateClock() {
const now = new Date();
let hours = now.getHours();
let minutes = now.getMinutes();
let seconds = now.getSeconds();

let ampm = "AM";
if(hours >= 12){
hours -= 12;
ampm = "PM";
} 
if(hours == 0){
hours = 12;
}

minutes = minutes.toString().padStart(2, '0');
seconds = seconds.toString().padStart(2, '0');

document.getElementById("clock").textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}

updateClock();
setInterval(updateClock, 1000);

// Boot screen fade out
setTimeout (() => {
const bootScreen = document.getElementById("boot-screen");
if(bootScreen) {
bootScreen.remove();
}
}, 3500);