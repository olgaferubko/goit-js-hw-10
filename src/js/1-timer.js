import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysField = document.querySelector("[data-days]");
const hoursField = document.querySelector("[data-hours]");
const minutesField = document.querySelector("[data-minutes]");
const secondsField = document.querySelector("[data-seconds]");

let countdownInterval;
let userSelectedDate = null;
startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({ title: "Error", message: "Please choose a date in the future" });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

function startCountdown() {
  startButton.disabled = true;
  datetimePicker.disabled = true;

  countdownInterval = setInterval(() => {
    const now = new Date();
    const timeRemaining = userSelectedDate - now;

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay(0, 0, 0, 0);
      datetimePicker.disabled = false;
      startButton.disabled = true;
      return;
    }

    const timeParts = convertMs(timeRemaining);
    updateTimerDisplay(timeParts.days, timeParts.hours, timeParts.minutes, timeParts.seconds);
  }, 1000);
}

function updateTimerDisplay(days, hours, minutes, seconds) {
  daysField.textContent = addLeadingZero(days);
  hoursField.textContent = addLeadingZero(hours);
  minutesField.textContent = addLeadingZero(minutes);
  secondsField.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

startButton.addEventListener("click", startCountdown);
