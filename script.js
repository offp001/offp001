(() => {
  const track = document.getElementById('track');
  const tabs = [...document.querySelectorAll('.tab')];
  const indicators = [...document.querySelectorAll('.indicator')];
  let current = 0;
  function goTo(index) {
    current = Math.max(0, Math.min(2, index));
    track.style.transform = `translateX(-${current * 33.333333}%)`;
    tabs.forEach((tab, i) => tab.classList.toggle('active', i === current));
    indicators.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }
  tabs.forEach(tab => tab.addEventListener('click', () => goTo(Number(tab.dataset.page))));
  // Touch / trackpad navigation between the three full-screen sections.
  let startX = 0, startY = 0;
  track.addEventListener('touchstart', e => { startX=e.touches[0].clientX; startY=e.touches[0].clientY; }, {passive:true});
  track.addEventListener('touchend', e => {
    const dx=e.changedTouches[0].clientX-startX, dy=e.changedTouches[0].clientY-startY;
    if (Math.abs(dx)>65 && Math.abs(dx)>Math.abs(dy)*1.25) goTo(current+(dx<0?1:-1));
  }, {passive:true});
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo(current+1);
    if (e.key === 'ArrowLeft') goTo(current-1);
  });

  // A local counter is only a visual demo; replace with a real analytics endpoint if desired.
  const count = document.getElementById('view-count');
  try { const key='offp-portfolio-views'; const n=Number(sessionStorage.getItem(key)||0)+1; sessionStorage.setItem(key,n); count.textContent=String(n); } catch (_) {}

  // Discord presence is public only if the account exposes presence through Lanyard.
  async function loadDiscord() {
    const el=document.getElementById('discord-status');
    try {
      const res=await fetch('https://api.lanyard.rest/v1/users/1081565798918787142');
      const json=await res.json();
      if (!json.success || !json.data) throw new Error('Unavailable');
      const d=json.data;
      const labels={online:'online',idle:'idle',dnd:'do not disturb',offline:'offline'};
      const activity=d.activities?.find(a=>a.type===0);
      el.textContent=(labels[d.discord_status]||'offline')+(activity?` · ${activity.name}`:'');
    } catch (_) { el.textContent='presence unavailable'; }
  }
  loadDiscord(); setInterval(loadDiscord, 60000);

  const user='offp001';
  const repoGrid=document.getElementById('repo-grid');
  const readme=document.getElementById('readme-content');
  async function loadGithub() {
    try {
      const [u,r,md]=await Promise.all([
        fetch(`https://api.github.com/users/${user}`).then(x=>{if(!x.ok)throw Error();return x.json()}),
        fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=100`).then(x=>{if(!x.ok)throw Error();return x.json()}),
        fetch(`https://api.github.com/repos/${user}/${user}/readme`).then(x=>x.ok?x.json():null).catch(()=>null)
      ]);
      document.getElementById('gh-avatar').src=u.avatar_url;
      document.getElementById('gh-name').textContent=u.name||u.login;
      document.getElementById('gh-bio').textContent=u.bio||'reverse engineer · debugger';
      document.getElementById('gh-repos').textContent=u.public_repos;
      document.getElementById('gh-followers').textContent=u.followers;
      const pinnedNames=['']; // Add repository names here to force a custom order.
      const repos=[...r].sort((a,b)=>{
        const ai=pinnedNames.indexOf(a.name), bi=pinnedNames.indexOf(b.name);
        if(ai!==-1||bi!==-1)return (ai===-1?999:ai)-(bi===-1?999:bi);
        return new Date(b.updated_at)-new Date(a.updated_at);
      }).slice(0,6);
      repoGrid.innerHTML='';
      repos.forEach(repo=>{
        const a=document.createElement('a'); a.className='repo-card glass'; a.href=repo.html_url; a.target='_blank'; a.rel='noreferrer';
        const title=document.createElement('div'); title.className='repo-title'; title.textContent=repo.name;
        const desc=document.createElement('div'); desc.className='repo-desc'; desc.textContent=repo.description||'No description provided.';
        const meta=document.createElement('div'); meta.className='repo-meta';
        const lang=document.createElement('span'); lang.innerHTML=repo.language?'<i class="language-dot"></i>':''; lang.append(document.createTextNode(repo.language||'source'));
        const stars=document.createElement('span'); stars.textContent=`☆ ${repo.stargazers_count}`;
        meta.append(lang,stars); a.append(title,desc,meta); repoGrid.append(a);
      });
      if(!repos.length) repoGrid.innerHTML='<div class="repo-card glass">No public repositories found.</div>';
      if(md?.content) {
        const raw=atob(md.content.replace(/\n/g,''));
        const decoded=decodeURIComponent(escape(raw));
        readme.innerHTML=renderMarkdownLite(decoded);
      } else {
        readme.innerHTML='<p>Profile README not found. Add a repository named <code>offp001</code> to show it here.</p>';
      }
    } catch (_) {
      repoGrid.innerHTML='<div class="repo-card glass">GitHub API is currently unavailable. <a href="https://github.com/offp001">Open profile ↗</a></div>';
      readme.innerHTML='<p>Could not load the profile README right now. You can still visit <a href="https://github.com/offp001">github.com/offp001</a>.</p>';
    }
  }
  function renderMarkdownLite(md) {
    // Small safe Markdown renderer for headings, paragraphs, lists, code and links.
    const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    return md.split(/\n{2,}/).map(block=>{
      const t=block.trim(); if(!t)return '';
      if(/^```/.test(t)) return `<pre>${esc(t.replace(/^```[^\n]*\n?/,'').replace(/```$/,''))}</pre>`;
      if(/^#{1,3}\s/.test(t)){const n=t.match(/^#+/)[0].length;return `<h${n}>${esc(t.replace(/^#{1,3}\s/,''))}</h${n}>`;}
      if(/^[-*]\s/m.test(t)) return `<ul>${t.split('\n').map(x=>`<li>${esc(x.replace(/^[-*]\s/,''))}</li>`).join('')}</ul>`;
      return `<p>${esc(t).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')}</p>`;
    }).join('');
  }
  loadGithub();
})();