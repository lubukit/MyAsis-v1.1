const DEFAULT_LOCATION = {
  latitude: 3.139,
  longitude: 101.6869,
  label: "Kuala Lumpur, Malaysia"
};

const weatherCode = {
  0: "Clear",
  1: "Mostly Clear",
  2: "Cloudy",
  3: "Cloudy",
  45: "Foggy",
  48: "Foggy",
  51: "Drizzle",
  53: "Drizzle",
  55: "Drizzle",
  61: "Rainy",
  63: "Rainy",
  65: "Rainy",
  80: "Showers",
  81: "Showers",
  82: "Showers",
  95: "Storm",
  96: "Storm",
  99: "Storm"
};

const $ = (id) => document.getElementById(id);
const memoryStore = {};
const storage = {
  getItem(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memoryStore[key] || "";
    }
  },
  setItem(key, value) {
    memoryStore[key] = value;
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  },
  removeItem(key) {
    delete memoryStore[key];
    try {
      window.localStorage.removeItem(key);
    } catch {}
  }
};
const bioFields = ["name", "nickname", "birthday", "phone", "anniversary", "location", "color", "food", "drink", "hobby", "notes"];
const profileFields = ["name", "role", "phone", "email", "address"];
const settingsFields = ["homeName", "weatherPlace", "defaultTab", "tempUnit", "birthdayNotify", "salaryDay", "salaryTime", "bankName", "bankAccount", "bankHolder"];
const companyFields = ["name", "phone", "email", "instagram", "facebook", "tiktok", "address"];
let musicMode = "music";
let selectedCalendarDate = new Date();
let quotationItems = [];
let companyEditMode = false;
let editingPriceServiceIndex = -1;
let activeProjectChatId = null;
let chatUnsubscribe = null;
let firestoreDb = null;
let priceHoldTimer = null;
let priceHoldTriggered = false;
let installPromptEvent = null;
const quotes = [
  "Small steps, strong home.",
  "Control the day before it controls you.",
  "Tenang dulu, kemudian buat satu-satu.",
  "Discipline beats mood.",
  "Hari ini buat lebih baik sedikit.",
  "Jaga rumah, jaga hati, jaga fokus."
];
const defaultDevices = {
  aircon: true,
  tv: false,
  lighting: false,
  speaker: false
};
const demoSongs = [
  {
    title: "Hujan",
    artist: "Search YouTube",
    query: "hujan official music video",
    lyrics: "Paste lirik sendiri di sini, kemudian tekan Save Lirik."
  },
  {
    title: "Hujan Lyrics",
    artist: "Search YouTube",
    query: "hujan lyrics video",
    lyrics: "Paste lirik sendiri di sini, kemudian tekan Save Lirik."
  },
  {
    title: "Hujan Cover",
    artist: "Search YouTube",
    query: "hujan cover acoustic",
    lyrics: "Paste lirik sendiri di sini, kemudian tekan Save Lirik."
  },
  {
    title: "Perfect",
    artist: "Ed Sheeran",
    videoId: "2Vv-BfVoq4g",
    lyrics: "Lirik penuh tidak dimasukkan secara automatik.\nPaste lirik sendiri di sini, kemudian tekan Save Lirik."
  },
  {
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    videoId: "GxldQ9eX2wo",
    lyrics: "Lirik penuh tidak dimasukkan secara automatik.\nPaste lirik sendiri di sini, kemudian tekan Save Lirik."
  },
  {
    title: "Sempurna",
    artist: "Andra and The Backbone",
    videoId: "fN5HV79_8B8",
    lyrics: "Lirik penuh tidak dimasukkan secara automatik.\nPaste lirik sendiri di sini, kemudian tekan Save Lirik."
  }
];
const DEFAULT_PRICELIST_SEED = "lubuk-pricelist-2025-v2";
const DEFAULT_PRICELIST = [
  {
    service: "E-Commerce Poster Design",
    image: "assets/pricelist/ecommerce-poster-design.jpg",
    theme: "#f7b500",
    addOns: "Extra Revision RM5-RM10 | Resize RM10 | Full Source File RM20 | Fast Track RM25",
    packages: [
      { name: "1 Design", amount: 39, details: "1 Poster E-commerce | Free Revisions | Format JPG/PNG | 1-2 days" },
      { name: "3 Design", amount: 99, details: "3 Poster E-commerce | Free Revisions | Format JPG/PNG + PDF | 2-3 days" },
      { name: "5 Design", amount: 159, details: "5 Poster E-commerce | Free Revisions | Format JPG/PNG + PDF | 3-5 days" }
    ]
  },
  {
    service: "Flyers Design",
    image: "assets/pricelist/flyers-design.jpg",
    theme: "#22b9f2",
    addOns: "Extra Revision RM5-RM10 | Resize RM10 | Full Source File RM30 | Fast Track RM30",
    packages: [
      { name: "1 Design", amount: 49, details: "1 Design Flyers | Free Revisions | Saiz standard A5/A6 | Format JPG/PNG | 1-2 days" },
      { name: "3 Design", amount: 129, details: "3 Design Flyers | Free Revisions | Saiz standard A5/A6 | Format JPG/PNG + PDF | 2-4 days" },
      { name: "5 Design", amount: 199, details: "5 Design Flyers | Free Revisions | Saiz standard A5/A6 | Format JPG/PNG + PDF | 3-6 days" }
    ]
  },
  {
    service: "Poster Social Media",
    image: "assets/pricelist/poster-social-media.jpg",
    theme: "#2564d8",
    addOns: "Extra Revision RM5-RM10 | Resize RM10 | Full Source File RM10 | Fast Track RM20",
    packages: [
      { name: "1 Poster", amount: 39, details: "1 Design Poster | Free Revision | Format PNG/JPG | 1-2 days" },
      { name: "2 Poster", amount: 75, details: "2 Design Poster | Free Revision | Format PNG/JPG | 1-2 days" },
      { name: "3 Poster", amount: 105, details: "3 Design Poster | Free Revision | Format PNG/JPG + PDF | 2-3 days" }
    ]
  },
  {
    service: "Menu Design",
    image: "assets/pricelist/menu-design.jpg",
    theme: "#4acb1f",
    addOns: "Extra Revision RM10-RM15 | Resize RM20 | Full Source File RM40 | Fast Track RM40",
    packages: [
      { name: "1 Muka Surat", amount: 50, details: "1 muka surat | Untuk 5-10 item F&B | Free Revision | High-Res Format JPG & PDF | 1-2 days" },
      { name: "2 Muka Surat", amount: 145, details: "3 muka surat | Untuk 11-30 item F&B | Free Revision | High-Res Format JPG & PDF | 2-4 days" },
      { name: "5 Muka Surat", amount: 239, details: "5 muka surat | Untuk 31-60 item F&B | Free Revision | High-Res Format JPG & PDF | 4-6 days" }
    ]
  },
  {
    service: "Packaging Design",
    image: "assets/pricelist/packaging-design.jpg",
    theme: "#bf9635",
    addOns: "Extra Revision RM15 | Resize RM20 | Full Source File RM40 | Fast Track RM30 | 1x Mockup RM30 | 1x Die-Cut RM20",
    packages: [
      { name: "1 Packaging", amount: 69, details: "1 Design Packaging | Free Revision | File JPEG/PDF | 1-2 days" },
      { name: "2 Packaging", amount: 129, details: "2 Design Packaging | Free Revision | File JPEG/PDF | 2-3 days" },
      { name: "3 Packaging", amount: 179, details: "3 Design Packaging | Free Revision | File JPEG/PDF | 2-4 days" }
    ]
  },
  {
    service: "Bunting & Banner Design",
    image: "assets/pricelist/bunting-banner-design.jpg",
    theme: "#f0448d",
    addOns: "Extra Revision RM5-RM10 | Resize RM10 | Full Source File RM30 | Fast Track RM15",
    packages: [
      { name: "1 Design", amount: 45, details: "1 Design Banner/Bunting | Free Revision | Format JPG + PDF | 1-2 days" },
      { name: "3 Design", amount: 135, details: "3 Design Banner/Bunting | Free Revision | Format JPG + PDF | 2-3 days" },
      { name: "5 Design", amount: 199, details: "5 Design Banner/Bunting | Free Revision | Format JPG + PDF | 3-5 days" }
    ]
  },
  {
    service: "Poster Design",
    image: "assets/pricelist/poster-design.jpg",
    theme: "#8b28e6",
    addOns: "Extra Revision RM5-RM10 | Resize RM10 | Full Source File RM30 | Fast Track RM20 | Custom Illustrasi RM50+",
    packages: [
      { name: "1 Poster", amount: 49, details: "1 Poster Design | Free Revision | Saiz A3/A4 | Format JPG/PNG | 1-2 days" },
      { name: "3 Poster", amount: 129, details: "3 Poster Design | Free Revision | Saiz A3/A4 | Format JPG/PNG + PDF | 2-4 days" },
      { name: "5 Poster", amount: 199, details: "5 Poster Design | Free Revision | Saiz A3/A4 | Format JPG/PNG + PDF | 3-5 days" }
    ]
  },
  {
    service: "Sticker Design",
    image: "assets/pricelist/sticker-design.jpg",
    theme: "#ff5b10",
    addOns: "Extra Revision RM10 | Resize RM10 | Full Source File RM30 | Custom Character RM50+ | Fast Track RM30",
    packages: [
      { name: "1 Sticker", amount: 39, details: "1 Design Sticker | Free Revision | Format JPG/PNG | 1-2 days" },
      { name: "3 Sticker", amount: 109, details: "3 Design Sticker | Free Revision | Format JPG/PNG | 2-3 days" },
      { name: "5 Sticker", amount: 175, details: "5 Design Sticker | Free Revision | Format JPG/PNG | 3-4 days" }
    ]
  },
  {
    service: "Tiktok Live Design",
    image: "assets/pricelist/tiktok-live-design.jpg",
    theme: "#1b1b1f",
    addOns: "Extra Revision RM5 | Resize RM20 | Full Source File RM40 | Weekly theme change RM40 | Extra frame/background RM30 | Extra sticker RM15",
    packages: [
      { name: "Basic", amount: 65, details: "1 Frame Live | 1 Background | 1-2 days" },
      { name: "Advance", amount: 119, details: "1 Frame Live | 1 Background | 3 Sticker | 1-2 days" },
      { name: "Premium", amount: 199, details: "2 Frame Live boleh tukar tema | 2 Background | 5 Sticker | 2-4 days" }
    ]
  },
  {
    service: "Logo & Branding",
    image: "assets/pricelist/logo-branding.jpg",
    theme: "#d51f2d",
    addOns: "Extra Revision RM10 | Extra Collateral RM50 | Full Source File RM50 | Fast Track RM50",
    packages: [
      { name: "Start-Up", amount: 89, details: "1 Logo design | Free Revision | 4 days" },
      { name: "Growth", amount: 399, details: "2 Logo design | Free Revision | 3x Collateral design | Color palette | 2 weeks" },
      { name: "Premium", amount: 1199, details: "3 Logo design | Free Revision + 1 | 3x Collateral design | Color palette | Brand pattern design | Brand guideline | Full sources file | 4 weeks" }
    ]
  }
];

function setDate() {
  $("today").textContent = new Intl.DateTimeFormat("en-MY", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date());
}

function setMainGreeting() {
  const hour = new Date().getHours();
  let greeting = "Hey";
  if (hour >= 5 && hour < 12) greeting = "Good Morning";
  if (hour >= 12 && hour < 18) greeting = "Good Afternoon";
  if (hour >= 18 && hour < 22) greeting = "Good Evening";
  if (hour >= 22 || hour < 5) greeting = "Good Night";
  $("timeGreeting").textContent = greeting;
}

function setMainQuote() {
  const dayIndex = Math.floor(Date.now() / 86400000) % quotes.length;
  $("mainQuote").textContent = quotes[dayIndex];
}

function updateWeatherIcon(condition) {
  const icon = $("weatherIcon");
  icon.classList.toggle("rain", /Rain|Shower|Storm|Drizzle/i.test(condition));
  icon.classList.toggle("clear", /Clear/i.test(condition));
}

function updateWeather(data, placeLabel) {
  document.querySelector(".weather-card").classList.remove("sale-summary-card");
  $("weatherIcon").classList.remove("sale-mark");
  const current = data.current;
  const condition = weatherCode[current.weather_code] || "Cloudy";
  const temp = toDisplayTemp(current.temperature_2m);
  const feels = toDisplayTemp(current.apparent_temperature);

  $("condition").textContent = condition;
  $("place").textContent = placeLabel;
  $("temperature").textContent = Math.round(temp);
  $("feelsLike").textContent = `${Math.round(feels)}°`;
  $("humidity").textContent = `${Math.round(current.relative_humidity_2m)}%`;
  $("wind").textContent = Math.round(current.wind_speed_10m);
  $("pressure").textContent = `${Math.round(current.surface_pressure)}hpa`;
  updateWeatherIcon(condition);
  refreshUsageStats();
}

function toDisplayTemp(celsius) {
  return getSettings().tempUnit === "f" ? (celsius * 9 / 5) + 32 : celsius;
}

async function getDeviceLocation() {
  const fallbackLocation = { ...DEFAULT_LOCATION, label: getSettings().weatherPlace || DEFAULT_LOCATION.label };
  if (!("geolocation" in navigator)) return fallbackLocation;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        label: "Lokasi semasa"
      }),
      () => resolve(fallbackLocation),
      { enableHighAccuracy: false, timeout: 6500, maximumAge: 900000 }
    );
  });
}

async function loadWeather() {
  document.querySelector(".weather-card").classList.remove("sale-summary-card");
  $("weatherIcon").classList.remove("sale-mark");
  $("condition").textContent = "Memuatkan";
  $("place").textContent = "Mengambil cuaca";

  try {
    const location = await getDeviceLocation();
    const params = new URLSearchParams({
      latitude: location.latitude,
      longitude: location.longitude,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m",
      timezone: "auto"
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) throw new Error("Weather request failed");
    updateWeather(await response.json(), location.label);
  } catch {
    $("condition").textContent = "Cloudy";
    $("place").textContent = getSettings().weatherPlace || DEFAULT_LOCATION.label;
    $("temperature").textContent = String(Math.round(toDisplayTemp(28)));
    $("feelsLike").textContent = `${Math.round(toDisplayTemp(31))}°`;
    $("humidity").textContent = "65%";
    $("wind").textContent = "3";
    $("pressure").textContent = "1009hpa";
    updateWeatherIcon("Cloudy");
    refreshUsageStats();
  }
}

function normalisePhone(value) {
  return value.replace(/[^\d]/g, "");
}

function getBio() {
  try {
    return JSON.parse(storage.getItem("loveBio") || "{}");
  } catch {
    return {};
  }
}

function setBio(bio) {
  storage.setItem("loveBio", JSON.stringify(bio));
}

function readJson(key, fallback) {
  try {
    return { ...fallback, ...JSON.parse(storage.getItem(key) || "{}") };
  } catch {
    return { ...fallback };
  }
}

function getProfile() {
  return readJson("profile", {
    name: "Muaz",
    role: "Home Owner",
    phone: "",
    email: "",
    address: ""
  });
}

function setProfile(profile) {
  storage.setItem("profile", JSON.stringify(profile));
}

function getSettings() {
  return readJson("settings", {
    homeName: "Smart Home",
    weatherPlace: "Kuala Lumpur",
    defaultTab: "home",
    tempUnit: "c",
    birthdayNotify: false,
    salaryDay: "25",
    salaryTime: "09:00",
    bankName: "",
    bankAccount: "",
    bankHolder: "",
    bankQr: ""
  });
}

function setSettings(settings) {
  storage.setItem("settings", JSON.stringify(settings));
}

function getDeviceStates() {
  return readJson("devices", defaultDevices);
}

function setDeviceStates(devices) {
  storage.setItem("devices", JSON.stringify(devices));
}

function getLovePhone() {
  const bio = getBio();
  let phone = storage.getItem("loveWhatsapp") || normalisePhone(bio.phone || "");
  if (!phone) {
    const entered = window.prompt("Masukkan nombor WhatsApp My Love. Contoh: 60123456789");
    if (!entered) return "";
    phone = normalisePhone(entered);
    if (phone) storage.setItem("loveWhatsapp", phone);
  }
  return phone;
}

function getLoveLocation() {
  const bio = getBio();
  let location = storage.getItem("loveLocation") || bio.location || "";
  if (!location) {
    const entered = window.prompt("Masukkan link Google Maps atau alamat lokasi My Love.");
    if (!entered) return "";
    location = entered.trim();
    storage.setItem("loveLocation", location);
  }
  return location;
}

function openUrl(url) {
  window.location.href = url;
}

function openLoveLocation() {
  const location = getLoveLocation();
  if (!location) return;
  refreshLoveLabels();

  if (/^https?:\/\//i.test(location)) {
    openUrl(location);
    return;
  }

  openUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`);
}

function openWhatsappChat() {
  const phone = getLovePhone();
  if (!phone) return;
  refreshLoveLabels();
  openUrl(`https://wa.me/${phone}`);
}

function openWhatsappVideo() {
  const phone = getLovePhone();
  if (!phone) return;
  refreshLoveLabels();

  const fallback = `https://wa.me/${phone}`;
  window.location.href = `whatsapp://call?phone=${phone}&video=1`;
  window.setTimeout(() => {
    window.location.href = fallback;
  }, 900);
}

function refreshLoveLabels() {
  const bio = getBio();
  const phone = storage.getItem("loveWhatsapp") || normalisePhone(bio.phone || "");
  const location = storage.getItem("loveLocation") || bio.location;
  $("loveWhatsappLabel").textContent = phone ? `+${phone}` : "Tap untuk set nombor";
  $("loveLocationLabel").textContent = location ? "Lokasi disimpan" : "Tap untuk set lokasi";
  $("loveBioLabel").textContent = bio.name || bio.nickname || bio.birthday ? "Detail disimpan" : "Tap untuk isi detail";
}

function applyProfile() {
  const profile = getProfile();
  const settings = getSettings();
  const firstName = profile.name.trim().split(/\s+/)[0] || "Muaz";
  document.querySelector(".greeting strong").textContent = `${firstName}!`;
  $("profileAvatar").textContent = firstName.charAt(0).toUpperCase();
  $("profileNameText").textContent = profile.name || "Muaz";
  $("profileRoleText").textContent = profile.role || "Home Owner";
  $("profileHomeName").textContent = settings.homeName || "Smart Home";
  $("statProfile").textContent = firstName;
}

function loadProfileForm() {
  const profile = getProfile();
  const form = $("profileForm");
  profileFields.forEach((field) => {
    if (form.elements[field]) form.elements[field].value = profile[field] || "";
  });
  applyProfile();
}

function saveProfileForm() {
  const form = $("profileForm");
  const profile = {};
  profileFields.forEach((field) => {
    profile[field] = (form.elements[field]?.value || "").trim();
  });
  setProfile(profile);
  applyProfile();
  window.alert("Profile disimpan.");
}

function loadSettingsForm() {
  const settings = getSettings();
  const form = $("settingsForm");
  settingsFields.forEach((field) => {
    if (!form.elements[field]) return;
    if (form.elements[field].type === "checkbox") {
      form.elements[field].checked = Boolean(settings[field]);
    } else {
      form.elements[field].value = settings[field] || "";
    }
  });
}

function saveSettingsForm() {
  const form = $("settingsForm");
  const previous = getSettings();
  const settings = {};
  settingsFields.forEach((field) => {
    if (!form.elements[field]) return;
    settings[field] = form.elements[field].type === "checkbox"
      ? form.elements[field].checked
      : (form.elements[field].value || "").trim();
  });
  settings.bankQr = previous.bankQr || "";
  setSettings(settings);
  applyProfile();
  if (document.querySelector(".tab.active")?.dataset.tab === "lubuk") renderSaleSummary();
  else loadWeather();
  window.alert("Settings disimpan.");
}

function saveBankQr(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const settings = getSettings();
    settings.bankQr = reader.result;
    setSettings(settings);
    window.alert("QR bank disimpan.");
  };
  reader.readAsDataURL(file);
}

function refreshDeviceCards() {
  const devices = getDeviceStates();
  document.querySelectorAll("[data-device]").forEach((card) => {
    const isOn = Boolean(devices[card.dataset.device]);
    card.classList.toggle("accent", isOn);
    card.classList.toggle("disabled", !isOn);
    card.querySelector("[data-device-state]").textContent = isOn ? "ON" : "OFF";
    card.querySelector("[data-device-switch]").classList.toggle("on", isOn);
  });
  refreshUsageStats();
}

function toggleDevice(key) {
  const devices = getDeviceStates();
  devices[key] = !devices[key];
  setDeviceStates(devices);
  refreshDeviceCards();
}

function refreshUsageStats() {
  const devices = getDeviceStates();
  const values = Object.values(devices);
  $("statActive").textContent = values.filter(Boolean).length;
  $("statTotal").textContent = values.length;
  $("statWeather").textContent = `${$("temperature").textContent || "--"}°`;
}

function formatBirthday(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-MY", { day: "2-digit", month: "short" }).format(date);
}

function getNextBirthday(value) {
  if (!value) return null;
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;

  const today = new Date();
  const next = new Date(today.getFullYear(), parts[1] - 1, parts[2]);
  next.setHours(0, 0, 0, 0);

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  if (next < todayStart) next.setFullYear(today.getFullYear() + 1);
  return next;
}

function refreshBirthdayStatus() {
  const bio = getBio();
  const next = getNextBirthday(bio.birthday);

  if (!next) {
    $("birthdayStatus").textContent = "Birthday belum diset";
    $("birthdayCountdown").textContent = "-- hari lagi";
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.round((next - today) / dayMs);
  $("birthdayStatus").textContent = `Birthday ${formatBirthday(next)}`;
  $("birthdayCountdown").textContent = days === 0 ? "Hari ini birthday!" : `${days} hari lagi`;
}

function loadBioForm() {
  const bio = getBio();
  const form = $("bioForm");
  bioFields.forEach((field) => {
    if (form.elements[field]) form.elements[field].value = bio[field] || "";
  });
  refreshBirthdayStatus();
}

function saveBioForm() {
  const form = $("bioForm");
  const bio = {};
  bioFields.forEach((field) => {
    bio[field] = (form.elements[field]?.value || "").trim();
  });

  if (bio.phone) storage.setItem("loveWhatsapp", normalisePhone(bio.phone));
  if (bio.location) storage.setItem("loveLocation", bio.location);
  setBio(bio);
  refreshLoveLabels();
  refreshBirthdayStatus();
  checkBirthdayNotification();
}

function openBioPanel() {
  loadBioForm();
  $("bioPanel").hidden = false;
}

function closeBioPanel() {
  $("bioPanel").hidden = true;
}

async function requestBirthdayNotification() {
  if (!("Notification" in window)) {
    window.alert("Notification tidak disokong pada browser ini.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    window.alert("Notification birthday sudah aktif. App akan beri alert bila birthday tiba.");
    checkBirthdayNotification(true);
  } else {
    window.alert("Notification belum dibenarkan.");
  }
}

function showBirthdayNotification(name) {
  const title = `Birthday ${name || "My Love"} hari ini`;
  const body = "Jangan lupa wish dan buat dia rasa special hari ini.";

  if (navigator.serviceWorker?.ready) {
    navigator.serviceWorker.ready
      .then((registration) => registration.showNotification(title, { body, icon: "./icon.svg" }))
      .catch(() => new Notification(title, { body }));
    return;
  }

  new Notification(title, { body });
}

function checkBirthdayNotification(force = false) {
  const bio = getBio();
  if (!bio.birthday || !("Notification" in window) || Notification.permission !== "granted") return;

  const birthday = getNextBirthday(bio.birthday);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!birthday || birthday.getTime() !== today.getTime()) return;

  const key = `birthdayNotified-${today.getFullYear()}`;
  if (!force && storage.getItem(key)) return;
  storage.setItem(key, "yes");
  showBirthdayNotification(bio.nickname || bio.name);
}

function getCalendarNotes() {
  return readJson("calendarNotes", {});
}

function setCalendarNotes(notes) {
  storage.setItem("calendarNotes", JSON.stringify(notes));
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function setupCalendarControls() {
  const monthNames = Array.from({ length: 12 }, (_, index) => (
    new Intl.DateTimeFormat("en-MY", { month: "short" }).format(new Date(2026, index, 1))
  ));
  $("calendarMonth").innerHTML = monthNames.map((name, index) => `<option value="${index}">${name}</option>`).join("");

  const currentYear = new Date().getFullYear();
  $("calendarYear").innerHTML = Array.from({ length: 11 }, (_, index) => currentYear - 5 + index)
    .map((year) => `<option value="${year}">${year}</option>`)
    .join("");
}

function syncCalendarInputs() {
  $("calendarDate").value = dateKey(selectedCalendarDate);
  $("calendarMonth").value = String(selectedCalendarDate.getMonth());
  $("calendarYear").value = String(selectedCalendarDate.getFullYear());
  $("selectedDateText").textContent = new Intl.DateTimeFormat("en-MY", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(selectedCalendarDate);
  $("calendarTitle").textContent = new Intl.DateTimeFormat("en-MY", {
    month: "long",
    year: "numeric"
  }).format(selectedCalendarDate);
}

function renderCalendar() {
  const notes = getCalendarNotes();
  const year = selectedCalendarDate.getFullYear();
  const month = selectedCalendarDate.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const selected = dateKey(selectedCalendarDate);

  $("calendarGrid").innerHTML = Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    const key = dateKey(new Date(year, month, day));
    const classes = [
      "calendar-day",
      key === selected ? "selected" : "",
      notes[key]?.note ? "has-note" : ""
    ].filter(Boolean).join(" ");
    return `<button class="${classes}" type="button" data-calendar-day="${day}">${day}</button>`;
  }).join("");
  syncCalendarInputs();
}

function selectCalendarDate(date) {
  selectedCalendarDate = date;
  renderCalendar();
}

function openCalendarNote() {
  const key = dateKey(selectedCalendarDate);
  const notes = getCalendarNotes();
  $("noteDate").value = key;
  $("noteText").value = notes[key]?.note || "";
  $("noteNotify").checked = Boolean(notes[key]?.notify);
  openAppPanel("calendarNotePanel");
}

async function saveCalendarNote() {
  const key = $("noteDate").value || dateKey(selectedCalendarDate);
  const notes = getCalendarNotes();
  notes[key] = {
    note: $("noteText").value.trim(),
    notify: $("noteNotify").checked
  };
  if (!notes[key].note && !notes[key].notify) delete notes[key];
  setCalendarNotes(notes);
  selectCalendarDate(parseDateKey(key));

  if (notes[key]?.notify && "Notification" in window && Notification.permission !== "granted") {
    await Notification.requestPermission();
  }

  window.alert("Note disimpan.");
}

function checkCalendarNotifications() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const key = dateKey(new Date());
  const notes = getCalendarNotes();
  if (!notes[key]?.notify || !notes[key]?.note) return;
  const sentKey = `calendarNotified-${key}`;
  if (storage.getItem(sentKey)) return;
  storage.setItem(sentKey, "yes");
  new Notification("Calendar Note", { body: notes[key].note, icon: "./icon.svg" });
}

function switchView(view, activeTab) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab === activeTab);
  });
  $("homeView").hidden = view !== "home";
  $("loveView").hidden = view !== "love";
  $("personalView").hidden = view !== "personal";
  $("hackingView").hidden = view !== "hacking";
  $("lubukView").hidden = view !== "lubuk";
  document.querySelector(".weather-card").hidden = view === "personal";
  $("calendarCard").hidden = view !== "personal";
  if (view === "personal") renderCalendar();
  if (view === "lubuk") renderSaleSummary();
  if (view !== "personal" && view !== "lubuk") loadWeather();
}

function activateTab(view) {
  const tab = [...document.querySelectorAll(".tab")].find((item) => item.dataset.tab === view) || document.querySelector(".tab");
  switchView(tab.dataset.tab || "home", tab);
}

function closeAllPanels() {
  ["usagePanel", "settingsPanel", "profilePanel", "bioPanel", "musicPanel", "calendarNotePanel", "identityPanel", "targetPanel", "companyPanel", "pricePanel", "projectPanel", "bookingPanel", "salesPanel", "projectChatPanel", "sopPanel", "achievementPanel"].forEach((id) => {
    if ($(id)) $(id).hidden = true;
  });
  document.body.classList.remove("client-chat-mode");
}

function closeNavPanel() {
  closeAllPanels();
  setNavActive("home");
}

function openAppPanel(id) {
  closeAllPanels();
  $(id).hidden = false;
  if (id === "usagePanel") refreshUsageStats();
  if (id === "settingsPanel") loadSettingsForm();
  if (id === "profilePanel") loadProfileForm();
}

function setNavActive(nav) {
  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.classList.toggle("active", button.dataset.nav === nav);
  });
}

function handleNav(nav) {
  setNavActive(nav);
  if (nav === "home") {
    closeAllPanels();
    activateTab(getSettings().defaultTab || "home");
  }
  if (nav === "usage") openAppPanel("usagePanel");
  if (nav === "settings") openAppPanel("settingsPanel");
  if (nav === "profile") openAppPanel("profilePanel");
}

function resetAppData() {
  if (!window.confirm("Reset semua data app?")) return;
  ["profile", "settings", "devices", "loveBio", "loveWhatsapp", "loveLocation", "calendarNotes", "targets"].forEach((key) => storage.removeItem(key));
  setDeviceStates(defaultDevices);
  loadProfileForm();
  loadSettingsForm();
  refreshLoveLabels();
  refreshDeviceCards();
  activateTab("home");
  closeAllPanels();
}

async function downloadAppNow() {
  if (installPromptEvent) {
    installPromptEvent.prompt();
    await installPromptEvent.userChoice.catch(() => {});
    installPromptEvent = null;
    return;
  }

  window.alert("Untuk install app: buka website ini di Safari/Chrome, tekan Share/Menu, kemudian pilih Add to Home Screen atau Install App.");
}

function openIdentityPanel() {
  openAppPanel("identityPanel");
}

function getTargets() {
  try {
    return JSON.parse(storage.getItem("targets") || "[]");
  } catch {
    return [];
  }
}

function setTargets(targets) {
  storage.setItem("targets", JSON.stringify(targets));
}

function formatMoney(value) {
  return `RM ${Number(value || 0).toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function openTargetPanel() {
  openAppPanel("targetPanel");
  renderTargets();
}

function renderTargets() {
  const targets = getTargets();
  const settings = getSettings();
  $("targetCardLabel").textContent = targets.length ? `${targets.length} target aktif` : "Set goal dan monitor duit";

  if (!targets.length) {
    $("targetList").innerHTML = "<div class=\"identity-result\"><p>Belum ada target. Tambah target pertama seperti basikal, phone, trip, atau apa-apa goal.</p></div>";
    return;
  }

  $("targetList").innerHTML = targets.map((target, index) => {
    const amount = Number(target.amount || 0);
    const saved = Number(target.saved || 0);
    const balance = Math.max(amount - saved, 0);
    const progress = amount ? Math.min((saved / amount) * 100, 100) : 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = target.deadline ? parseDateKey(target.deadline) : today;
    const days = Math.max(Math.ceil((deadline - today) / 86400000), 1);
    const weekly = balance / Math.max(days / 7, 1);
    const monthly = balance / Math.max(days / 30, 1);
    return `
      <div class="target-item">
        <h3>${escapeHtml(target.name || "Target")}</h3>
        <p>${formatMoney(saved)} / ${formatMoney(amount)} (${Math.round(progress)}%)</p>
        <div class="target-bar"><span style="width:${progress}%"></span></div>
        <p>Baki: ${formatMoney(balance)} | ${days} hari lagi</p>
        <p>Simpan anggaran: ${formatMoney(weekly)}/minggu atau ${formatMoney(monthly)}/bulan</p>
        <label class="target-reminder"><span>Salary reminder</span><input type="checkbox" data-target-reminder="${index}" ${target.notify ? "checked" : ""}></label>
        <div class="target-bank">
          ${settings.bankQr ? `<img src="${settings.bankQr}" alt="QR bank">` : ""}
          <p><strong>${escapeHtml(settings.bankName || "Bank belum diset")}</strong></p>
          <p>${escapeHtml(settings.bankAccount || "No account belum diset")}</p>
          <p>${escapeHtml(settings.bankHolder || "Nama account belum diset")}</p>
        </div>
        <div class="target-transfer">
          <input type="number" min="0" step="0.01" placeholder="Jumlah transfer" data-transfer-amount="${index}">
          <button type="button" data-transfer-target="${index}">Mark Transfer</button>
        </div>
        <button class="target-delete" type="button" data-delete-target="${index}">Delete</button>
      </div>
    `;
  }).join("");
}

function saveTarget(event) {
  event.preventDefault();
  const target = {
    name: $("targetName").value.trim(),
    amount: Number($("targetAmount").value || 0),
    saved: Number($("targetSaved").value || 0),
    deadline: $("targetDeadline").value,
    notify: false
  };
  if (!target.name || !target.amount) {
    window.alert("Masukkan nama target dan harga target.");
    return;
  }
  const targets = getTargets();
  targets.push(target);
  setTargets(targets);
  $("targetForm").reset();
  renderTargets();
}

function deleteTarget(index) {
  const targets = getTargets();
  targets.splice(index, 1);
  setTargets(targets);
  renderTargets();
}

function toggleTargetReminder(index, checked) {
  const targets = getTargets();
  if (!targets[index]) return;
  targets[index].notify = checked;
  setTargets(targets);
  if (checked && "Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  renderTargets();
}

function markTargetTransfer(index) {
  const input = document.querySelector(`[data-transfer-amount="${index}"]`);
  const amount = Number(input?.value || 0);
  if (!amount) {
    window.alert("Masukkan jumlah transfer.");
    return;
  }
  const targets = getTargets();
  if (!targets[index]) return;
  targets[index].saved = Number(targets[index].saved || 0) + amount;
  setTargets(targets);
  renderTargets();
}

function checkSalaryNotifications() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const settings = getSettings();
  const today = new Date();
  const salaryDay = Number(settings.salaryDay || 0);
  if (today.getDate() !== salaryDay) return;
  const activeTargets = getTargets().filter((target) => target.notify);
  if (!activeTargets.length) return;
  const key = `salaryNotified-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  if (storage.getItem(key)) return;
  storage.setItem(key, "yes");
  new Notification("Salary Target Reminder", {
    body: `Gaji masuk. Transfer ke simpanan untuk ${activeTargets.map((target) => target.name).join(", ")}.`,
    icon: "./icon.svg"
  });
}

function getCompany() {
  return readJson("company", {
    name: "Lubuk IT",
    phone: "",
    email: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    address: ""
  });
}

function setCompany(company) {
  storage.setItem("company", JSON.stringify(company));
}

function getPricelist() {
  try {
    const rawItems = JSON.parse(storage.getItem("pricelist") || "[]");
    return rawItems.map((item) => {
      if (Array.isArray(item.packages)) {
        return {
          service: item.service || item.name || "Service",
          image: item.image || "",
          theme: item.theme || "#8afbf1",
          addOns: item.addOns || "",
          packages: item.packages.map((pkg) => ({
            name: pkg.name || "Package",
            amount: Number(pkg.amount || pkg.price || 0),
            details: pkg.details || "",
            image: pkg.image || item.image || ""
          }))
        };
      }

      return {
        service: item.name || "Service",
        image: item.image || "",
        theme: item.theme || "#8afbf1",
        addOns: item.addOns || "",
        packages: [{ name: "Standard", amount: Number(item.amount || 0), details: item.details || "", image: item.image || "" }]
      };
    });
  } catch {
    return [];
  }
}

function setPricelist(items) {
  storage.setItem("pricelist", JSON.stringify(items));
}

function seedDefaultPricelist() {
  if (storage.getItem("pricelistSeed") === DEFAULT_PRICELIST_SEED) return;
  setPricelist(DEFAULT_PRICELIST);
  storage.setItem("pricelistSeed", DEFAULT_PRICELIST_SEED);
}

function restoreDefaultPricelist() {
  if (!window.confirm("Restore balik service default yang hilang? Service custom awak akan kekal.")) return;
  const currentItems = getPricelist();
  const currentNames = new Set(currentItems.map((item) => (item.service || "").toLowerCase()));
  const missingDefaults = DEFAULT_PRICELIST.filter((item) => !currentNames.has(item.service.toLowerCase()));
  if (!missingDefaults.length) {
    window.alert("Semua default pricelist sudah ada.");
    return;
  }
  setPricelist([...currentItems, ...missingDefaults]);
  storage.setItem("pricelistSeed", DEFAULT_PRICELIST_SEED);
  renderPricelist();
  window.alert(`${missingDefaults.length} service default sudah restore.`);
}

function openCompanyPanel() {
  openAppPanel("companyPanel");
  loadCompanyForm();
}

function openPricePanel() {
  openAppPanel("pricePanel");
  resetPriceForm();
  renderPricelist();
}

function openProjectPanel() {
  openAppPanel("projectPanel");
  renderProjects();
}

function openSalesPanel() {
  openAppPanel("salesPanel");
  renderSales();
}

function getSops() {
  try {
    return JSON.parse(storage.getItem("sops") || "[]");
  } catch {
    return [];
  }
}

function setSops(items) {
  storage.setItem("sops", JSON.stringify(items));
}

function openSopPanel() {
  openAppPanel("sopPanel");
  renderSops();
}

function saveSop(event) {
  event.preventDefault();
  const title = $("sopTitle").value.trim();
  const steps = $("sopSteps").value.split("\n").map((step) => step.trim()).filter(Boolean);
  if (!title || !steps.length) {
    window.alert("Masukkan title dan step SOP.");
    return;
  }
  setSops([{ id: Date.now(), title, steps }, ...getSops()]);
  $("sopForm").reset();
  renderSops();
}

function renderSops() {
  const sops = getSops();
  $("sopList").innerHTML = sops.length ? sops.map((sop) => `
    <article class="ops-card">
      <div class="ops-head">
        <h3>${escapeHtml(sop.title)}</h3>
        <button type="button" data-delete-sop="${sop.id}">Delete</button>
      </div>
      <ol>${sop.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
    </article>
  `).join("") : "<div class=\"identity-result\"><p>Belum ada SOP. Tambah checklist kerja pertama.</p></div>";
}

function deleteSop(id) {
  setSops(getSops().filter((item) => String(item.id) !== String(id)));
  renderSops();
}

function getAchievements() {
  try {
    return JSON.parse(storage.getItem("achievements") || "[]");
  } catch {
    return [];
  }
}

function setAchievements(items) {
  storage.setItem("achievements", JSON.stringify(items));
}

function openAchievementPanel() {
  openAppPanel("achievementPanel");
  renderAchievements();
}

function saveAchievement(event) {
  event.preventDefault();
  const item = {
    id: Date.now(),
    staff: $("achievementStaff").value.trim(),
    title: $("achievementTitle").value.trim(),
    point: Number($("achievementPoint").value || 0),
    detail: $("achievementDetail").value.trim(),
    date: new Intl.DateTimeFormat("en-MY", { dateStyle: "medium" }).format(new Date())
  };
  if (!item.staff || !item.title) {
    window.alert("Masukkan nama staff dan title achievement.");
    return;
  }
  setAchievements([item, ...getAchievements()]);
  $("achievementForm").reset();
  renderAchievements();
}

function renderAchievements() {
  const items = getAchievements();
  $("achievementList").innerHTML = items.length ? items.map((item) => `
    <article class="ops-card achievement-card">
      <div class="ops-head">
        <div>
          <h3>${escapeHtml(item.staff)}</h3>
          <p>${escapeHtml(item.title)} • ${escapeHtml(item.date || "")}</p>
        </div>
        <strong>${Number(item.point || 0)} pts</strong>
      </div>
      ${item.detail ? `<p>${escapeHtml(item.detail)}</p>` : ""}
      <button type="button" data-delete-achievement="${item.id}">Delete</button>
    </article>
  `).join("") : "<div class=\"identity-result\"><p>Belum ada achievement staff.</p></div>";
}

function deleteAchievement(id) {
  setAchievements(getAchievements().filter((item) => String(item.id) !== String(id)));
  renderAchievements();
}

function loadCompanyForm() {
  const company = getCompany();
  const form = $("companyForm");
  companyFields.forEach((field) => {
    if (form.elements[field]) form.elements[field].value = company[field] || "";
  });
  setCompanyEditMode(false);
}

function setCompanyEditMode(enabled) {
  companyEditMode = enabled;
  const form = $("companyForm");
  form.classList.toggle("is-editing", enabled);
  companyFields.forEach((field) => {
    const element = form.elements[field];
    if (!element) return;
    element.readOnly = !enabled;
    element.classList.toggle("copy-ready", !enabled);
  });
  $("companySubmit").textContent = enabled ? "Save Company Detail" : "Edit Company Detail";
}

function copyText(value, label) {
  const text = String(value || "").trim();
  if (!text) {
    window.alert(`${label} belum diisi.`);
    return;
  }
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  window.alert(`Copy ${label}`);
}

function saveCompany(event) {
  event.preventDefault();
  if (!companyEditMode) {
    setCompanyEditMode(true);
    return;
  }

  const form = $("companyForm");
  const company = {};
  companyFields.forEach((field) => {
    company[field] = (form.elements[field]?.value || "").trim();
  });
  setCompany(company);
  setCompanyEditMode(false);
  window.alert("Company detail disimpan.");
}

function copyCompanyField(target) {
  if (companyEditMode) return;
  const field = target.closest("input, textarea");
  if (!field || !field.name || !companyFields.includes(field.name)) return;
  const label = field.closest("label")?.childNodes?.[0]?.textContent?.trim() || field.name;
  copyText(field.value, label);
}

function setPriceBuilderVisible(visible) {
  $("priceForm").hidden = !visible;
  $("addServiceButton").hidden = visible;
  $("addServiceButton").textContent = "Add New Service";
}

function togglePriceBuilder() {
  if (!$("priceForm").hidden) {
    $("priceServiceName").focus();
    return;
  }

  editingPriceServiceIndex = -1;
  setPriceBuilderVisible(true);
  $("priceSubmit").textContent = "Proceed Pricelist";
  renderPricePackageInputs();
  $("priceServiceName").focus();
}

function renderPricePackageInputs(existingPackages = []) {
  const count = Number($("packageCount").value || 3);
  $("packageFields").innerHTML = Array.from({ length: count }, (_, index) => {
    const pkg = existingPackages[index] || {};
    return `
      <div class="package-input-card">
        <h3>Package ${index + 1}</h3>
        <label>Nama package<input class="package-name" type="text" placeholder="Basic / Standard / Premium" value="${escapeHtml(pkg.name || "")}"></label>
        <label>Harga (RM)<input class="package-price" type="number" min="0" step="0.01" placeholder="80" value="${pkg.amount || ""}"></label>
        <label>Apa yang dapat<textarea class="package-detail" rows="2" placeholder="Contoh: Cleaning, thermal paste, checking">${escapeHtml(pkg.details || "")}</textarea></label>
      </div>
    `;
  }).join("");
}

function resetPriceForm() {
  editingPriceServiceIndex = -1;
  $("priceServiceName").value = "";
  $("packageCount").value = "3";
  $("priceSubmit").textContent = "Proceed Pricelist";
  renderPricePackageInputs();
  setPriceBuilderVisible(false);
}

function addPriceItem(event) {
  event.preventDefault();
  const service = $("priceServiceName").value.trim();
  const names = [...document.querySelectorAll(".package-name")];
  const prices = [...document.querySelectorAll(".package-price")];
  const details = [...document.querySelectorAll(".package-detail")];
  const packages = names.map((input, index) => ({
    name: input.value.trim(),
    amount: Number(prices[index]?.value || 0),
    details: details[index]?.value.trim() || ""
  })).filter((pkg) => pkg.name && pkg.amount);

  if (!service || !packages.length) {
    window.alert("Masukkan nama service dan sekurang-kurangnya satu package lengkap.");
    return;
  }

  const items = getPricelist();
  const existing = editingPriceServiceIndex >= 0 ? items[editingPriceServiceIndex] || {} : {};
  const serviceItem = { service, image: existing.image || "", theme: existing.theme || "#8afbf1", addOns: existing.addOns || "", packages };
  if (editingPriceServiceIndex >= 0 && items[editingPriceServiceIndex]) {
    items[editingPriceServiceIndex] = serviceItem;
  } else {
    items.push(serviceItem);
  }
  setPricelist(items);
  resetPriceForm();
  renderPricelist();
}

function flattenPricelist() {
  return getPricelist().flatMap((serviceItem, serviceIndex) => (
    serviceItem.packages.map((pkg, packageIndex) => ({
      service: serviceItem.service,
      packageName: pkg.name,
      name: `${serviceItem.service} - ${pkg.name}`,
      amount: Number(pkg.amount || 0),
      details: pkg.details || "",
      image: pkg.image || serviceItem.image || "",
      serviceIndex,
      packageIndex
    }))
  ));
}

function renderPricelist() {
  const services = getPricelist();

  $("priceList").innerHTML = services.length
    ? `<div class="price-services-track">${services.map((serviceItem, serviceIndex) => `
      <article class="price-service-card" style="--service-theme:${escapeHtml(serviceItem.theme || "#8afbf1")}">
        <div class="price-service-head">
          <div>
            <p>Service</p>
            <h3>${escapeHtml(serviceItem.service)}</h3>
          </div>
          <div class="service-actions">
            ${serviceItem.image ? `<button class="service-image-button" type="button" data-download-service-image="${serviceIndex}" aria-label="Download gambar service"><span aria-hidden="true"></span></button>` : ""}
            <button class="delete-service-button" type="button" data-delete-price="${serviceIndex}">Delete</button>
          </div>
        </div>
        <div class="package-card-list">
          ${serviceItem.packages.map((pkg, packageIndex) => `
            <div class="package-card" role="button" tabindex="0" data-package-card data-service-index="${serviceIndex}" data-package-index="${packageIndex}">
              <span>${escapeHtml(pkg.name)}</span>
              <strong>${formatMoney(pkg.amount)}</strong>
              <small>${escapeHtml(pkg.details || "Detail belum diset")}</small>
            </div>
          `).join("")}
        </div>
        ${serviceItem.addOns ? `<p class="service-addons">Add-on: ${escapeHtml(serviceItem.addOns)}</p>` : ""}
        <button class="book-service-button" type="button" data-book-service="${serviceIndex}">Book Now</button>
        <p class="hold-hint">Tap package untuk copy. Hold 5 saat untuk edit.</p>
      </article>
    `).join("")}</div>`
    : "<div class=\"identity-result\"><p>Belum ada pricelist. Isi detail service di atas, kemudian tekan Proceed Pricelist.</p></div>";
}

function getSales() {
  try {
    return JSON.parse(storage.getItem("sales") || "[]");
  } catch {
    return [];
  }
}

function setSales(sales) {
  storage.setItem("sales", JSON.stringify(sales));
  if (document.querySelector(".tab.active")?.dataset.tab === "lubuk") renderSaleSummary();
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isSameWeek(date, now) {
  const start = new Date(now);
  const day = start.getDay() || 7;
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - day + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return date >= start && date < end;
}

function renderSaleSummary() {
  if (!$("condition")) return;
  document.querySelector(".weather-card").classList.add("sale-summary-card");
  $("weatherIcon").classList.add("sale-mark");
  const sales = getSales();
  const now = new Date();
  const totalFor = (filterFn) => sales
    .filter((sale) => filterFn(new Date(sale.createdAt || sale.id || Date.now())))
    .reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  const daily = totalFor((date) => isSameDay(date, now));
  const weekly = totalFor((date) => isSameWeek(date, now));
  const monthly = totalFor((date) => date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth());
  const activeProjects = sales.filter((sale) => !["finish", "cancel"].includes(sale.status || "in-project")).length;

  $("condition").textContent = "Sale Detail";
  $("place").textContent = `${sales.length} sale record`;
  $("temperature").textContent = formatMoney(monthly).replace("RM ", "RM");
  $("feelsLike").textContent = formatMoney(daily).replace("RM ", "RM");
  $("humidity").textContent = formatMoney(weekly).replace("RM ", "RM");
  $("wind").textContent = formatMoney(monthly).replace("RM ", "RM");
  $("pressure").textContent = activeProjects;
}

function openBookingPanel(serviceIndex) {
  const services = getPricelist();
  const serviceItem = services[serviceIndex];
  if (!serviceItem) return;
  openAppPanel("bookingPanel");
  $("bookingForm").reset();
  $("bookingServiceName").textContent = `Started with ${serviceItem.service}. Add package dari service lain kalau perlu.`;
  $("bookingDueDate").value = dateKey(new Date(Date.now() + 7 * 86400000));
  $("bookingPackageList").innerHTML = services.map((item, currentServiceIndex) => `
    <section class="booking-service-group ${currentServiceIndex === serviceIndex ? "open" : ""}" data-booking-service-group>
      <button class="booking-service-toggle" type="button" data-toggle-booking-service="${currentServiceIndex}">
        <span>${escapeHtml(item.service)}</span>
        <small>${item.packages.length} package</small>
      </button>
      <div class="booking-service-packages">
        ${item.packages.map((pkg, packageIndex) => `
          <label class="booking-package">
            <input type="checkbox" data-book-service-index="${currentServiceIndex}" data-book-package-index="${packageIndex}" ${currentServiceIndex === serviceIndex ? "checked" : ""}>
            <span>
              <strong>${escapeHtml(pkg.name)}</strong>
              <small>${formatMoney(pkg.amount)} - ${escapeHtml(pkg.details || "No detail")}</small>
            </span>
          </label>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function toggleBookingService(index) {
  const group = document.querySelector(`[data-toggle-booking-service="${index}"]`)?.closest("[data-booking-service-group]");
  if (group) group.classList.toggle("open");
}

function buildQuotationHtml({ customer, valid, items, note }) {
  const company = getCompany();
  const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const rows = items.map((item, index) => `
    <tr><td>${index + 1}</td><td>${escapeHtml(item.name)}</td><td>${formatMoney(item.amount)}</td></tr>
  `).join("");
  return `<!doctype html><html><head><title>Quotation - ${escapeHtml(customer)}</title>
    <style>body{font-family:Arial,sans-serif;padding:32px;color:#111}h1{margin:0}table{width:100%;border-collapse:collapse;margin-top:24px}td,th{border:1px solid #ddd;padding:10px;text-align:left}.total{text-align:right;font-size:20px;font-weight:700;margin-top:18px}.muted{color:#555}.note{margin-top:18px;padding:12px;background:#f4f4f4}</style>
  </head><body>
    <h1>${escapeHtml(company.name || "Lubuk IT")}</h1>
    <p class="muted">${escapeHtml(company.address || "")}<br>${escapeHtml(company.phone || "")} ${escapeHtml(company.email || "")}</p>
    <h2>Quotation</h2>
    <p><strong>Customer:</strong> ${escapeHtml(customer)}<br><strong>Valid/Due:</strong> ${escapeHtml(valid || "-")}</p>
    <table><thead><tr><th>No</th><th>Item</th><th>Price</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="total">Total: ${formatMoney(total)}</div>
    ${note ? `<div class="note"><strong>Note:</strong><br>${escapeHtml(note)}</div>` : ""}
    <p class="muted">Socmed: ${escapeHtml([company.instagram, company.facebook, company.tiktok].filter(Boolean).join(" | "))}</p>
    <script>window.onload=()=>window.print();<\/script>
  </body></html>`;
}

function printQuotation(data) {
  const win = window.open("", "_blank");
  if (!win) {
    window.alert("Popup blocked. Benarkan popup untuk generate quotation.");
    return false;
  }
  win.document.write(buildQuotationHtml(data));
  win.document.close();
  return true;
}

function saveBooking(event) {
  event.preventDefault();
  const services = getPricelist();
  const selectedInputs = [...$("bookingPackageList").querySelectorAll("input:checked")];
  if (!selectedInputs.length) {
    window.alert("Pilih sekurang-kurangnya satu package.");
    return;
  }
  const customer = $("bookingClientName").value.trim();
  if (!customer) {
    window.alert("Masukkan nama client.");
    return;
  }
  const items = selectedInputs.map((input) => {
    const serviceItem = services[Number(input.dataset.bookServiceIndex)];
    const pkg = serviceItem?.packages?.[Number(input.dataset.bookPackageIndex)];
    return {
      name: `${serviceItem.service} - ${pkg.name}`,
      amount: Number(pkg.amount || 0),
      details: pkg.details || ""
    };
  }).filter((item) => item.name && Number.isFinite(item.amount));
  const serviceNames = [...new Set(items.map((item) => item.name.split(" - ")[0]))];
  const sale = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    service: serviceNames.join(", "),
    services: serviceNames,
    customer,
    phone: $("bookingClientPhone").value.trim(),
    email: $("bookingClientEmail").value.trim(),
    due: $("bookingDueDate").value,
    status: "in-project",
    note: $("bookingNote").value.trim(),
    items,
    total: items.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  };
  setSales([sale, ...getSales()]);
  printQuotation({ customer: sale.customer, valid: sale.due, items: sale.items, note: sale.note });
  openSalesPanel();
}

function projectStatusLabel(status) {
  return {
    "in-project": "In Project",
    "due-date": "Due Date",
    finish: "Finish",
    cancel: "Cancel"
  }[status || "in-project"] || "In Project";
}

function renderProjects() {
  const sales = getSales();
  $("projectList").innerHTML = sales.length ? sales.map((sale) => {
    const status = sale.status || "in-project";
    return `
      <article class="project-card status-${escapeHtml(status)}">
        <div class="project-card-head">
          <div>
            <p>${escapeHtml(sale.service || "Service")}</p>
            <h3>${escapeHtml(sale.customer || "Client")}</h3>
          </div>
          <span>${escapeHtml(projectStatusLabel(status))}</span>
        </div>
        <div class="sale-meta">
          <span>Due date: ${escapeHtml(sale.due || "-")}</span>
          <span>Phone: ${escapeHtml(sale.phone || "-")}</span>
          <span>Email: ${escapeHtml(sale.email || "-")}</span>
        </div>
        <div class="sale-items">
          ${sale.items.map((item) => `<p>${escapeHtml(item.name)} <strong>${formatMoney(item.amount)}</strong></p>`).join("")}
        </div>
        <label class="project-status-select">Status
          <select data-project-status="${sale.id}">
            <option value="in-project" ${status === "in-project" ? "selected" : ""}>In Project</option>
            <option value="due-date" ${status === "due-date" ? "selected" : ""}>Due Date</option>
            <option value="finish" ${status === "finish" ? "selected" : ""}>Finish</option>
            <option value="cancel" ${status === "cancel" ? "selected" : ""}>Cancel</option>
          </select>
        </label>
        <button type="button" data-open-project-chat="${sale.id}">Chat</button>
      </article>
    `;
  }).join("") : "<div class=\"identity-result\"><p>Belum ada project. Bila client booking dan generate quotation, project akan masuk sini.</p></div>";
}

function openProjectChat(id) {
  const sale = getSales().find((item) => String(item.id) === String(id));
  activeProjectChatId = sale?.id || id;
  openAppPanel("projectChatPanel");
  $("projectChatClient").textContent = sale?.customer || "Project Chat";
  $("projectChatName").value = getProfile().name || "Muaz";
  renderProjectChat();
  subscribeProjectChat();
}

function renderProjectChat() {
  const sale = getSales().find((item) => String(item.id) === String(activeProjectChatId));
  const localRooms = getLocalChatRooms();
  const messages = sale?.chat || localRooms[String(activeProjectChatId)] || [];
  $("projectChatThread").innerHTML = messages.length ? messages.map((message) => `
    <div class="chat-message">
      <div><strong>${escapeHtml(message.name || "User")}</strong><span>${escapeHtml(message.time || "")}</span></div>
      <p>${escapeHtml(message.text || "")}</p>
    </div>
  `).join("") : "<div class=\"identity-result\"><p>Belum ada update. Mula chat untuk project ini.</p></div>";
  $("projectChatThread").scrollTop = $("projectChatThread").scrollHeight;
}

function renderChatMessages(messages) {
  $("projectChatThread").innerHTML = messages.length ? messages.map((message) => `
    <div class="chat-message">
      <div><strong>${escapeHtml(message.name || "User")}</strong><span>${escapeHtml(message.time || "")}</span></div>
      <p>${escapeHtml(message.text || "")}</p>
    </div>
  `).join("") : "<div class=\"identity-result\"><p>Belum ada update. Mula chat untuk project ini.</p></div>";
  $("projectChatThread").scrollTop = $("projectChatThread").scrollHeight;
}

function initFirestore() {
  const config = window.firebaseAppConfig;
  if (!config?.enabled || !window.firebase?.initializeApp) {
    $("projectChatStatus").textContent = "Local mode - database belum connect";
    return null;
  }
  if (firestoreDb) return firestoreDb;
  try {
    if (!window.firebase.apps?.length) window.firebase.initializeApp(config);
    firestoreDb = window.firebase.firestore();
    $("projectChatStatus").textContent = "Online database connected";
    return firestoreDb;
  } catch {
    $("projectChatStatus").textContent = "Database error - guna local mode";
    return null;
  }
}

function getLocalChatRooms() {
  try {
    return JSON.parse(storage.getItem("projectChatRooms") || "{}");
  } catch {
    return {};
  }
}

function setLocalChatRooms(rooms) {
  storage.setItem("projectChatRooms", JSON.stringify(rooms));
}

function subscribeProjectChat() {
  if (chatUnsubscribe) chatUnsubscribe();
  chatUnsubscribe = null;
  const db = initFirestore();
  if (!db || !activeProjectChatId) return;
  $("projectChatStatus").textContent = "Online database connected";
  chatUnsubscribe = db.collection("projectChats")
    .doc(String(activeProjectChatId))
    .collection("messages")
    .orderBy("createdAt", "asc")
    .onSnapshot((snapshot) => {
      renderChatMessages(snapshot.docs.map((doc) => doc.data()));
    });
}

function saveProjectChat(event) {
  event.preventDefault();
  const text = $("projectChatMessage").value.trim();
  if (!text) return;
  const message = {
    name: $("projectChatName").value.trim() || "User",
    text,
    time: new Intl.DateTimeFormat("en-MY", { dateStyle: "short", timeStyle: "short" }).format(new Date()),
    createdAt: Date.now()
  };
  const db = initFirestore();
  if (db && activeProjectChatId) {
    db.collection("projectChats").doc(String(activeProjectChatId)).collection("messages").add(message);
    $("projectChatMessage").value = "";
    return;
  }
  const sales = getSales();
  const sale = sales.find((item) => String(item.id) === String(activeProjectChatId));
  if (!sale) {
    const rooms = getLocalChatRooms();
    const key = String(activeProjectChatId);
    rooms[key] = [...(rooms[key] || []), message];
    setLocalChatRooms(rooms);
    renderChatMessages(rooms[key]);
    $("projectChatMessage").value = "";
    return;
  }
  sale.chat = sale.chat || [];
  sale.chat.push(message);
  setSales(sales);
  $("projectChatMessage").value = "";
  renderProjectChat();
}

function shareProjectChat() {
  if (!activeProjectChatId) return;
  const url = new URL(window.location.href);
  url.searchParams.set("chat", activeProjectChatId);
  url.searchParams.delete("tab");
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url.toString()).catch(() => {});
  }
  window.alert("Link chat project sudah copy. Share link ini kepada client.");
}

function openSharedProjectChat() {
  const chatId = new URLSearchParams(window.location.search).get("chat");
  if (!chatId) return false;
  document.body.classList.add("client-chat-mode");
  window.setTimeout(() => {
    openProjectChat(chatId);
    document.body.classList.add("client-chat-mode");
  }, 200);
  return true;
}

function updateProjectStatus(id, status) {
  const sales = getSales();
  const sale = sales.find((item) => String(item.id) === String(id));
  if (!sale) return;
  sale.status = status;
  setSales(sales);
  renderProjects();
  renderSales();
}

function renderSales() {
  const sales = getSales();
  $("salesList").innerHTML = sales.length ? sales.map((sale) => `
    <article class="sale-card">
      <div class="sale-card-head">
        <div>
          <p>${escapeHtml(sale.service || "Service")}</p>
          <h3>${escapeHtml(sale.customer || "Client")}</h3>
        </div>
        <strong>${formatMoney(sale.total)}</strong>
      </div>
      <div class="sale-meta">
        <span>Due: ${escapeHtml(sale.due || "-")}</span>
        <span>Phone: ${escapeHtml(sale.phone || "-")}</span>
        <span>Email: ${escapeHtml(sale.email || "-")}</span>
      </div>
      <div class="sale-items">
        ${sale.items.map((item) => `<p>${escapeHtml(item.name)} <strong>${formatMoney(item.amount)}</strong></p>`).join("")}
      </div>
      ${sale.note ? `<p class="sale-note">${escapeHtml(sale.note)}</p>` : ""}
      <button type="button" data-print-sale="${sale.id}">Print Quotation</button>
    </article>
  `).join("") : "<div class=\"identity-result\"><p>Belum ada sale. Tekan Book Now dekat mana-mana service untuk mula booking.</p></div>";
}

function printSaleQuotation(id) {
  const sale = getSales().find((item) => String(item.id) === String(id));
  if (!sale) return;
  printQuotation({ customer: sale.customer, valid: sale.due, items: sale.items, note: sale.note });
}

function downloadServiceImage(serviceIndex) {
  const serviceItem = getPricelist()[serviceIndex];
  const image = serviceItem?.image || "";
  if (!image) return;
  const link = document.createElement("a");
  const serviceName = (serviceItem.service || "pricelist").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  link.href = image;
  link.download = `${serviceName}.jpg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function copyPackagePrice(serviceIndex, packageIndex) {
  const serviceItem = getPricelist()[serviceIndex];
  const pkg = serviceItem?.packages?.[packageIndex];
  if (!serviceItem || !pkg) return;
  const text = `${serviceItem.service} - ${pkg.name}: ${formatMoney(pkg.amount)}${pkg.details ? `\n${pkg.details}` : ""}`;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  window.alert(`Copy price for ${serviceItem.service} - ${pkg.name}`);
}

function editPriceService(index) {
  const serviceItem = getPricelist()[index];
  if (!serviceItem) return;
  editingPriceServiceIndex = index;
  setPriceBuilderVisible(true);
  $("priceServiceName").value = serviceItem.service || "";
  $("packageCount").value = String(Math.min(Math.max(serviceItem.packages.length, 1), 3));
  $("priceSubmit").textContent = "Update Pricelist";
  renderPricePackageInputs(serviceItem.packages);
  $("priceServiceName").focus();
  window.alert(`Edit package untuk ${serviceItem.service}`);
}

function startPackageHold(card) {
  priceHoldTriggered = false;
  window.clearTimeout(priceHoldTimer);
  priceHoldTimer = window.setTimeout(() => {
    priceHoldTriggered = true;
    editPriceService(Number(card.dataset.serviceIndex));
  }, 5000);
}

function stopPackageHold() {
  window.clearTimeout(priceHoldTimer);
}

function handlePackageClick(card) {
  if (priceHoldTriggered) {
    priceHoldTriggered = false;
    return;
  }
  copyPackagePrice(Number(card.dataset.serviceIndex), Number(card.dataset.packageIndex));
}

function deletePriceItem(index) {
  const items = getPricelist();
  const serviceName = items[index]?.service || "service ini";
  if (!window.confirm(`Delete ${serviceName}?`)) return;
  items.splice(index, 1);
  setPricelist(items);
  if (editingPriceServiceIndex === index) resetPriceForm();
  renderPricelist();
}

function detectIdentityTypes(info, hasImage) {
  const types = [];
  if (/\+?\d[\d\s\-()]{7,}/.test(info)) types.push("Phone number");
  if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(info)) types.push("Email");
  if (/https?:\/\/|www\./i.test(info)) types.push("Link / social profile");
  if (/@[a-zA-Z0-9_.]{2,}/.test(info)) types.push("Username / handle");
  if (hasImage) types.push("Image attached");
  if (!types.length && info.trim()) types.push("General text");
  return types;
}

function analyzeIdentity(event) {
  event.preventDefault();
  const info = $("identityInput").value.trim();
  const hasImage = Boolean($("identityImage").files?.[0]);
  const purpose = $("identityPurpose").value;
  const types = detectIdentityTypes(info, hasImage);
  const risk = types.includes("Link / social profile") || types.includes("Phone number") ? "Medium" : "Low";
  const cleanPhone = (info.match(/\+?\d[\d\s\-()]{7,}/) || [""])[0].replace(/[^\d+]/g, "");

  $("identityResult").innerHTML = `
    <p><strong>Detected:</strong> ${escapeHtml(types.join(", ") || "Nothing yet")}</p>
    <p><strong>Purpose:</strong> ${escapeHtml(purpose)}</p>
    <p><strong>Risk:</strong> ${risk}</p>
    ${cleanPhone ? `<p><strong>Phone format:</strong> ${escapeHtml(cleanPhone)}</p>` : ""}
    <ul>
      <li>Analisis ini hanya guna info yang awak masukkan.</li>
      <li>Ia tidak mencari alamat, IC, lokasi, keluarga, atau data peribadi orang.</li>
      <li>Untuk safety/scam check, sahkan melalui sumber rasmi dan jangan dedahkan maklumat sensitif.</li>
    </ul>
  `;
}

function getYoutubeId(value) {
  const text = value.trim();
  if (!text) return "";
  if (/^[a-zA-Z0-9_-]{11}$/.test(text)) return text;

  try {
    const url = new URL(text);
    if (url.hostname.includes("youtu.be")) return url.pathname.split("/").filter(Boolean)[0] || "";
    if (url.searchParams.get("v")) return url.searchParams.get("v");
    const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
  } catch {}

  return "";
}

function openMusicPanel() {
  $("musicPanel").hidden = false;
  $("musicPanel").classList.remove("minimized");
  $("musicSearch").focus();
}

function closeMusicPanel() {
  $("musicPanel").hidden = true;
  $("musicPanel").classList.remove("minimized");
}

function minimizeMusicPanel() {
  $("musicPanel").classList.toggle("minimized");
}

function openYoutubeSearch() {
  showSongSuggestions();
}

function getLyricsKey(videoId) {
  return `lyrics-${videoId || "custom"}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

function loadLyrics(videoId, fallback) {
  $("lyricsText").value = storage.getItem(getLyricsKey(videoId)) || fallback || "";
}

function setYoutubeFallback(url) {
  $("youtubeFallback").href = url;
  $("youtubeFallback").hidden = false;
}

function getYoutubeWatchUrl(song) {
  if (song.videoId) return `https://www.youtube.com/watch?v=${song.videoId}`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(song.query || `${song.title} ${song.artist}`)}`;
}

function getYoutubeMusicUrl(song) {
  if (song.videoId) return `https://music.youtube.com/watch?v=${song.videoId}`;
  return `https://music.youtube.com/search?q=${encodeURIComponent(song.query || `${song.title} ${song.artist}`)}`;
}

function getYoutubeThumb(videoId) {
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "icon.svg";
}

function getVideoIdFromUrl(value) {
  const direct = getYoutubeId(value);
  if (direct) return direct;
  const match = String(value || "").match(/[?&]v=([a-zA-Z0-9_-]{11})|\/watch\/([a-zA-Z0-9_-]{11})|\/([a-zA-Z0-9_-]{11})$/);
  return match ? (match[1] || match[2] || match[3] || "") : "";
}

function showAlbumPlayer(song) {
  $("musicFrame").src = "";
  $("youtubeFallback").hidden = true;
  $("emptyVideo").hidden = true;
  $("albumPlayer").hidden = false;
  $("albumTitle").textContent = song.title;
  $("albumArtist").textContent = song.artist || "Unknown Artist";
  $("albumArt").src = song.artwork || "icon.svg";
  $("audioPlayer").src = song.previewUrl || "";
  $("audioPlayer").hidden = !song.previewUrl;
  $("musicCardLabel").textContent = song.title;

  if (song.previewUrl) {
    $("audioPlayer").play().catch(() => {});
  }
}

function showYoutubeAlbum(song) {
  const videoId = song.videoId || "";

  $("musicFrame").src = "";
  $("emptyVideo").hidden = true;
  $("albumPlayer").hidden = false;
  $("albumTitle").textContent = song.title;
  $("albumArtist").textContent = `${song.artist || "YouTube"} - buka untuk audio penuh`;
  $("albumArt").src = song.artwork || getYoutubeThumb(videoId);
  $("audioPlayer").removeAttribute("src");
  $("audioPlayer").hidden = true;
  $("musicCardLabel").textContent = song.title;
  $("youtubeFallback").hidden = true;
  $("lyricsTitle").textContent = `${song.title} - ${song.artist}`;
  storage.setItem("lastMusicVideo", videoId || song.query || song.title);
  storage.setItem("lastMusicTitle", `${song.title} - ${song.artist}`);
  loadLyrics(videoId || song.query || song.title, song.lyrics);
}

function showYoutubeVideo(song) {
  const videoId = song.videoId || "";
  const query = song.query || `${song.title} ${song.artist}`;

  $("albumPlayer").hidden = true;
  $("emptyVideo").hidden = true;
  $("musicFrame").src = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`
    : `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(query)}&autoplay=1&rel=0&playsinline=1`;
  setYoutubeFallback(getYoutubeWatchUrl(song));
  $("youtubeFallback").textContent = "Buka Video di YouTube";
  $("lyricsTitle").textContent = `${song.title} - ${song.artist}`;
  $("musicCardLabel").textContent = song.title;
  storage.setItem("lastMusicVideo", videoId || query);
  storage.setItem("lastMusicTitle", `${song.title} - ${song.artist}`);
  loadLyrics(videoId || query, song.lyrics);
}

function chooseLocalMusic() {
  $("localMusicFile").click();
}

function playLocalMusic(file) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  showAlbumPlayer({
    title: file.name.replace(/\.[^/.]+$/, ""),
    artist: "Full song from your file",
    artwork: "icon.svg",
    previewUrl: url,
    trackId: file.name,
    lyrics: "Paste lirik sendiri di sini, kemudian tekan Save Lirik."
  });
  $("lyricsTitle").textContent = file.name.replace(/\.[^/.]+$/, "");
}

function playSong(song) {
  if (musicMode === "video") {
    showYoutubeVideo(song);
    return;
  }

  if (song.previewUrl || song.artwork) {
    showAlbumPlayer(song);
    $("youtubeFallback").hidden = true;
    $("lyricsTitle").textContent = `${song.title} - ${song.artist}`;
    storage.setItem("lastMusicTitle", `${song.title} - ${song.artist}`);
    loadLyrics(song.trackId || song.previewUrl || song.title, song.lyrics);
    return;
  }

  showYoutubeAlbum(song);
}

function setMusicMode(mode) {
  musicMode = mode === "video" ? "video" : "music";
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === musicMode);
  });
}

function playYoutubeInput() {
  const query = $("musicSearch").value.trim();
  const videoId = getYoutubeId(query);

  if (videoId) {
    playSong({
      title: "YouTube Video",
      artist: "YouTube",
      videoId,
      artwork: getYoutubeThumb(videoId),
      lyrics: "Paste lirik sendiri di sini, kemudian tekan Save Lirik."
    });
    $("songResults").innerHTML = "";
    return;
  }

  showSongSuggestions();
}

function buildQuerySuggestions(query) {
  const clean = query.trim();
  if (!clean) return [];

  return [
    { title: clean, artist: "YouTube Search", query: clean, lyrics: "Paste lirik sendiri di sini, kemudian tekan Save Lirik." },
    { title: `${clean} official music video`, artist: "YouTube Search", query: `${clean} official music video`, lyrics: "Paste lirik sendiri di sini, kemudian tekan Save Lirik." },
    { title: `${clean} lyrics`, artist: "YouTube Search", query: `${clean} lyrics video`, lyrics: "Paste lirik sendiri di sini, kemudian tekan Save Lirik." }
  ];
}

function normalizeItunesSong(item) {
  return {
    title: item.trackName || item.collectionName || "Unknown Song",
    artist: item.artistName || "Unknown Artist",
    artwork: (item.artworkUrl100 || "").replace("100x100bb", "600x600bb"),
    previewUrl: item.previewUrl || "",
    trackId: String(item.trackId || item.collectionId || item.previewUrl || ""),
    lyrics: "Paste lirik sendiri di sini, kemudian tekan Save Lirik."
  };
}

async function searchOnlineSongs(rawQuery) {
  const response = await fetch(`https://itunes.apple.com/search?media=music&entity=song&limit=8&term=${encodeURIComponent(rawQuery)}`);
  if (!response.ok) throw new Error("Music search failed");
  const data = await response.json();
  return (data.results || []).map(normalizeItunesSong).filter((song) => song.previewUrl);
}

function normalizeVideoResult(item) {
  const videoId = getVideoIdFromUrl(item.url || item.link || item.id || "");
  return {
    title: item.title || "YouTube Video",
    artist: item.uploaderName || item.author || item.channelName || "YouTube",
    videoId,
    artwork: item.thumbnail || item.thumbnailUrl || getYoutubeThumb(videoId),
    lyrics: "Paste lirik sendiri di sini, kemudian tekan Save Lirik."
  };
}

async function searchYoutubeVideos(rawQuery) {
  const response = await fetch(`https://piped.video/api/v1/search?q=${encodeURIComponent(rawQuery)}&filter=videos`);
  if (!response.ok) throw new Error("Video search failed");
  const data = await response.json();
  return (data.items || data || [])
    .map(normalizeVideoResult)
    .filter((song) => song.videoId)
    .slice(0, 8);
}

async function showSongSuggestions() {
  const rawQuery = $("musicSearch").value.trim();
  if (!rawQuery) {
    $("songResults").innerHTML = "<button type=\"button\">Tulis tajuk lagu dulu</button>";
    return;
  }

  $("songResults").innerHTML = "<button type=\"button\">Mencari lagu...</button>";

  if (musicMode === "video") {
    try {
      const videos = await searchYoutubeVideos(rawQuery);
      if (videos.length) {
        renderSongSuggestions(videos);
        return;
      }
    } catch {}

    renderSongSuggestions(buildQuerySuggestions(rawQuery));
    showYoutubeVideo({ title: rawQuery, artist: "YouTube Search", query: rawQuery, lyrics: "Paste lirik sendiri di sini, kemudian tekan Save Lirik." });
    return;
  }

  try {
    const onlineSongs = await searchOnlineSongs(rawQuery);
    if (onlineSongs.length) {
      renderSongSuggestions(onlineSongs);
      return;
    }
  } catch {}

  const query = rawQuery.toLowerCase();
  const results = demoSongs.filter((song) => {
    const haystack = `${song.title} ${song.artist} ${song.query || ""}`.toLowerCase();
    return !query || haystack.includes(query);
  });
  const list = results.length ? results : buildQuerySuggestions(rawQuery);

  renderSongSuggestions(list);

  if (!list.length) {
    $("songResults").innerHTML = "<button type=\"button\">Tulis tajuk lagu dulu</button>";
  }
}

function renderSongSuggestions(list) {
  $("songResults").innerHTML = list.map((song, index) => (
    `<button type="button" data-song-index="${index}"><strong>${escapeHtml(song.title)}</strong><span>${escapeHtml(song.artist)}${song.previewUrl ? " - preview music" : " - search result"}</span></button>`
  )).join("");
  $("songResults").dataset.songSet = JSON.stringify(list);
}

function saveLyrics() {
  const currentVideo = storage.getItem("lastMusicVideo") || "custom";
  storage.setItem(getLyricsKey(currentVideo), $("lyricsText").value);
  window.alert("Lirik sudah disimpan.");
}

function setupInteractions() {
  document.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    const action = event.target.closest("[data-action]");
    const nav = event.target.closest("[data-nav]");
    const device = event.target.closest("[data-device]");
    const mode = event.target.closest("[data-mode]");

    if (nav) {
      handleNav(nav.dataset.nav);
      return;
    }

    if (mode) {
      setMusicMode(mode.dataset.mode);
      return;
    }

    if (tab) {
      switchView(tab.dataset.tab || "home", tab);
      setNavActive("home");
      return;
    }

    if (device) {
      toggleDevice(device.dataset.device);
      return;
    }

    if (!action) return;

    const type = action.dataset.action;
    if (type === "location") openLoveLocation();
    if (type === "whatsapp") openWhatsappChat();
    if (type === "video") openWhatsappVideo();
    if (type === "bio") openBioPanel();
    if (type === "closeBio") closeBioPanel();
    if (type === "birthdayNotify") requestBirthdayNotification();
    if (type === "music") openMusicPanel();
    if (type === "closeMusic") closeMusicPanel();
    if (type === "minimizeMusic") minimizeMusicPanel();
    if (type === "songSearch") playYoutubeInput();
    if (type === "chooseMusic") chooseLocalMusic();
    if (type === "saveLyrics") saveLyrics();
    if (type === "closePanel") closeNavPanel();
    if (type === "shareProjectChat") shareProjectChat();
    if (type === "resetApp") resetAppData();
    if (type === "downloadApp") downloadAppNow();
    if (type === "openCalendarNote") openCalendarNote();
    if (type === "identity") openIdentityPanel();
    if (type === "target") openTargetPanel();
    if (type === "companyDetail") openCompanyPanel();
    if (type === "priceList") openPricePanel();
    if (type === "project") openProjectPanel();
    if (type === "sales") openSalesPanel();
    if (type === "sop") openSopPanel();
    if (type === "achievement") openAchievementPanel();
    if (type === "addNewService") togglePriceBuilder();
    if (type === "cancelAddService") resetPriceForm();
    if (type === "restoreDefaultPricelist") restoreDefaultPricelist();
  });

  $("bookingPackageList").addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-toggle-booking-service]");
    if (!toggle) return;
    toggleBookingService(toggle.dataset.toggleBookingService);
  });

  $("priceList").addEventListener("click", (event) => {
    const bookButton = event.target.closest("[data-book-service]");
    if (bookButton) {
      openBookingPanel(Number(bookButton.dataset.bookService));
      return;
    }

    const downloadButton = event.target.closest("[data-download-service-image]");
    if (downloadButton) {
      downloadServiceImage(Number(downloadButton.dataset.downloadServiceImage));
      return;
    }

    const packageCard = event.target.closest("[data-package-card]");
    if (packageCard) {
      handlePackageClick(packageCard);
      return;
    }

    const button = event.target.closest("[data-delete-price]");
    if (!button) return;
    deletePriceItem(Number(button.dataset.deletePrice));
  });

  $("priceList").addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-download-service-image]")) return;
    const packageCard = event.target.closest("[data-package-card]");
    if (packageCard) startPackageHold(packageCard);
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    $("priceList").addEventListener(eventName, stopPackageHold);
  });

  $("salesList").addEventListener("click", (event) => {
    const printButton = event.target.closest("[data-print-sale]");
    if (!printButton) return;
    printSaleQuotation(printButton.dataset.printSale);
  });

  $("sopList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-sop]");
    if (!button) return;
    deleteSop(button.dataset.deleteSop);
  });

  $("achievementList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-achievement]");
    if (!button) return;
    deleteAchievement(button.dataset.deleteAchievement);
  });

  $("projectList").addEventListener("click", (event) => {
    const chatButton = event.target.closest("[data-open-project-chat]");
    if (!chatButton) return;
    openProjectChat(chatButton.dataset.openProjectChat);
  });

  $("projectList").addEventListener("change", (event) => {
    const status = event.target.closest("[data-project-status]");
    if (!status) return;
    updateProjectStatus(status.dataset.projectStatus, status.value);
  });

  $("targetList").addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete-target]");
    const transferButton = event.target.closest("[data-transfer-target]");
    if (deleteButton) deleteTarget(Number(deleteButton.dataset.deleteTarget));
    if (transferButton) markTargetTransfer(Number(transferButton.dataset.transferTarget));
  });

  $("targetList").addEventListener("change", (event) => {
    const reminder = event.target.closest("[data-target-reminder]");
    if (!reminder) return;
    toggleTargetReminder(Number(reminder.dataset.targetReminder), reminder.checked);
  });

  $("calendarGrid").addEventListener("click", (event) => {
    const day = event.target.closest("[data-calendar-day]");
    if (!day) return;
    selectCalendarDate(new Date(selectedCalendarDate.getFullYear(), selectedCalendarDate.getMonth(), Number(day.dataset.calendarDay)));
  });

  $("calendarDate").addEventListener("change", (event) => {
    if (event.target.value) selectCalendarDate(parseDateKey(event.target.value));
  });

  $("calendarMonth").addEventListener("change", (event) => {
    const day = Math.min(selectedCalendarDate.getDate(), new Date(selectedCalendarDate.getFullYear(), Number(event.target.value) + 1, 0).getDate());
    selectCalendarDate(new Date(selectedCalendarDate.getFullYear(), Number(event.target.value), day));
  });

  $("calendarYear").addEventListener("change", (event) => {
    const year = Number(event.target.value);
    const month = selectedCalendarDate.getMonth();
    const day = Math.min(selectedCalendarDate.getDate(), new Date(year, month + 1, 0).getDate());
    selectCalendarDate(new Date(year, month, day));
  });

  $("songResults").addEventListener("click", (event) => {
    const button = event.target.closest("[data-song-index]");
    if (!button) return;
    const list = JSON.parse($("songResults").dataset.songSet || "[]");
    const song = list[Number(button.dataset.songIndex)];
    if (song) playSong(song);
  });

  document.querySelector("[data-action='location']").addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLoveLocation();
    }
  });

  document.querySelector("[data-action='bio']").addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openBioPanel();
    }
  });

  document.querySelector("[data-action='music']").addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMusicPanel();
    }
  });

  $("musicSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      playYoutubeInput();
    }
  });

  $("localMusicFile").addEventListener("change", (event) => {
    playLocalMusic(event.target.files?.[0]);
  });

  $("bioForm").addEventListener("submit", (event) => {
    event.preventDefault();
    saveBioForm();
  });

  $("settingsForm").addEventListener("submit", (event) => {
    event.preventDefault();
    saveSettingsForm();
  });

  $("profileForm").addEventListener("submit", (event) => {
    event.preventDefault();
    saveProfileForm();
  });

  $("calendarNoteForm").addEventListener("submit", (event) => {
    event.preventDefault();
    saveCalendarNote();
  });

  $("identityForm").addEventListener("submit", analyzeIdentity);

  $("targetForm").addEventListener("submit", saveTarget);

  $("companyForm").addEventListener("submit", saveCompany);

  $("companyForm").addEventListener("click", (event) => copyCompanyField(event.target));

  $("priceForm").addEventListener("submit", addPriceItem);

  $("bookingForm").addEventListener("submit", saveBooking);

  $("projectChatForm").addEventListener("submit", saveProjectChat);

  $("sopForm").addEventListener("submit", saveSop);

  $("achievementForm").addEventListener("submit", saveAchievement);

  $("packageCount").addEventListener("change", () => renderPricePackageInputs());

  $("bankQrFile").addEventListener("change", (event) => {
    saveBankQr(event.target.files?.[0]);
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPromptEvent = event;
});

setDate();
setMainGreeting();
setMainQuote();
seedDefaultPricelist();
setupCalendarControls();
renderCalendar();
loadWeather();
applyProfile();
loadSettingsForm();
loadProfileForm();
refreshLoveLabels();
refreshBirthdayStatus();
refreshDeviceCards();
renderTargets();
checkBirthdayNotification();
checkCalendarNotifications();
checkSalaryNotifications();
window.setInterval(checkBirthdayNotification, 60 * 60 * 1000);
window.setInterval(checkCalendarNotifications, 60 * 60 * 1000);
window.setInterval(checkSalaryNotifications, 60 * 60 * 1000);
setupInteractions();
activateTab(getSettings().defaultTab || "home");
openSharedProjectChat();
$("refreshWeather").addEventListener("click", () => {
  const activeTab = document.querySelector(".tab.active")?.dataset.tab;
  if (activeTab === "lubuk") renderSaleSummary();
  else loadWeather();
});
