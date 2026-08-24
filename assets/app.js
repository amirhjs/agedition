/**
 * AGEDITION - GLOBAL APPLICATION UI & NAVIGATION MODULE
 * Brand: AGEDITION
 */

document.addEventListener("DOMContentLoaded", () => {
  initDrawer();
  initHeaderUser();
  initNotifications();
  highlightActiveNav();
});

// Mobile Nav Drawer
function initDrawer() {
  const menuBtn = document.getElementById("menu-btn");
  const closeMenuBtn = document.getElementById("close-menu-btn");
  const navDrawer = document.getElementById("nav-drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");

  if (!menuBtn || !navDrawer) return;

  function openMenu() {
    navDrawer.classList.add("open");
    navDrawer.style.transform = "translateX(0)";
    if (drawerOverlay) {
      drawerOverlay.classList.remove("hidden");
      drawerOverlay.classList.add("block");
      setTimeout(() => (drawerOverlay.style.opacity = "1"), 10);
    }
  }

  function closeMenu() {
    navDrawer.classList.remove("open");
    navDrawer.style.transform = "translateX(100%)";
    if (drawerOverlay) {
      drawerOverlay.style.opacity = "0";
      setTimeout(() => {
        drawerOverlay.classList.remove("block");
        drawerOverlay.classList.add("hidden");
      }, 300);
    }
  }

  menuBtn.addEventListener("click", openMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);
  if (drawerOverlay) drawerOverlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navDrawer.classList.contains("open")) {
      closeMenu();
    }
  });
}

// Update TopBar / Header User Profile & Role link
function initHeaderUser() {
  const user = window.Store ? window.Store.getUser() : null;
  const adminBadge = document.getElementById("header-admin-badge");
  const accountLink = document.getElementById("header-account-link");

  if (user) {
    if (adminBadge) {
      if (user.role === "admin" || (user.email && user.email.toLowerCase() === window.CONFIG.PRIMARY_ADMIN_EMAIL.toLowerCase())) {
        adminBadge.classList.remove("hidden");
      } else {
        adminBadge.classList.add("hidden");
      }
    }
  }
}

// Notifications handling
function initNotifications() {
  const notifBtn = document.getElementById("notif-btn");
  const notifBadge = document.getElementById("notif-badge");
  const notifMenu = document.getElementById("notif-dropdown");

  if (!notifBtn) return;

  function updateBadge() {
    if (!window.Store) return;
    const list = window.Store.getNotifications();
    const unread = list.filter(n => !n.read).length;
    if (notifBadge) {
      if (unread > 0) {
        notifBadge.textContent = unread.toLocaleString("fa-IR");
        notifBadge.classList.remove("hidden");
      } else {
        notifBadge.classList.add("hidden");
      }
    }
  }

  updateBadge();
  if (window.Store) {
    window.Store.onChange("notifications", updateBadge);
  }

  notifBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (notifMenu) {
      notifMenu.classList.toggle("hidden");
      renderNotifList();
    } else {
      // If no dropdown on this page, redirect to dashboard or support
      window.location.href = "dashboard.html";
    }
  });

  document.addEventListener("click", (e) => {
    if (notifMenu && !notifMenu.contains(e.target) && !notifBtn.contains(e.target)) {
      notifMenu.classList.add("hidden");
    }
  });
}

function renderNotifList() {
  const listEl = document.getElementById("notif-list");
  if (!listEl || !window.Store) return;

  const items = window.Store.getNotifications();
  if (items.length === 0) {
    listEl.innerHTML = '<div class="p-4 text-center text-xs text-[#6F7C74]">هیچ اعلانی وجود ندارد.</div>';
    return;
  }

  listEl.innerHTML = items.slice(0, 5).map(item => `
    <div class="p-3 border-b border-white/5 hover:bg-white/5 transition-colors flex items-start gap-2">
      <span class="material-symbols-outlined text-primary text-[18px] mt-0.5">notifications_active</span>
      <div class="flex-1">
        <p class="text-xs text-white leading-relaxed">${item.text}</p>
        <span class="text-[10px] text-[#6F7C74] mt-1 block">${new Date(item.date).toLocaleDateString("fa-IR")}</span>
      </div>
    </div>
  `).join("");
}

// Active Nav link highlight
function highlightActiveNav() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("a[href]");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      if (link.classList.contains("nav-item")) {
        link.classList.add("text-primary", "bg-primary-container/20");
        link.classList.remove("text-on-surface-variant", "text-[#6F7C74]");
      }
    }
  });
}

// Toast Utility
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = type === "success" ? "check_circle" : type === "error" ? "error" : "info";
  const iconColor = type === "success" ? "#50e08a" : type === "error" ? "#ffb4ab" : "#6edc9a";

  toast.innerHTML = `
    <span class="material-symbols-outlined" style="color: ${iconColor}; font-size: 20px;">${icon}</span>
    <span class="flex-1 text-sm font-medium leading-relaxed">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

window.showToast = showToast;
