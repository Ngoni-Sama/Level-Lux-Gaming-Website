class Carousel {
    constructor(containerId, indicatorsId) {
        this.container = document.getElementById(containerId);
        this.slides = this.container.getElementsByClassName('carousel-slide');
        this.indicatorsContainer = document.getElementById(indicatorsId);
        this.currentSlide = 0;
        this.setupIndicators();
        this.startAutoPlay();
    }

    setupIndicators() {
        for (let i = 0; i < this.slides.length; i++) {
            const indicator = document.createElement('button');
            indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
            indicator.onclick = () => this.goToSlide(i);
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    updateSlides() {
        for (let i = 0; i < this.slides.length; i++) {
            this.slides[i].classList.remove('active');
            this.indicatorsContainer.children[i].classList.remove('active');
        }
        this.slides[this.currentSlide].classList.add('active');
        this.indicatorsContainer.children[this.currentSlide].classList.add('active');
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlides();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
    }

    startAutoPlay() {
        setInterval(() => this.nextSlide(), 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Carousel('carousel', 'carousel-indicators');
});