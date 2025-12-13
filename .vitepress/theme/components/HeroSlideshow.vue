<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'

const slides = [
  { src: withBase('/cover_1.png'), alt: 'WebArcade Desktop Application' },
  { src: withBase('/cover_2.png'), alt: 'WebArcade Plugin System' }
]

const currentSlide = ref(0)
let intervalId: number | null = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const startAutoplay = () => {
  intervalId = window.setInterval(nextSlide, 5000)
}

const stopAutoplay = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <div class="hero-slideshow" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
    <div class="slideshow-container">
      <div class="slides-wrapper">
        <div class="slides">
          <div
            v-for="(slide, index) in slides"
            :key="index"
            :class="['slide', { active: currentSlide === index }]"
          >
            <img :src="slide.src" :alt="slide.alt" />
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button class="nav-button prev" @click="prevSlide" aria-label="Previous slide">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button class="nav-button next" @click="nextSlide" aria-label="Next slide">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <!-- Dots Indicator -->
      <div class="dots">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          :class="['dot', { active: currentSlide === index }]"
          @click="goToSlide(index)"
          :aria-label="`Go to slide ${index + 1}`"
        ></button>
      </div>
    </div>

    <div class="slideshow-caption">
      <h2>See WebArcade in Action</h2>
      <p>Build beautiful, extensible desktop applications</p>
    </div>
  </div>
</template>

<style scoped>
.hero-slideshow {
  margin: 0 auto 2rem;
  max-width: 1000px;
  padding: 0 24px;
}

.slideshow-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 25px 50px -12px rgba(139, 92, 246, 0.25),
    0 0 0 1px rgba(139, 92, 246, 0.1);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
  padding: 4px;
}

.slides-wrapper {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background: var(--vp-c-bg-soft);
}

.slides {
  position: relative;
  width: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.slide:first-child {
  position: relative;
  opacity: 1;
}

.slide.active {
  opacity: 1;
  pointer-events: auto;
  z-index: 2;
}

.slide img {
  width: 100%;
  height: auto;
  display: block;
}

/* Navigation Buttons */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #6366f1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.slideshow-container:hover .nav-button {
  opacity: 1;
}

.nav-button:hover {
  background: #fff;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
}

.nav-button svg {
  width: 24px;
  height: 24px;
}

.nav-button.prev {
  left: 16px;
}

.nav-button.next {
  right: 16px;
}

.dark .nav-button {
  background: rgba(30, 30, 30, 0.9);
  color: #a78bfa;
}

.dark .nav-button:hover {
  background: rgba(40, 40, 40, 1);
}

/* Dots Indicator */
.dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.2);
}

.dot.active {
  background: #fff;
  transform: scale(1.2);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
}

/* Caption */
.slideshow-caption {
  text-align: center;
  margin-top: 1.5rem;
}

.slideshow-caption h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.slideshow-caption p {
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-slideshow {
    padding: 0 16px;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    opacity: 1;
  }

  .nav-button svg {
    width: 20px;
    height: 20px;
  }

  .nav-button.prev {
    left: 8px;
  }

  .nav-button.next {
    right: 8px;
  }

  .slideshow-caption h2 {
    font-size: 1.5rem;
  }

  .slideshow-caption p {
    font-size: 1rem;
  }
}
</style>
