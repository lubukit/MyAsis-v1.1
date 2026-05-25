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
const settingsFields = ["homeName", "weatherPlace", "defaultTab", "tempUnit", "birthdayNotify"];
let musicMode = "music";
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

function setDate() {
  $("today").textContent = new Intl.DateTimeFormat("en-MY", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date());
}

function updateWeatherIcon(condition) {
  const icon = $("weatherIcon");
  icon.classList.toggle("rain", /Rain|Shower|Storm|Drizzle/i.test(condition));
  icon.classList.toggle("clear", /Clear/i.test(condition));
}

function updateWeather(data, placeLabel) {
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
    birthdayNotify: false
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
  const settings = {};
  settingsFields.forEach((field) => {
    if (!form.elements[field]) return;
    settings[field] = form.elements[field].type === "checkbox"
      ? form.elements[field].checked
      : (form.elements[field].value || "").trim();
  });
  setSettings(settings);
  applyProfile();
  loadWeather();
  window.alert("Settings disimpan.");
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

function switchView(view, activeTab) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab === activeTab);
  });
  $("homeView").hidden = view !== "home";
  $("loveView").hidden = view !== "love";
  $("personalView").hidden = view !== "personal";
}

function activateTab(view) {
  const tab = [...document.querySelectorAll(".tab")].find((item) => item.dataset.tab === view) || document.querySelector(".tab");
  switchView(tab.dataset.tab || "home", tab);
}

function closeAllPanels() {
  ["usagePanel", "settingsPanel", "profilePanel", "bioPanel", "musicPanel"].forEach((id) => {
    if ($(id)) $(id).hidden = true;
  });
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
  ["profile", "settings", "devices", "loveBio", "loveWhatsapp", "loveLocation"].forEach((key) => storage.removeItem(key));
  setDeviceStates(defaultDevices);
  loadProfileForm();
  loadSettingsForm();
  refreshLoveLabels();
  refreshDeviceCards();
  activateTab("home");
  closeAllPanels();
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
    if (type === "closePanel") closeAllPanels();
    if (type === "resetApp") resetAppData();
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
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

setDate();
loadWeather();
applyProfile();
loadSettingsForm();
loadProfileForm();
refreshLoveLabels();
refreshBirthdayStatus();
refreshDeviceCards();
checkBirthdayNotification();
window.setInterval(checkBirthdayNotification, 60 * 60 * 1000);
setupInteractions();
activateTab(getSettings().defaultTab || "home");
$("refreshWeather").addEventListener("click", loadWeather);
