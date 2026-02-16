/* booking.js
 - dashboard rendering
 - booking modal + payment modal
 - store bookings in localStorage
 - prevent double booking
 - user-specific bookings
 - cancelation rule: can cancel >=1 hour before -> refund if paid
*/

function el(id){ return document.getElementById(id); }

function shortDate(ts){
  const d = new Date(ts);
  const pad = n => String(n).padStart(2,'0');
  return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* =========================
   DASHBOARD INIT
========================= */
function dashboardInit(){
  if (typeof requireAuth !== "function") {
    alert("Authentication system error");
    return;
  }
  if(!requireAuth()) return;

  const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if(u) el('userName').textContent = u.name;

  renderDashboard();
  renderBookingsList();
}

/* =========================
   DASHBOARD RENDER
========================= */
function renderDashboard(){
  const grid = el('placesGrid');
  grid.innerHTML = '';

  parkingPlaces.forEach(p => {
    const availableSpots = Math.floor(Math.random()*50)+1;

    const node = document.createElement('div');
    node.className='card';

    node.innerHTML = `
      <div class="title">${p.name}</div>
      <div class="meta">${p.city}</div>
      <div class="meta">Available spots: ${availableSpots}</div>
      <div class="price">${p.pricePerHour>0 ? p.pricePerHour.toFixed(2)+' €/h' : 'Visitor free'}</div>
      <div class="pay">Free: ${p.freeMinutes} min • ${p.paymentMethods.join(', ')}</div>
      <div class="card-footer">
        <div style="flex:1"></div>
        <button class="btn" onclick="openBookingModal('${p.id}')">Book</button>
        <button class="btn outline" onclick="openDetails('${p.id}')">Details</button>
      </div>
    `;
    grid.appendChild(node);
  });
}

/* =========================
   DETAILS MODAL
========================= */
function openDetails(id){
  const p = parkingPlaces.find(x=>x.id===id);
  el('detailsTitle').textContent = p.name;
  el('detailsBody').innerHTML = `
    <p><strong>City:</strong> ${p.city}</p>
    <p><strong>Price / h:</strong> ${p.pricePerHour} €</p>
    <p><strong>Free minutes:</strong> ${p.freeMinutes} min</p>
    <p><strong>Payment:</strong> ${p.paymentMethods.join(', ')}</p>
  `;
  showModal('detailsBackdrop', true);
}

/* =========================
   BOOKING MODAL
========================= */
function openBookingModal(placeId){
  const p = parkingPlaces.find(x=>x.id===placeId);
  el('bk_placeId').value = p.id;
  el('bk_placeName').textContent = p.name;
  el('bk_city').textContent = p.city;
  el('bk_price').textContent = p.pricePerHour>0 ? p.pricePerHour.toFixed(2)+' €/h' : 'Free';
  el('bk_method').innerHTML = p.paymentMethods.map(m=>`<option value="${m}">${m}</option>`).join('');
  el('bk_time').value = '';
  el('bk_duration').value = '1';
  el('bk_plate').value = '';
  computeBookingPrice();
  showModal('bookingBackdrop', true);
}

function computeBookingPrice(){
  const pid = el('bk_placeId').value;
  const p = parkingPlaces.find(x=>x.id===pid);
  const duration = parseFloat(el('bk_duration').value) || 0;

  let total = p.pricePerHour * duration;

  if(p.freeMinutes && duration*60 <= p.freeMinutes){
    total = 0;
  }

  el('bk_total').textContent = total.toFixed(2) + ' €';
}

/* =========================
   PAYMENT
========================= */
function bookingConfirmNext(){
  const method = el('bk_method').value;

  if(method && method.toLowerCase().includes('card')){
    el('pay_amount').textContent = el('bk_total').textContent;
    showModal('paymentBackdrop', true);
  } else {
    saveBooking(false);
  }
}

function processCardPayment(){
  const num = el('card_number').value.trim().replace(/\s/g,'');
  const name = el('card_name').value.trim();
  const exp = el('card_exp').value.trim();
  const cvv = el('card_cvv').value.trim();

  if(!num || !name || !exp || !cvv){
    showToast('Please fill card details');
    return;
  }

  if(!/^\d{12,19}$/.test(num)){
    showToast('Invalid card format');
    return;
  }

  showModal('paymentBackdrop', false);
  showToast('Payment successful');
  saveBooking(true);
}

/* =========================
   SAVE BOOKING
========================= */
function saveBooking(paid){
  const pid = el('bk_placeId').value;
  const p = parkingPlaces.find(x=>x.id===pid);
  const timeVal = el('bk_time').value;
  const duration = parseFloat(el('bk_duration').value);
  const plate = el('bk_plate').value.trim();
  const method = el('bk_method').value;

  if(!timeVal || !duration || !plate){
    showToast('Fill time, duration and car plate');
    return;
  }

  const arr = JSON.parse(localStorage.getItem('bookings') || '[]');

  // 🔥 Prevent double booking
  const conflict = arr.find(b =>
    b.placeId === pid &&
    !b.cancelled &&
    new Date(b.time).getTime() === new Date(timeVal).getTime()
  );

  if(conflict){
    showToast('This time slot is already booked');
    return;
  }

  let total = p.pricePerHour * duration;

  if(p.freeMinutes && duration*60 <= p.freeMinutes){
    total = 0;
  }

  const curUser = JSON.parse(localStorage.getItem('currentUser'));

  const booking = {
    id: 'bk_'+Date.now(),
    userEmail: curUser.email,
    placeId: p.id,
    placeName: p.name,
    city: p.city,
    time: timeVal,
    duration,
    plate,
    paymentMethod: method,
    total: parseFloat(total.toFixed(2)),
    paid: !!paid,
    cancelled:false,
    refunded:false
  };

  arr.push(booking);
  localStorage.setItem('bookings', JSON.stringify(arr));

  showModal('bookingBackdrop', false);
  showToast('Booking saved');
  renderBookingsList();
}

/* =========================
   BOOKING LIST
========================= */
function renderBookingsList(){
  const box = el('bookingList');
  const curUser = JSON.parse(localStorage.getItem('currentUser'));
  const arr = JSON.parse(localStorage.getItem('bookings') || '[]')
    .filter(b => b.userEmail === curUser.email);

  box.innerHTML = '';

  if(arr.length === 0){
    box.innerHTML = '<div class="card"><div class="meta">No bookings yet</div></div>';
    return;
  }

  arr.slice().reverse().forEach(b=>{
    const wrapper = document.createElement('div');
    wrapper.className='booking-card';

    const left = document.createElement('div');
    left.innerHTML = `
      <div style="font-weight:800">${b.placeName}</div>
      <div class="meta">${b.city} • ${shortDate(b.time)} • ${b.duration}h</div>
      <div class="pay">Car: ${b.plate} • ${b.paymentMethod} • ${b.paid ? b.total.toFixed(2)+' €' : 'Unpaid'}</div>
    `;

    const right = document.createElement('div');
    right.style.textAlign='right';

    const status = b.cancelled ? 
      (b.refunded ? 'Cancelled • Refunded' : 'Cancelled • No refund') 
      : 'Active';

    right.innerHTML = `
      <div class="badge">${status}</div>
      <div style="margin-top:8px">
        ${b.cancelled ? '' : `<button class="btn outline" onclick="startCancel('${b.id}')">Cancel</button>`}
        <button class="btn" style="margin-left:8px" onclick="viewBooking('${b.id}')">Details</button>
      </div>
    `;

    wrapper.appendChild(left);
    wrapper.appendChild(right);
    box.appendChild(wrapper);
  });
}

/* =========================
   CANCEL
========================= */
function startCancel(id){
  el('cancel_booking_id').value = id;
  showModal('cancelBackdrop', true);
}

function performCancel(){
  const id = el('cancel_booking_id').value;
  const arr = JSON.parse(localStorage.getItem('bookings') || '[]');
  const idx = arr.findIndex(x=>x.id===id);
  if(idx === -1) return;

  const b = arr[idx];
  const bookingTime = new Date(b.time);
  const now = new Date();
  const diffHours = (bookingTime - now) / (1000*60*60);

  b.cancelled = true;

  if(diffHours >= 1 && b.paid){
    b.refunded = true;
  } else {
    b.refunded = false;
  }

  arr[idx] = b;
  localStorage.setItem('bookings', JSON.stringify(arr));

  showModal('cancelBackdrop', false);
  showToast(b.refunded ? 'Cancelled and refunded' : 'Cancelled. No refund');
  renderBookingsList();
}

/* =========================
   MODAL
========================= */
function showModal(id, show){
  const elb = document.getElementById(id);
  if(!elb) return;

  elb.style.display = show ? 'flex' : 'none';

  const modal = elb.querySelector('.modal');
  if(modal){
    if(show) modal.classList.add('show');
    else modal.classList.remove('show');
  }
}
