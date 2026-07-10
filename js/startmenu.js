(function() {
    const apps = [
        { name: "Notepad", icon: "assets/notepad-icon.png", targetId: "notepad-icon" },
        { name: "Terminal", icon: "assets/terminal-icon.png", targetId: "terminal-icon" },
        { name: "Web Browser", icon: "assets/browser-icon.png", targetId: "browser-icon" },
        { name: "Minesweeper", icon: "assets/minesweeper-icon.png", targetId: "minesweeper-icon" },
        { name: "About", icon: "assets/about-icon.png" , targetId: "about-icon"},
        { name: "File Explorer", icon: "assets/fileexplorer-icon.png", targetId: "fileexplorer-icon" }
    ];

    const startButton = document.getElementById("os-text");
    if(!startButton) return;
    startButton.style.cursor = "pointer";

    const startMenu = document.createElement("div");
    startMenu.id = "start-menu";
    startMenu.style.display = "none";
        
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "start-menu-search";
    searchInput.placeholder = "Search apps or the web...";
    startMenu.appendChild(searchInput);

    const resultsList = document.createElement("div");
    resultsList.id = "start-menu-results";
    startMenu.appendChild(resultsList);

    document.body.appendChild(startMenu);

    let filteredApps = [];

    function renderResults(query){
        resultsList.innerHTML = "";
        const q = query.trim().toLowerCase();
        filteredApps = q === "" ? apps : apps.filter(app => app.name.toLowerCase().includes(q));

        filteredApps.forEach((app, index) => {
            const item = document.createElement("div");
            item.className = "start-menu-item";
            if(index === 0) item.classList.add("selected");

            const img = document.createElement("img");
            img.src = app.icon;
            item.appendChild(img);

            const label = document.createElement("span");
            label.textContent = app.name;
            item.appendChild(label);

            item.addEventListener("click", () => launchApp(app));
            resultsList.appendChild(item);
        });
        
        if(filteredApps.length === 0 && q !== "") {
            const item = document.createElement("div");
            item.className = "start-menu-item start-menu-search-web";
            item.textContent = `Search the web for "${query}"`;
            item.addEventListener("click", () => searchWeb(query));
            resultsList.appendChild(item);
        }
    }

    function launchApp(app) {
        const icon = document.getElementById(app.targetId);
        if(icon) icon.click();
        closeStartMenu();
    }

    function searchWeb(query) {
        const browserIcon = document.getElementById("browser-icon");
        if(browserIcon) browserIcon.click();

        setTimeout(() => {
            const urlInput = document.getElementById("browser-url");
            const goBtn = document.getElementById("browser-go-btn");
            if(urlInput && goBtn){
                urlInput.value = "https://www.google.com/search?q=" + encodeURIComponent(query);
                goBtn.click();
            }
        }, 100);

        closeStartMenu();
    }

    function openStartMenu() {
        startMenu.style.display = "flex";
        searchInput.value = "";
        renderResults("");
        searchInput.focus();
    }

    function closeStartMenu() {
        startMenu.style.display = "none";
    }

    function toggleStartMenu() {
        if(startMenu.style.display === "flex") {
            closeStartMenu();
        } else {
            openStartMenu();
        }
    }

    startButton.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleStartMenu();
    });

    searchInput.addEventListener("input", () => {
        renderResults(searchInput.value);
    });
    
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter"){
            const query = searchInput.value.trim();
            if (query === "") return;
            if(filteredApps.length > 0){
                launchApp(filteredApps[0]);
            } else {
                searchWeb(query);
            }
        } else if (e.key === "Escape") {
            closeStartMenu();
        }
    });

    document.addEventListener("click", (e) => {
        if(startMenu.style.display === "flex" && !startMenu.contains(e.target)) {
            closeStartMenu();
        }
    });

    document.addEventListener("keydown", (e) => {
        if(e.ctrlKey && e.code === "Space"){
            e.preventDefault();
            toggleStartMenu();
        }
    });
})();