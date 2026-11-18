(() => {
  const requestedTopic = new URLSearchParams(location.search).get('topic');
  const board = window.LITERATURE_BOARDS.find(item => item.id === requestedTopic) || window.LITERATURE_BOARDS[0];
  const viewport = document.getElementById('viewport');
  const world = document.getElementById('world');
  const dialog = document.getElementById('paper-detail');
  const papers = new Map(board.papers.map(paper => [paper.id, paper]));
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const citation = paper => [paper.year, paper.venue].filter(Boolean).join(' · ');
  const shortTitle = paper => paper.title.split(':')[0];
  const state = { x: 0, y: 0, scale: 1, width: 0, height: 0 };
  const positions = new Map();
  let suppressClick = false;

  document.title = board.title + ' — Visual literature map';
  document.querySelector('h1').textContent = board.title;
  document.querySelector('[data-topic="' + board.id + '"]').setAttribute('aria-current', 'page');
  const illustrated = board.papers.filter(paper => paper.image).length;
  document.getElementById('coverage').textContent =
    board.papers.length + ' reviewed records · ' + illustrated + ' source figures';

  function paperCard(paper) {
    return '<button class="paper-card" data-paper="' + escape(paper.id) + '">' +
      (paper.image ? '<img src="' + escape(paper.image) + '" alt="Source figure from ' + escape(paper.title) + '" draggable="false">' : '') +
      '<span class="paper-text"><strong>' + escape(shortTitle(paper)) + '</strong>' +
      '<span class="citation">' + escape(citation({...paper, venue: paper.venue.split(/[;,]/)[0]})) + '</span>' +
      (paper.image ? '' : '<span class="method">' + escape(paper.method) + '</span><span class="missing">Source figure unavailable in current review</span>') +
      '</span></button>';
  }

  world.innerHTML = board.groups.map(group => {
    const members = board.papers.filter(paper => paper.group === group.id)
      .sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)) || (b.year || 0) - (a.year || 0));
    const notes = board.notes.filter(note => note.group === group.id);
    return '<section class="cluster" id="group-' + group.id + '">' +
      '<h2>' + escape(group.title) + '<span class="cluster-count">' + members.length + ' papers</span></h2>' +
      '<p class="cluster-description">' + escape(group.description) + '</p>' +
      '<div class="paper-grid">' + members.map(paperCard).join('') + '</div>' +
      notes.map(note => '<aside class="gap-note"><h3>Gap · ' + escape(note.title) + '</h3>' +
        '<p>' + escape(note.text) + '</p><p class="question">' + escape(note.question) + '</p>' +
        '<div class="refs">' + note.ids.map(id => '<button data-paper="' + escape(id) + '">' +
          escape(shortTitle(papers.get(id))) + ' · ' + escape(papers.get(id).year) + '</button>').join('') +
        '</div></aside>').join('') + '</section>';
  }).join('');

  document.getElementById('group-nav').innerHTML = board.groups.map(group =>
    '<button data-group="' + group.id + '">' + escape(group.title) + '</button>').join('');

  function draw() {
    world.style.transform = 'translate(' + state.x + 'px,' + state.y + 'px) scale(' + state.scale + ')';
    document.getElementById('zoom-value').textContent = Math.round(state.scale * 100) + '%';
  }

  function layout() {
    const heights = [24, 24, 24, 24];
    board.groups.forEach((group, index) => {
      const element = document.getElementById('group-' + group.id);
      const column = index % 4;
      const position = { x: 24 + column * 820, y: heights[column], height: element.offsetHeight };
      positions.set(group.id, position);
      element.style.left = position.x + 'px';
      element.style.top = position.y + 'px';
      heights[column] += element.offsetHeight + 40;
    });
    state.width = 4 * 820 + 8;
    state.height = Math.max(...heights);
    world.style.width = state.width + 'px';
    world.style.height = state.height + 'px';
  }

  function fit() {
    state.scale = Math.min(viewport.clientWidth / state.width, viewport.clientHeight / state.height) * .96;
    state.x = (viewport.clientWidth - state.width * state.scale) / 2;
    state.y = (viewport.clientHeight - state.height * state.scale) / 2;
    draw();
  }

  function zoomAt(factor, x, y) {
    const next = Math.max(.08, Math.min(2.5, state.scale * factor));
    const ratio = next / state.scale;
    state.x = x - (x - state.x) * ratio;
    state.y = y - (y - state.y) * ratio;
    state.scale = next;
    draw();
  }

  function focusGroup(id) {
    const position = positions.get(id);
    state.scale = Math.min(1, (viewport.clientWidth - 48) / 780);
    state.x = (viewport.clientWidth - 780 * state.scale) / 2 - position.x * state.scale;
    state.y = 24 - position.y * state.scale;
    draw();
  }

  function openPaper(id) {
    const paper = papers.get(id);
    const evidence = (paper.evidence || []).filter(item => item.url);
    document.getElementById('detail-body').innerHTML =
      '<h2>' + escape(paper.title) + '</h2><p>' + escape(citation(paper)) + '</p>' +
      (paper.image ? '<img src="' + escape(paper.image) + '" alt="Source figure from ' + escape(paper.title) + '">' +
        '<p class="reading">' + escape(paper.figureCredit || 'Figure credited to the paper authors') + '</p>' : '') +
      [['Problem', paper.problem], ['Method', paper.method], ['Contribution', paper.contribution],
        ['Remaining question in our review', paper.gap]].filter(item => item[1]).map(item =>
        '<h3>' + escape(item[0]) + '</h3><p>' + escape(item[1]) + '</p>').join('') +
      '<p class="reading">Reading status · ' + escape(paper.readStatus) + '</p>' +
      '<p><a href="' + escape(paper.url) + '" target="_blank" rel="noopener noreferrer">Open paper / author project ↗</a></p>' +
      (evidence.length ? '<h3>Evidence in the review</h3><ul>' + evidence.map(item =>
        '<li><a href="' + escape(item.url) + '" target="_blank" rel="noopener noreferrer">' +
        escape(item.locator || item.claim || 'Source') + '</a></li>').join('') + '</ul>' : '');
    dialog.showModal();
    dialog.scrollTop = 0;
  }

  world.addEventListener('click', event => {
    if (suppressClick) return;
    const button = event.target.closest('[data-paper]');
    if (button) openPaper(button.dataset.paper);
  });
  document.getElementById('close-detail').onclick = () => dialog.close();
  dialog.addEventListener('click', event => {
    if (event.target === dialog && event.offsetX < 0) dialog.close();
  });
  document.getElementById('group-nav').onclick = event => {
    const button = event.target.closest('[data-group]');
    if (button) focusGroup(button.dataset.group);
  };
  document.getElementById('fit').onclick = fit;
  document.getElementById('readable').onclick = () => focusGroup(board.groups[0].id);
  document.querySelectorAll('[data-zoom]').forEach(button => {
    button.onclick = () => zoomAt(button.dataset.zoom === 'in' ? 1.25 : .8,
      viewport.clientWidth / 2, viewport.clientHeight / 2);
  });

  viewport.addEventListener('wheel', event => {
    event.preventDefault();
    const rectangle = viewport.getBoundingClientRect();
    zoomAt(Math.exp(-event.deltaY * .0015), event.clientX - rectangle.left, event.clientY - rectangle.top);
  }, { passive: false });

  const pointers = new Map();
  let gesture = null;
  function pointerDistance() {
    const points = [...pointers.values()];
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  }
  viewport.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    gesture = { x: event.clientX, y: event.clientY, startX: state.x, startY: state.y,
      distance: pointers.size === 2 ? pointerDistance() : 0 };
    suppressClick = false;
    viewport.classList.add('dragging');
  });
  viewport.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId) || !gesture) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) {
      const points = [...pointers.values()];
      const distance = pointerDistance();
      const rectangle = viewport.getBoundingClientRect();
      zoomAt(distance / gesture.distance, (points[0].x + points[1].x) / 2 - rectangle.left,
        (points[0].y + points[1].y) / 2 - rectangle.top);
      gesture.distance = distance;
      suppressClick = true;
    } else {
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (Math.hypot(dx, dy) > 5) {
        suppressClick = true;
        viewport.setPointerCapture(event.pointerId);
        state.x = gesture.startX + dx;
        state.y = gesture.startY + dy;
        draw();
      }
    }
  });
  function endPointer(event) {
    pointers.delete(event.pointerId);
    gesture = null;
    viewport.classList.remove('dragging');
  }
  viewport.addEventListener('pointerup', endPointer);
  viewport.addEventListener('pointercancel', endPointer);
  viewport.addEventListener('pointerleave', event => {
    if (!viewport.hasPointerCapture(event.pointerId)) endPointer(event);
  });

  let resized = false;
  window.addEventListener('resize', () => {
    if (!resized) {
      resized = true;
      requestAnimationFrame(() => { fit(); resized = false; });
    }
  });
  layout();
  fit();
})();
