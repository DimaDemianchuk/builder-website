const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
    return;
  }

  callback();
};

ready(() => {
  document.documentElement.classList.add('is-ready');
});
