/* ============================================================
   Climate-life — frontend logikasi (Supabase bilan)
   ============================================================ */

/* 1. SUPABASE SOZLAMALARI */
const SUPABASE_URL = 'https://twcdwrcheytlhipvbrti.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y2R3cmNoZXl0bGhpcHZicnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MTE2MzMsImV4cCI6MjA5Njk4NzYzM30.iEkLD3yYX-D8YWcHKZiqO1meOqdrQekdqryxHTx1Ea4';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ---------- Yordamchilar ---------- */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => { t.classList.remove('show'); }, 3200);
}
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function formatDate(iso) {
  const d = new Date(iso);
  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}
function toggleEye(inputId, eyeEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const shown = input.type === 'text';
  input.type = shown ? 'password' : 'text';
  const el = (typeof eyeEl === 'string') ? document.getElementById(eyeEl) : eyeEl;
  if (el) el.textContent = shown ? '👁' : '🙈';
}

/* ============================================================
   2. OMMAVIY SAYT — ma'lumotlarni Supabase'dan o'qish
   ============================================================ */
const PROBLEMS = {
  xolodilnik: ["Sovutmayapti", "Juda ko'p sovutadi / muzlab qoladi", "Shovqin chiqaryapti", "Suv oqizadi", "Yorug'lik / displey ishlamaydi", "Eshik yaxshi yopilmaydi", "Boshqa nosozlik"],
  konditsaner: ["Sovutmayapti", "Isitmayapti", "Suv tomchilaydi / oqadi", "Shovqin yoki tebranish", "Yomon hid chiqaradi", "Pult / boshqaruv ishlamaydi", "Yoqilmayapti / o'chib qoladi", "Boshqa nosozlik"]
};

async function renderServices() {
  const el = document.getElementById('servicesGrid');
  const res = await sb.from('services').select('*').order('sort', { ascending: true });
  if (res.error) { el.innerHTML = '<div class="loading-row">Xizmatlarni yuklab bo\'lmadi</div>'; return; }
  el.innerHTML = (res.data || []).map((s) => {
    return '<div class="svc-card ' + (s.type || 't1') + '">'
      + (s.badge ? '<div class="svc-badge">' + escapeHtml(s.badge) + '</div>' : '')
      + '<div class="svc-ico">' + (s.icon || '🔧') + '</div>'
      + '<h3>' + escapeHtml(s.title) + '</h3><p>' + escapeHtml(s.description || '') + '</p>'
      + '<ul class="svc-list">' + (s.features || []).map((f) => '<li>' + escapeHtml(f) + '</li>').join('') + '</ul>'
      + '<div class="svc-price"><span class="from">Narx (boshlang\'ich)</span><span class="val">' + escapeHtml(s.price_from) + ' <small>so\'mdan</small></span></div></div>';
  }).join('') || '<div class="loading-row">Xizmatlar yo\'q</div>';
}
async function renderMasters() {
  const el = document.getElementById('mastersGrid');
  const res = await sb.from('masters').select('*').order('id', { ascending: true });
  if (res.error) { el.innerHTML = '<div class="loading-row">Yuklab bo\'lmadi</div>'; return; }
  el.innerHTML = (res.data || []).map((m) => {
    return '<div class="master-card"><div class="master-photo"><img src="' + escapeHtml(m.photo) + '" alt="' + escapeHtml(m.name) + '" onerror="this.src=\'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=300&q=80\'"></div>'
      + '<h4>' + escapeHtml(m.name) + '</h4><div class="master-role">' + escapeHtml(m.role) + '</div>'
      + '<div class="master-meta"><span>🛠 ' + escapeHtml(m.experience) + ' tajriba</span><span>✅ ' + escapeHtml(m.orders) + ' buyurtma</span></div>'
      + '<div class="master-stars">★★★★★ <span style="color:var(--muted);font-size:12px;font-weight:700;">' + escapeHtml(m.rating) + '</span></div>'
      + '<div class="master-tags" style="margin-top:10px;">' + (m.tags || []).map((t) => '<span class="mtag">' + escapeHtml(t) + '</span>').join('') + '</div></div>';
  }).join('') || '<div class="loading-row">Ustalar yo\'q</div>';
}
async function renderReviews() {
  const el = document.getElementById('reviewsGrid');
  const res = await sb.from('reviews').select('*').order('id', { ascending: true });
  if (res.error) { el.innerHTML = '<div class="loading-row" style="color:rgba(255,255,255,.5)">Yuklab bo\'lmadi</div>'; return; }
  el.innerHTML = (res.data || []).map((r) => {
    const initials = r.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return '<div class="review-card"><div class="review-stars">' + '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) + '</div>'
      + '<div class="review-text">"' + escapeHtml(r.text) + '"</div>'
      + '<div class="review-author"><div class="rauthor-avatar">' + escapeHtml(initials) + '</div>'
      + '<div><div class="rauthor-name">' + escapeHtml(r.name) + '</div><div class="rauthor-meta">' + escapeHtml(r.meta || '') + '</div></div></div></div>';
  }).join('') || '<div class="loading-row" style="color:rgba(255,255,255,.5)">Sharhlar yo\'q</div>';
}
async function renderFaq() {
  const el = document.getElementById('faqList');
  const res = await sb.from('faq').select('*').order('sort', { ascending: true });
  if (res.error) { el.innerHTML = '<div class="loading-row">Yuklab bo\'lmadi</div>'; return; }
  el.innerHTML = (res.data || []).map((f, i) => {
    return '<div class="faq-item" id="faq-' + i + '"><div class="faq-q" onclick="toggleFaq(' + i + ')"><span>' + escapeHtml(f.question) + '</span><span class="fplus">+</span></div><div class="faq-a">' + escapeHtml(f.answer) + '</div></div>';
  }).join('') || '<div class="loading-row">Savollar yo\'q</div>';
}
function toggleFaq(i) { document.getElementById('faq-' + i).classList.toggle('open'); }

function populateProblems(device) {
  const sel = document.getElementById('o-problem');
  const opts = PROBLEMS[device] || PROBLEMS.xolodilnik;
  sel.innerHTML = '<option value="">Tanlang...</option>' + opts.map((o) => '<option value="' + o + '">' + o + '</option>').join('');
}
function selectDevice(el) {
  document.querySelectorAll('.device-opt').forEach((d) => { d.classList.remove('active'); });
  el.classList.add('active');
  el.querySelector('input').checked = true;
  populateProblems(el.querySelector('input').value);
}
async function submitOrder() {
  const device = document.querySelector('input[name="device"]:checked').value;
  const problem = document.getElementById('o-problem').value;
  const name = document.getElementById('o-name').value.trim();
  const phone = document.getElementById('o-phone').value.trim();
  const address = document.getElementById('o-address').value.trim();
  const msg = document.getElementById('o-msg').value.trim();
  if (!problem) { showToast('❌ Nosozlik turini tanlang'); return; }
  if (!name) { showToast('❌ Ismingizni kiriting'); return; }
  if (!phone || phone.length < 7) { showToast('❌ Telefon raqamni to\'g\'ri kiriting'); return; }
  const btn = document.getElementById('orderSubmitBtn');
  btn.disabled = true; btn.textContent = '⏳ Yuborilmoqda...';
  const res = await sb.from('orders').insert([{ device, problem, name, phone, address, msg, status: 'yangi' }]);
  btn.disabled = false; btn.textContent = '🛠 Buyurtma berish';
  if (res.error) { showToast('❌ Xatolik: ' + res.error.message); return; }
  document.getElementById('formStep').style.display = 'none';
  document.getElementById('successPhone').textContent = phone;
  document.getElementById('formSuccess').classList.add('show');
}
function resetForm() {
  document.getElementById('formStep').style.display = 'block';
  document.getElementById('formSuccess').classList.remove('show');
  ['o-name', 'o-phone', 'o-address', 'o-msg'].forEach((id) => { document.getElementById(id).value = ''; });
  document.getElementById('o-problem').value = '';
  document.querySelectorAll('.device-opt')[0].click();
}
function toggleMobDrawer() { document.getElementById('mobDrawer').classList.toggle('open'); document.getElementById('overlay').classList.toggle('open'); }
function closeAll() { document.getElementById('mobDrawer').classList.remove('open'); document.getElementById('overlay').classList.remove('open'); }

/* ============================================================
   3. ADMIN — Supabase Auth bilan kirish
   ============================================================ */
function openAdmin() {
  closeAll();
  document.getElementById('public-site').style.display = 'none';
  sb.auth.getSession().then((res) => {
    if (res.data.session) { showAdminApp(); }
    else { document.getElementById('login-screen').classList.add('show'); }
  });
}
function closeAdmin() {
  document.getElementById('login-screen').classList.remove('show');
  document.getElementById('admin-app').classList.remove('show');
  document.getElementById('public-site').style.display = 'block';
  if (location.hash === '#admin') { history.replaceState(null, '', location.pathname); }
}
/* Admin login: oddiy "admin" loginini ichki email'ga bog'laymiz.
   Foydalanuvchi "admin" yozadi, Supabase'da esa quyidagi email saqlanadi. */
const ADMIN_LOGIN = 'admin';
const ADMIN_EMAIL = 'admin@climate-life.uz';

async function doLogin() {
  const loginInput = document.getElementById('lu').value.trim();
  const pass = document.getElementById('lp').value;
  // "admin" yozilsa ichki email'ga aylantiramiz; email yozilsa o'zini ishlatamiz
  const email = (loginInput.toLowerCase() === ADMIN_LOGIN) ? ADMIN_EMAIL : loginInput;
  const btn = document.getElementById('loginBtn');
  btn.disabled = true; btn.textContent = '⏳ ...';
  const res = await sb.auth.signInWithPassword({ email, password: pass });
  btn.disabled = false; btn.textContent = 'Kirish →';
  if (res.error) {
    const err = document.getElementById('login-err');
    err.style.display = 'block';
    setTimeout(() => { err.style.display = 'none'; }, 3000);
    return;
  }
  document.getElementById('lp').value = '';
  showAdminApp();
}
function showAdminApp() {
  document.getElementById('login-screen').classList.remove('show');
  document.getElementById('admin-app').classList.add('show');
  initAdmin();
}
async function doLogout() {
  await sb.auth.signOut();
  document.getElementById('admin-app').classList.remove('show');
  document.getElementById('lu').value = ''; document.getElementById('lp').value = '';
  closeAdmin();
}
function toggleAdminSidebar() {
  document.getElementById('aside').classList.toggle('mob-open');
  document.getElementById('amobOverlay').classList.toggle('open');
}

/* ---------- Admin: jadval operatorlari ---------- */
async function aGet(table, order) {
  let q = sb.from(table).select('*');
  if (order) q = q.order(order.col, { ascending: order.asc !== false });
  const res = await q;
  if (res.error) { showToast('❌ ' + res.error.message); return []; }
  return res.data || [];
}

/* ---------- Sahifa navigatsiyasi ---------- */
function goPage(p, btn) {
  document.querySelectorAll('.apage').forEach((el) => { el.classList.remove('on'); });
  document.querySelectorAll('.anav').forEach((b) => { b.classList.remove('on'); });
  document.getElementById('ap-' + p).classList.add('on');
  if (btn) btn.classList.add('on');
  if (p === 'dashboard') { refreshStats(); renderDashOrders(); }
  if (p === 'orders') renderOrdersTable();
  if (p === 'services') renderServicesGrid();
  if (p === 'masters') renderMastersGrid();
  if (p === 'reviews') renderReviewsGrid();
  if (p === 'faq') renderFaqAdmin();
  document.getElementById('aside').classList.remove('mob-open');
  document.getElementById('amobOverlay').classList.remove('open');
}
function goPageByName(p) {
  const idx = { dashboard: 0, orders: 1, services: 2, masters: 3, reviews: 4, faq: 5 }[p];
  const btns = document.querySelectorAll('.anav');
  goPage(p, btns[idx]);
}

const STATUS_LABELS = { yangi: '🆕 Yangi', jarayonda: '⏳ Jarayonda', bajarildi: '✅ Bajarildi', bekor: '❌ Bekor qilindi' };
const STATUS_BADGE = { yangi: 'tbadge-red', jarayonda: 'tbadge-blue', bajarildi: 'tbadge-green', bekor: 'tbadge-gray' };
const DEVICE_LABELS = { xolodilnik: '🧊 Xolodilnik', konditsaner: '🫧 Konditsaner' };

let ordersCache = [];

async function refreshStats() {
  const orders = await aGet('orders');
  let yangi = 0, jarayonda = 0, bajarildi = 0;
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].status === 'yangi') yangi++;
    else if (orders[i].status === 'jarayonda') jarayonda++;
    else if (orders[i].status === 'bajarildi') bajarildi++;
  }
  document.getElementById('st-total').textContent = orders.length;
  document.getElementById('st-new').textContent = yangi;
  document.getElementById('st-process').textContent = jarayonda;
  document.getElementById('st-done').textContent = bajarildi;
  const navCount = document.getElementById('navOrderCount');
  if (yangi > 0) { navCount.style.display = 'flex'; navCount.textContent = yangi; } else { navCount.style.display = 'none'; }
}
async function renderDashOrders() {
  const orders = (await aGet('orders', { col: 'created_at', asc: false })).slice(0, 6);
  const tbody = document.getElementById('dash-orders-tbody');
  if (!orders.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:30px;">Hozircha buyurtmalar yo\'q</td></tr>'; return; }
  tbody.innerHTML = orders.map((o) => {
    return '<tr><td>' + formatDate(o.created_at) + '</td><td><strong>' + escapeHtml(o.name) + '</strong></td><td><a class="phone-link" href="tel:' + escapeHtml(o.phone) + '">' + escapeHtml(o.phone) + '</a></td><td>' + (DEVICE_LABELS[o.device] || escapeHtml(o.device)) + '</td><td>' + escapeHtml(o.problem) + '</td><td><span class="tbadge ' + (STATUS_BADGE[o.status] || 'tbadge-gray') + '">' + (STATUS_LABELS[o.status] || escapeHtml(o.status)) + '</span></td></tr>';
  }).join('');
}

let orderFilter = 'all';
function setOrderFilter(f, btn) {
  orderFilter = f;
  document.querySelectorAll('[id^="of-"]').forEach((b) => { b.className = 'btn btn-gray btn-sm'; });
  btn.className = 'btn btn-orange btn-sm';
  renderOrdersTable();
}
async function renderOrdersTable() {
  const q = (document.getElementById('order-search').value || '').toLowerCase();
  let orders = await aGet('orders', { col: 'created_at', asc: false });
  if (orderFilter !== 'all') { orders = orders.filter((o) => o.status === orderFilter); }
  if (q) { orders = orders.filter((o) => (o.name || '').toLowerCase().indexOf(q) > -1 || (o.phone || '').toLowerCase().indexOf(q) > -1 || (o.problem || '').toLowerCase().indexOf(q) > -1); }
  document.getElementById('orders-count-lbl').textContent = orders.length + ' ta buyurtma';
  const tbody = document.getElementById('orders-tbody');
  if (!orders.length) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:40px;">Buyurtmalar topilmadi</td></tr>'; return; }
  ordersCache = orders;
  tbody.innerHTML = orders.map((o) => {
    const rowClass = o.status === 'yangi' ? ' class="new-order"' : '';
    let statusOptions = '';
    for (const key in STATUS_LABELS) { statusOptions += '<option value="' + key + '"' + (key === o.status ? ' selected' : '') + '>' + STATUS_LABELS[key] + '</option>'; }
    return '<tr' + rowClass + '><td>' + formatDate(o.created_at) + '</td><td><strong style="cursor:pointer;" onclick="viewOrder(' + o.id + ')">' + escapeHtml(o.name) + '</strong></td><td><a class="phone-link" href="tel:' + escapeHtml(o.phone) + '">' + escapeHtml(o.phone) + '</a></td><td>' + (DEVICE_LABELS[o.device] || escapeHtml(o.device)) + '</td><td>' + escapeHtml(o.problem) + '</td><td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (o.address ? escapeHtml(o.address) : '-') + '</td><td><select class="status-select" onchange="updateOrderStatus(' + o.id + ', this.value)">' + statusOptions + '</select></td><td><div class="tactions"><button class="btn btn-gray btn-sm" onclick="viewOrder(' + o.id + ')">👁</button><button class="btn btn-red btn-sm" onclick="delOrder(' + o.id + ')">🗑</button></div></td></tr>';
  }).join('');
}
async function updateOrderStatus(id, status) {
  const res = await sb.from('orders').update({ status }).eq('id', id);
  if (res.error) { showToast('❌ ' + res.error.message); return; }
  refreshStats(); renderOrdersTable(); showToast('✅ Holat yangilandi');
}
function viewOrder(id) {
  const o = ordersCache.find((x) => x.id === id);
  if (!o) return;
  document.getElementById('order-detail').innerHTML =
    '<div class="detail-row"><div class="dk">Sana</div><div class="dv">' + formatDate(o.created_at) + '</div></div>'
    + '<div class="detail-row"><div class="dk">Mijoz</div><div class="dv">' + escapeHtml(o.name) + '</div></div>'
    + '<div class="detail-row"><div class="dk">Telefon</div><div class="dv"><a class="phone-link" href="tel:' + escapeHtml(o.phone) + '">' + escapeHtml(o.phone) + '</a></div></div>'
    + '<div class="detail-row"><div class="dk">Texnika</div><div class="dv">' + (DEVICE_LABELS[o.device] || escapeHtml(o.device)) + '</div></div>'
    + '<div class="detail-row"><div class="dk">Nosozlik</div><div class="dv">' + escapeHtml(o.problem) + '</div></div>'
    + '<div class="detail-row"><div class="dk">Manzil</div><div class="dv">' + (o.address ? escapeHtml(o.address) : "Kiritilmagan") + '</div></div>'
    + '<div class="detail-row"><div class="dk">Izoh</div><div class="dv">' + (o.msg ? escapeHtml(o.msg) : "Yo'q") + '</div></div>'
    + '<div class="detail-row"><div class="dk">Holat</div><div class="dv"><span class="tbadge ' + (STATUS_BADGE[o.status] || 'tbadge-gray') + '">' + (STATUS_LABELS[o.status] || escapeHtml(o.status)) + '</span></div></div>';
  document.getElementById('order-modal').classList.add('open');
}
async function delOrder(id) {
  if (!confirm("Buyurtmani o'chirishni tasdiqlaysizmi?")) return;
  const res = await sb.from('orders').delete().eq('id', id);
  if (res.error) { showToast('❌ ' + res.error.message); return; }
  refreshStats(); renderOrdersTable(); renderDashOrders(); showToast("🗑 Buyurtma o'chirildi");
}
async function clearOrders() {
  if (!confirm("Barcha buyurtmalar o'chirilsinmi?")) return;
  const res = await sb.from('orders').delete().neq('id', 0);
  if (res.error) { showToast('❌ ' + res.error.message); return; }
  refreshStats(); renderOrdersTable(); renderDashOrders(); showToast("🗑 Buyurtmalar tozalandi");
}

/* ---------- Xizmatlar (admin) ---------- */
async function renderServicesGrid() {
  const services = await aGet('services', { col: 'sort', asc: true });
  document.getElementById('services-count-lbl').textContent = services.length + ' ta xizmat';
  document.getElementById('services-grid').innerHTML = services.map((s) => {
    return '<div class="item-card"><div class="ic-ico">' + escapeHtml(s.icon || '🔧') + '</div><h4>' + escapeHtml(s.title) + '</h4><div class="ic-sub">' + escapeHtml(s.price_from) + " so'mdan" + (s.badge ? ' · <span class="tbadge tbadge-orange">' + escapeHtml(s.badge) + '</span>' : '') + '</div><div class="ic-text">' + escapeHtml(s.description || '') + '</div><div class="ic-actions"><button class="btn btn-gray btn-sm" onclick="editService(' + s.id + ')">✏️ Tahrir</button><button class="btn btn-red btn-sm" onclick="delService(' + s.id + ')">🗑</button></div></div>';
  }).join('') || '<div class="loading-row">Xizmatlar yo\'q</div>';
}
function openAddService() {
  document.getElementById('sm-title').textContent = "Yangi xizmat qo'shish";
  document.getElementById('sm-edit-id').value = '';
  ['sm-icon', 'sm-title-input', 'sm-desc', 'sm-features', 'sm-price'].forEach((id) => { document.getElementById(id).value = ''; });
  document.getElementById('sm-type').value = 't1';
  document.getElementById('sm-badge').value = '';
  document.getElementById('service-modal').classList.add('open');
}
async function editService(id) {
  const s = (await aGet('services')).find((x) => x.id === id);
  if (!s) return;
  document.getElementById('sm-title').textContent = "Xizmatni tahrirlash";
  document.getElementById('sm-edit-id').value = id;
  document.getElementById('sm-icon').value = s.icon || '';
  document.getElementById('sm-type').value = s.type || 't1';
  document.getElementById('sm-title-input').value = s.title || '';
  document.getElementById('sm-desc').value = s.description || '';
  document.getElementById('sm-features').value = (s.features || []).join(', ');
  document.getElementById('sm-price').value = s.price_from || '';
  document.getElementById('sm-badge').value = s.badge || '';
  document.getElementById('service-modal').classList.add('open');
}
async function saveService() {
  const editId = document.getElementById('sm-edit-id').value;
  const title = document.getElementById('sm-title-input').value.trim();
  const price = document.getElementById('sm-price').value.trim();
  if (!title) { showToast("❌ Sarlavhani kiriting"); return; }
  if (!price) { showToast("❌ Narxni kiriting"); return; }
  const obj = {
    icon: document.getElementById('sm-icon').value.trim() || '🔧',
    type: document.getElementById('sm-type').value,
    title,
    description: document.getElementById('sm-desc').value.trim(),
    features: document.getElementById('sm-features').value.split(',').map((s) => s.trim()).filter((s) => s),
    price_from: price,
    badge: document.getElementById('sm-badge').value
  };
  const res = editId ? await sb.from('services').update(obj).eq('id', parseInt(editId, 10)) : await sb.from('services').insert([obj]);
  if (res.error) { showToast('❌ ' + res.error.message); return; }
  renderServicesGrid(); closeModal('service-modal'); showToast('✅ Xizmat ' + (editId ? 'yangilandi' : "qo'shildi"));
}
async function delService(id) {
  if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
  const res = await sb.from('services').delete().eq('id', id);
  if (res.error) { showToast('❌ ' + res.error.message); return; }
  renderServicesGrid(); showToast("🗑 Xizmat o'chirildi");
}

/* ---------- Ustalar (admin) ---------- */
async function renderMastersGrid() {
  const masters = await aGet('masters', { col: 'id', asc: true });
  document.getElementById('masters-count-lbl').textContent = masters.length + ' ta usta';
  document.getElementById('masters-grid').innerHTML = masters.map((m) => {
    return '<div class="item-card"><img class="ic-photo" src="' + escapeHtml(m.photo) + '" alt="' + escapeHtml(m.name) + '" onerror="this.src=\'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=120&q=80\'"><h4>' + escapeHtml(m.name) + '</h4><div class="ic-sub">' + escapeHtml(m.role) + '</div><div class="ic-text">🛠 ' + escapeHtml(m.experience) + ' · ✅ ' + escapeHtml(m.orders) + ' · ⭐ ' + escapeHtml(m.rating) + '</div><div class="ic-actions"><button class="btn btn-gray btn-sm" onclick="editMaster(' + m.id + ')">✏️ Tahrir</button><button class="btn btn-red btn-sm" onclick="delMaster(' + m.id + ')">🗑</button></div></div>';
  }).join('') || '<div class="loading-row">Ustalar yo\'q</div>';
}
function previewMasterPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast("❌ Rasm 2MB dan kichik bo'lsin"); input.value = ''; return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('mm-photo').value = e.target.result;
    const prev = document.getElementById('mm-photo-preview');
    prev.src = e.target.result; prev.style.display = 'block';
  };
  reader.readAsDataURL(file);
}
function openAddMaster() {
  document.getElementById('mm-title').textContent = "Yangi usta qo'shish";
  document.getElementById('mm-edit-id').value = '';
  ['mm-name', 'mm-role', 'mm-photo', 'mm-exp', 'mm-orders', 'mm-rating', 'mm-tags'].forEach((id) => { document.getElementById(id).value = ''; });
  document.getElementById('mm-photo-file').value = '';
  document.getElementById('mm-photo-preview').style.display = 'none';
  document.getElementById('master-modal').classList.add('open');
}
async function editMaster(id) {
  const m = (await aGet('masters')).find((x) => x.id === id);
  if (!m) return;
  document.getElementById('mm-title').textContent = "Ustani tahrirlash";
  document.getElementById('mm-edit-id').value = id;
  document.getElementById('mm-name').value = m.name || '';
  document.getElementById('mm-role').value = m.role || '';
  document.getElementById('mm-photo').value = m.photo || '';
  document.getElementById('mm-exp').value = m.experience || '';
  document.getElementById('mm-orders').value = m.orders || '';
  document.getElementById('mm-rating').value = m.rating || '';
  document.getElementById('mm-tags').value = (m.tags || []).join(', ');
  document.getElementById('mm-photo-file').value = '';
  const prev = document.getElementById('mm-photo-preview');
  if (m.photo) { prev.src = m.photo; prev.style.display = 'block'; } else { prev.style.display = 'none'; }
  document.getElementById('master-modal').classList.add('open');
}
async function saveMaster() {
  const editId = document.getElementById('mm-edit-id').value;
  const name = document.getElementById('mm-name').value.trim();
  const role = document.getElementById('mm-role').value.trim();
  const photo = document.getElementById('mm-photo').value.trim();
  if (!name || !role) { showToast("❌ Ism va lavozimni kiriting"); return; }
  if (!photo) { showToast("❌ Galereyadan rasm tanlang"); return; }
  const obj = {
    name, role, photo,
    experience: document.getElementById('mm-exp').value.trim() || '1 yil',
    orders: document.getElementById('mm-orders').value.trim() || '0',
    rating: document.getElementById('mm-rating').value.trim() || '4.5',
    tags: document.getElementById('mm-tags').value.split(',').map((s) => s.trim()).filter((s) => s)
  };
  const res = editId ? await sb.from('masters').update(obj).eq('id', parseInt(editId, 10)) : await sb.from('masters').insert([obj]);
  if (res.error) { showToast('❌ ' + res.error.message); return; }
  renderMastersGrid(); closeModal('master-modal'); showToast('✅ Usta ' + (editId ? 'yangilandi' : "qo'shildi"));
}
async function delMaster(id) {
  if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
  const res = await sb.from('masters').delete().eq('id', id);
  if (res.error) { showToast('❌ ' + res.error.message); return; }
  renderMastersGrid(); showToast("🗑 Usta o'chirildi");
}

/* ---------- Sharhlar (admin) ---------- */
async function renderReviewsGrid() {
  const reviews = await aGet('reviews', { col: 'id', asc: true });
  document.getElementById('reviews-count-lbl').textContent = reviews.length + ' ta sharh';
  document.getElementById('reviews-grid').innerHTML = reviews.map((r) => {
    let stars = '';
    for (let k = 0; k < 5; k++) { stars += (k < r.rating) ? '★' : '☆'; }
    return '<div class="item-card"><div class="ic-stars">' + stars + '</div><h4>' + escapeHtml(r.name) + '</h4><div class="ic-sub">' + escapeHtml(r.meta || '') + '</div><div class="ic-text">"' + escapeHtml(r.text) + '"</div><div class="ic-actions"><button class="btn btn-gray btn-sm" onclick="editReview(' + r.id + ')">✏️ Tahrir</button><button class="btn btn-red btn-sm" onclick="delReview(' + r.id + ')">🗑</button></div></div>';
  }).join('') || '<div class="loading-row">Sharhlar yo\'q</div>';
}
function openAddReview() {
  document.getElementById('rm-title').textContent = "Yangi sharh qo'shish";
  document.getElementById('rm-edit-id').value = '';
  ['rm-name', 'rm-meta', 'rm-text'].forEach((id) => { document.getElementById(id).value = ''; });
  document.getElementById('rm-rating').value = '5';
  document.getElementById('review-modal').classList.add('open');
}
async function editReview(id) {
  const r = (await aGet('reviews')).find((x) => x.id === id);
  if (!r) return;
  document.getElementById('rm-title').textContent = "Sharhni tahrirlash";
  document.getElementById('rm-edit-id').value = id;
  document.getElementById('rm-name').value = r.name || '';
  document.getElementById('rm-meta').value = r.meta || '';
  document.getElementById('rm-rating').value = r.rating || 5;
  document.getElementById('rm-text').value = r.text || '';
  document.getElementById('review-modal').classList.add('open');
}
async function saveReview() {
  const editId = document.getElementById('rm-edit-id').value;
  const name = document.getElementById('rm-name').value.trim();
  const text = document.getElementById('rm-text').value.trim();
  if (!name || !text) { showToast("❌ Ism va sharh matnini kiriting"); return; }
  const obj = { name, meta: document.getElementById('rm-meta').value.trim(), rating: parseInt(document.getElementById('rm-rating').value, 10) || 5, text };
  const res = editId ? await sb.from('reviews').update(obj).eq('id', parseInt(editId, 10)) : await sb.from('reviews').insert([obj]);
  if (res.error) { showToast('❌ ' + res.error.message); return; }
  renderReviewsGrid(); closeModal('review-modal'); showToast('✅ Sharh ' + (editId ? 'yangilandi' : "qo'shildi"));
}
async function delReview(id) {
  if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
  const res = await sb.from('reviews').delete().eq('id', id);
  if (res.error) { showToast('❌ ' + res.error.message); return; }
  renderReviewsGrid(); showToast("🗑 Sharh o'chirildi");
}

/* ---------- FAQ (admin) ---------- */
async function renderFaqAdmin() {
  const faq = await aGet('faq', { col: 'sort', asc: true });
  document.getElementById('faq-count-lbl').textContent = faq.length + ' ta savol';
  document.getElementById('faq-list-admin').innerHTML = faq.map((f) => {
    return '<div class="item-card" style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;"><div style="flex:1;min-width:0;"><h4>' + escapeHtml(f.question) + '</h4><div class="ic-text" style="-webkit-line-clamp:2;">' + escapeHtml(f.answer) + '</div></div><div class="ic-actions" style="margin-top:0;flex-shrink:0;"><button class="btn btn-gray btn-sm" onclick="editFaq(' + f.id + ')">✏️</button><button class="btn btn-red btn-sm" onclick="delFaq(' + f.id + ')">🗑</button></div></div>';
  }).join('') || '<div class="loading-row">Savollar yo\'q</div>';
}
function openAddFaq() {
  document.getElementById('fm-title').textContent = "Yangi savol qo'shish";
  document.getElementById('fm-edit-id').value = '';
  document.getElementById('fm-q').value = '';
  document.getElementById('fm-a').value = '';
  document.getElementById('faq-modal').classList.add('open');
}
async function editFaq(id) {
  const f = (await aGet('faq')).find((x) => x.id === id);
  if (!f) return;
  document.getElementById('fm-title').textContent = "Savolni tahrirlash";
  document.getElementById('fm-edit-id').value = id;
  document.getElementById('fm-q').value = f.question || '';
  document.getElementById('fm-a').value = f.answer || '';
  document.getElementById('faq-modal').classList.add('open');
}
async function saveFaq() {
  const editId = document.getElementById('fm-edit-id').value;
  const q = document.getElementById('fm-q').value.trim();
  const a = document.getElementById('fm-a').value.trim();
  if (!q || !a) { showToast("❌ Savol va javobni kiriting"); return; }
  const obj = { question: q, answer: a };
  const res = editId ? await sb.from('faq').update(obj).eq('id', parseInt(editId, 10)) : await sb.from('faq').insert([obj]);
  if (res.error) { showToast('❌ ' + res.error.message); return; }
  renderFaqAdmin(); closeModal('faq-modal'); showToast('✅ Savol ' + (editId ? 'yangilandi' : "qo'shildi"));
}
async function delFaq(id) {
  if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
  const res = await sb.from('faq').delete().eq('id', id);
  if (res.error) { showToast('❌ ' + res.error.message); return; }
  renderFaqAdmin(); showToast("🗑 Savol o'chirildi");
}

function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function initAdmin() {
  goPage('dashboard', document.querySelectorAll('.anav')[0]);
}

/* ============================================================
   4. ISHGA TUSHIRISH
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderServices(); renderMasters(); renderReviews(); renderFaq();
  populateProblems('xolodilnik');
  document.getElementById('lp').addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });
  document.getElementById('lu').addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });
  ['order-modal', 'service-modal', 'master-modal', 'review-modal', 'faq-modal'].forEach((id) => {
    document.getElementById(id).addEventListener('click', function (e) { if (e.target === this) closeModal(id); });
  });
  if (location.hash === '#admin') { openAdmin(); }
});
