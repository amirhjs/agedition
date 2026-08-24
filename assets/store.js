/**
 * AGEDITION - STATE & DATA ACCESS LAYER
 * Handles API integration with server, secure file reading, session management,
 * and robust client-side persistence for seamless static and hosted runtime.
 */

const Store = {
  // Current user in session
  getUser() {
    try {
      const u = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      // Double check admin role against official email
      if (user.email && user.email.trim().toLowerCase() === CONFIG.PRIMARY_ADMIN_EMAIL.toLowerCase()) {
        user.role = "admin";
      }
      localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
    }
    this.emitChange("user", user);
  },

  isAdmin() {
    const u = this.getUser();
    return u && u.email && u.email.trim().toLowerCase() === CONFIG.PRIMARY_ADMIN_EMAIL.toLowerCase();
  },

  // Register or Login
  async registerUser(fullName, phone, email) {
    const payload = { fullName, phone, email };

    try {
      const res = await fetch(CONFIG.ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          this.setUser(data.user);
          return data.user;
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable, using local client persistence:", err);
    }

    // Static / Local Fallback
    const isPrimaryAdmin = email && email.trim().toLowerCase() === CONFIG.PRIMARY_ADMIN_EMAIL.toLowerCase();
    const user = {
      id: "usr-" + Date.now().toString(36),
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : "",
      role: isPrimaryAdmin ? "admin" : "user",
      createdAt: new Date().toISOString(),
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMMAm1wFGztE0bGedJwbsEwrhC3gOnWsLkfHIySOhvr3K3mjPMG7G4F7JhNKuQ3TZcobXB_AksDYRZPxXdEO7IvTCMBVqdfc1Ct16dkwShpmN_0YFgarrIujwta0vSjv4Ly1mXLSyQ4r9wB8jzy-x-_Zz2sf6VvnVmW64gyDE6XAdGCaMw3UCDp4VNlP6_UJep0Yvw6G2atzrwWqom91NQBrO6NmeMlfzd-MlPh0lWnh-3HkbBKFrqQg"
    };
    this.setUser(user);
    this.addNotification("ثبت‌نام شما با موفقیت انجام شد.");
    return user;
  },

  // Course configuration
  async getCourseConfig() {
    try {
      const res = await fetch(CONFIG.ENDPOINTS.COURSE);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.course) {
          localStorage.setItem(CONFIG.STORAGE_KEYS.COURSE_CONFIG, JSON.stringify(data.course));
          return data.course;
        }
      }
    } catch (e) {}

    const local = localStorage.getItem(CONFIG.STORAGE_KEYS.COURSE_CONFIG);
    if (local) {
      try { return JSON.parse(local); } catch (e) {}
    }

    return {
      title: CONFIG.PRODUCT.TITLE,
      description: CONFIG.PRODUCT.DESCRIPTION,
      price: CONFIG.PRODUCT.PRICE,
      formattedPrice: CONFIG.PRODUCT.PRICE_FORMATTED,
      duration: CONFIG.PRODUCT.DURATION,
      durationAccurate: CONFIG.PRODUCT.DURATION_ACCURATE,
      coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB6slgWfT3ba_rW611rGjH-T2P3czeXO8vExixjK08I4IDAEcxAcrDXFLyw9BB-t-ujszeFrspUNp8pwMixRl00jLoMtHUtqU69l5lfyfKXEmnXpFaji02Ci3a-rxxvwLQd8aIDn0jjcYl1R1sHxkM4RInNXnBPuIISBd-PT5GbAhVauW4poXjPzDclONVh-tydtvkhT-ZTuO3PtyzgCurzc1RIYB5lbFeHvtnPVGlZTuhhGd_RldT6w",
      videoFileName: "DLS19_Master_Edition_Course_Complete.mp4",
      videoDuration: "01:04:20",
      videoStatus: "active",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      toolsFileName: CONFIG.PRODUCT.TOOLS_NAME,
      toolsFileSize: CONFIG.PRODUCT.TOOLS_SIZE,
      toolsLastUpdated: CONFIG.PRODUCT.TOOLS_UPDATE_DATE,
      toolsStatus: "active",
      paymentCardImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuACf4qiS3DlSo0Ejw_uRMiaMTuPZC8SUf2hC7x92NtkWgq7xxEyEkFdBWqFP7_08n-25MZq1A5qqt-WuJE1cBjXU2-dPw-j3PJAFY0DvmzJccilCPfvypdUVN9FVHLoubJUthU6Xl5ODtK-hwE56T4c3ec5YC_ODYu60UbqLE0WlbvgUvfYr25Dpkup1JjBj2twGPaDVZYQAvGmaN4-tZ3zTScEIofnTAJ24MawBruMBSalnjwjDTkAIg",
      cardNumber: "6037-9975-1234-5678",
      cardHolder: "AGEDITION - علیرضا جلیلیان",
      bankName: "بانک ملی ایران",
      instructions: "مبلغ را به شماره کارت نمایش داده شده واریز کنید، سپس تصویر رسید پرداخت را ارسال کنید.",
    };
  },

  async updateCourseConfig(updates) {
    const current = await this.getCourseConfig();
    const next = { ...current, ...updates };
    localStorage.setItem(CONFIG.STORAGE_KEYS.COURSE_CONFIG, JSON.stringify(next));

    try {
      await fetch(CONFIG.ENDPOINTS.COURSE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next)
      });
    } catch (e) {}

    this.emitChange("course", next);
    return next;
  },

  // Submit Receipt Order
  async submitReceipt(receiptDataUrl) {
    const user = this.getUser();
    if (!user) throw new Error("لطفاً ابتدا ثبت‌نام کنید.");

    const payload = {
      userId: user.id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      receiptImage: receiptDataUrl
    };

    try {
      const res = await fetch(CONFIG.ENDPOINTS.ORDER_SUBMIT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          this.saveLocalOrder(data.order);
          this.addNotification("رسید پرداخت شما با موفقیت ارسال شد و در انتظار تایید است.");
          return data.order;
        }
      }
    } catch (e) {
      console.warn("API submission error, using local storage:", e);
    }

    // Local Fallback Order
    const order = {
      id: Math.floor(10000 + Math.random() * 90000).toString(),
      userId: user.id,
      userName: user.fullName,
      phone: user.phone,
      email: user.email,
      amount: CONFIG.PRODUCT.PRICE,
      productName: CONFIG.PRODUCT.TITLE,
      status: "pending",
      receiptImage: receiptDataUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveLocalOrder(order);
    this.addNotification("رسید پرداخت شما با موفقیت ارسال شد و در انتظار تایید است.");
    return order;
  },

  saveLocalOrder(order) {
    let orders = this.getLocalOrders();
    const idx = orders.findIndex(o => o.userId === order.userId);
    if (idx >= 0) {
      orders[idx] = order;
    } else {
      orders.unshift(order);
    }
    localStorage.setItem(CONFIG.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.emitChange("orders", orders);
  },

  getLocalOrders() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.ORDERS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    // Default Seed Order for demonstration if empty
    return [
      {
        id: "89042",
        userId: "user-seed-1",
        userName: "علی رضایی",
        phone: "0912 345 6789",
        email: "ali.rezaei@example.com",
        amount: 400000,
        productName: CONFIG.PRODUCT.TITLE,
        status: "pending",
        receiptImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCX_sN55-Na6b4BI-nu59vfx3LrPjQ5hXDbTNnB8ZyGNe-YtHMh3R3_mIE1-qsZLEVhtmjuxEDSG94bSXg6dNvAEO0_6EPtnUIz4c1hbDvD_zfbnwJ_ahDQfVwuX1chgybr9DvXtKCyzvr2CI9000eWUOCHB89OBOjT_BKUn5XfrY8QnLSMJ2YH6vFYjEniUQDdZ3RpVAjHigpBdKBcahZJ-rFErTHA9xoyN1ChQYnTp5k4Cp9uX9P3LA",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ];
  },

  async getUserOrder(userId) {
    if (!userId) {
      const u = this.getUser();
      if (!u) return null;
      userId = u.id;
    }

    try {
      const res = await fetch(`${CONFIG.ENDPOINTS.ORDER_USER}/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) return data.order;
      }
    } catch (e) {}

    const orders = this.getLocalOrders();
    return orders.find(o => o.userId === userId) || null;
  },

  async getAllOrders() {
    try {
      const res = await fetch(CONFIG.ENDPOINTS.ADMIN_ORDERS);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.orders) return data.orders;
      }
    } catch (e) {}
    return this.getLocalOrders();
  },

  // Admin Order Actions
  async approveOrder(orderId) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/approve`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          this.saveLocalOrder(data.order);
          return data.order;
        }
      }
    } catch (e) {}

    const orders = this.getLocalOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = "approved";
      order.updatedAt = new Date().toISOString();
      this.saveLocalOrder(order);
      this.sendMessage(order.userId, "پرداخت شما با موفقیت تأیید شد! دسترسی شما به ویدیوی دوره و پکیج ابزارها فعال گردید.", order.id);
    }
    return order;
  },

  async rejectOrder(orderId, reason = "رسید پرداخت مورد تأیید قرار نگرفت.") {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          this.saveLocalOrder(data.order);
          return data.order;
        }
      }
    } catch (e) {}

    const orders = this.getLocalOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = "rejected";
      order.rejectReason = reason;
      order.updatedAt = new Date().toISOString();
      this.saveLocalOrder(order);
      this.sendMessage(order.userId, `رسید پرداخت شما تأیید نشد: ${reason} لطفاً مجدداً رسید معتبر ارسال کنید.`, order.id);
    }
    return order;
  },

  // Messages (Admin -> User)
  async getMessages(userId) {
    if (!userId) {
      const u = this.getUser();
      if (!u) return [];
      userId = u.id;
    }

    try {
      const res = await fetch(`${CONFIG.ENDPOINTS.USER_MESSAGES}/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.messages) return data.messages;
      }
    } catch (e) {}

    const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.MESSAGES);
    const list = raw ? JSON.parse(raw) : [
      {
        id: "msg-default-1",
        userId: userId,
        sender: "admin",
        content: "به آکادمی تخصصی AGEDITION خوش آمدید. پس از واریز و ثبت رسید، دسترسی شما فعال می‌شود.",
        createdAt: new Date().toISOString(),
        read: false
      }
    ];
    return list.filter(m => m.userId === userId);
  },

  async sendMessage(userId, content, orderId) {
    const msg = {
      id: "msg-" + Date.now(),
      userId,
      orderId,
      sender: "admin",
      content,
      createdAt: new Date().toISOString(),
      read: false
    };

    try {
      await fetch(CONFIG.ENDPOINTS.ADMIN_MESSAGES_SEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, content, orderId })
      });
    } catch (e) {}

    let allMsgs = [];
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.MESSAGES);
      if (raw) allMsgs = JSON.parse(raw);
    } catch (e) {}
    allMsgs.push(msg);
    localStorage.setItem(CONFIG.STORAGE_KEYS.MESSAGES, JSON.stringify(allMsgs));
    this.emitChange("messages", allMsgs);
    return msg;
  },

  // Feedbacks
  async sendFeedback(message) {
    const u = this.getUser();
    const payload = {
      userId: u ? u.id : "guest",
      userName: u ? u.fullName : "کاربر مهمان",
      message
    };

    try {
      await fetch(CONFIG.ENDPOINTS.FEEDBACK_SUBMIT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {}

    let feedbacks = [];
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.FEEDBACKS);
      if (raw) feedbacks = JSON.parse(raw);
    } catch (e) {}
    feedbacks.unshift({ ...payload, id: "fb-" + Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem(CONFIG.STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks));
    this.addNotification("نظر شما با موفقیت برای مدیریت ارسال شد.");
    return true;
  },

  async getFeedbacks() {
    try {
      const res = await fetch(CONFIG.ENDPOINTS.ADMIN_FEEDBACKS);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.feedbacks) return data.feedbacks;
      }
    } catch (e) {}

    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.FEEDBACKS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [
      {
        id: "fb-1",
        userId: "user-seed-1",
        userName: "علی رضایی",
        message: "دوره بسیار عالی و کامل بود. پکیج ابزارها فوق‌العاده کاربردیه!",
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  },

  // Notifications
  getNotifications() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.NOTIFICATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  addNotification(text) {
    const list = this.getNotifications();
    list.unshift({ id: "nt-" + Date.now(), text, date: new Date().toISOString(), read: false });
    localStorage.setItem(CONFIG.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.emitChange("notifications", list);
  },

  // Event bus
  listeners: {},
  onChange(key, callback) {
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(callback);
  },
  emitChange(key, data) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(fn => fn(data));
    }
  }
};

if (typeof window !== "undefined") {
  window.Store = Store;
}
