document.querySelectorAll('.scroll-row').forEach(row => {
  const track = row.querySelector('.scroll-track');

  let isDown = false;
  let startX = 0;
  let currentX = 0;
  let autoScroll;
  let originalWidth;

  // Duplicate content ONCE
  const originalContent = track.innerHTML;
  track.innerHTML += originalContent;

  // Wait for images to load before measuring
  const images = track.querySelectorAll('img');
  let loadedImages = 0;

  images.forEach(img => {
    img.onload = () => {
      loadedImages++;
      if (loadedImages === images.length) {
        initialize();
      }
    };
  });

  // If images are cached
  if (images.length === 0) {
    initialize();
  }

  function initialize() {
    originalWidth = track.scrollWidth / 2;
    startAutoScroll();
  }

  function startAutoScroll() {
    autoScroll = requestAnimationFrame(autoScrollLoop);
  }

  function autoScrollLoop() {
    currentX -= 0.3; // drift speed

    if (Math.abs(currentX) >= originalWidth) {
      currentX = 0;
    }

    track.style.transform = `translateX(${currentX}px)`;
    autoScroll = requestAnimationFrame(autoScrollLoop);
  }

  function stopAutoScroll() {
    cancelAnimationFrame(autoScroll);
  }

  row.addEventListener('mouseenter', stopAutoScroll);
  row.addEventListener('mouseleave', startAutoScroll);

  row.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX;
    stopAutoScroll();
    row.style.cursor = "grabbing";
  });

  row.addEventListener('mouseup', () => {
    isDown = false;
    row.style.cursor = "grab";
    startAutoScroll();
  });

  row.addEventListener('mousemove', (e) => {
    if (!isDown) return;

    const x = e.pageX;
    const walk = x - startX;
    currentX += walk;

    if (Math.abs(currentX) >= originalWidth) {
      currentX = 0;
    }

    track.style.transform = `translateX(${currentX}px)`;
    startX = x;
  });
});


const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const captionLeft = document.getElementById('captionLeft');
const captionRight = document.getElementById('captionRight');
const overlay = document.querySelector('.modal-overlay');

document.querySelectorAll('.item img').forEach(img => {
  img.addEventListener('click', () => {
    modal.classList.add('active');
    modalImage.src = img.src;
    captionLeft.textContent = img.dataset.left || "";
    captionRight.textContent = img.dataset.right || "";
  });
});

overlay.addEventListener('click', () => {
  modal.classList.remove('active');
});
