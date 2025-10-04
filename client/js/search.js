document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    performSearch();
  });
  document.getElementById('clear-btn').addEventListener('click', clearFilters);
});

// Load event categories from API
async function loadCategories() {
  try {
    const response = await fetch('http://localhost:3000/api/events/all-categories');
    if (!response.ok) throw new Error('Failed to load categories');
    
    const categories = await response.json();
    const select = document.getElementById('category');
    select.innerHTML = '<option value="">All Categories</option>';
    
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.category_id;
      option.textContent = cat.category_name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading categories:', error);
    document.getElementById('category').innerHTML = '<option value="">Categories unavailable</option>';
  }
}

// Perform event search with filters
async function performSearch() {
  const eventMonth = document.getElementById('eventMonth').value;
  const location = document.getElementById('location').value.trim();
  const categoryId = document.getElementById('category').value;

  const params = new URLSearchParams();
  if (eventMonth) params.append('eventMonth', eventMonth);
  if (location) params.append('location', location);
  if (categoryId) params.append('category_id', categoryId);

  try {
    const response = await fetch(`http://localhost:3000/api/events/search?${params.toString()}`);
    if (!response.ok) throw new Error('No events found');
    
    const results = await response.json();
    renderResults(results);
  } catch (error) {
    console.error('Search error:', error);
    document.getElementById('search-results').innerHTML = `
      <div class="error">No events match your criteria. Try different filters.</div>
    `;
  }
}

// Render search results
function renderResults(events) {
  const container = document.getElementById('search-results');
  container.innerHTML = '';

  if (events.length === 0) {
    container.innerHTML = '<p>No events match your search criteria.</p>';
    return;
  }

  events.forEach(event => {
    const formattedDate = new Date(event.event_date).toLocaleString('en-AU', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const ticketPrice = Number(event.ticket_price || 0);

    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <h3>${event.title || 'Untitled Event'}</h3>
      <p><strong>Category:</strong> ${event.category_name || 'N/A'}</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Location:</strong> ${event.location || 'N/A'}</p>
      <p><strong>Ticket Price:</strong> $${ticketPrice.toFixed(2)}</p>
      <a href="/detail?event_id=${event.event_id}" class="btn">View Details</a>
    `;
    container.appendChild(card);
  });
}

// Clear all search filters
function clearFilters() {
  document.getElementById('search-form').reset();
  document.getElementById('search-results').innerHTML = '<p>Enter search criteria and click "Search" to find events.</p>';
}