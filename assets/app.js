/* ===== 示例数据（可删除） ===== */
const demoData = [
  {
    id: "book-1",
    title: "深度工作",
    author: "Cal Newport",
    year: 2016,
    tags: ["效率","专注"],
    notes: [
      {title: "核心观点", tags:["总结"], text: "少即是多；安排深度工作的固定时段；远离社交媒体噪音。"},
      {title: "行动清单", tags:["行动"], text: "- 每天2小时不被打扰\n- 关闭所有通知\n- 每周一次长时段深度工作"},
      {title: "喜欢的句子", tags:["金句"], text: "要像工匠一样对待自己的注意力。"}
    ]
  },
  {
    id: "book-2",
    title: "原则",
    author: "Ray Dalio",
    year: 2017,
    tags: ["决策","管理"],
    notes: [
      {title: "个人原则", tags:["思考"], text: "极度透明；极度诚实；求真。" },
      {title: "工作原则", tags:["管理"], text: "建立可反驳的观点；用数据驱动决策；鼓励有分歧的讨论。"},
      {title: "工具", tags:["方法"], text: "写下你的原则；把情绪与事实分离。"}
    ]
  }
];

/* ===== 状态 & 存储 ===== */
const STORAGE_KEY = "reading-notes-data-v1";
const THEME_KEY = "reading-notes-theme";
const state = {
  data: loadData(),
  currentBookId: null,
  activeTag: null,
};
if(!state.data.length){ state.data = demoData; saveData(); }
state.currentBookId = state.data[0]?.id;

/* ===== DOM ===== */
const bookList = document.getElementById("bookList");
const notesEl  = document.getElementById("notes");
const countInfo= document.getElementById("countInfo");
const bookSearch = document.getElementById("bookSearch");
const noteSearch = document.getElementById("noteSearch");
const activeTagEl= document.getElementById("activeTag");

/* ===== 初始主题 ===== */
const savedTheme = localStorage.getItem(THEME_KEY);
if(savedTheme === "light") document.documentElement.classList.add("light");

/* ===== 渲染 ===== */
function renderBooks(filter=""){
  bookList.innerHTML = "";
  const books = state.data.filter(b => (b.title+b.author).toLowerCase().includes(filter.toLowerCase()));
  books.forEach(b => {
    const el = document.createElement("div");
    el.className = "book" + (b.id===state.currentBookId ? " active": "");

    el.innerHTML = `
      <div class="row">
        <div class="book-cover">${(b.title?.[0]||"书").toUpperCase()}</div>
        <div style="min-width:0">
          <div><strong>${escapeHTML(b.title)}</strong></div>
          <div class="meta">${escapeHTML(b.author||"")} · ${b.year||""}</div>
          <div class="tags">${(b.tags||[]).map(t=>`<span class="chip" data-tag="${t}">#${escapeHTML(t)}</span>`).join("")}</div>
        </div>
        <div class="actions">
          <button class="icon-btn edit" title="编辑">✎</button>
          <button class="icon-btn del"  title="删除">🗑</button>
        </div>
      </div>`;

    // 卡片点击切换当前书（避免点击按钮/标签时触发）
    el.addEventListener("click", (e)=>{
      if(e.target.closest(".icon-btn") || e.target.classList.contains("chip")) return;
      state.currentBookId=b.id; state.activeTag=null; noteSearch.value=""; renderAll();
    });

    // 标签筛选
    el.querySelectorAll(".chip").forEach(ch => ch.addEventListener("click", (e)=>{
      e.stopPropagation();
      state.activeTag = ch.dataset.tag;
      renderNotes();
    }));

    // 编辑 & 删除
    el.querySelector(".edit").addEventListener("click", (e)=>{ e.stopPropagation(); editBook(b.id); });
    el.querySelector(".del").addEventListener("click",  (e)=>{ e.stopPropagation(); deleteBook(b.id); });

    bookList.appendChild(el);
  });
}

function renderNotes(){
  const book = state.data.find(b=>b.id===state.currentBookId);
  if(!book){ notesEl.innerHTML="<div class='muted'>请选择或新建一本书。</div>"; return; }
  const term = noteSearch.value.trim().toLowerCase();
  notesEl.innerHTML="";
  let count=0;
  (book.notes||[]).forEach((n,idx) => {
    const text = `${n.title} ${(n.tags||[]).join(" ")} ${n.text}`.toLowerCase();
    const tagOk = !state.activeTag || (n.tags||[]).includes(state.activeTag);
    if( (!term || text.includes(term)) && tagOk){
      const el = document.createElement("details");
      el.className="note"; el.open = idx<2; // 前两个默认展开
      el.innerHTML = `
        <summary><h3>${escapeHTML(n.title||"未命名笔记")}</h3></summary>
        <div class="meta">
          ${(n.tags||[]).map(t=>`<span class="chip" data-tag="${t}">#${escapeHTML(t)}</span>`).join("")}
          <span>✍️ 可编辑</span>
        </div>
        <div class="content" contenteditable="true">${escapeHTML(n.text||"")}</div>`;
      // 标签点击
      el.querySelectorAll(".chip").forEach(ch => ch.addEventListener("click", (e)=>{
        e.stopPropagation(); state.activeTag = ch.textContent.replace("#",""); renderNotes();
      }));
      // 保存编辑
      el.querySelector(".content").addEventListener("input", (e)=>{
        n.text = e.target.innerText; saveData();
      });
      notesEl.appendChild(el);
      count++;
    }
  });
  countInfo.textContent = `共 ${book.notes?.length||0} 条笔记 · 当前显示 ${count} 条${state.activeTag?` · 标签 #${state.activeTag}`:""}`;
  // 激活标签显示
  if(state.activeTag){ activeTagEl.textContent = `#${state.activeTag} ✕`; activeTagEl.classList.remove("hidden"); }
  else { activeTagEl.classList.add("hidden"); }
}

function renderAll(){ renderBooks(bookSearch.value); renderNotes(); }
renderAll();

/* ===== 交互 ===== */
bookSearch.addEventListener("input", ()=> renderBooks(bookSearch.value));
noteSearch.addEventListener("input", ()=> renderNotes());
activeTagEl.addEventListener("click", ()=>{ state.activeTag=null; renderNotes(); });

document.getElementById("newBookBtn").addEventListener("click", ()=>{
  const title = prompt("新书名称：");
  if(!title) return;
  const author = prompt("作者：") || "";
  const id = "book-"+crypto.randomUUID();
  state.data.unshift({id, title, author, year: new Date().getFullYear(), tags: [], notes: []});
  state.currentBookId = id;
  saveData(); renderAll();
});

document.getElementById("exportBtn").addEventListener("click", ()=>{
  const blob = new Blob([JSON.stringify(state.data, null, 2)], {type:"application/json"});
  triggerDownload(blob, "reading-notes.json");
});

document.getElementById("importBtn").addEventListener("click", async ()=>{
  const [file] = await selectFile(".json");
  if(!file) return;
  try{
    const text = await file.text();
    const json = JSON.parse(text);
    if(!Array.isArray(json)) throw new Error("JSON 顶层应为数组");
    state.data = json;
    state.currentBookId = state.data[0]?.id || null;
    saveData(); renderAll();
  }catch(err){
    alert("导入失败："+err.message);
  }
});

document.getElementById("printBtn").addEventListener("click", ()=>{
  window.print();
});

document.getElementById("toggleTheme").addEventListener("click", ()=>{
  const isLight = document.documentElement.classList.toggle("light");
  localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
});

/* ===== 编辑 / 删除书本 ===== */
function editBook(bookId){
  const b = state.data.find(x=>x.id===bookId);
  if(!b) return;
  const title = prompt("书名：", b.title || "") ?? b.title;
  if(!title) return; // 保持必填
  const author = prompt("作者：", b.author || "") ?? b.author;
  const yearIn = prompt("年份（数字，可留空）：", b.year ?? "") ?? b.year;
  const year = yearIn ? parseInt(yearIn, 10) : b.year;
  const tagsIn = prompt("标签（用逗号分隔）：", (b.tags||[]).join(",")) ?? (b.tags||[]).join(",");
  const tags = tagsIn ? tagsIn.split(",").map(s=>s.trim()).filter(Boolean) : [];
  b.title = title; b.author = author; b.year = year; b.tags = tags;
  saveData(); renderAll();
}

function deleteBook(bookId){
  const b = state.data.find(x=>x.id===bookId);
  if(!b) return;
  if(!confirm(`确定删除《${b.title}》及其所有笔记吗？此操作不可撤销。`)) return;
  const idx = state.data.findIndex(x=>x.id===bookId);
  if(idx >= 0){ state.data.splice(idx,1); }
  if(state.currentBookId === bookId){
    state.currentBookId = state.data[0]?.id || null;
  }
  saveData(); renderAll();
}

/* ===== 工具函数 ===== */
function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch{ return []; }
}
function saveData(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}
function escapeHTML(s=""){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function selectFile(accept){
  return new Promise(resolve=>{
    const inp = document.createElement("input");
    inp.type="file"; inp.accept=accept;
    inp.onchange = ()=> resolve(inp.files);
    inp.click();
  });
}
function triggerDownload(blob, filename){
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
