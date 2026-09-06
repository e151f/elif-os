// Small compatibility bridge for the single-file ELIF OS runtime.
// The state engine calls render() after writes; reloading is safe and keeps the
// localStorage-backed UI in sync without duplicating the rendering engine.
window.render=window.render||function(){location.reload()};
