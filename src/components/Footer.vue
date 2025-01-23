<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="copyright">
        Copyright © {{ currentYear }} All rights reserved.<br>
        Made By <a href="https://github.com/DropFan" target="_blank">Tiger</a> With ♥️.
      </p>
      <p class="github-link">
        <a href="https://github.com/DropFan/snake-game" target="_blank">View on GitHub</a>
        <br>
        <a href="https://v2dl.net/" target="_blank">v2dl.net</a>
      </p>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer {
  width: 100%;
  padding: 1rem 0;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  text-align: center;
  font-size: 0.9rem;
  color: rgba(25, 25, 25, 0.6);
}

.copyright, .github-link {
  margin: 0.5rem 0;
}

.footer a {
  color: #4CAF50;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer a:hover {
  color: #388E3C;
  text-decoration: underline;
}

@media (prefers-color-scheme: light) {
  .footer-content {
    color: rgba(0, 0, 0, 0.6);
  }
  
  .footer {
    border-top-color: rgba(0, 0, 0, 0.1);
  }
}
</style>