(function(){
    const minesweeperWindow = document.getElementById("minesweeper-window");
    const minesweeperIcon = document.getElementById("minesweeper-icon");
    const minesweeperMinBtn = document.getElementById("minesweeper-min-btn");
    const minesweeperMaxBtn = document.getElementById("minesweeper-max-btn");
    const minesweeperCloseBtn = document.getElementById("minesweeper-close-btn");
    const taskbar = document.getElementById("taskbar");

    let minesweeperMaximized = false;
    let minesweeperPrevState = {
        width: minesweeperWindow.style.width,
        height: minesweeperWindow.style.height,
        left: minesweeperWindow.style.left,
        top: minesweeperWindow.style.top
    };

    minesweeperIcon.addEventListener("click", () => {
        minesweeperWindow.style.width = "400px";
        minesweeperWindow.style.height = "480px";
        minesweeperWindow.style.top = "120px";
        minesweeperWindow.style.left = "200px";
        minesweeperWindow.classList.remove("maximized");
        minesweeperMaximized = false;
        minesweeperWindow.style.display = "flex";
        window.focusWindow(minesweeperWindow);
        addMinesweeperToTaskbar();
    });
    minesweeperCloseBtn.addEventListener("click", () => {
        minesweeperWindow.style.display = "none";
        if(minesweeperMaximized){
            taskbar.classList.remove("solid");
            minesweeperMaximized = false;
        }
        window.removeFromTaskbar("taskbar-minesweeper");
    });
    minesweeperMinBtn.addEventListener("click", () => {
        minesweeperWindow.style.display = "none";
        if(!document.getElementById("taskbar-minesweeper")){
            addMinesweeperToTaskbar();
        }
    });
    minesweeperMaxBtn.addEventListener("click", () => {
        if(!minesweeperMaximized){
            minesweeperPrevState = {
                width: minesweeperWindow.style.width,
                height: minesweeperWindow.style.height,
                left: minesweeperWindow.style.left,
                top: minesweeperWindow.style.top
            };
            minesweeperWindow.style.width = "100vw";
            minesweeperWindow.style.height = "calc(100vh - 50px)";
            minesweeperWindow.style.left = "0px";
            minesweeperWindow.style.top = "0px";
            minesweeperWindow.classList.add("maximized");
            taskbar.classList.add("solid");
        }
        else{
            minesweeperWindow.style.width = minesweeperPrevState.width;
            minesweeperWindow.style.height = minesweeperPrevState.height;
            minesweeperWindow.style.left = minesweeperPrevState.left;
            minesweeperWindow.style.top = minesweeperPrevState.top;
            minesweeperWindow.classList.remove("maximized");
            taskbar.classList.remove("solid");
        }
        minesweeperMaximized = !minesweeperMaximized;
    });
    
    function addMinesweeperToTaskbar(){
        const taskbarItems = document.getElementById("taskbar-items");
        if(document.getElementById("taskbar-minesweeper")) return;

        const item = document.createElement("button");
        item.id = "taskbar-minesweeper";
        item.style.cursor = "pointer";
        item.style.background = "none";
        item.style.border = "none";
        item.style.padding = "0";
        item.style.margin = "0 5px";

        const img = document.createElement("img");
        img.src = "assets/minesweeper-icon.png";
        img.style.width = "40px";
        img.style.height = "40px";

        item.addEventListener("mouseenter", () => {
            item.style.background = "rgba(54,52,52,0.1)";
            item.style.borderRadius = "4px";
            item.style.border = "1px solid rgba(255,255,255,0.2)";
        });

        item.addEventListener("mouseleave", () => {
            item.style.background = "none";
            item.style.border = "none";
        });

        item.addEventListener("click", () => {
            if(minesweeperWindow.style.display === "none"){
                minesweeperWindow.style.display = "flex";
                window.focusWindow(minesweeperWindow);
                if (minesweeperMaximized) taskbar.classList.add("solid");
            }
            else{
                minesweeperWindow.style.display = "none";
                if(minesweeperMaximized) taskbar.classList.remove("solid");
            }
        });
        item.appendChild(img);
        taskbarItems.appendChild(item);
    }
    
    minesweeperWindow.addEventListener("mousedown", () => {
        window.bringToFront(minesweeperWindow);
    });
})();