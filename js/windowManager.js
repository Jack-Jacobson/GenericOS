// Dragging and window management
const notepadWindow = document.getElementById("notepad-window");
const terminalWindow = document.getElementById("terminal-window");
const taskbar = document.getElementById("taskbar");

let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let globalDragging = false;

const titleBar = document.getElementById("notepad-titleBar");
if (titleBar) {
  titleBar.addEventListener("mousedown", (e) => {
    if (isMaximized) return;
    isDragging = true;
    globalDragging = true;
    offsetX = e.clientX - notepadWindow.offsetLeft;
    offsetY = e.clientY - notepadWindow.offsetTop;
    notepadWindow.style.cursor = "grabbing";
  });
}

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    let activeWindow = notepadWindow;
    if(terminalWindow.style.cursor === "grabbing"){
        activeWindow = terminalWindow;
    }

    const maxX = window.innerWidth - activeWindow.offsetWidth;
    const maxY = window.innerHeight - activeWindow.offsetHeight;

    const nextX = e.clientX - offsetX;
    const nextY = e.clientY - offsetY;

    const clampedX = Math.max(0, Math.min(nextX, maxX));
    const clampedY = Math.max(0, Math.min(nextY, maxY));

    activeWindow.style.left = `${clampedX}px`;
    activeWindow.style.top = `${clampedY}px`;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    globalDragging = false;
   notepadWindow.style.cursor = "";
   terminalWindow.style.cursor = "";
});

// Prevent icon highlight when dragging
document.addEventListener("mousedown", () =>{
    document.body.classList.add("dragging");
});

document.addEventListener("mouseup", () =>{
    document.body.classList.remove("dragging");
});

// Window button control
const win = document.getElementById("notepad-window");
const minBtn = document.getElementById("min-btn");
const maxBtn = document.getElementById("max-btn");
const closeBtn = document.getElementById("close-btn");

let isMaximized = false;
let prevState = {
    width: win.style.width,
    height: win.style.height,
    left: win.style.left,
    top: win.style.top
};

closeBtn.addEventListener("click", () => {
    if(isMaximized){
        taskbar.classList.remove("solid");
        isMaximized = false;
    }
    notepadWindow.style.display = "none";
    removeFromTaskbar();
});

minBtn.addEventListener("click", () => {
    notepadWindow.style.display = "none";
    if(!document.getElementById("taskbar-notepad")) addToTaskbar();
});

maxBtn.addEventListener("click", () => {
    if (!isMaximized) {
        prevState = {
            width: notepadWindow.style.width,
            height: notepadWindow.style.height,
            left: notepadWindow.style.left,
            top: notepadWindow.style.top
        };
        notepadWindow.style.width = "100vw";
        notepadWindow.style.height = "calc(100vh - 50px)";
        notepadWindow.style.left = "0";
        notepadWindow.style.top = "0";

        notepadWindow.classList.add("maximized");
        taskbar.classList.add("solid");

    } else {
        notepadWindow.style.width = prevState.width;
        notepadWindow.style.height = prevState.height;
        notepadWindow.style.left = prevState.left;
        notepadWindow.style.top = prevState.top;

        notepadWindow.classList.remove("maximized");
        taskbar.classList.remove("solid");
    }
    isMaximized = !isMaximized;
});

window.addToTaskbar = function(id, imgPath) {
    const taskbarItems = document.getElementById("taskbar-items");
    if (document.getElementById(id)) return;
    
    const item = document.createElement("button");
    item.id = id;
    item.innerHTML = `<img src="${imgPath}" style="width:30px;">`;
    taskbarItems.appendChild(item);
};

window.removeFromTaskbar = function(id) {
    const item = document.getElementById(id);
    if (item) item.remove();
};