(function () {
    const aboutWindow = document.getElementById("about-window");
    const aboutIcon = document.getElementById("about-icon");
    const aboutMinBtn = document.getElementById("about-min-btn");
    const aboutMaxBtn = document.getElementById("about-max-btn");
    const aboutCloseBtn = document.getElementById("about-close-btn");
    const aboutSkipBtn = document.getElementById("about-skip-btn");
    const aboutBackBtn = document.getElementById("about-back-btn");
    const aboutNextBtn = document.getElementById("about-next-btn");
    const aboutDots = document.getElementById("about-dots");
    const slideIcon = document.getElementById("about-slide-icon");
    const slideTitle = document.getElementById("about-slide-title");
    const slideText = document.getElementById("about-slide-text");
    const taskbar = document.getElementById("taskbar");

    let aboutmaximized = false;
    let aboutPrevState = {
        width: aboutWindow.style.width,
        height: aboutWindow.style.height,
        left: aboutWindow.style.left,
        top: aboutWindow.style.top
    };

    const slides = [
        {
            icon: "assets/about-icon.png",
            title: "Welcome to GenericOS",
            text: `GenericOS is a custom desktop environment built with HTML, CSS, and JavaScript. This quick tour covers what you can do.`
        },
        {
            icon: "assets/notepad-icon.png",
            title: "Desktop Apps",
            text: `Open Notepad, Terminal, Web Browser, and Minesweeper from their desktop icons or the taskbar. Every app opens in its own window.`
        },
        {
            icon: "assets/terminal-icon.png",
            title: "Move & Snap Windows",
            text: `Drag any window by its title bar. Drag it to the top of the screen to maximize it, or to the left or right edge to snap it to half the screen.`
        },
        {
            icon: "assets/about-icon.png",
            title: "Customize Your Desktop",
            text: `Right-click anywhere on the desktop to change your wallpaper. Drag any desktop icon to rearrange it - it will snap neatly into place.`
        },
        {
            icon: "assets/about-icon.png",
            title: "Start Menu",
            text: `Click "GenericOS" in the taskbar, or press Ctrl+Space, to open the Start Menu. Search for an app by name, or press Enter on anything else to search the web.`
        },
        {
            icon: "assets/about-icon.png",
            title: "You're All Set!",
            text: `That covers the basics. You can reopen this tour anytime from the About icon on your desktop or the Start Menu.`
        }
    ];

    let currentSlide = 0;

    function renderSlide() {
        const slide = slides[currentSlide];
        slideIcon.src = slide.icon;
        slideTitle.textContent = slide.title;
        slideText.textContent = slide.text;

        aboutDots.innerHTML = "";
        slides.forEach((_, i) => {
            const dot = document.createElement("div");
            dot.className = "about-dot" + (i === currentSlide ? " active": "");
            aboutDots.appendChild(dot);
        });

        aboutBackBtn.disabled = currentSlide === 0;
        aboutNextBtn.textContent = currentSlide === slides.length-1 ? "Finish" : "Next";
    }
    
    function openAboutWindow() {
        aboutWindow.style.width = "500px";
        aboutWindow.style.height = "420px";
        aboutWindow.style.top = "100px";
        aboutWindow.style.left = "250px";
        aboutWindow.classList.remove("maximized");
        aboutmaximized = false;
        aboutWindow.style.display = "flex";
        window.focusWindow(aboutWindow);
        addAboutToTaskbar();
        currentSlide = 0;
        renderSlide();
    }

    function dismissTour() {
        localStorage.setItem("hasSeenAboutTour", "true");
        aboutWindow.style.display = "none";
        if(aboutMaximized) {
            taskbar.classList.remove("solid");
            aboutMaximized = false;
        }
        window.removeFromTaskbar("taskbar-about");
    }

    aboutIcon.addEventListener("click", openAboutWindow);

    aboutMinBtn.addEventListener("click", () => { 
        aboutWindow.style.display = "none";
        if(!document.getElementById("taskbar-about")) {
            addAboutToTaskbar();
        }
    });

    aboutMaxBtn.addEventListener("click", () => {
        if (!aboutMaximized) {
            aboutPrevState = {
                width: aboutWindow.style.width,
                height: aboutWindow.style.height,
                left: aboutWindow.style.left,
                top: aboutWindow.style.top
            };
            aboutWindow.style.width = "100vw";
            aboutWindow.style.height = "calc(100vh - 50px)";
            aboutWindow.style.left = "0";
            aboutWindow.style.top = "0";
            aboutWindow.classList.add("maximized");
            taskbar.classList.add("solid");
        } else {
            aboutWindow.classList.remove("maximized");
            aboutWindow.style.width = aboutPrevState.width;
            aboutWindow.style.height = aboutPrevState.height;
            aboutWindow.style.left = aboutPrevState.left;
            aboutWindow.style.top = aboutPrevState.top;
            taskbar.classList.remove("solid");
        }
        aboutMaximized = !aboutMaximized;
    });

    aboutCloseBtn.addEventListener("click", dismissTour);
    aboutSkipBtn.addEventListener("click", dismissTour);

    aboutBackBtn.addEventListener("click", () => {
        if(currentSlide > 0){
            currentSlide--;
            renderSlide();
        }
    });

    aboutNextBtn.addEventListener("click", () => {
        if(currentSlide < slides.length - 1){
            currentSlide++;
            renderSlide();
        } else {
            dismissTour();
        }
    });

    function addAboutToTaskbar() {
        const taskbarItems = document.getElementById("taskbar-items");
        if(document.getElementById("taskbar-about")) return;
        
        const item = document.createElement("button");
        item.id = "taskbar-about";
        item.style.cursor = "pointer";
        item.style.background = "none";
        item.style.border = "none";
        item.style.padding = "0";
        item.style.margin = "0 5px";

        const img = document.createElement("img");
        img.src = "assets/about-icon.png";
        img.style.width = "40px";
        img.style.height = "40px";
        
        item.addEventListener("mouseenter", () => {
            item.style.background = "rgba(54,52,52,0.2)"
            item.style.borderRadius = "4px";
            item.style.border = "1px solid rgba(255,255,255,0.2)";
        });

        item.addEventListener("mouseleave", () => {
            item.style.background = "none";
            item.style.border = "none";
        });

        item.addEventListener("click", () => {
            if(aboutWindow.style.display === "none") {
                aboutWindow.style.display = "flex";
                window.focusWindow(aboutWindow);
                if(aboutMaximized) taskbar.classList.add("solid");
            } else {
                aboutWindow.style.display = "none";
                if(aboutMaximized) taskbar.classList.remove("solid");
            }
        });

        item.appendChild(img);
        taskbarItems.appendChild(item);

    }

    function maybeShowTour() {
        if(!localStorage.getItem("hasSeenAboutTour")) {
            openAboutWindow();
        }
    }

    if(!document.getElementById("boot-screen")) {
        maybeShowTour();
    } else {
        const bootObserver = new MutationObserver(() => {
            if(!document.getElementById("boot-screen")) {
                bootObserver.disconnect();
                maybeShowTour();
            }
        });
        bootObserver.observe(document.body, { childList: true });
    }
})();