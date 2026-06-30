(function() {
    const browserIcon = document.getElementById("browser-icon");
    const browserWindow = document.getElementById("browser-window");
    const iframe = document.getElementById("browser-iframe");
    const urlInput = document.getElementById("browser-url");
    const goBtn = document.getElementById("browser-go-btn");
    const backBtn = document.getElementById("browser-back-btn");
    const refreshBtn = document.getElementById("browser-refresh-btn");
    const taskbar = document.getElementById("taskbar");

    let isMaximized = false;
    let preMaximizedStyle = {};

    browserIcon.addEventListener("click", () => {
        browserWindow.style.width = "800px";
        browserWindow.style.height = "500px";
        browserWindow.style.top = "80px";
        browserWindow.style.left = "120px";
        browserWindow.classList.remove("maximized");
        isMaximized = false;
        browserWindow.style.display = "flex";
        window.focusWindow(browserWindow);
        addToTaskbar();
    });

    function addToTaskbar() {
        const taskbarItems = document.getElementById("taskbar-items");
        if (document.getElementById("taskbar-browser")) return;

        const item = document.createElement("button");
        item.id = "taskbar-browser";
        item.style.cursor = "pointer";
        item.style.background = "none";
        item.style.border = "none";
        item.style.padding = "0";
        item.style.margin = "0 5px";

        const img = document.createElement("img");
        img.src = "assets/browser-icon.png";
        img.style.width = "40px";
        img.style.height = "40px";

        item.addEventListener("mouseenter", () => {
            item.style.background = "rgba(54, 52, 52, 0.1)";
            item.style.borderRadius = "4px";
            item.style.border = "1px solid rgba(255, 255, 255, 0.2)";
        });

        item.addEventListener("mouseleave", () => {
            item.style.background = "none";
            item.style.border = "none";
        });

        item.addEventListener("click", () => {
            if (browserWindow.style.display === "none") {
                browserWindow.style.display = "flex";
                window.focusWindow(browserWindow);
                if (isMaximized) taskbar.classList.add("solid");
            } else {
                browserWindow.style.display = "none";
                if (isMaximized) taskbar.classList.remove("solid");
            }
        });

        item.appendChild(img);
        taskbarItems.appendChild(item);
    }
    document.getElementById("browser-close-btn").addEventListener("click", () => {
        browserWindow.style.display = "none";
        window.removeFromTaskbar("taskbar-browser");
        if (isMaximized) taskbar.classList.remove("solid");
    });

    document.getElementById("browser-min-btn").addEventListener("click", () => {
        browserWindow.style.display = "none";
        if (isMaximized) taskbar.classList.remove("solid");
        if (!document.getElementById("taskbar-browser")) addToTaskbar();
    });

    document.getElementById("browser-max-btn").addEventListener("click", () => {
        if (!isMaximized) {
            preMaximizedStyle = {
                top: browserWindow.style.top,
                left: browserWindow.style.left,
                width: browserWindow.style.width,
                height: browserWindow.style.height
            };
            browserWindow.style.width = "100vw";
            browserWindow.style.height = "calc(100vh - 50px)";
            browserWindow.style.left = "0";
            browserWindow.style.top = "0";
            browserWindow.classList.add("maximized");
            taskbar.classList.add("solid");
            isMaximized = true;
        } else {
            browserWindow.style.width = preMaximizedStyle.width;
            browserWindow.style.height = preMaximizedStyle.height;
            browserWindow.style.left = preMaximizedStyle.left;
            browserWindow.style.top = preMaximizedStyle.top;
            browserWindow.classList.remove("maximized");
            taskbar.classList.remove("solid");
            isMaximized = false;
        }
    });

    browserWindow.addEventListener("mousedown", () => {
        window.bringToFront(browserWindow);
    });

    function navigate() {
        let url = urlInput.value.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
            urlInput.value = url;
        }
        iframe.src = url;
    }

    goBtn.addEventListener("click", navigate);
    
    urlInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            navigate();
        }
    });

    refreshBtn.addEventListener("click", () => {
        iframe.src = iframe.src;
    });

    backBtn.addEventListener("click", () => {
        // Warning: Iframe history tracking is strictly blocked by browsers for cross-origin URLs.
        try {
            iframe.contentWindow.history.back();
        } catch(e) {
            console.log("Cross-origin iframe history manipulation is blocked by the host browser.");
        }
    });

})();