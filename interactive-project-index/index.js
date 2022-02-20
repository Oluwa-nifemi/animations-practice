//Util functions
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Function to run query selector and return an array so that I don't have to convert in my code. The spread syntax looks a bit messy
function querySelector(query, parent = document) {
  return [...parent.querySelectorAll(query)]
}

//Libraries
const GSAP = window.gsap;

//Variables
const categories = [
  'ALL',
  'BRANDING',
  'ADVERTISING',
  'DIGITAL'
]
const itemNames = [
  'Nike X Carhatt',
  'Officina 28',
  'Norma Jean'
]

//DOM Elements
const gallery = document.querySelector('.gallery');
const categoryLinks = querySelector('.links.categories .link')
const casesLink = document.querySelector('.link.cases');
const detailLink = document.querySelector('.link.detail');

//State variables
let activeCategory = 'ALL';
let activePage = 'cases';

//Generate image urls
const images = Array.from({length: 15}).map((_, index) => ({
  link: `https://picsum.photos/id/${index * 3 + 10}/1440/700`,
  category: categories[index % 3 + 1]
}))

//Append images to page
images.forEach(image => {
  //Create elements
  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('gallery_image-wrapper')
  wrapperDiv.dataset.category = image.category;

  const realImage = document.createElement('img');
  realImage.classList.add('gallery_image');
  realImage.src = image.link;

  const fakeImage = document.createElement('img');
  fakeImage.className = 'gallery_image-fake'
  fakeImage.src = image.link;

  wrapperDiv.appendChild(realImage)
  wrapperDiv.appendChild(fakeImage)

  const textWrapper = document.createElement('div');
  textWrapper.className = 'gallery_image-text'

  const textHeader = document.createElement('h3');
  const textCategory = document.createElement('p');

  textHeader.textContent = itemNames[getRandomInt(0, 2)]
  textCategory.textContent = image.category.toLowerCase()

  textWrapper.appendChild(textHeader)
  textWrapper.appendChild(textCategory)

  wrapperDiv.appendChild(textWrapper)

  gallery.appendChild(wrapperDiv)
})

const galleryImages = querySelector('.gallery_image-wrapper')

categoryLinks.forEach((category, index) => {
  category.addEventListener('click', async () => {
    document.querySelector('.categories .link.is-active').classList.remove('is-active')

    category.classList.add('is-active')

    //Categories array matches the order of the elements in DOM, so I can use the index to get the clicked category
    const targetCategory = categories[index];

    //If the current category is clicked ignore event
    if(activeCategory === targetCategory){
      return
    }

    if(targetCategory === 'ALL'){
      //If target category is all just display all wrappers and then all images
      galleryImages.forEach(wrapper => {
        const timeline = GSAP.timeline()

        timeline.to(wrapper, {
          height: '70px'
        })

        timeline.set(wrapper, {
          overflow: 'visible'
        })

        timeline.to(wrapper.querySelector('.gallery_image-fake'), {
          height: '100%'
        })
      })
    }else{
      if(activeCategory !== 'ALL'){
        //If target category is not all and current category is a sub category
        const hiddenImageWrappers = querySelector(`[data-category=${activeCategory}]`);
        const visibleImageWrappers = querySelector(`[data-category=${targetCategory}]`);

        //Hide current sub category and show target sub category
        for (let i = 0; i < hiddenImageWrappers.length; i++) {
          const timeline = GSAP.timeline()
          const hiddenImageWrapper = hiddenImageWrappers[i];

          //Overflow hidden to disable hover events for hidden elements
          timeline.set(hiddenImageWrapper, {
            overflow: 'hidden'
          })

          timeline.to(hiddenImageWrapper, {
            height: 0,
          }, 'height')

          const visibleImageWrapper = visibleImageWrappers[i];

          timeline.to(visibleImageWrapper, {
            height: '70px'
          }, 'height')

          //Overflow visible to allow fake image elements show outside the wrapper on hover
          timeline.set(visibleImageWrapper, {
            overflow: 'visible'
          })

          timeline.to(visibleImageWrapper.querySelector('.gallery_image-fake'), {
            height: '100%'
          })
        }
      }else{
        //If target category is not all and current category is all

        //Select all wrappers that are not in this category
        const hiddenImageWrappers = querySelector(`.gallery_image-wrapper:not([data-category=${targetCategory}])`);

        //All we need to do is hide all the invalid elements
        hiddenImageWrappers.forEach(wrapper => {
          const timeline = GSAP.timeline();

          const hiddenImage = wrapper.querySelector('.gallery_image-fake');

          timeline.to(hiddenImage, {
            height: 0,
            ease: "power1.in"
          })

          timeline.set(wrapper, {
            overflow: 'hidden'
          })

          timeline.to(wrapper, {
            height: 0,
            ease: "linear"
          }, '+=0.3')

          //After all animations are done set height of hidden image to 100% for cool blinds animation between categories
          timeline.set(hiddenImage, {
            height: '100%'
          })
        })
      }
    }

    //Update state
    activeCategory = targetCategory
  })
})

galleryImages.forEach(gallery => {
  gallery.addEventListener('click', () => {
    //Update state
    activePage = 'detail'

    //Update active link
    casesLink.classList.remove('is-active')
    detailLink.classList.add('is-active')

    //Hide all gallery images
    const timeline = GSAP.timeline();

    galleryImages.forEach(wrapper => {
      timeline.to(wrapper, {
        opacity: 0,
        duration: 0.2
      }, 'opacity')
    })

    //Hide header
    timeline.set('header', {opacity: 0})

    //Get clicked image position
    const clickedImage = gallery.querySelector('.gallery_image-fake');
    const positionY = clickedImage.getBoundingClientRect().y + window.scrollY;

    //Duplicate clicked image
    const displayImage = document.createElement('img');
    displayImage.className = 'display-image';
    displayImage.src = clickedImage.src;
    document.body.appendChild(displayImage);

    //Move display image from position of clicked image to it's natural position
    timeline.from(displayImage, {
      top: `${positionY}px`,
      height: '140px',
      ease: "power1.in",
      duration: 0.4
    }, 'start')


    //Get clicked image's text position
    const clickedText = gallery.querySelector('.gallery_image-text')
    const textPositionY = clickedText.getBoundingClientRect().y;

    //Duplicate clicked text
    const displayText = document.createElement('div');
    displayText.innerHTML = clickedText.innerHTML;
    displayText.className = 'display-text'

    document.body.appendChild(displayText);

    //Move display text from position of clicked text to it's natural position
    timeline.from(displayText, {
      top: `${textPositionY}px`,
      ease: "power1.in",
      duration: 0.3
    }, 'start+=0.25')

    timeline.from(displayText, {
      color: 'white',
    }, 'start+=0.4')

    //Hide all gallery images after animations
    timeline.set(galleryImages, { height: 0, display: 'none' })

    //Scroll to top of page in case they clicked on an element below
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
})

casesLink.addEventListener('click', () => {
  if(activePage !== 'cases'){
    //Update state
    activeCategory = 'ALL'
    activePage = 'cases'

    //Update active link
    casesLink.classList.add('is-active')
    detailLink.classList.remove('is-active')

    const timeline = GSAP.timeline({
      onComplete: () => {
        //Remove display elements
        document.querySelector('.display-text').remove()
        document.querySelector('.display-image').remove()
      }
    })

    //Hide display elements
    timeline.to(['.display-image', '.display-text'], {
      autoAlpha: 0
    })

    const images = querySelector('.gallery_image-fake');

    //Minimize image size and increase image wrapper size in order to replicate animation in video
    timeline.set(images, { height: 0 })

    timeline.set(galleryImages, { height: '70px', display: 'block', opacity: 1 })

    timeline.to(images, { height: '70px', ease: "power1.in" }, 'show')

    timeline.to('header', { opacity: 1 }, 'show')
  }
})