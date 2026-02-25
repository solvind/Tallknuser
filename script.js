diff --git a/script.js b/script.js
--- a/script.js
+++ b/script.js
@@ -1,9 +1,14 @@
 const size = 4;
+const minSwipeDistance = 30;
+
 let board = Array.from({ length: size }, () => Array(size).fill(0));
 let score = 0;
 let gameOver = false;
 let won = false;
 
+let touchStartX = 0;
+let touchStartY = 0;
+
 const boardEl = document.getElementById("board");
 const scoreEl = document.getElementById("score");
 const statusEl = document.getElementById("status");
@@ -143,6 +148,35 @@ function updateUI() {
   scoreEl.textContent = String(score);
 }
 
+function onDirectionInput(direction) {
+  move(direction);
+}
+
+function handleTouchStart(event) {
+  const touch = event.changedTouches[0];
+  touchStartX = touch.clientX;
+  touchStartY = touch.clientY;
+}
+
+function handleTouchEnd(event) {
+  const touch = event.changedTouches[0];
+  const deltaX = touch.clientX - touchStartX;
+  const deltaY = touch.clientY - touchStartY;
+
+  if (
+    Math.abs(deltaX) < minSwipeDistance &&
+    Math.abs(deltaY) < minSwipeDistance
+  ) {
+    return;
+  }
+
+  if (Math.abs(deltaX) > Math.abs(deltaY)) {
+    onDirectionInput(deltaX > 0 ? "right" : "left");
+  } else {
+    onDirectionInput(deltaY > 0 ? "down" : "up");
+  }
+}
+
 document.addEventListener("keydown", (event) => {
   const map = {
     ArrowLeft: "left",
@@ -155,9 +189,12 @@ document.addEventListener("keydown", (event) => {
   if (!direction) return;
 
   event.preventDefault();
-  move(direction);
+  onDirectionInput(direction);
 });
 
+boardEl.addEventListener("touchstart", handleTouchStart, { passive: true });
+boardEl.addEventListener("touchend", handleTouchEnd, { passive: true });
+
 restartBtn.addEventListener("click", init);
 
 init();
