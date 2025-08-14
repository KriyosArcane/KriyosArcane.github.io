// Animation System
const ANIMATIONS = {
  particles: {
    name: 'Floating Particles',
    init: function() {
      // Density based on screen area so large displays don't look empty
      const area = window.animationW * window.animationH;
      const base = 110; // baseline for ~1920x1080
      const target = Math.min(300, Math.round(base * (area / (1920*1080))));
      this.dots = [];
      for (let i = 0; i < target; i++) {
        this.dots.push({
          x: Math.random() * window.animationW,
          y: Math.random() * window.animationH,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 0.6,
          pulse: Math.random() * Math.PI * 2
        });
      }
    },
    render: function(ctx, w, h) {
      // Subtle fade for trails
      ctx.fillStyle = 'rgba(0,0,0,0.20)';
      ctx.fillRect(0, 0, w, h);

      const color = window.particleColor || 'rgba(54,255,122,0.55)';
      const maxDist = Math.min(240, Math.max(120, Math.min(w, h) / 3));

      // Draw connections first (lighter stroke)
      for (let i = 0; i < this.dots.length; i++) {
        const a = this.dots[i];
        for (let j = i + 1; j < this.dots.length; j++) {
          const b = this.dots[j];
          const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = dx*dx + dy*dy;
            if (dist < maxDist * maxDist) {
              const alpha = 1 - Math.sqrt(dist) / maxDist;
              if (alpha > 0.04) {
                ctx.strokeStyle = color.replace(/rgba\(([^)]+),[^,]+\)$/,'rgba($1,' + (alpha * 0.35).toFixed(3) + ')');
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            }
        }
      }

      // Update & draw particles
      for (const p of this.dots) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > w) { p.x = w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > h) { p.y = h; p.vy *= -1; }

        const glow = (Math.sin(p.pulse) + 1) * 0.5; // 0..1
        const radius = p.r * (0.7 + glow * 0.6);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 3);
        // derive RGB components from color if rgba(r,g,b,a)
        const m = color.match(/rgba\((\d+),(\d+),(\d+)/);
        const rgb = m ? `${m[1]},${m[2]},${m[3]}` : '54,255,122';
        gradient.addColorStop(0, `rgba(${rgb},0.9)`);
        gradient.addColorStop(0.4, `rgba(${rgb},0.35)`);
        gradient.addColorStop(1, `rgba(${rgb},0)`);
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
        ctx.fill();
        // core
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(p.x, p.y, radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
  
  matrix: {
    name: 'Matrix Rain',
    init: function() {
      this.columns = Math.floor(window.animationW / 20);
      this.drops = new Array(this.columns).fill(1);
      this.chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01'.split('');
    },
    render: function(ctx, w, h) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, w, h);
      
      ctx.fillStyle = window.particleColor || 'rgba(54,255,122,0.8)';
      ctx.font = '15px monospace';
      
      for (let i = 0; i < this.drops.length; i++) {
        const text = this.chars[Math.floor(Math.random() * this.chars.length)];
        ctx.fillText(text, i * 20, this.drops[i] * 20);
        
        if (this.drops[i] * 20 > h && Math.random() > 0.975) {
          this.drops[i] = 0;
        }
        this.drops[i]++;
      }
    }
  },
  
  stars: {
    name: 'Starfield',
    init: function() {
      this.stars = [];
      for (let i = 0; i < 200; i++) {
        this.stars.push({
          x: Math.random() * window.animationW,
          y: Math.random() * window.animationH,
          z: Math.random() * 1000,
          speed: Math.random() * 2 + 1
        });
      }
    },
    render: function(ctx, w, h) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, w, h);
      
      const centerX = w / 2;
      const centerY = h / 2;
      
      for (const star of this.stars) {
        star.z -= star.speed;
        if (star.z <= 0) {
          star.x = Math.random() * w;
          star.y = Math.random() * h;
          star.z = 1000;
        }
        
        const x = (star.x - centerX) * (200 / star.z) + centerX;
        const y = (star.y - centerY) * (200 / star.z) + centerY;
        const size = (1 - star.z / 1000) * 2;
        
        ctx.fillStyle = window.particleColor || 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
  
  waves: {
    name: 'Sine Waves',
    init: function() {
      this.time = 0;
      this.waves = [
        { amplitude: 30, frequency: 0.02, phase: 0, speed: 0.08 },
        { amplitude: 20, frequency: 0.03, phase: Math.PI, speed: 0.06 },
        { amplitude: 15, frequency: 0.04, phase: Math.PI / 2, speed: 0.1 }
      ];
    },
    render: function(ctx, w, h) {
      ctx.clearRect(0, 0, w, h);
      this.time += 0.04;
      
      this.waves.forEach((wave, index) => {
        ctx.strokeStyle = window.particleColor || 'rgba(54,255,122,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = 0; x < w; x += 2) {
          const y = h / 2 + Math.sin(x * wave.frequency + this.time * wave.speed + wave.phase) * wave.amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    }
  },
  
  grid: {
    name: 'Cyber Grid',
    init: function() {
      this.gridSize = 30;
      this.pulses = [];
      this.time = 0;
    },
    render: function(ctx, w, h) {
      ctx.clearRect(0, 0, w, h);
      this.time += 0.02;
      
      // Add random pulses (increased frequency)
      if (Math.random() < 0.12) {
        this.pulses.push({
          x: Math.floor(Math.random() * (w / this.gridSize)) * this.gridSize,
          y: Math.floor(Math.random() * (h / this.gridSize)) * this.gridSize,
          intensity: 1,
          decay: 0.015
        });
      }
      
      // Draw grid
      ctx.strokeStyle = window.particleColor || 'rgba(54,255,122,0.2)';
      ctx.lineWidth = 1;
      
      for (let x = 0; x < w; x += this.gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      
      for (let y = 0; y < h; y += this.gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      
      // Draw pulses
      this.pulses = this.pulses.filter(pulse => {
        pulse.intensity -= pulse.decay;
        if (pulse.intensity <= 0) return false;
        
        const alpha = pulse.intensity;
        ctx.fillStyle = window.particleColor.replace(/[\d.]+\)$/, alpha + ')') || `rgba(54,255,122,${alpha})`;
        ctx.fillRect(pulse.x, pulse.y, this.gridSize, this.gridSize);
        return true;
      });
    }
  },
  
  bubbles: {
    name: 'Rising Bubbles',
    init: function() {
      this.bubbles = [];
      for (let i = 0; i < 20; i++) {
        this.bubbles.push({
          x: Math.random() * window.animationW,
          y: window.animationH + Math.random() * 100,
          r: Math.random() * 30 + 10,
          vy: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    },
    render: function(ctx, w, h) {
      ctx.clearRect(0, 0, w, h);
      
      for (const bubble of this.bubbles) {
        bubble.y -= bubble.vy;
        bubble.x += bubble.vx;
        
        if (bubble.y < -bubble.r) {
          bubble.y = h + bubble.r;
          bubble.x = Math.random() * w;
        }
        
        if (bubble.x < -bubble.r || bubble.x > w + bubble.r) {
          bubble.vx *= -1;
        }
        
        ctx.strokeStyle = window.particleColor || 'rgba(54,255,122,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner glow
        ctx.fillStyle = window.particleColor.replace(/[\d.]+\)$/, bubble.opacity * 0.1 + ')') || `rgba(54,255,122,${bubble.opacity * 0.1})`;
        ctx.fill();
      }
    }
  }
};

// Animation Engine
(function() {
  const c = document.getElementById('space');
  const ctx = c.getContext('2d');
  let w, h;
  
  function resize() {
    w = innerWidth;
    h = innerHeight;
    window.animationW = w;
    window.animationH = h;
    c.width = w;
    c.height = h;
    
    // Reinitialize current animation
    if (window.currentAnimation && ANIMATIONS[window.currentAnimation]) {
      ANIMATIONS[window.currentAnimation].init();
    }
  }
  
  window.addEventListener('resize', resize);
  resize();
  
  // Initialize particle color and current animation
  window.particleColor = 'rgba(54,255,122,0.55)';
  window.currentAnimation = 'particles';
  ANIMATIONS[window.currentAnimation].init();
  
  function tick() {
    if (window.currentAnimation && ANIMATIONS[window.currentAnimation]) {
      ANIMATIONS[window.currentAnimation].render(ctx, w, h);
    }
    requestAnimationFrame(tick);
  }
  
  tick();
})();

// Terminal core
const screen = document.getElementById('screen');
const input = document.getElementById('cmd');
const ps1El = document.getElementById('ps1');
const titleEl = document.getElementById('title-text');
const manifest = JSON.parse(document.getElementById('posts-manifest').textContent);
const resumeText = document.getElementById('resume-text').textContent || '';
const YT = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

const COMMANDS = ['whoami', 'id', 'pwd', 'ls', 'cd', 'cat', 'less', 'vim', 'nano', 'ps', 'strings', 'find', 'echo', 'sudo', 'clear', 'help', 'nmap', 'ssh', 'banner', 'msfconsole', 'theme', 'animation'];

const state = {
  user: 'fagan',
  host: 'kr1y0s',
  sep: '@',
  cwd: manifest.cwd || '~',
  root: false,
  files: new Map(),
  localDirs: new Map(),
  sysDirs: new Map(),
  blogFiles: new Map(), // Cache for blog files
  blogFilesLoaded: false,
  history: [],
  hIndex: -1,
  mode: 'shell',
  msf: { module: null, opts: {} },
  currentTheme: 'matrix',
  currentAnimation: 'particles'
};

// Color themes
const THEMES = {
  matrix: {
    name: 'Matrix Green',
    colors: {
      bg: '#0b0f0c',
      green: '#36ff7a',
      accent: '#36ff7a',
      text: '#c9ffd9',
      muted: '#6ce6a7',
      border: '#164727',
      particles: 'rgba(54,255,122,0.55)'
    }
  },
  cyberpunk: {
    name: 'Cyberpunk Pink',
    colors: {
      bg: '#0f0b14',
      green: '#ff1493',
      accent: '#ff1493',
      text: '#ff69b4',
      muted: '#da70d6',
      border: '#8b008b',
      particles: 'rgba(255,20,147,0.55)'
    }
  },
  amber: {
    name: 'Amber Classic',
    colors: {
      bg: '#1a1000',
      green: '#ffb000',
      accent: '#ffb000',
      text: '#ffa500',
      muted: '#ff8c00',
      border: '#cc8800',
      particles: 'rgba(255,176,0,0.55)'
    }
  },
  ocean: {
    name: 'Ocean Blue',
    colors: {
      bg: '#0a0f1a',
      green: '#00bfff',
      accent: '#00bfff',
      text: '#87ceeb',
      muted: '#4682b4',
      border: '#1e90ff',
      particles: 'rgba(0,191,255,0.55)'
    }
  },
  fire: {
    name: 'Fire Red',
    colors: {
      bg: '#1a0a0a',
      green: '#ff4500',
      accent: '#ff4500',
      text: '#ff6347',
      muted: '#dc143c',
      border: '#b22222',
      particles: 'rgba(255,69,0,0.55)'
    }
  },
  purple: {
    name: 'Royal Purple',
    colors: {
      bg: '#140a1a',
      green: '#9370db',
      accent: '#9370db',
      text: '#dda0dd',
      muted: '#ba55d3',
      border: '#663399',
      particles: 'rgba(147,112,219,0.55)'
    }
  },
  terminal: {
    name: 'Classic Terminal',
    colors: {
      bg: '#000000',
      green: '#00ff00',
      accent: '#00ff00',
      text: '#00ff00',
      muted: '#008000',
      border: '#004000',
      particles: 'rgba(0,255,0,0.55)'
    }
  },
  frost: {
    name: 'Frost White',
    colors: {
      bg: '#0a0f14',
      green: '#ffffff',
      accent: '#ffffff',
      text: '#e6e6fa',
      muted: '#c0c0c0',
      border: '#696969',
      particles: 'rgba(255,255,255,0.55)'
    }
  }
};

// GitHub API functions
async function fetchGitHubRepoFiles() {
  try {
    const response = await fetch('https://api.github.com/repos/KriyosArcane/blogs/contents');
    if (!response.ok) throw new Error('Failed to fetch');
    const files = await response.json();
    
    // Filter for markdown files and extract names
    const blogFiles = files
      .filter(file => file.type === 'file' && file.name.endsWith('.md'))
      .map(file => ({
        name: file.name,
        download_url: file.download_url,
        path: file.path
      }));
    
    // Update state
    state.blogFiles.clear();
    blogFiles.forEach(file => {
      state.blogFiles.set(file.name, file);
    });
    
    state.blogFilesLoaded = true;
    console.log('Blog files loaded:', blogFiles.length, 'files');
    return blogFiles;
  } catch (error) {
    console.error('Failed to fetch blog files:', error);
    // Fallback to empty array
    state.blogFilesLoaded = true;
    return [];
  }
}

async function fetchBlogContent(fileName) {
  try {
    const file = state.blogFiles.get(fileName);
    if (!file) return null;
    
    const response = await fetch(file.download_url);
    if (!response.ok) throw new Error('Failed to fetch content');
    
    return await response.text();
  } catch (error) {
    console.error('Failed to fetch blog content:', error);
    return null;
  }
}

// Seed manifest
(function() {
  for (const f of manifest.files) {
    state.files.set(f.name, f);
  }
  for (const d of manifest.dirs) {
    if (d.name && d.name.startsWith('/')) {
      state.sysDirs.set(d.name, d);
    } else {
      state.localDirs.set(d.name, d);
    }
  }
})();

function ps1() {
  return state.user + state.sep + state.host + ' ' + state.cwd + ' >';
}

function updatePS1() {
  ps1El.textContent = ps1();
  titleEl.textContent = state.user + state.sep + state.host + ' — Terminal';
}

function println(html) {
  const el = document.createElement('div');
  el.className = 'line';
  el.innerHTML = html || '';
  screen.appendChild(el);
  screen.scrollTop = screen.scrollHeight;
}

function typeWriter(text, speed) {
  speed = speed || 14;
  return new Promise(resolve => {
    const el = document.createElement('div');
    el.className = 'line';
    screen.appendChild(el);
    let i = 0;
    const id = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      screen.scrollTop = screen.scrollHeight;
      if (i >= text.length) {
        clearInterval(id);
        resolve();
      }
    }, speed);
  });
}

function escapeHTML(s) {
  s = String(s || '');
  return s.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
}

// Path helpers
function resolvePath(input) {
  if (!input) return state.cwd;
  const parts = input.split('/').filter(Boolean);
  let base = [];
  
  if (input[0] === '/') {
    base = parts;
  } else {
    if (state.cwd === '~') {
      base = [];
    } else if (state.cwd === 'blogs') {
      base = ['blogs'];
    } else if (state.cwd === '/usr/local/bin') {
      base = ['usr', 'local', 'bin'];
    } else if (state.cwd === '/root') {
      base = ['root'];
    } else {
      base = state.cwd.split('/').filter(Boolean);
    }
    base = base.concat(parts);
  }
  
  const out = [];
  for (const p of base) {
    if (p === '.') continue;
    if (p === '..') {
      if (out.length) out.pop();
      continue;
    }
    out.push(p);
  }
  
  if (out.length === 0) return '~';
  if (out[0] === 'blogs') return 'blogs';
  if (out[0] === 'usr' && out[1] === 'local' && out[2] === 'bin') return '/usr/local/bin';
  if (out[0] === 'root') return '/root';
  return out.join('/');
}

function listContents(loc, showHidden = false) {
  const items = [];
  if (loc === '~' || !loc) {
    for (const [name, f] of state.files) {
      if (showHidden || !name.startsWith('.')) {
        items.push({ name, f });
      }
    }
    for (const [d, dir] of state.localDirs) items.push({ name: d, f: { type: 'dir', dir } });
  } else if (loc === 'blogs') {
    // Use dynamic blog files from GitHub
    if (state.blogFilesLoaded) {
      for (const [name, file] of state.blogFiles) {
        items.push({ name, f: { type: 'file', path: file.download_url } });
      }
    } else {
      // Show loading message if not loaded yet
      items.push({ name: 'Loading...', f: { type: 'file' } });
    }
  } else if (loc === '/usr/local/bin') {
    const d = state.sysDirs.get('/usr/local/bin');
    if (d && d.files) {
      for (const fi of d.files) items.push({ name: fi.name, f: fi });
    }
  } else if (loc === '/root') {
    const d = state.sysDirs.get('/root');
    if (d && d.files) {
      for (const fi of d.files) items.push({ name: fi.name, f: fi });
    }
  }
  return items;
}

function findFile(path) {
  if (!path) return null;
  const clean = path.replace(/^\/+/, '');
  
  if (clean.indexOf('blogs/') === 0) {
    const base = clean.split('/').pop();
    const file = state.blogFiles.get(base);
    if (file) return { dir: 'blogs', file: base, path: file.download_url };
  }
  
  // Check if it's a direct blog file name
  if (state.blogFiles.has(path)) {
    const file = state.blogFiles.get(path);
    return { dir: 'blogs', file: path, path: file.download_url };
  }
  
  if (state.files.has(path)) {
    return { dir: '~', file: path, path: state.files.get(path).path };
  }
  
  if (['usr/local/bin/nano', 'bin/nano', 'nano', '/usr/local/bin/nano'].indexOf(path) !== -1) {
    const d = state.sysDirs.get('/usr/local/bin');
    const f = d && d.files.find(x => x.name === 'nano');
    if (f) return { dir: '/usr/local/bin', file: 'nano', path: f.path };
  }
  
  if (['secret/root.txt', 'root.txt', '/root/root.txt'].indexOf(path) !== -1) {
    const d = state.sysDirs.get('/root');
    const f = d && d.files.find(x => x.name === 'root.txt');
    if (f) return { dir: '/root', file: 'root.txt', path: f.path };
  }
  
  return null;
}

// Command implementations
function doLs(args) {
  const showHidden = args && (args.includes('-a') || args.includes('-la') || args.includes('-al'));
  const arg = args && args.length ? args.find(a => !a.startsWith('-')) : null;
  
  if (!arg) {
    const items = listContents(state.cwd, showHidden);
    const line = document.createElement('div');
    line.className = 'line';
    items.forEach(({ name, f }) => {
      const span = document.createElement('span');
      span.className = 'file' + (f.type === 'dir' ? ' dir' : '');
      span.textContent = name;
      span.tabIndex = 0;
      span.addEventListener('click', () => {
        if (f.type === 'dir') {
          run('cd ' + name);
          setTimeout(() => run('ls'), 100);
        } else {
          run('cat ' + (state.cwd === 'blogs' ? name : name));
        }
      });
      line.appendChild(span);
      line.appendChild(document.createTextNode('  '));
    });
    screen.appendChild(line);
    screen.scrollTop = screen.scrollHeight;
    return;
  }
  
  const found = findFile(arg);
  if (found && found.file) {
    println(found.file);
    return;
  }
  
  const resolved = resolvePath(arg);
  if (resolved === '/root' && !state.root) {
    println('ls: cannot open directory ' + arg + ': Permission denied');
    return;
  }
  
  const contents = listContents(resolved, showHidden);
  if (contents.length === 0) {
    println('ls: ' + arg + ': No such file or directory');
    return;
  }
  
  const line = document.createElement('div');
  line.className = 'line';
  contents.forEach(({ name, f }) => {
    const span = document.createElement('span');
    span.className = 'file' + (f.type === 'dir' ? ' dir' : '');
    span.textContent = name;
    span.tabIndex = 0;
    span.addEventListener('click', () => {
      if (f.type === 'dir') {
        run('cd ' + name);
        setTimeout(() => run('ls'), 100);
      } else {
        run('cat ' + (resolved === 'blogs' ? name : name));
      }
    });
    line.appendChild(span);
    line.appendChild(document.createTextNode('  '));
  });
  screen.appendChild(line);
  screen.scrollTop = screen.scrollHeight;
}

function doCd(arg) {
  if (!arg || arg === '~') {
    state.cwd = '~';
    updatePS1();
    return;
  }
  
  const resolved = resolvePath(arg);
  if (resolved === '/root' && !state.root) {
    println('cd: permission denied: /root');
    return;
  }
  
  if (['~', 'blogs', '/usr/local/bin', '/root'].indexOf(resolved) !== -1) {
    state.cwd = resolved;
    updatePS1();
    return;
  }
  
  if (resolved.indexOf('blogs/') === 0) {
    state.cwd = 'blogs';
    updatePS1();
    return;
  }
  
  println('cd: no such file or directory: ' + escapeHTML(arg));
}

async function fetchText(path) {
  try {
    const r = await fetch(path);
    if (!r.ok) throw 0;
    return await r.text();
  } catch (e) {
    return null;
  }
}

function renderMarkdownSimple(md) {
  if (md === null || md === undefined) return '';
  const lines = md.split('\n');
  const out = [];
  let inList = false;
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockLines = [];
  
  for (let L of lines) {
    // Handle code blocks (```)
    if (L.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        if (inList) {
          out.push('</ul>');
          inList = false;
        }
        const codeContent = codeBlockLines.join('\n');
        out.push('<pre><code class="' + escapeHTML(codeBlockLang) + '">' + escapeHTML(codeContent) + '</code></pre>');
        inCodeBlock = false;
        codeBlockLang = '';
        codeBlockLines = [];
      } else {
        // Start code block
        if (inList) {
          out.push('</ul>');
          inList = false;
        }
        inCodeBlock = true;
        codeBlockLang = L.trim().slice(3) || 'text';
        codeBlockLines = [];
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBlockLines.push(L);
      continue;
    }
    
    if (L.trim() === '') {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      out.push('');
      continue;
    }
    
    // Headers
    if (L.indexOf('### ') === 0) {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      out.push('<h3>' + processInlineMarkdown(L.slice(4)) + '</h3>');
      continue;
    }
    
    if (L.indexOf('## ') === 0) {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      out.push('<h2>' + processInlineMarkdown(L.slice(3)) + '</h2>');
      continue;
    }
    
    if (L.indexOf('# ') === 0) {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      out.push('<h1>' + processInlineMarkdown(L.slice(2)) + '</h1>');
      continue;
    }
    
    // Unordered lists
    if (L.trim().indexOf('- ') === 0 || L.trim().indexOf('* ') === 0) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push('<li>' + processInlineMarkdown(L.trim().slice(2)) + '</li>');
      continue;
    }
    
    // Ordered lists
    if (/^\s*\d+\.\s/.test(L)) {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      if (!inList || out[out.length - 1].indexOf('<ol>') === -1) {
        out.push('<ol>');
        inList = 'ordered';
      }
      const match = L.match(/^\s*\d+\.\s(.+)$/);
      if (match) {
        out.push('<li>' + processInlineMarkdown(match[1]) + '</li>');
      }
      continue;
    }
    
    // Images
    if (L.indexOf('![') === 0) {
      const a = L.indexOf('](');
      const b = L.lastIndexOf(')');
      if (a > 0 && b > a) {
        const alt = L.slice(2, a);
        const url = L.slice(a + 2, b);
        out.push('<img src="' + escapeHTML(url) + '" alt="' + escapeHTML(alt) + '" style="max-width: 100%; height: auto; border-radius: 4px;">');
        continue;
      }
    }
    
    // Links
    if (L.indexOf('[') !== -1 && L.indexOf('](') !== -1) {
      out.push('<p>' + processInlineMarkdown(L) + '</p>');
      continue;
    }
    
    // Blockquotes
    if (L.trim().startsWith('> ')) {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      out.push('<blockquote>' + processInlineMarkdown(L.trim().slice(2)) + '</blockquote>');
      continue;
    }
    
    // Horizontal rules
    if (L.trim() === '---' || L.trim() === '***' || L.trim() === '___') {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      out.push('<hr>');
      continue;
    }
    
    // Regular paragraphs
    out.push('<p>' + processInlineMarkdown(L) + '</p>');
  }
  
  if (inList) {
    if (inList === 'ordered') {
      out.push('</ol>');
    } else {
      out.push('</ul>');
    }
  }
  
  if (inCodeBlock) {
    // Close unclosed code block
    const codeContent = codeBlockLines.join('\n');
    out.push('<pre><code class="' + escapeHTML(codeBlockLang) + '">' + escapeHTML(codeContent) + '</code></pre>');
  }
  
  return out.join('\n');
}

function processInlineMarkdown(text) {
  if (!text) return '';
  
  // Process in order: code, bold/italic, links
  let result = text;
  
  // Inline code first (to avoid processing markdown inside code)
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold and italic (**text** and *text*)
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Links [text](url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #36ff7a; text-decoration: underline;">$1</a>');
  
  // Strikethrough ~~text~~
  result = result.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  
  // Escape HTML in the final result (but preserve our markdown HTML)
  const tempMarkers = {
    code: '___CODE___',
    strong: '___STRONG___',
    em: '___EM___',
    link: '___LINK___',
    del: '___DEL___'
  };
  
  // Replace our HTML with temporary markers
  result = result.replace(/<code>([^<]+)<\/code>/g, `${tempMarkers.code}$1${tempMarkers.code}`);
  result = result.replace(/<strong>([^<]+)<\/strong>/g, `${tempMarkers.strong}$1${tempMarkers.strong}`);
  result = result.replace(/<em>([^<]+)<\/em>/g, `${tempMarkers.em}$1${tempMarkers.em}`);
  result = result.replace(/<a href="([^"]+)" target="_blank" rel="noopener noreferrer" style="color: #36ff7a; text-decoration: underline;">([^<]+)<\/a>/g, `${tempMarkers.link}$2|$1${tempMarkers.link}`);
  result = result.replace(/<del>([^<]+)<\/del>/g, `${tempMarkers.del}$1${tempMarkers.del}`);
  
  // Escape HTML
  result = escapeHTML(result);
  
  // Restore our HTML
  result = result.replace(new RegExp(`${tempMarkers.code}([^${tempMarkers.code.slice(0, 3)}]+)${tempMarkers.code}`, 'g'), '<code>$1</code>');
  result = result.replace(new RegExp(`${tempMarkers.strong}([^${tempMarkers.strong.slice(0, 3)}]+)${tempMarkers.strong}`, 'g'), '<strong>$1</strong>');
  result = result.replace(new RegExp(`${tempMarkers.em}([^${tempMarkers.em.slice(0, 3)}]+)${tempMarkers.em}`, 'g'), '<em>$1</em>');
  result = result.replace(new RegExp(`${tempMarkers.link}([^|]+)\\|([^${tempMarkers.link.slice(0, 3)}]+)${tempMarkers.link}`, 'g'), '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #36ff7a; text-decoration: underline;">$1</a>');
  result = result.replace(new RegExp(`${tempMarkers.del}([^${tempMarkers.del.slice(0, 3)}]+)${tempMarkers.del}`, 'g'), '<del>$1</del>');
  
  return result;
}

async function doCat(name) {
  if (!name) {
    println('cat: missing operand');
    return;
  }
  
  if (name === 'resume.txt') {
    // Using actual resume content
    const resumeContent = `
FAGAN AFANDIYEV
===============

🌐 faganafandiyev.com | � faganafandiyev@usf.edu | 🔗 linkedin.com/in/fagan-afandi

EDUCATION
---------
Bachelor of Science in Cyber Security                                    Graduation: May 2027
University of South Florida, Tampa FL
Founding Member at CyberHerd (USF's Cybersecurity Competition team)

Recognitions/Awards:
• 1st Place – Def Con 33, Adversary Village CTF                          August 2025
• 1st Place – TempleLabs, Social Engineering Competition                 April 2025
• 1st Place – BSides Tampa, Hack The Box CTF                            May 2025
• 1st Place – NCAE, Cyber Games South East Region                       Feb 2024
• 2nd Place – Collegiate Penetration Testing Competition                 November 2024
• 2nd Place – Aviation ISAC CTF                                         October 2024

CERTIFICATIONS
--------------
• Offensive Security Experienced Penetration Tester (OSEP)              Expected Oct 2025
• HackTheBox Certified Active Directory Pentesting Expert (CAPE)        April 2025
• HackTheBox Certified Penetration Testing Specialist (CPTS)            July 2025
• Zero-Point Security Certified Red Team Operator (CRTO)                June 2025
• WhiteKnightLabs Advanced Red Team Operator (ARTO)                     July 2024
• CompTIA Security+                                                      March 2024

WORK EXPERIENCE
---------------
White Knight Labs Inc. | Offensive Security Intern                      August 2024 – Present
• Led internal penetration tests across 10+ enterprise networks, compromising
  full domains in 95% of the engagements
• Developed the Offensive Active Directory Operations Course (OADOC), a 1,000+
  page expert-level curriculum with a lab network of 10+ hosts, 5 domains, and
  3 forests, covering SCCM, ADCS, ADFS, ADWS, and more
• Authored the Entry Level Penetration Tester (ELPT) course, covering
  infrastructure, Linux, web, Active Directory, Command and Control (C2)
  frameworks, defence evasion, reporting, and client communication
• Shadowed senior penetration testers and red team operators on 5+ client
  engagements, gaining exposure to advanced tactics, opsec practices, and
  complex Active Directory exploitation techniques

LEADERSHIP
----------
WCSC, Whitehatters Computer Security Club                               Tampa, FL
President                                                                December 2024 – Present
• Directed operations for 150+ active members, increasing event attendance
  by 55% through hands-on trainings
• Coordinated and facilitated 60+ meetings and events annually, attracting
  an average of 40+ participants per event
• Delivered 10+ workshops focused on Web exploitation, EDR Evasion, and
  Active Directory attacks
• Secured 4 new partnerships with Rapid7, Honeywell, CyberFlorida, and
  ReliaQuest, expanding opportunities

OPEN SOURCE CONTRIBUTIONS
-------------------------
NetExec Modules | Python, Linux, Active Directory, Windows, SMB, LDAP   April 2025
• Contributed code to a widely adopted open-source project with 4,500+ GitHub stars
• Created a module to automate tool transfer and execution, streamlining
  enumeration and exploitation
• Developed a password attack module enabling rapid remote credential resets,
  boosting engagement efficiency
• Implemented an LDAP obfuscation feature to bypass detection systems
  enhancing stealth during engagements

TECHNICAL SKILLS
----------------
Coding: Proficient in C/C++, Python, Powershell, Bash, JavaScript, HTML/CSS;
        Working Knowledge of SQL, Rust

Offensive Tools: Kali Linux, Nmap, Metasploit, Wireshark, Cobalt Strike,
                 Sliver, BloodHound, Rubeus, Impacket, NetExec, SharpHound,
                 Certipy, Mimikatz, PowerSploit, Mythic, Havoc

Defensive Tools: Splunk, Elastic, Sysmon, Velociraptor, Wazuh, Sigma,
                 PingCastle, Snort, MITRE Caldera, Atomic Red Team

Languages: Fluent in English, Azerbaijani, Turkish; Working Proficiency in Russian

---
Google Docs version: https://docs.google.com/document/d/14bAwAc0IIuxOXpQhVnNfwh62WPvcfD_v4dHOhpCiFzo/edit?usp=sharing
    `;

    println('📄 RESUME');
    println('=========');
    println('');
    
    // Render the resume content line by line with proper formatting
    const lines = resumeContent.trim().split('\n');
    for (const line of lines) {
      if (line.trim() === '') {
        println('');
      } else if (line.includes('===') || line.includes('---')) {
        println('<span style="color: #36ff7a;">' + escapeHTML(line) + '</span>');
      } else if (line.match(/^[A-Z\s&-]+$/)) {
        // Headers in caps
        println('<span style="color: #36ff7a; font-weight: bold;">' + escapeHTML(line) + '</span>');
      } else if (line.startsWith('•')) {
        // Bullet points
        println('<span style="color: #6ce6a7;">  ' + escapeHTML(line) + '</span>');
      } else if (line.includes('🌐') || line.includes('📧') || line.includes('🔗')) {
        // Contact info with emojis
        println('<span style="color: #36ff7a;">' + escapeHTML(line) + '</span>');
      } else {
        println(escapeHTML(line));
      }
    }
    
    println('');
    println('<a href="https://docs.google.com/document/d/14bAwAc0IIuxOXpQhVnNfwh62WPvcfD_v4dHOhpCiFzo/edit?usp=sharing" target="_blank" rel="noopener noreferrer" style="color: #36ff7a; text-decoration: underline;">🔗 View full resume in Google Docs</a>');
    return;
  }
  
  if (state.cwd === 'blogs' && name.indexOf('/') === -1) {
    // Handle blog files from GitHub
    if (state.blogFiles.has(name)) {
      const content = await fetchBlogContent(name);
      if (content === null) {
        println('cat: ' + name + ': No such file or failed to load');
        return;
      }
      println(renderMarkdownSimple(content));
      return;
    }
  }
  
  if (name.indexOf('blogs/') === 0) {
    const base = name.split('/').pop();
    if (state.blogFiles.has(base)) {
      const content = await fetchBlogContent(base);
      if (content === null) {
        println('cat: ' + base + ': No such file or failed to load');
        return;
      }
      println(renderMarkdownSimple(content));
      return;
    }
  }
  
  if (name === 'root.txt' || name === '/root/root.txt' || name === 'secret/root.txt') {
    if (!state.root) {
      println('cat: permission denied');
      return;
    }
    const enc = btoa(YT);
    println('root.txt: Nice work, root. Click reward: <a href="' + YT + '" target="_blank" rel="noreferrer">' + enc + '</a>');
    return;
  }
  
  const fh = state.files.get(name);
  if (fh) {
    const t = await fetchText(fh.path);
    if (t === null) {
      println('cat: ' + name + ': No such file');
      return;
    }
    println(renderMarkdownSimple(t));
    return;
  }
  
  println('cat: ' + escapeHTML(name) + ': No such file');
}

function doLess(name) {
  return doCat(name).then(() => println('(END)'));
}

function doPs(args) {
  println('PID   TTY      TIME     CMD');
  println('1337  pts/0    00:00:01 zsh');
  println('1701  pts/0    00:00:00 node particles.js');
  if (args && args.indexOf('-ef') !== -1) {
    println('root      1     0  0 ?  00:00:01 /sbin/init');
    println('root   4040     1  0 ?  00:00:00 /usr/bin/nano (suid)');
  }
}

function doStrings(name) {
  if (name === '/usr/bin/nano' || name === 'nano') {
    println('libc.so.6');
    println('/bin/sh');
    println('/bin/bash');
    println('HINT: nano -s /bin/sh  (SUID)');
  } else {
    println('strings: no printable strings found');
  }
}

function doFind(args) {
  const q = (args || []).join(' ');
  if (q.indexOf('-perm') !== -1 && q.indexOf('4000') !== -1) {
    println('/usr/bin/sudo');
    println('/usr/bin/nano');
    println('/usr/local/bin/pkexec');
  } else {
    println('find: nothing found');
  }
}

function doNmap(args) {
  const target = (args && args[0]) || '';
  if (target === 'localhost' || target === '127.0.0.1') {
    println('Starting Nmap (sim)');
    println('Nmap scan report for localhost (127.0.0.1)');
    println('PORT     STATE SERVICE');
    println('22/tcp   open  ssh   (Try: ssh root@127.0.0.1)');
    println('80/tcp   open  http  (Hint: cat welcome.md)');
    println('1337/tcp open  ctf   (Hidden: find / -perm -4000 -type f)');
  } else {
    println('Simulated scanner. Try: nmap localhost');
  }
}

function doSSH(args) {
  const target = (args && args[0]) || '';
  if (target !== 'root@127.0.0.1') {
    println('ssh: could not resolve host. Try: ssh root@127.0.0.1');
    return;
  }
  println('root@127.0.0.1\'s password:');
  state.mode = 'ssh-pass';
}

function sshHandlePassword(pw) {
  state.mode = 'shell';
  const ok = ['toor', 'letmein', 'hunter2', 'kr1y0s'];
  if (ok.indexOf((pw || '').trim()) !== -1) {
    println('Permission granted. Welcome, root.');
    becomeRoot('via ssh');
  } else {
    println('Permission denied, please try again.');
  }
}

function doBanner(text) {
  const up = (text || 'KR1Y0S').toUpperCase();
  const rows = ['', '', '', '', '', ''];
  const sampleFont = {
    'A': ['  ██  ', ' ████ ', '██  ██', '██████', '██  ██', '██  ██'],
    'B': ['█████ ', '██  ██', '█████ ', '█████ ', '██  ██', '█████ '],
    'C': [' █████', '██    ', '██    ', '██    ', '██    ', ' █████'],
    'D': ['█████ ', '██  ██', '██  ██', '██  ██', '██  ██', '█████ '],
    'E': ['██████', '██    ', '█████ ', '█████ ', '██    ', '██████'],
    'F': ['██████', '██    ', '█████ ', '█████ ', '██    ', '██    '],
    'G': [' █████', '██    ', '██ ███', '██  ██', '██  ██', ' █████'],
    'H': ['██  ██', '██  ██', '██████', '██████', '██  ██', '██  ██'],
    'I': ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  ', '██████'],
    'J': ['██████', '    ██', '    ██', '    ██', '██  ██', ' █████'],
    'K': ['██  ██', '██ ██ ', '████  ', '████  ', '██ ██ ', '██  ██'],
    'L': ['██    ', '██    ', '██    ', '██    ', '██    ', '██████'],
    'M': ['██  ██', '██████', '██████', '██  ██', '██  ██', '██  ██'],
    'N': ['██  ██', '███ ██', '██████', '██ ███', '██  ██', '██  ██'],
    'O': [' █████', '██  ██', '██  ██', '██  ██', '██  ██', ' █████'],
    'P': ['█████ ', '██  ██', '██  ██', '█████ ', '██    ', '██    '],
    'Q': [' █████', '██  ██', '██  ██', '██ ███', '██  ██', ' ██████'],
    'R': ['█████ ', '██  ██', '██  ██', '█████ ', '██ ██ ', '██  ██'],
    'S': [' █████', '██    ', ' ████ ', '    ██', '    ██', '█████ '],
    'T': ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  ', '  ██  '],
    'U': ['██  ██', '██  ██', '██  ██', '██  ██', '██  ██', ' █████'],
    'V': ['██  ██', '██  ██', '██  ██', '██  ██', ' ████ ', '  ██  '],
    'W': ['██  ██', '██  ██', '██  ██', '██████', '██████', '██  ██'],
    'X': ['██  ██', ' ████ ', '  ██  ', '  ██  ', ' ████ ', '██  ██'],
    'Y': ['██  ██', '██  ██', ' ████ ', '  ██  ', '  ██  ', '  ██  '],
    'Z': ['██████', '    ██', '   ██ ', '  ██  ', ' ██   ', '██████'],
    '1': ['  ██  ', ' ███  ', '  ██  ', '  ██  ', '  ██  ', '██████'],
    '2': [' █████', '██  ██', '   ██ ', '  ██  ', ' ██   ', '██████'],
    '3': [' █████', '██  ██', '  ███ ', '    ██', '██  ██', ' █████'],
    '4': ['██  ██', '██  ██', '██████', '    ██', '    ██', '    ██'],
    '5': ['██████', '██    ', '█████ ', '    ██', '██  ██', ' █████'],
    '6': [' █████', '██    ', '█████ ', '██  ██', '██  ██', ' █████'],
    '7': ['██████', '    ██', '   ██ ', '  ██  ', ' ██   ', '██    '],
    '8': [' █████', '██  ██', ' █████', ' █████', '██  ██', ' █████'],
    '9': [' █████', '██  ██', '██  ██', ' ██████', '    ██', ' █████'],
    '0': [' █████', '██  ██', '██  ██', '██  ██', '██  ██', ' █████'],
    ' ': ['      ', '      ', '      ', '      ', '      ', '      ']
  };
  
  for (const ch of up) {
    const glyph = sampleFont[ch] || ['██████', '██    ', '██████', '██████', '██    ', '██████']; // Default for unknown chars
    for (let i = 0; i < 6; i++) {
      rows[i] += glyph[i] + '  ';
    }
  }
  
  println('<pre>' + rows.join('\n') + '</pre>');
}

// Theme management functions
function applyTheme(themeName) {
  if (!THEMES[themeName]) {
    println('Unknown theme: ' + themeName);
    return;
  }
  
  const theme = THEMES[themeName];
  const root = document.documentElement;
  
  // Update CSS variables
  root.style.setProperty('--bg', theme.colors.bg);
  root.style.setProperty('--green', theme.colors.green);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--text', theme.colors.text);
  root.style.setProperty('--muted', theme.colors.muted);
  
  // Update particle color
  const canvas = document.getElementById('space');
  if (canvas && canvas.getContext) {
    // Store the new particle color for the animation loop
    window.particleColor = theme.colors.particles;
  }
  
  state.currentTheme = themeName;
  println('Theme changed to: ' + theme.name);
}

function doTheme(args) {
  if (!args || args.length === 0) {
    // List available themes
    println('Available themes:');
    for (const [key, theme] of Object.entries(THEMES)) {
      const current = key === state.currentTheme ? ' (current)' : '';
      println('  ' + key + ' — ' + theme.name + current);
    }
    println('');
    println('Usage: theme <name>');
    return;
  }
  
  const themeName = args[0].toLowerCase();
  applyTheme(themeName);
}

function cycleTheme() {
  const themeKeys = Object.keys(THEMES);
  const currentIndex = themeKeys.indexOf(state.currentTheme);
  const nextIndex = (currentIndex + 1) % themeKeys.length;
  const nextTheme = themeKeys[nextIndex];
  applyTheme(nextTheme);
}

// Animation management functions
function applyAnimation(animationName) {
  if (!ANIMATIONS[animationName]) {
    println('Unknown animation: ' + animationName);
    return;
  }
  
  window.currentAnimation = animationName;
  ANIMATIONS[animationName].init();
  state.currentAnimation = animationName;
  println('Animation changed to: ' + ANIMATIONS[animationName].name);
}

function doAnimation(args) {
  if (!args || args.length === 0) {
    // List available animations
    println('Available animations:');
    for (const [key, animation] of Object.entries(ANIMATIONS)) {
      const current = key === state.currentAnimation ? ' (current)' : '';
      println('  ' + key + ' — ' + animation.name + current);
    }
    println('');
    println('Usage: animation <name>');
    return;
  }
  
  const animationName = args[0].toLowerCase();
  applyAnimation(animationName);
}

function cycleAnimation() {
  const animationKeys = Object.keys(ANIMATIONS);
  const currentIndex = animationKeys.indexOf(state.currentAnimation || 'particles');
  const nextIndex = (currentIndex + 1) % animationKeys.length;
  const nextAnimation = animationKeys[nextIndex];
  applyAnimation(nextAnimation);
}

// msf console sim
function msfStart() {
  println('Metasploit (sim)');
  println('msf6 >');
  state.mode = 'msf';
  state.msf = { module: null, opts: {} };
}

function msfHandle(line) {
  const parts = splitArgs(line || '');
  const cmd = parts[0] || '';
  const rest = parts.slice(1);
  const arg = rest.join(' ');
  
  if (!cmd) {
    println('msf6 >');
    return;
  }
  
  if (cmd === 'use') {
    if (arg === 'exploit/ctf/privesc') {
      state.msf.module = arg;
      println('msf6 exploit(ctf/privesc) >');
    } else {
      println('[-] Unknown module');
    }
    return;
  }
  
  if (cmd === 'set') {
    const k = rest[0];
    const v = rest.slice(1).join(' ');
    state.msf.opts[(k || '').toUpperCase()] = v;
    println('option set');
    return;
  }
  
  if (cmd === 'show' && rest[0] === 'options') {
    println(JSON.stringify(state.msf.opts, null, 2));
    return;
  }
  
  if (cmd === 'info') {
    println('Module: ' + (state.msf.module || 'none') + ' (sim)');
    return;
  }
  
  if (cmd === 'run' || cmd === 'exploit') {
    if (state.msf.module === 'exploit/ctf/privesc') {
      println('[+] Launching privesc ...');
      becomeRoot('via msfmodule');
    } else {
      println('[-] No module selected');
    }
    return;
  }
  
  if (cmd === 'back' || cmd === 'exit' || cmd === 'quit') {
    state.mode = 'shell';
    println('Bye.');
    return;
  }
  
  println('msf6 > ' + escapeHTML(line) + ' (noop)');
}

function msfHelp() {
  return [
    'msfconsole (sim) commands:',
    '  use <module> — select module (try: use exploit/ctf/privesc)',
    '  set <OPTION> <VAL> — set module options',
    '  show options',
    '  info',
    '  run | exploit',
    '  back',
    '  exit | quit'
  ].join('\n');
}

function becomeRoot(reason) {
  state.root = true;
  state.user = 'root';
  state.sep = '☠';
  document.body.classList.add('root-mode');
  updatePS1();
  println('[+] Privilege escalation successful' + (reason ? ': ' + reason : '') + '. You are now root.');
}

function splitArgs(s) {
  const out = [];
  let cur = '';
  let inQuote = false;
  let quoteChar = '';
  
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inQuote) {
      if (ch === quoteChar) {
        inQuote = false;
        quoteChar = '';
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"' || ch === "'") {
        inQuote = true;
        quoteChar = ch;
      } else if (ch === ' ') {
        if (cur) {
          out.push(cur);
          cur = '';
        }
      } else {
        cur += ch;
      }
    }
  }
  
  if (cur) out.push(cur);
  return out;
}

async function run(cmdline, opts) {
  if (!cmdline) return;
  const echo = !(opts && opts.echo === false);
  
  if (echo && state.mode === 'shell') {
    await typeWriter(ps1() + ' ' + cmdline);
  }
  
  if (state.mode === 'ssh-pass') {
    return sshHandlePassword(cmdline);
  }
  
  if (state.mode === 'msf') {
    return msfHandle(cmdline);
  }
  
  const parts = splitArgs(cmdline.trim());
  const cmd = (parts[0] || '').toLowerCase(); // Convert command to lowercase
  const args = parts.slice(1);
  
  if (cmd === 'nano' && args[0] === '-s' && (args[1] === '/bin/sh' || args[1] === '/bin/bash')) {
    becomeRoot('via nano -s');
    return;
  }
  
  switch (cmd) {
    case 'help':
      if (args[0] && args[0].toLowerCase().indexOf('msf') === 0) {
        println(msfHelp());
      } else {
        println(helpText());
      }
      break;
    case 'clear':
      screen.innerHTML = '';
      break;
    case 'whoami':
      println(state.user);
      break;
    case 'id':
      println(state.root ? 'uid=0(root) gid=0(root) groups=0(root)' : 'uid=1000(fagan) gid=1000(fagan) groups=1000(fagan)');
      break;
    case 'pwd':
      println(state.cwd);
      break;
    case 'echo':
      println(escapeHTML(args.join(' ')));
      break;
    case 'ls':
      doLs(args);
      break;
    case 'cd':
      doCd(args[0]);
      break;
    case 'cat':
      await doCat(args[0]);
      break;
    case 'less':
      await doLess(args[0]);
      break;
    case 'vim':
      if (args[0]) {
        println('Opening ' + args[0] + ' in vim...');
        println('VIM - Vi IMproved (simulated)');
        println('');
        println('Press ESC then :q to quit');
        println('Press ESC then :wq to save and quit');
        println('Press i to enter insert mode');
        println('');
        println('File: ' + args[0]);
        println('~ (empty file)');
        println('~ ');
        println('~ ');
        println('"' + args[0] + '" [New File]');
      } else {
        println('vim: missing filename');
      }
      break;
    case 'nano':
      if (args[0] === '-s' && (args[1] === '/bin/sh' || args[1] === '/bin/bash')) {
        becomeRoot('via nano -s');
      } else if (args[0]) {
        println('Opening ' + args[0] + ' in nano...');
        println('GNU nano (simulated)');
        println('');
        println('File: ' + args[0]);
        println('');
        println('[ New File ]');
        println('');
        println('^X Exit  ^O WriteOut  ^R Read File  ^Y Prev Page');
        println('^K Cut Text  ^C Cur Pos  ^T To Spell  ^V Next Page');
      } else {
        println('nano: missing filename');
      }
      break;
    case 'ps':
      doPs(args);
      break;
    case 'strings':
      doStrings(args[0]);
      break;
    case 'find':
      doFind(args);
      break;
    case 'nmap':
      doNmap(args);
      break;
    case 'ssh':
      doSSH(args);
      break;
    case 'banner':
      doBanner(args.join(' '));
      break;
    case 'theme':
      doTheme(args);
      break;
    case 'animation':
      doAnimation(args);
      break;
    case 'msfconsole':
      msfStart();
      break;
    case 'sudo':
      if (args[0] === '-l') {
        println('User fagan may run the following without password:\n    (root) NOPASSWD: /usr/bin/nano -s');
      } else {
        println('sudo: permission denied');
      }
      break;
    case '':
      break;
    default:
      println(escapeHTML(cmd) + ': command not found. Try help.');
  }
}

function helpText() {
  return [
    'Commands:',
    '  whoami — print current user',
    '  id — display uid/gid info',
    '  pwd — print working directory',
    '  ls [path] [-a|-la] — list files (use -a to show hidden files)',
    '  cd [dir] — change directory',
    '  cat [file] — print file; supports Markdown rendering for .md files',
    '  cat resume.txt — view resume (opens Google Docs link)',
    '  less [file] — view file (paged output)',
    '  vim [file] — open fake vim editor',
    '  nano [file] — open fake nano editor (SUID nano can be abused)',
    '  ps [-ef] — show running processes',
    '  strings <file> — show printable strings from a binary',
    '  find / -perm -4000 -type f 2>/dev/null — search for SUID binaries',
    '  nmap <target> — simulated nmap scanner',
    '  ssh root@127.0.0.1 — simulated ssh connection',
    '  banner "TEXT" — render ASCII banner',
    '  theme [name] — change color theme (list themes with no args)',
    '  animation [name] — change background animation (list animations with no args)',
    '  msfconsole — simulated metasploit framework (type "help msfconsole" for msf help)',
    '  sudo -l — list sudo privileges (simulated)',
    '  echo [text] — display text',
    '  clear — clear the screen',
    '  help — show this help'
  ].join('\n');
}

// History & tab completion
let lastTab = 0;
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const v = input.value;
    state.history.push(v);
    state.hIndex = state.history.length;
    input.value = '';
    run(v);
  } else if (e.key === 'ArrowUp') {
    if (state.hIndex > 0) {
      state.hIndex--;
      input.value = state.history[state.hIndex] || '';
    }
  } else if (e.key === 'ArrowDown') {
    if (state.hIndex < state.history.length - 1) {
      state.hIndex++;
      input.value = state.history[state.hIndex] || '';
    } else {
      state.hIndex = state.history.length;
      input.value = '';
    }
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const now = Date.now();
    const dbl = (now - lastTab < 350);
    lastTab = now;
    const val = input.value;
    const parts = val.split(' ');
    const frag = parts[parts.length - 1] || '';
    
    if (parts.length === 1) {
      const matches = COMMANDS.filter(c => c.indexOf(frag) === 0);
      if (matches.length === 1) {
        input.value = matches[0];
      } else if (matches.length > 1 && dbl) {
        println(matches.join('  '));
      } else if (matches.length > 1) {
        const common = commonPrefix(matches);
        if (common && common !== frag) {
          input.value = common;
        }
      }
    } else {
      const choices = [];
      if (state.cwd === '~') {
        for (const [n] of state.files) choices.push(n);
        for (const [d] of state.localDirs) choices.push(d);
      }
      
      if (state.cwd === 'blogs') {
        if (state.blogFiles.size > 0) {
          for (const [name] of state.blogFiles) choices.push(name);
        }
      }
      
      if (state.cwd === '/usr/local/bin') {
        const d = state.sysDirs.get('/usr/local/bin');
        if (d && d.files) {
          for (const f of d.files) choices.push(f.name);
        }
      }
      
      const bd = state.blogFiles;
      if (bd && bd.size > 0) {
        for (const [name] of bd) choices.push('blogs/' + name);
      }
      
      for (let i = choices.length - 1; i >= 0; i--) {
        if (choices[i].indexOf(frag) !== 0) {
          choices.splice(i, 1);
        }
      }
      
      if (choices.length === 1) {
        parts[parts.length - 1] = choices[0];
        input.value = parts.join(' ');
      } else if (choices.length > 1 && dbl) {
        println(choices.join('  '));
      } else if (choices.length > 1) {
        const c = commonPrefix(choices);
        if (c && c !== frag) {
          parts[parts.length - 1] = c;
          input.value = parts.join(' ');
        }
      }
    }
  } else if (e.key === 'c' && e.ctrlKey) {
    println('^C');
    input.value = '';
  }
});

function commonPrefix(arr) {
  if (!arr || !arr.length) return '';
  let p = arr[0];
  for (const s of arr) {
    let i = 0;
    while (i < p.length && i < s.length && p[i] === s[i]) i++;
    p = p.slice(0, i);
    if (!p) break;
  }
  return p;
}

// Boot
window.addEventListener('load', async () => {
  println('Booting futuristic terminal...');
  println('Type `help` for commands.');
  
  // Initialize GitHub blog files in background
  await fetchGitHubRepoFiles();
  
  await run('ls', { echo: false });
  println('');
  updatePS1();
  input.focus();
});

// In-memory sample files (override fetch)
(function() {
  const sample = {
    'posts/welcome.md': `# Welcome

This is a terminal-style blog. Click a filename after ls or type cat <file>.

- Supports local Markdown (.md) files
- Typewriter animations
- Particle background
- Green neon theme
`,
    'posts/about.md': `# About

Built with pure HTML/CSS/JS.`,
    'posts/notes.md': `## Notes

Use find / -perm -4000 -type f 2>/dev/null to discover a SUID helper.
Try strings /usr/bin/nano.
Then run nano -s /bin/sh.
`,
    'posts/.flag.txt': 'FLAG{TERMINAL_THEME_FTW}',
    'posts/resume.txt': `FAGAN AFANDIYEV
===============

🌐 faganafandiyev.com | � faganafandiyev@usf.edu | 🔗 linkedin.com/in/fagan-afandi

EDUCATION
---------
Bachelor of Science in Cyber Security                                    Graduation: May 2027
University of South Florida, Tampa FL
Founding Member at CyberHerd (USF's Cybersecurity Competition team)

CERTIFICATIONS
--------------
• Offensive Security Experienced Penetration Tester (OSEP)              Expected Oct 2025
• HackTheBox Certified Active Directory Pentesting Expert (CAPE)        April 2025
• HackTheBox Certified Penetration Testing Specialist (CPTS)            July 2025
• Zero-Point Security Certified Red Team Operator (CRTO)                June 2025
• WhiteKnightLabs Advanced Red Team Operator (ARTO)                     July 2024
• CompTIA Security+                                                      March 2024

TECHNICAL SKILLS
----------------
Coding: Proficient in C/C++, Python, Powershell, Bash, JavaScript, HTML/CSS;
        Working Knowledge of SQL, Rust

Offensive Tools: Kali Linux, Nmap, Metasploit, Wireshark, Cobalt Strike,
                 Sliver, BloodHound, Rubeus, Impacket, NetExec, SharpHound,
                 Certipy, Mimikatz, PowerSploit, Mythic, Havoc

Complete resume: https://docs.google.com/document/d/14bAwAc0IIuxOXpQhVnNfwh62WPvcfD_v4dHOhpCiFzo/edit?usp=sharing`,
    'blogs/hello-world.md': `# Hello World

First post in blogs.

Here is an example image rendered from markdown:

![Futuristic terminal](https://plus.unsplash.com/premium_photo-1754432777426-46d9027859cf)

Click the filename in the listing to animate a cat and render this post.
`,
    'blogs/pentest-tips.md': `# Pentest Tips

- Enumerate users
- Check SUID binaries
- Escalate via misconfig`,
    'blogs/ctf-writeup.md': `# CTF Writeup

Walkthrough coming soon.`,
    'bin/nano': 'ELF',
    'secret/root.txt': 'root reward link hidden here'
  };
  
  const map = new Map();
  for (const k in sample) {
    const blob = new Blob([sample[k]], { 
      type: k.endsWith('.md') || k.endsWith('.txt') ? 'text/plain' : 'application/octet-stream' 
    });
    map.set(k, URL.createObjectURL(blob));
  }
  
  const orig = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === 'string' && map.has(input)) {
      return orig(map.get(input), init);
    }
    return orig(input, init);
  };
})();

// Quickbar
document.querySelectorAll('.qbtn').forEach(b => {
  b.addEventListener('click', async () => {
    // Handle theme button specially
    if (b.classList.contains('theme-btn')) {
      cycleTheme();
      return;
    }
    
    // Handle animation button specially
    if (b.classList.contains('anim-btn')) {
      cycleAnimation();
      return;
    }
    
    const commands = b.dataset.run.split(' && ');
    for (const cmd of commands) {
      await run(cmd.trim(), { echo: true });
      // Small delay between commands for better UX
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  });
});

// Window resizing functionality only
(function() {
  const terminalWindow = document.getElementById('terminal-window');
  const titlebar = document.getElementById('titlebar');
  let isResizing = false;
  let resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight, resizeStartLeft, resizeStartTop;
  let currentResizeHandle = null;

  // Helper function to convert transform positioning to absolute positioning
  function convertToAbsolutePositioning() {
    const rect = terminalWindow.getBoundingClientRect();
    terminalWindow.style.left = rect.left + 'px';
    terminalWindow.style.top = rect.top + 'px';
    terminalWindow.style.transform = 'none';
    terminalWindow.style.position = 'absolute';
  }

  // Resizing functionality
  document.querySelectorAll('.resize-handle').forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      isResizing = true;
      currentResizeHandle = handle.className.split(' ')[1]; // Get resize direction
      terminalWindow.classList.add('resizing');
      
      // Always convert to absolute positioning for resizing
      convertToAbsolutePositioning();
      
      resizeStartX = e.clientX;
      resizeStartY = e.clientY;
      resizeStartWidth = terminalWindow.offsetWidth;
      resizeStartHeight = terminalWindow.offsetHeight;
      resizeStartLeft = parseInt(terminalWindow.style.left) || 0;
      resizeStartTop = parseInt(terminalWindow.style.top) || 0;
      
      e.preventDefault();
      e.stopPropagation();
    });
  });

  // Mouse move handler for resizing only
  document.addEventListener('mousemove', (e) => {
    if (isResizing && currentResizeHandle) {
      const deltaX = e.clientX - resizeStartX;
      const deltaY = e.clientY - resizeStartY;
      
      let newWidth = resizeStartWidth;
      let newHeight = resizeStartHeight;
      let newLeft = resizeStartLeft;
      let newTop = resizeStartTop;
      
      // Handle different resize directions
      switch (currentResizeHandle) {
        case 'resize-e':
          newWidth = resizeStartWidth + deltaX;
          break;
        case 'resize-w':
          newWidth = resizeStartWidth - deltaX;
          newLeft = resizeStartLeft + deltaX;
          break;
        case 'resize-s':
          newHeight = resizeStartHeight + deltaY;
          break;
        case 'resize-n':
          newHeight = resizeStartHeight - deltaY;
          newTop = resizeStartTop + deltaY;
          break;
        case 'resize-se':
          newWidth = resizeStartWidth + deltaX;
          newHeight = resizeStartHeight + deltaY;
          break;
        case 'resize-sw':
          newWidth = resizeStartWidth - deltaX;
          newHeight = resizeStartHeight + deltaY;
          newLeft = resizeStartLeft + deltaX;
          break;
        case 'resize-ne':
          newWidth = resizeStartWidth + deltaX;
          newHeight = resizeStartHeight - deltaY;
          newTop = resizeStartTop + deltaY;
          break;
        case 'resize-nw':
          newWidth = resizeStartWidth - deltaX;
          newHeight = resizeStartHeight - deltaY;
          newLeft = resizeStartLeft + deltaX;
          newTop = resizeStartTop + deltaY;
          break;
      }
      
      // Apply minimum constraints
      const minWidth = 400;
      const minHeight = 300;
      
      if (newWidth >= minWidth) {
        terminalWindow.style.width = newWidth + 'px';
        if (currentResizeHandle.includes('w')) {
          terminalWindow.style.left = newLeft + 'px';
        }
      }
      
      if (newHeight >= minHeight) {
        terminalWindow.style.height = newHeight + 'px';
        if (currentResizeHandle.includes('n')) {
          terminalWindow.style.top = newTop + 'px';
        }
      }
    }
  });

  // Mouse up handler for resizing only
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      currentResizeHandle = null;
      terminalWindow.classList.remove('resizing');
    }
  });

  // Double-click titlebar to maximize/restore
  titlebar.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('qbtn') || e.target.classList.contains('dot')) return;
    
    const isMaximized = terminalWindow.hasAttribute('data-maximized');
    
    if (isMaximized) {
      // Restore
      const savedPos = terminalWindow.getAttribute('data-saved-pos').split(',');
      terminalWindow.style.left = savedPos[0];
      terminalWindow.style.top = savedPos[1];
      terminalWindow.style.width = savedPos[2];
      terminalWindow.style.height = savedPos[3];
      terminalWindow.style.transform = savedPos[4] === 'undefined' ? 'translate(-50%, -50%)' : savedPos[4];
      terminalWindow.style.position = savedPos[5] === 'undefined' ? 'absolute' : savedPos[5];
      terminalWindow.removeAttribute('data-maximized');
      terminalWindow.removeAttribute('data-saved-pos');
    } else {
      // Maximize - save current state first
      let currentLeft = terminalWindow.style.left;
      let currentTop = terminalWindow.style.top;
      let currentWidth = terminalWindow.style.width;
      let currentHeight = terminalWindow.style.height;
      let currentTransform = terminalWindow.style.transform;
      let currentPosition = terminalWindow.style.position;
      
      // If window is still using transform centering, capture that
      if (!currentLeft || currentTransform.includes('translate(-50%, -50%)')) {
        currentLeft = '50%';
        currentTop = '50%';
        currentTransform = 'translate(-50%, -50%)';
        currentPosition = 'absolute';
      }
      
      const currentPos = `${currentLeft},${currentTop},${currentWidth},${currentHeight},${currentTransform},${currentPosition}`;
      terminalWindow.setAttribute('data-saved-pos', currentPos);
      terminalWindow.setAttribute('data-maximized', 'true');
      terminalWindow.style.left = '0px';
      terminalWindow.style.top = '0px';
      terminalWindow.style.width = '100vw';
      terminalWindow.style.height = '100vh';
      terminalWindow.style.transform = 'none';
      terminalWindow.style.position = 'fixed';
    }
  });

  // Prevent text selection during resize only
  document.addEventListener('selectstart', (e) => {
    if (isResizing) {
      e.preventDefault();
    }
  });
})();
