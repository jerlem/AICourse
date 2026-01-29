const slides = [
	{
		"image": "slide1.jpg",
		"tagLine": "Impressions tous formats <span>en boutique et en ligne</span>"
	},
	{
		"image": "slide2.jpg",
		"tagLine": "Tirages haute définition grand format <span>pour vos bureaux et events</span>"
	},
	{
		"image": "slide3.jpg",
		"tagLine": "Grand choix de couleurs <span>de CMJN aux pantones</span>"
	},
	{
		"image": "slide4.png",
		"tagLine": "Autocollants <span>avec découpe laser sur mesure</span>"
	}
];

const banner = document.getElementById('banner');
const bannerImg = banner.querySelector('.banner-img');
const bannerText = banner.querySelector('p');
const dotsContainer = banner.querySelector('.dots');
const arrowLeft = banner.querySelector('.arrow_left');
const arrowRight = banner.querySelector('.arrow_right');

let currentIndex = 0;

function updateCarousel() {
	const slide = slides[currentIndex];
	bannerImg.src = `./assets/images/slideshow/${slide.image}`;
	bannerText.innerHTML = slide.tagLine;

	const dots = dotsContainer.querySelectorAll('.dot');
	dots.forEach((dot, index) => {
		if (index === currentIndex) {
			dot.classList.add('dot_selected');
		} else {
			dot.classList.remove('dot_selected');
		}
	});
}

function createDots() {
	slides.forEach((_, index) => {
		const dot = document.createElement('div');
		dot.classList.add('dot');
		if (index === 0) dot.classList.add('dot_selected');
		dotsContainer.appendChild(dot);
	});
}

arrowLeft.addEventListener('click', () => {
	currentIndex = (currentIndex - 1 + slides.length) % slides.length;
	updateCarousel();
});

arrowRight.addEventListener('click', () => {
	currentIndex = (currentIndex + 1) % slides.length;
	updateCarousel();
});

createDots();
