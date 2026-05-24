const bus = document.getElementById("bus");
const bocina = document.getElementById("bocina");

bus.addEventListener("mouseenter", () => {
  bocina.currentTime = 0;
  bocina.play();
});

bus.addEventListener("mouseleave", () => {
  bocina.pause();
  bocina.currentTime = 0;
});