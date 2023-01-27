"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Page navigation
// this solution works but not efficient, we have to attach same function to all elements
// document.querySelectorAll(".nav__link").forEach((el) => {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     console.log("LINK => ", id);
//     document.querySelector(id).scrollIntoView({behavior:'smooth'});
//   });
// });

// efficient solution using Event Delegation
// // 1. Add listener to the common parent of elements
// // 2. Determine which element originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  if (e.target.classList.contains("nav__link")) {
    e.preventDefault();
    // const id = this.getAttribute("href");
    const id = e.target.getAttribute("href");
    // console.log("LINK => ", id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Tabbed component
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  if (!clicked) return;
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active"); //.getAttribute("data-tab") will also work
});

// Menu Fade Animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    // now the value of this, is 1 or .5 due to bind
    logo.style.opacity = this;
  }
};
const nav = document.querySelector(".nav");
// mouseneter does not bubble
nav.addEventListener("mouseover", handleHover.bind(0.5));
// passing arguments to handler
nav.addEventListener("mouseout", handleHover.bind(1));

// sticky nav => bad way
// const initialCords = section1.getBoundingClientRect();
// window.addEventListener("scroll", function (e) {
//   // console.log(nav);
//   if (this.window.scrollY > initialCords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

// sticky nav: intersection observer api
/* 
const obsCallBack = function (entries, observer) {
  entries.forEach((entry) => {
    console.log(entry);
  });
};
const obsOptions = {
  root: null,
  threshold: 0.1, // threshold means %age of our target that should be in our root (null = viewport)
};
const observer = new IntersectionObserver(obsCallBack, obsOptions);
// when target (section1) intersects the viewport (null) at 10% (0.1), the call back will happen
observer.observe(section1);
*/

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries, observer) {
  const [entry] = entries;
  // entry = entries[0]
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal Sections
const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  // unobserve
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach((section) => {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

// Lazy loading
const imgTargets = document.querySelectorAll("img[data-src]");
console.log(imgTargets);
function loadImg(entries, observer) {
  const [entry] = entries;
  // gaurd clause
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  // we want to remove lazy-img class once image is loaded completely, not immediately
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
}
const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  // start loading before user reach the point
  rootMargin: "200px",
});
imgTargets.forEach((img) => {
  imageObserver.observe(img);
});

// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  // const slider = document.querySelector(".slider");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");

  const dotContainer = document.querySelector(".dots");

  let currSlide = 0;
  const maxSlide = slides.length;

  // slider.style.transform = "scale(0.3)";
  // slider.style.overflow = "visible";

  slides.forEach((s, i) => {
    s.style.transform = `translateX(${i * 100}%)`;
  });

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
    activateDot(slide);
  };

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `
        <button class="dots__dot" data-slide="${i}"></button>
        `
      );
    });
  };

  const activateDot = function (slide) {
    document.querySelectorAll(".dots__dot").forEach((dot) => {
      console.log(dot);
      dot.classList.remove("dots__dot--active");
      document
        .querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList.add("dots__dot--active");
    });
  };

  const init = function () {
    createDots();
    goToSlide(0);
  };

  init();

  const nextSlide = function () {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    goToSlide(currSlide);
  };

  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }
    goToSlide(currSlide);
  };

  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      // console.log(e.target.getAttribute('data-slide'));
      goToSlide(e.target.dataset.slide);
    }
  });
};

slider();

//////////////////////////////////
/**
 * 
// SELECTING ELEMENTS
const allSections = document.querySelectorAll(".section");
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);
const header = document.querySelector(".header");
// document.querySelectorAll
// document.getElementById
// document.getElementsByClassName
const allButtons = document.getElementsByTagName("button");
// console.log(allButtons);

// CREATING AND INSERTING ELEMENTS
// .insertAdjacentHTML
const message = document.createElement("div");
message.classList.add("cookie-message");
// message.textContent =
//   "We use cookies for for improved functionality and analytics.";
message.innerHTML = `
We use cookies for for improved functionality and analytics.
<button class="btn btn--close-cookie">Got it!</button>
`;
// a single element can be inserted just once. It can not be available at two places at same time
// prepend => first child
// header.prepend(message);

// append => last child
header.append(message);

// if we want same element to be at multiple places, then we have to clone it first
// header.append(message.cloneNode(true));

// after and before make elements siblings
// header.after(message)

// DELETE ELEMENTS
document.querySelector(".btn--close-cookie").addEventListener("click", () => {
  message.remove();
  // old way
  // message.parentElement.removeChild(message)
});

// STYLES
message.style.backgroundColor = "#37383d";
message.style.width = "120%";

// // we can only get inline styles and the style we apply through js are applied as inline
// console.log(message.style.width);

// // to get all style
// console.log(getComputedStyle(message).color);

// // if we want to add style according to already available style
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + "px";
// console.log(message.style.height);

// // to change the value of variables (custom css properties)

// document.documentElement.style.setProperty("--color-primary", "orangered");

// // ATTRIBUTES

// const logo = document.querySelector(".nav__logo");
// console.log(logo.src);
// // for relative url
// console.log(logo.getAttribute("src"));
// logo.alt = "Beautiful minimalist logo";
// // non-standard not gonna work
// console.log(logo.designer);
// // to get non-standard properties
// console.log(logo.getAttribute("designer"));
// logo.setAttribute("company", "Bankist");

// //  DATA ATTRIBUTES
// console.log(logo.dataset.whateverWeWant);

// CLASSES
// logo.classList.add
// logo.classList.remove
// logo.classList.contains
// logo.classList.toggle

btnScrollTo.addEventListener("click", function (e) {
  // e.target is where click was happen, in this case, btnscrollto
  console.log(e.target.getBoundingClientRect());
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log("current scroll position (X/Y)", window.scrollX, window.scrollY);
  console.log(
    "height/width of current viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
    );
    // Old way of scrolling
    // scrolling
    // window.scrollTo(
      //   s1coords.left + window.scrollX,
      //   s1coords.top + window.scrollY
      // );
      // smooth scrolling
      // window.scrollTo({
        //   left: s1coords.left + window.scrollX,
        //   top: s1coords.top + window.scrollY,
        //   behavior: "smooth",
        // });
        // new way of scrolling
        section1.scrollIntoView({ behavior: "smooth" });
      });
      
      // TYPES OF EVENTS
      // const h1 = document.querySelector("h1");
      // const fn = () => {
        //   console.log("mouse enter");
        //   h1.removeEventListener('mouseenter',fn);
        // };
        // h1.addEventListener("mouseenter", fn);
        // another way of attaching eventlistner (old)
        // h1.onmouseenter = () => {
          //   console.log("mouse enters ");
          // };
          
          // DELEGATION, BUBBLING
          // const randomInt = (max, min) =>
          //   min + Math.trunc(Math.random() * (max - min + 1));
          // const randomColor = () =>
          //   `rgb(${randomInt(255, 0)},${randomInt(255, 0)},${randomInt(255, 0)})`;
          // console.log(randomColor());
          
          // document.querySelector(".nav__link").addEventListener("click", function (e) {
            //   this.style.backgroundColor = randomColor();
            //   console.log("Link ", e.target);
            // });
            
            // document.querySelector(".nav__links").addEventListener("click", function (e) {
              //   this.style.backgroundColor = randomColor();
              //   console.log("container ", e.target);
              // });
              
              // document.querySelector(".nav").addEventListener("click", function (e) {
                //   this.style.backgroundColor = randomColor();
                //   console.log("nav ", e.target);
                // });
                
                // DOM TRAVERSING
                const h1 = document.querySelector("h1");
                
                // going downward: children
                // only children of h1 with class highlight will be selected
                // const arr = h1.querySelectorAll(".highlight");
                // console.log(h1.childNodes);
                // // console.log(h1.children);
                // // console.log(h1.firstChild);
                // console.log(h1.firstElementChild);
                // console.log(h1.lastElementChild);
                
                // going upwards: parent
                console.log(h1.parentNode);
                console.log(h1.parentElement);
                
                // closest selects the closest parent with given class
                console.log(h1.closest(".header"));
                // h1.closest(".header").style.background = "var(--gradient-primary)";
                // h1.closest("h1").style.background = "var(--gradient-secondary)";
                
                // going sideways: siblings
                // console.log(h1.previousElementSibling);
                console.log(h1.nextElementSibling);
                
                // selecting all siblings
                console.log(h1.parentElement.children);
                
                
                */
//  this event is fired when html and js is loaded from server
document.addEventListener("DOMContentLoaded", function (e) {
  console.log("DOMContentLoaded", e);
});

//  this event is fired when html, js, all the images and external resources like css are loaded from server
window.addEventListener("load", function (e) {
  console.log("LOAD", e);
});

//  this event is fired when user is about to leave the page
// window.addEventListener("beforeunload", function (e) {
//   e.preventDefault();
//   console.log("beforeunload", e);
//   e.returnValue = "";
// });

// lec 19 done
