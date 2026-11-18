/* Mystery Lens: a zero-build, GitHub Pages friendly Blogger front page.
   Post links navigate straight to their canonical Blogger URL in the same tab.
   Blogger's public JSONP feed is used where available; verified stories below
   remain visible if the feed is disabled or temporarily unavailable. */
(() => {
  'use strict';
  const BLOG_URL = 'https://mysterylens.blogspot.com/';
  const MAX_POSTS = 100;
  const PAGE_SIZE = 9;
  const FALLBACK_POSTS = [
    {title:'Shadows in the Stone: The Haunted Legacy of Lambi Dehar Mines',url:'https://mysterylens.blogspot.com/2024/09/shadows-in-stone-haunted-legacy-of.html',date:'2024-09-25',category:'Haunted Places',excerpt:'The haunting stories and eerie atmosphere of an abandoned limestone mine in the hills of Mussoorie.'},
    {title:'The Richat Structure: Eye of the Sahara',url:'https://mysterylens.blogspot.com/2024/08/the-richat-structure-eye-of-sahara.html',date:'2024-08-02',category:'History & Places',excerpt:'A spectacular series of rings in the Sahara Desert, visible from space, with a geological story millions of years in the making.'},
    {title:'Hachishakusama: The Eight-Foot-Tall Terror of Japanese Nightmares',url:'https://mysterylens.blogspot.com/2024/03/hachishakusama-eight-foot-tall-terror.html',date:'2024-03-19',category:'Folklore',excerpt:'An unsettling figure from Japanese folklore, recognized by her towering height and a chilling call.'},
    {title:'Lost Recipes from around the World',url:'https://mysterylens.blogspot.com/2023/12/lost-recipes-from-around-world.html',date:'2023-12-22',category:'Curiosities',excerpt:'From ancient Soma to the legendary ambrosia, discover the foods and flavors history left behind.'},
    {title:'GP Block: Meerut',url:'https://mysterylens.blogspot.com/2023/11/gp-block-meerut.html',date:'2023-11-26',category:'Haunted Places',excerpt:'Explore the stories, rumors and folklore surrounding an abandoned mansion in Meerut.'}
  ];
  const state={posts:FALLBACK_POSTS,filter:'All',query:'',visible:PAGE_SIZE};
  const grid=document.querySelector('#stories-grid');
  const notice=document.querySelector('#feed-notice');
  const count=document.querySelector('#result-count');
  const more=document.querySelector('#load-more');
  const archiveLink=document.querySelector('#blog-archive-link');
  const filters=document.querySelector('#topic-filters');
  const search=document.querySelector('#story-search');
  const empty=document.querySelector('#empty-state');
  const el=(tag,className,content)=>{const node=document.createElement(tag);if(className)node.className=className;if(content!==undefined)node.textContent=content;return node;};
  const allowedURL=(raw)=>{try{const u=new URL(raw);return u.protocol==='https:'&&(u.hostname==='mysterylens.blogspot.com'||u.hostname==='www.mysterylens.blogspot.com')?u.href:null;}catch{return null;}};
  const safeImage=(raw)=>{try{const u=new URL(raw);return u.protocol==='https:'?u.href:null;}catch{return null;}};
  const categorize=(title,labels=[])=>{
    const value=`${title} ${labels.join(' ')}`.toLowerCase();
    if(/haunt|ghost|paranormal|mine|spirit|mansion|horror|block|abandon/.test(value))return 'Haunted Places';
    if(/folklore|legend|myth|japan|yokai|hachishaku|creature/.test(value))return 'Folklore';
    if(/sahara|geolog|structure|histor|archaeolog|ancient|monument|site|place/.test(value))return 'History & Places';
    return 'Curiosities';
  };
  const formatDate=(value)=>{const d=new Date(value);return Number.isNaN(d.getTime())?'':d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});};
  function makeCover(category){
    const div=el('div','cover-placeholder');
    div.innerHTML='<svg viewBox="0 0 280 180" fill="none" aria-hidden="true"><circle cx="140" cy="84" r="59" stroke="#f3d4cf" stroke-opacity=".58" stroke-width="1.4"/><circle cx="140" cy="84" r="41" stroke="#e9c6cf" stroke-opacity=".3"/><circle cx="140" cy="84" r="24" fill="#ead0c9" fill-opacity=".14"/><circle cx="140" cy="84" r="10" fill="#f6d3b6" fill-opacity=".75"/><path d="M10 145L60 112L100 135L144 102L192 125L232 94L270 129" stroke="#e8d2dd" stroke-opacity=".55" stroke-width="2"/><path d="M12 155L64 135L110 151L159 128L215 145L268 127" stroke="#e8d2dd" stroke-opacity=".25" stroke-width="1.5"/><circle cx="65" cy="38" r="2" fill="#fbd7b2"/><circle cx="205" cy="29" r="2" fill="#fbd7b2"/><path d="M216 65h12m-6-6v12" stroke="#ead0c9" stroke-opacity=".8"/></svg>';
    return div;
  }
  function articleCard(post,index){
    const card=el('article','story-card');
    const cover=el('a','story-cover');cover.href=post.url;cover.setAttribute('aria-label',`Read ${post.title}`);cover.dataset.category=post.category;
    if(post.image){const img=el('img');img.src=post.image;img.alt='';img.loading=index<3?'eager':'lazy';img.decoding='async';img.addEventListener('error',()=>{img.remove();cover.insertBefore(makeCover(post.category),cover.firstChild);},{once:true});cover.append(img);}else cover.append(makeCover(post.category));
    cover.append(el('span','cover-corner','MYSTERY LENS'));
    cover.append(el('span','cover-arrow','↗'));
    const meta=el('div','story-metadata');meta.append(el('span','',post.category),el('span','metadata-dot'),el('time','',formatDate(post.date)));meta.querySelector('time').dateTime=post.date;
    const headline=el('h3');const titleLink=el('a','',post.title);titleLink.href=post.url;headline.append(titleLink);
    const desc=el('p','',post.excerpt||'Uncover another curious story from Mystery Lens.');
    const read=el('a','read-story');read.href=post.url;read.append(document.createTextNode('Read the story '),el('span','','↗'));
    card.append(cover,meta,headline,desc,read);return card;
  }
  function render(){
    const q=state.query.trim().toLowerCase();
    const items=state.posts.filter(p=>(state.filter==='All'||p.category===state.filter)&&(!q||`${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(q)));
    grid.replaceChildren(...items.slice(0,state.visible).map(articleCard));
    empty.hidden=items.length!==0;
    grid.hidden=items.length===0;
    more.hidden=items.length<=state.visible;
    archiveLink.hidden=items.length>state.visible;
    count.textContent=`${items.length} ${items.length===1?'story':'stories'} ${q||state.filter!=='All'?'found':'to explore'}`;
  }
  filters.addEventListener('click',event=>{const btn=event.target.closest('button[data-filter]');if(!btn)return;state.filter=btn.dataset.filter;state.visible=PAGE_SIZE;filters.querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});render();});
  search.addEventListener('input',()=>{state.query=search.value;state.visible=PAGE_SIZE;render();});
  document.querySelector('#clear-search').addEventListener('click',()=>{search.value='';state.query='';state.filter='All';filters.querySelectorAll('button').forEach(b=>{const yes=b.dataset.filter==='All';b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes));});state.visible=PAGE_SIZE;render();search.focus();});
  more.addEventListener('click',()=>{state.visible+=PAGE_SIZE;render();});
  document.querySelector('#year').textContent=String(new Date().getFullYear());
  const toggle=document.querySelector('#menu-toggle');const nav=document.querySelector('#site-nav');
  toggle.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!expanded));toggle.setAttribute('aria-label',expanded?'Open navigation':'Close navigation');nav.classList.toggle('open',!expanded);});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');}));
  render();
  document.querySelector('#hero-latest').href=FALLBACK_POSTS[0].url;

  function extractExcerpt(html){const div=document.createElement('div');div.innerHTML=html||'';div.querySelectorAll('script,style,iframe').forEach(n=>n.remove());return (div.textContent||'').replace(/\s+/g,' ').trim().slice(0,185).replace(/\s+\S*$/,'')+'…';}
  function feedPost(entry){
    const link=(entry.link||[]).find(l=>l.rel==='alternate'&&l.type==='text/html');
    const url=allowedURL(link&&link.href);const title=entry.title&&entry.title.$t;
    if(!url||!title)return null;
    const html=(entry.content&&entry.content.$t)||(entry.summary&&entry.summary.$t)||'';
    const rawLabels=(entry.category||[]).map(c=>c.term).filter(Boolean);
    let image=entry.media$thumbnail&&entry.media$thumbnail.url;
    if(image)image=image.replace(/\/s72-c\//,'/s640/');
    if(!image&&html){const doc=new DOMParser().parseFromString(html,'text/html');image=doc.querySelector('img[src]')?.getAttribute('src');}
    const pub=entry.published&&entry.published.$t||'';
    return {title,url,date:pub.slice(0,10),category:categorize(title,rawLabels),excerpt:extractExcerpt(html),image:safeImage(image)};
  }
  let finished=false;
  const feedScript=document.createElement('script');
  let timeout;
  const complete=()=>{clearTimeout(timeout);feedScript.remove();try{delete window.mysteryLensFeedCallback;}catch{/* ignore */}};
  window.mysteryLensFeedCallback=(data)=>{
    if(finished)return;
    finished=true;
    const entries=Array.isArray(data?.feed?.entry)?data.feed.entry:[];
    const posts=entries.map(feedPost).filter(Boolean);
    if(posts.length){
      const map=new Map(posts.map(p=>[p.url,p]));
      /* If a feed page is incomplete, keep known, verified archive links. */
      FALLBACK_POSTS.forEach(p=>{if(!map.has(p.url))map.set(p.url,p);});
      state.posts=[...map.values()].sort((a,b)=>b.date.localeCompare(a.date));
      notice.textContent='Fresh from the original Mystery Lens blog · Updated automatically';
      document.querySelector('#hero-latest').href=state.posts[0].url;
      render();
    }
    complete();
  };
  feedScript.src=`${BLOG_URL}feeds/posts/default?alt=json-in-script&max-results=${MAX_POSTS}&callback=mysteryLensFeedCallback`;
  feedScript.async=true;
  feedScript.onerror=()=>{if(finished)return;finished=true;notice.textContent='A selection of stories from the Mystery Lens archive';complete();};
  timeout=setTimeout(()=>{if(finished)return;finished=true;complete();},12000);
  document.head.append(feedScript);
})();
