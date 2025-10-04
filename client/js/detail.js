document.addEventListener('DOMContentLoaded', () => {
  //Get event_id from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('event_id');

  if (!eventId) {
    document.getElementById('event-detail').innerHTML = `
      <div class="error">Invalid event ID. Please return to the home page.</div>
    `;
    return;
  }

  //Load event details
  fetchEventDetail(eventId);

  //Pop-up
  const modal = document.getElementById('register-modal');
  const registerBtn = document.getElementById('register-btn');
  const closeBtn = document.querySelector('.close-modal');

  registerBtn.addEventListener('click', () => modal.style.display = 'block');
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
});

//Get event details
async function fetchEventDetail(eventId) {
  try {
    const response = await fetch(`http://localhost:3000/api/events/${eventId}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error('Event not found');
      throw new Error('Failed to load details');
    }

    const event = await response.json();
    renderEventDetail(event);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('event-detail').innerHTML = `
      <div class="error">${error.message}. Please try another event.</div>
    `;
  }
}

//Render event details
function renderEventDetail(event) {
  const container = document.getElementById('event-detail');
  const formattedDate = new Date(event.event_date).toLocaleString('en-AU', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  
  //Safely handling numerical values
  const ticketPrice = Number(event.ticket_price || 0);
  const currentProgress = Number(event.current_progress || 0);
  const charityGoal = Number(event.charity_goal || 0);
  const progressPercent = charityGoal > 0 ? Math.min(100, (currentProgress / charityGoal) * 100) : 0;

  container.innerHTML = `
    <h1>${event.title || 'Untitled Event'}</h1>
    <p><strong>Category:</strong> ${event.category_name || 'N/A'}</p>
    <p><strong>Date & Time:</strong> ${formattedDate}</p>
    <p><strong>Location:</strong> ${event.location || 'N/A'}</p>
    <p><strong>Ticket Price:</strong> $${ticketPrice.toFixed(2)}</p>
    <p><strong>Description:</strong> ${event.description || 'No description available'}</p>
    <p><strong>Host Organization:</strong> ${event.org_name || 'N/A'}</p>
    <p><strong>Organization Contact:</strong> ${event.contact_email || 'N/A'} | <a href="${event.website || '#'}" target="_blank">Website</a></p>
    
    <h3>Charity Goal Progress</h3>
    <p>$${currentProgress.toFixed(2)} of $${charityGoal.toFixed(2)} (${progressPercent.toFixed(1)}%)</p>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${progressPercent}%"></div>
    </div>
  `;
}