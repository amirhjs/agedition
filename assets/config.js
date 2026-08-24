/**
 * AGEDITION - CENTRAL CONFIGURATION LAYER
 * Brand: AGEDITION
 * Language: Persian (fa-IR, RTL)
 * Admin Email: ajalilian446@gmail.com
 */

const CONFIG = {
  BRAND_NAME: "AGEDITION",
  BRAND_TAGLINE: "Premium Education.",
  PRIMARY_ADMIN_EMAIL: "ajalilian446@gmail.com",
  
  PRODUCT: {
    TITLE: "دوره کامل آموزش ساخت ادیشن Dream League Soccer 2019 + پکیج ابزارها",
    DESCRIPTION: "در یک دوره کامل یاد بگیر چطور ظاهر Dream League Soccer 2019 رو شخصی‌سازی کنی و همراه دوره، به پکیج ابزارهای مورد نیازت هم دسترسی داشته باشی.",
    PRICE: 400000,
    PRICE_FORMATTED: "۴۰۰,۰۰۰ تومان",
    DURATION: "حدود ۱ ساعت",
    DURATION_ACCURATE: "۰۱:۰۴:۲۰",
    TOOLS_NAME: "DLS19_AGEDITION_Tools_Package_V2.zip",
    TOOLS_SIZE: "1.2 GB",
    TOOLS_UPDATE_DATE: "۲۴ مهر ۱۴۰۳",
  },

  // API Endpoints for Full-Stack environment or static backend proxy
  API_BASE_URL: "/api",
  ENDPOINTS: {
    HEALTH: "/api/health",
    REGISTER: "/api/auth/register",
    VERIFY: "/api/auth/verify",
    COURSE: "/api/course",
    ORDER_SUBMIT: "/api/orders/submit",
    ORDER_USER: "/api/orders/user",
    ADMIN_ORDERS: "/api/admin/orders",
    ADMIN_USERS: "/api/admin/users",
    ADMIN_STATS: "/api/admin/stats",
    ADMIN_APPROVE: "/api/admin/orders/:id/approve",
    ADMIN_REJECT: "/api/admin/orders/:id/reject",
    ADMIN_MESSAGES_SEND: "/api/admin/messages/send",
    ADMIN_CARD_SETTINGS: "/api/admin/card-settings",
    ADMIN_VIDEO_SETTINGS: "/api/admin/video-settings",
    ADMIN_TOOLS_SETTINGS: "/api/admin/tools-settings",
    ADMIN_FEEDBACKS: "/api/admin/feedbacks",
    USER_MESSAGES: "/api/messages/user",
    FEEDBACK_SUBMIT: "/api/feedback",
    DOWNLOAD_TOOLS: "/api/download/tools",
  },

  STORAGE_KEYS: {
    USER: "agedition_auth_user",
    ORDERS: "agedition_orders",
    COURSE_CONFIG: "agedition_course_config",
    MESSAGES: "agedition_messages",
    FEEDBACKS: "agedition_feedbacks",
    NOTIFICATIONS: "agedition_notifications",
  }
};

if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}
