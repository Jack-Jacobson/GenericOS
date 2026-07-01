// Wallpaper
const desktop = document.getElementById("desktop");
const savedWallpaper = localStorage.getItem("customWallpaper");
desktop.style.backgroundImage = savedWallpaper ? `url(${savedWallpaper})` : "url('assets/wallpaper.jpeg')";

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

(function() {
    const wallpaperMenu = document.createElement("div");
    wallpaperMenu.id = "wallpaper-menu";
    wallpaperMenu.style.cssText = "position:absolute; display:none; background:rgba(20,20,20,0.9); border:1px solid rgba(255,255,255,0.2); border-radius:4px; padding:5px 0; z-index:99999; font-family:sans-serif; font-size:14px; color:white;";

    const changeWallpaperOption = document.createElement("div");
    changeWallpaperOption.textContent = "Change Wallpaper";
    changeWallpaperOption.style.cssText = "padding:8px 15px; cursor:pointer;";
    changeWallpaperOption.addEventListener("mouseenter", () => changeWallpaperOption.style.background = "rgba(255,255,255,0.1)");
    changeWallpaperOption.addEventListener("mouseleave", () => changeWallpaperOption.style.background = "none");

    wallpaperMenu.appendChild(changeWallpaperOption);
    document.body.appendChild(wallpaperMenu);

    const wallpaperInput = document.createElement("input");
    wallpaperInput.type = "file";
    wallpaperInput.accept = "image/*";
    wallpaperInput.style.display = "none";
    document.body.appendChild(wallpaperInput);

    desktop.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        wallpaperMenu.style.top = e.pageY + "px";
        wallpaperMenu.style.left = e.pageX + "px";
        wallpaperMenu.style.display = "block";
    });

    document.addEventListener("click", (e) => {
        if(!wallpaperMenu.contains(e.target)) wallpaperMenu.style.display = "none";
    });

    changeWallpaperOption.addEventListener("click", () => {
        wallpaperInput.click();
        wallpaperMenu.style.display = "none";
    })
    
    wallpaperInput.addEventListener("change", () => {
        const file = wallpaperInput.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            desktop.style.backgroundImage = `url('${reader.result}')`;
            localStorage.setItem("customWallpaper", reader.result);
        };
        reader.readAsDataURL(file);
    });
})();