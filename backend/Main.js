document.addEventListener('DOMContentLoaded', function() {
  const shapes = [
    { type: 'circle', class: 'shape shape1 circle' },
    { type: 'triangle', class: 'shape shape2 triangle' },
    { type: 'circle', class: 'shape shape3 circle' },
    { type: 'triangle', class: 'shape shape4 triangle' },
    { type: 'circle', class: 'shape shape5 circle' }
  ];
  const container = document.querySelector('.animated-shapes');
  if (container) {
    shapes.forEach(s => {
      const el = document.createElement('div');
      el.className = s.class;
      container.appendChild(el);
    });
  }
});    