(function() {
    const fileExplorerIcon = document.getElementById("fileexplorer-icon");
    const fileExplorerWindow = document.getElementById("fileexplorer-window");
    const fileExplorerMinBtn = document.getElementById("fileexplorer-min-btn");
    const fileExplorerMaxBtn = document.getElementById("fileexplorer-max-btn");
    const fileExplorerCloseBtn = document.getElementById("fileexplorer-close-btn");
    const breadcrumbBar = document.getElementById("fileexplorer-breadcrumb");
    const backBtn = document.getElementById("fileexplorer-back-btn");
    const newFolderBtn = document.getElementById("fileexplorer-new-folder-btn");
    const newFileBtn = document.getElementById("fileexplorer-new-file-btn");
    const deleteBtn = document.getElementById("fileexplorer-delete-btn");
    const viewArea = document.getElementById("fileexplorer-view");
    const taskbar = document.getElementById("taskbar");

    let isMaximized = false;
    let preMaximizedStyle = {
        width: fileExplorerWindow.style.width,
        height: fileExplorerWindow.style.height,
        left: fileExplorerWindow.style.left,
        top: fileExplorerWindow.style.top
    };

    let idCounter = 0;
    function makeId() {
        idCounter++;
        return "fe-node-" + Date.now() + "-" + idCounter;
    }

    function defaultFileSystem() {
        return {
            id: "root",
            name: "Home",
            type: "folder",
            children: [
                {
                    id: makeId(),
                    name: "Documents",
                    type: "folder",
                    children: [
                        { id: makeId(), name: "notes.txt", type: "file", content: "Just some notes :D"},
                        { id: makeId(), name: "todo.txt", type: "file", content: "1. Code 2. Release" },
                        { id: makeId(), name: "secretDONOTOPEN.txt", type: "file", content: "01000100 01101101 00100000 01101101 01100101 00100000 01101111 01101110 00100000 01110011 01101100 01100001 01100011 01101011 00100000 01100110 01101111 01110010 00100000 01100001 00100000 01110011 01110101 01110000 01110010 01101001 01110011 01100101 00100000 00101000 01000000 01101010 01100001 01100011 01101011 01101010 01100001 01100011 01101111 01100010 01110011 01101111 01101110 00101001 00100000 00111010 01000100"}
                    ]
                },
                { id: makeId(), name: "Pictures", type: "folder", children: [] },
                {
                    id: makeId(),
                    name: "readme.txt",
                    type: "file",
                    content:  "Welcome to the GenericOS File Explorer!\n\nDouble-click a folder to open it, or a text file to view it in Notepad."
                }
            ]
        };
    }

    function loadFileSystem(){
        const saved = localStorage.getItem("fileExplorerFS");
        if(saved) {
            try { return JSON.parse(saved); } catch (e) { return defaultFileSystem(); }
        }
        return defaultFileSystem();
    }

    function saveFileSystem(){
        localStorage.setItem("fileExplorerFS", JSON.stringify(rootFolder));
    }

    let rootFolder = loadFileSystem();
    let currentPath = [rootFolder];
    let selectedId = null;

    function getCurrentFolder() {
        return currentPath[currentPath.length - 1];
    }

    function renderBreadCrumb() {
        breadcrumbBar.innerHTML = "";
        currentPath.forEach((folder, index) => {
            const crumb = document.createElement("span");
            crumb.textContent = folder.name;
            crumb.className = "fileexplorer-crumb";
            crumb.addEventListener("click", () => {
                currentPath = currentPath.slice(0, index + 1);
                selectedId = null;
                renderView();
            });
            breadcrumbBar.appendChild(crumb);

            if (index < currentPath.length - 1) {
                const sep = document.createElement("span");
                sep.textContent = " / ";
                sep.className = "fileexplorer-crumb-sep";
                breadCrumbBar.appendChild(sep);
            }
        });
    }

    function renderView() {
        renderBreadCrumb();
        viewArea.innerHTML = "";
        
        const fodler = getCurrentFolder();
        const items = [...folder.children].sort((a, b) => {
            if(a.type !== b.type) return a.type === "folder" ? -1 : 1;
            return a.name.localeCompare(b.name);
        });

        items.forEach(item => {
            const el = document.createElement("div");
            el.className = "fileexplorer-item" + (item.id === selectedId ? " selected" : "");

            const iconBox = document.createElement("div");
            iconBox.className = item.type === "folder" ? "fileexplorer-icon-folder" : "fileexplorer-icon-file";

            const label = document.createElement("div");
            label.className = "fileexplorer-item-label";
            label.textContent = item.name;

            el.appendChild(iconBox);
            el.appendChild(label);

            el.addEventListener("click", (e) => {
                e.stopPropagation();
                selectedId = item.id;
                renderView();
            });

            el.addEventListener("dblclick", () => {
                if(item.type === "folder") {
                    currentPath.push(item);
                    selectedId = null;
                    renderView();
                } else {
                    openInNotepad(item);
                }
            });

            viewArea.appendChild(el);
        });
    }

    function openInNotepad(fileItem) {
        const notepadIcon = document.getElementById("notepad-icon");
        const notepadTextarea = document.getElementById("notepad-textarea");
        if (!notepadIcon || !notepadTextarea) return;
        notepadIcon.click();
        notepadTextarea.value = fileItem.content || "";
    }

    viewArea.addEventListener("click", () => {
        selectedId = null;
        renderView();
    });

    backBtn.addEventListener("click", () => {
        if(currentPath.length > 1){
            currentPath.pop();
            selectedId = null;
            renderView();
        }
    });

    newFolderBtn.addEventListener("click", () => {
        const name = prompt("New folder name:", "New Folder");
        if(!name) return;
        getCurrentFolder().children.push({ id: makeId(), name, type: "folder", children: [] });
        saveFileSystem();
        renderView();
    });
    newFileBtn.addEventListener("click", () => {
        const name = new prompt("New file name:", "New File.txt");
        if(!name) return;
        getCurrentFolder().children.push({ id: makeId(), name, type: "file", content: ""});
        saveFileSystem();
        renderView();
    });
    deleteBtn.addEventListener("click", () => {
        if(!selected) return;
        const folder = getCurrentFolder();
        folder.children = folder.children.filter(item => item.id !== selectedId);
        selectedId = null;
        saveFileSystem();
        renderView();
    });

    fileExplorerIcon.addEventListener("click", () => {
        fileExplorerWindow.style.width = "650px";
        fileExplorerWindow.style.height = "450px";
        fileExplorerWindow.style.top = "90px";
        fileExplorerWindow.style.left = "180px";
        fileExplorerWindow.classList.remove("maximized");
        isMaximized = false;
        fileExplorerWindow.style.display = "flex";
        window.focusWindow(fileExplorerWindow);
        addToTaskbar();
        currentPath = [rootFolder];
        selectedId = null;
        renderView();
    });

    fileExplorerMinBtn.addEventListener("click", () => {
        fileExplorerWindow.style.display = "none";
        if(isMaximized) taskbar.classList.remove("solid");
    });

    fileExplorerMaxBtn.addEventListener("click", () => {
        if (!isMaximized) {
            preMaximizedStyle = {
                width: fileExplorerWindow.style.width,
                height: fileExplorerWindow.style.height,
                left: fileExplorerWindow.style.left,
                top: fileExplorerWindow.style.top
            };
            fileExplorerWindow.style.width = "100vw";
            fileExplorerWindow.style.height = "calc(100vh - 50px)";
            fileExplorerWindow.style.left = "0";
            fileExplorerWindow.style.top = "0";
            fileExplorerWindow.classList.add("maximized");
            taskbar.classList.add("solid");
            isMaximized = true;
        } else {
            fileExplorerWindow.style.width = preMaximizedStyle.width;
            fileExplorerWindow.style.height = preMaximizedStyle.height;
            fileExplorerWindow.style.left = preMaximizedStyle.left;
            fileExplorerWindow.style.top = preMaximizedStyle.top;
            fileExplorerWindow.classList.remove("maximized");
            taskbar.classList.remove("solid");
            isMaximized = false;
        }
    });

    fileExplorerCloseBtn.addEventListener("click", () => {
        fileExplorerWindow.style.display = "none";
        if (isMaximized) taskbar.classList.remove("solid");
    });

    fileExplorerWindow.addEventListener("mousedown", () => {
        window.bringToFront(fileExplorerWindow);
    });

    function addToTaskbar() {
        const taskbarItems = document.getElementById("taskbar-items");
        if (document.getElementById("taskbar-fileexplorer")) return;

        const item = document.createElement("button");
        item.id = "taskbar-fileexplorer";
        item.style.cursor = "pointer";
        item.style.background = "none";
        item.style.border = "none";
        item.style.padding = "0";
        item.style.margin = "0 5px";

        const img = document.createElement("img");
        img.src = "assets/fileexplorer-icon.png";
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
            if (fileExplorerWindow.style.display === "none") {
                fileExplorerWindow.style.display = "flex";
                window.focusWindow(fileExplorerWindow);
                if (isMaximized) taskbar.classList.add("solid");
            } else {
                fileExplorerWindow.style.display = "none";
                if (isMaximized) taskbar.classList.remove("solid");
            }
        });

        item.appendChild(img);
        taskbarItems.appendChild(item);
    }
})();