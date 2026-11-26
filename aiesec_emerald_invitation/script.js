
const progressBar = document.getElementById("progressBar");
const music = document.getElementById("backgroundMusic");
const openInvitation = document.getElementById("openInvitation");
const musicControl = document.getElementById("musicControl");
const musicVolume = document.getElementById("musicVolume");

const rsvpArena = document.getElementById("rsvpArena");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const playfulHint = document.getElementById("playfulHint");

const attendanceFormWrap = document.getElementById("attendanceFormWrap");
const attendanceForm = document.getElementById("attendanceForm");
const formStatus = document.getElementById("formStatus");

const aiesecStatus = document.getElementById("aiesecStatus");
const membershipTypeGroup = document.getElementById("membershipTypeGroup");
const membershipType = document.getElementById("membershipType");

const invitationRsvpButton = document.getElementById("invitationRsvpButton");

let rsvpNavigationUnlocked = false;

let invitationOpened = false;
let musicStarted = false;
let musicFinished = false;
let noAttempts = 0;
let responseChosen = false;

// --------------------------------------------------
// INITIAL INVITATION LOCK
// --------------------------------------------------

document.documentElement.classList.add("invitation-locked");
document.body.classList.add("invitation-locked");

music.volume = 0.25;
music.loop = true;

// Prevent mouse wheel scrolling before opening.
function preventLockedScroll(event) {
  if (!rsvpNavigationUnlocked) {
    event.preventDefault();
  }
}

window.addEventListener("wheel", preventLockedScroll, {
  passive: false
});

// Prevent touch scrolling before opening.
window.addEventListener("touchmove", preventLockedScroll, {
  passive: false
});

// Prevent keyboard scrolling before opening.
window.addEventListener("keydown", (event) => {
  if (!rsvpNavigationUnlocked) {
    const scrollKeys = [
      "ArrowDown",
      "ArrowUp",
      "PageDown",
      "PageUp",
      "Home",
      "End",
      " "
    ];

    if (scrollKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
});

// --------------------------------------------------
// OPEN INVITATION
// --------------------------------------------------

openInvitation.addEventListener("click", async (event) => {
  event.preventDefault();

  if (invitationOpened) return;

  invitationOpened = true;

  document.documentElement.classList.remove("invitation-locked");
  document.body.classList.remove("invitation-locked");

  musicControl.hidden = false;

  // Start music softly.
  try {
    await music.play();
    musicStarted = true;
  } catch (error) {
    console.info("Music could not start:", error);
  }

  // Smoothly enter the invitation.
  document.getElementById("invitation").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// --------------------------------------------------
// USER-CONTROLLED MUSIC VOLUME
// --------------------------------------------------

musicVolume.addEventListener("input", () => {
  music.volume = Number(musicVolume.value);
});

// --------------------------------------------------
// SCROLL PROGRESS
// --------------------------------------------------

function updateProgress() {
  const scrollable =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = scrollable > 0
    ? (window.scrollY / scrollable) * 100
    : 0;

  progressBar.style.width =
    `${Math.min(100, Math.max(0, progress))}%`;

  // End the jazz immediately when the visitor reaches
  // the bottom of the invitation.
  if (
    invitationOpened &&
    !musicFinished &&
    window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2
  ) {
    finishInvitation();
  }
}

window.addEventListener("scroll", updateProgress, {
  passive: true
});

window.addEventListener("resize", updateProgress);

function finishInvitation() {
  musicFinished = true;

  music.pause();
  music.currentTime = 0;

  musicStarted = false;
  musicControl.hidden = true;
}

updateProgress();

// --------------------------------------------------
// REVEAL CONTENT
// --------------------------------------------------

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

document.querySelectorAll(".reveal").forEach(element => {
  revealObserver.observe(element);
});

// --------------------------------------------------
// RSVP: YES OPENS THE ATTENDANCE FORM
// --------------------------------------------------

yesButton.addEventListener("click", () => {
  if (responseChosen) return;

  responseChosen = true;

  rsvpArena.hidden = true;
  playfulHint.hidden = true;

  attendanceFormWrap.hidden = false;

  attendanceFormWrap.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});

// --------------------------------------------------
// RSVP: NO BUTTON DODGES
// --------------------------------------------------


const maxNoAttempts = 8;

function dodgeNoButton(event) {

    if (responseChosen || noAttempts >= maxNoAttempts) return;

    noAttempts++;

    const arenaRect = rsvpArena.getBoundingClientRect();
    const buttonWidth = noButton.offsetWidth;
    const buttonHeight = noButton.offsetHeight;

    const isMobile = window.innerWidth <= 600;

    // Available movement area
    const padding = 8;

    const maxX = arenaRect.width - buttonWidth - padding * 2;
    const maxY = arenaRect.height - buttonHeight - padding * 2;

    let x;
    let y;

    // Find a position away from the YES button.
    const yesRect = yesButton.getBoundingClientRect();

    for (let i = 0; i < 30; i++) {

        x = padding + Math.random() * Math.max(0, maxX);
        y = padding + Math.random() * Math.max(0, maxY);

        const proposedLeft = arenaRect.left + x;
        const proposedTop = arenaRect.top + y;

        const overlapsYes =
            proposedLeft < yesRect.right + 12 &&
            proposedLeft + buttonWidth > yesRect.left - 12 &&
            proposedTop < yesRect.bottom + 12 &&
            proposedTop + buttonHeight > yesRect.top - 12;

        if (!overlapsYes) break;
    }

    if (isMobile) {

        // Mobile: jump around the entire RSVP playground.
        noButton.style.left = `${x}px`;
        noButton.style.top = `${y}px`;
        noButton.style.transform = "none";

    } else {

        // Desktop: playful movement around the button area.
        const moveX = (Math.random() - 0.5) * 400;
        const moveY = (Math.random() - 0.5) * 180;

        noButton.style.transform =
            `translate(${moveX}px, ${moveY}px)`;
    }

    const hints = [
        "That was close! 😂",
        "You'll have to catch me first!",
        "Mamuu achazako... 😂",
        "Not so fast!",
        "I'm not that easy to catch!",
        "Almost! Try again!",
        "Okay, you're persistent!",
        "Alright, you win. 😂"
    ];

    playfulHint.textContent = hints[noAttempts - 1];

    // Eventually allow a genuine decline.
    if (noAttempts >= maxNoAttempts) {

        noButton.textContent = "No, I really can't attend";

        noButton.style.left = "50%";
        noButton.style.top = isMobile ? "115px" : "auto";
        noButton.style.transform = isMobile
            ? "translateX(-50%)"
            : "none";

        noButton.classList.add("decline-ready");

        playfulHint.textContent =
            "Okay, okay! You can make your choice now. 😂";
    }
}

// Desktop: run away when the mouse approaches.
noButton.addEventListener("pointerenter", (event) => {

    if (event.pointerType === "mouse") {
        dodgeNoButton(event);
    }

});

// Mobile: run away when the delegate touches it.
noButton.addEventListener("pointerdown", (event) => {

    if (
        event.pointerType === "touch" &&
        noAttempts < maxNoAttempts
    ) {
        event.preventDefault();
        dodgeNoButton(event);
    }

});

// Keyboard users can still interact with the button.
noButton.addEventListener("click", (event) => {

    if (noAttempts < maxNoAttempts) {

        if (event.detail === 0) {
            dodgeNoButton(event);
        }

        return;
    }

    responseChosen = true;

    rsvpArena.hidden = true;
    playfulHint.hidden = true;

    const responseMessage =
        document.getElementById("responseMessage");

    responseMessage.hidden = false;

    document.getElementById("responseIcon").textContent = "♡";

    document.getElementById("responseTitle").textContent =
        "Thank you for letting us know.";

    document.getElementById("responseText").textContent =
        "We're sorry you won't be able to join us. We appreciate your response.";

});

// Touch devices: move the button when tapped.
noButton.addEventListener("touchstart", (event) => {
  if (noAttempts < 5) {
    event.preventDefault();
    dodgeNoButton();
  }
}, {
  passive: false
});

// --------------------------------------------------
// ATTENDANCE FORM SUBMISSION
// --------------------------------------------------

attendanceForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = attendanceForm.querySelector(
    'button[type="submit"]'
  );

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  formStatus.textContent = "Please wait while we save your response.";

  try {
    const response = await fetch(attendanceForm.action, {
      method: "POST",
      body: new FormData(attendanceForm),
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Form submission failed.");
    }

    formStatus.textContent =
      "Your attendance has been confirmed. Thank you!";

    submitButton.textContent = "Confirmed";

    // Keep the visitor on the invitation so they can
    // continue exploring and reach the end of the page.
    attendanceForm.reset();

  } catch (error) {
    formStatus.textContent =
      "We couldn't save your response. Please check your connection and try again.";

    submitButton.disabled = false;
    submitButton.textContent = "Submit confirmation";

    console.error(error);
  }
});

aiesecStatus.addEventListener("change", () => {
    if (aiesecStatus.value === "Yes") {
        membershipTypeGroup.hidden = false;
        membershipType.required = true;
    } else {
        membershipTypeGroup.hidden = true;
        membershipType.required = false;
        membershipType.value = "";
    }
});

invitationRsvpButton.addEventListener("click", (event) => {
  event.preventDefault();

  if (rsvpNavigationUnlocked) return;

  // Unlock normal page scrolling.
  rsvpNavigationUnlocked = true;

  document.documentElement.classList.remove("invitation-locked");
  document.body.classList.remove("invitation-locked");

  // Smoothly take the visitor to the RSVP section.
  document.getElementById("rsvp").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});