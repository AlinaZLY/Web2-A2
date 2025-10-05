document.addEventListener('DOMContentLoaded', () => {
  // 初始化轮播图所需变量
  const slidesContainer = document.querySelector('.carousel-slides');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const indicators = document.querySelectorAll('.indicator');
  let currentIndex = 0;
  let slideInterval;

  fetchHomeEvents();//Call the API to get the homepage activities

  function initCarousel() {
    showSlide(currentIndex);
    startSlideInterval();
    
    // 绑定按钮事件
    prevBtn.addEventListener('click', showPrevSlide);
    nextBtn.addEventListener('click', showNextSlide);
    
    // 绑定指示点事件
    indicators.forEach(indicator => {
      indicator.addEventListener('click', () => {
        currentIndex = parseInt(indicator.dataset.index);
        showSlide(currentIndex);
        resetSlideInterval();
      });
    });
    
    // 鼠标悬停暂停/离开继续
    slidesContainer.addEventListener('mouseenter', stopSlideInterval);
    slidesContainer.addEventListener('mouseleave', startSlideInterval);
  }

  function showSlide(index) {
    // 处理边界情况
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    
    // 移动轮播容器
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // 更新指示点状态
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === currentIndex);
    });
    
    // 更新当前幻灯片的active类
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });
  }

  function showPrevSlide() {
    showSlide(currentIndex - 1);
    resetSlideInterval();
  }

  function showNextSlide() {
    showSlide(currentIndex + 1);
    resetSlideInterval();
  }

  function startSlideInterval() {
    // 每隔5秒自动切换
    slideInterval = setInterval(showNextSlide, 5000);
  }

  function stopSlideInterval() {
    clearInterval(slideInterval);
  }

  function resetSlideInterval() {
    stopSlideInterval();
    startSlideInterval();
  }

  // 初始化轮播图
  initCarousel();
});

//Call the API to obtain the homepage activity data
async function fetchHomeEvents() {
  try {
    //Calling the API ensures that it matches the backend port
    const response = await fetch('http://localhost:3000/api/events/home');
    if (!response.ok) throw new Error('Failed to load events');
    
    const { upcomingEvents, pastEvents } = await response.json();
    
    //Render the activity list
    renderEvents(upcomingEvents, 'upcoming-events');
    renderEvents(pastEvents, 'past-events');
  } catch (error) {
    console.error('Error:', error);
    //Display error message
    document.getElementById('upcoming-events').innerHTML = `
      <div class="error">Failed to load events. Please check if the API server is running.</div>
    `;
    document.getElementById('past-events').innerHTML = '';
  }
}

//Render the activity list to the specified container
function renderEvents(events, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; //Clear loading prompt

  if (events.length === 0) {
    container.innerHTML = '<p>No events available.</p>';
    return;
  }

  //Iterate through the activity data and create cards
  events.forEach(event => {
    //Format the date
    const formattedDate = new Date(event.event_date).toLocaleString('en-AU', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const ticketPrice = Number(event.ticket_price || 0);

    //Create an event card element
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <h3>${event.title}</h3>
      <p><strong>Category:</strong> ${event.category_name || 'N/A'}</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Location:</strong> ${event.location || 'N/A'}</p>
      <p><strong>Ticket Price:</strong> $${ticketPrice.toFixed(2)}</p>
      <a href="/detail?event_id=${event.event_id}" class="btn">View Details</a>
    `;

    container.appendChild(card);
  });
}