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

    async function navigate() {
        let url = urlInput.value.trim();
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        let targetUrl = url;
        
        let cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');

        if (url.includes('google.com/search')) {
            if (!url.includes('&igu=1')) {
                targetUrl = url + (url.includes('?') ? '&' : '?') + 'igu=1';
            }
        } else if (url.includes('google.com') && !url.includes('maps') && !url.includes('mail') && !url.includes('drive')) {
            targetUrl = "https://www.google.com/search?q=&igu=1";
        }

        else if (url.includes('duckduckgo.com')) {
            const query = url.split('q=')[1] || "";
            if (query) {
                targetUrl = "https://html.duckduckgo.com/html/?q=" + query;
            } else {
                targetUrl = "https://html.duckduckgo.com/html/";
            }
        }

        else if (cleanUrl.startsWith('youtube.com') || cleanUrl.startsWith('youtu.be')) {
            if (url.includes('v=')) {
                const videoId = url.split('v=')[1]?.split('&')[0] || "";
                if (videoId) {
                    targetUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
                }
            } else if (url.includes('youtu.be/')) {
                const videoId = url.split('youtu.be/')[1]?.split('?')[0] || "";
                if (videoId) {
                    targetUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
                }
            } else {

                targetUrl = `https://www.youtube-nocookie.com/embed?listType=playlist&list=PLrEnWoR77e9g60fS9w_Y2A_3E_G2E81U-`;
            }
        }

        else if (cleanUrl.startsWith('twitch.tv')) {
            const host = window.location.hostname || "localhost";
            const path = cleanUrl.replace('twitch.tv/', '').split('?')[0].trim();
            
            if (!path || path === 'directory' || path === 'search') {

                targetUrl = `https://player.twitch.tv/?channel=twitch&parent=${host}`;
            } else {
                targetUrl = `https://player.twitch.tv/?channel=${path}&parent=${host}`;
            }
        }

        else if (url.includes('google.com/maps') || url.includes('maps.google.com') || url.includes('googleusercontent.com/maps.google.com')) {
            if (!url.includes('output=embed')) {
                targetUrl = url + (url.includes('?') ? '&' : '?') + 'output=embed';
            }
        }

        else if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
            const videoId = url.split('vimeo.com/')[1]?.split('?')[0] || "";
            if (videoId && !isNaN(videoId)) {
                targetUrl = `https://player.vimeo.com/video/${videoId}`;
            }
        }

        else if (url.includes('soundcloud.com/') && !url.includes('w.soundcloud.com')) {
            targetUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`;
        }

        else if (url.includes('ted.com/talks/') && !url.includes('embed.ted.com')) {
            targetUrl = url.replace('ted.com/talks/', 'embed.ted.com/talks/');
        }

        iframe.src = targetUrl; 
    }

    goBtn.addEventListener("click", navigate);
    
    urlInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            navigate();
        }
    });

    refreshBtn.addEventListener("click", () => {
        navigate();
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