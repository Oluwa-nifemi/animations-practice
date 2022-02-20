const GSAP = window.gsap;

const preloaderTimeline = GSAP.timeline();

const heights = [75, 50, 25, 0]


heights.forEach(height => {
  preloaderTimeline.to('.preloader__overlay', {
    height: `${height}%`,
    ease: "power3.out",
    duration: 1,
    opacity: height === 0 ? 0 : 1
  }, '+=0.4')
})

preloaderTimeline.to('.preloader', {
  width: '123rem',
  top: 'calc(8.4rem + 12rem + 22rem - 5rem)',
  left: '0',
  duration: 1.2
}, '-=0.4')

preloaderTimeline.fromTo(
  '.navbar',
  {
    y: -100
  },
  {
    y: 0,
    opacity: 1,
    duration: 0.6
  },
  'first'
)

preloaderTimeline.fromTo(
  '.header span:first-child',
  {
    y: 130
  },
  {
    y: 0,
    opacity: 1,
    duration: 0.6
  },
  'first'
)

preloaderTimeline.fromTo(
  '.header span:last-child',
  {
    y: 130
  },
  {
    y: 0,
    opacity: 1,
    duration: 0.6
  },
  '+=0.4'
)

preloaderTimeline.fromTo(
  '.paragraph',
  {
    y: 80
  },
  {
    y: 0,
    opacity: 1,
    duration: 0.6
  },
  '+=0.4'
)

preloaderTimeline.to('.round-text', { opacity: 1 })