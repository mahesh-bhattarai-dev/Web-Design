const lessons = {
 html:{source:"HTML/first.html",title:"HTML · A simple page",heading:"Your first HTML page",description:"HTML gives a webpage its structure. Elements such as headings and paragraphs tell the browser what each piece of content represents.",tip:"Most HTML elements have an opening tag, content, and a closing tag.",code:`<!DOCTYPE html>
<html lang="en">
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Welcome to my page</h1>
  <p>This is my first paragraph.</p>
  <a href="https://www.nasa.gov/">Visit NASA</a>
</body>
</html>`,kind:"html",note:"This example is based on the introductory HTML files in your repository."},
 css:{source:"CSS/BoxModel.html",title:"CSS · Styling a card",heading:"Give a page its style",description:"CSS controls how HTML elements look. Selectors target elements, while properties define colors, spacing, borders, and layout.",tip:"The box model includes content, padding, border, and margin.",code:`.profile-card {
  background: #f1f5ff;
  border: 1px solid #dce6fb;
  border-radius: 12px;
  padding: 20px;
  max-width: 320px;
}

.profile-card h2 {
  color: #315fbd;
  margin-top: 0;
}`,kind:"css"},
 javascript:{source:"Javascript/Basics/helloWorld.js",title:"JavaScript · A button click",heading:"Make a page interactive",description:"JavaScript can respond to user actions, update page content, and work with data. This example changes a message when the button is clicked.",tip:"Use addEventListener() to respond to events without putting JavaScript directly in HTML.",code:`const button = document.querySelector("#helloButton");
const message = document.querySelector("#message");

button.addEventListener("click", () => {
  message.textContent = "Hello! JavaScript is working.";
});`,kind:"js"},
 bootstrap:{source:"Bootstrap/",title:"Bootstrap · Responsive grid",heading:"Build with a grid",description:"Bootstrap provides a responsive grid system and reusable interface components. Its columns adjust based on the screen size.",tip:"A .container holds the layout, .row groups columns, and .col-md-4 creates three columns on medium screens and larger.",code:`<div class="container">
  <div class="row">
    <div class="col-md-4">Column one</div>
    <div class="col-md-4">Column two</div>
    <div class="col-md-4">Column three</div>
  </div>
</div>`,kind:"bootstrap"},
 sql:{source:"SQL/CREATE_table_song.sql",title:"SQL · Select records",heading:"Ask a database a question",description:"SQL is used to define, add, and retrieve data in relational databases. This query selects songs from a sample song table.",tip:"The table below is a visual simulation based on sample records in your SQL folder. It is not connected to a live database.",code:`SELECT title, artist, release_year
FROM song
WHERE genre = 'grunge'
ORDER BY release_year;`,kind:"sql",note:"Simulated query result · based on your CREATE TABLE and INSERT examples."},
 node:{source:"NodeJS/server.js",title:"Node.js · Basic server",heading:"JavaScript beyond the browser",description:"Node.js lets JavaScript run outside a web browser. It can be used to build command-line tools, servers, and backend services.",tip:"This is a simplified teaching example. A real server needs to be run with Node.js.",code:`const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Node.js!");
});

server.listen(3000);`,kind:"node"},
 jquery:{source:"jquery/startJquery.html",title:"jQuery · Select and update",heading:"A shorter way to work with the DOM",description:"jQuery is a JavaScript library that makes common DOM tasks and event handling concise.",tip:"The $() function is used to select elements. This sample assumes the jQuery library is included in the page.",code:`$("#showMessage").on("click", function () {
  $("#message").text("The message was updated!");
});`,kind:"jquery"}
};
const order=["html","css","javascript","bootstrap","sql","node","jquery"];
let current="html";
const $=s=>document.querySelector(s);
const codePanel=$("#codePanel"),resultPanel=$("#resultPanel");
function escapeHTML(value){return value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function showLesson(key){
 current=key; const item=lessons[key];
 $("#exampleTitle").textContent=item.title;$("#sourceLink").href=item.source||"README.md";$("#lessonHeading").textContent=item.heading;
 $("#lessonDescription").textContent=item.description;$("#lessonTip").textContent=item.tip;
 codePanel.querySelector("code").textContent=item.code;codePanel.classList.remove("hidden");resultPanel.classList.add("hidden");
 $("#codeTab").classList.add("active");$("#resultTab").classList.remove("active");
 $("#simulationNote").textContent=item.note||"Preview runs in your browser. Examples are for learning and may be simplified.";
 document.querySelectorAll("[data-topic]").forEach(el=>el.classList.toggle("selected",el.dataset.topic===key));
 renderPreview(item);
}
function renderPreview(item){
 if(item.kind==="html") resultPanel.innerHTML='<div class="browser-card"><h3>Welcome to my page</h3><p>This is my first paragraph.</p><a href="https://www.nasa.gov/" target="_blank" rel="noopener">Visit NASA ↗</a></div>';
 else if(item.kind==="css") resultPanel.innerHTML='<div class="browser-card" style="background:#f1f5ff;border:1px solid #dce6fb;border-radius:12px;padding:20px;max-width:320px"><h3 style="color:#315fbd;margin-top:0">Profile card</h3><p>A simple card styled with CSS.</p></div>';
 else if(item.kind==="js") resultPanel.innerHTML='<div class="browser-card"><h3>Button demo</h3><p id="message">Click the button to update this message.</p><button id="helloButton">Say hello</button></div>';
 else if(item.kind==="bootstrap") resultPanel.innerHTML='<div class="browser-card" style="max-width:100%;display:grid;grid-template-columns:repeat(3,1fr);gap:8px"><div style="background:#eaf0ff;padding:20px 8px;text-align:center;border-radius:6px">Column one</div><div style="background:#eaf0ff;padding:20px 8px;text-align:center;border-radius:6px">Column two</div><div style="background:#eaf0ff;padding:20px 8px;text-align:center;border-radius:6px">Column three</div></div><p class="output-label">Visual grid preview · simplified for this lesson</p>';
 else if(item.kind==="sql") resultPanel.innerHTML='<p class="output-label">SIMULATED QUERY RESULT · 3 ROWS</p><table class="sql-table"><thead><tr><th>title</th><th>artist</th><th>release_year</th></tr></thead><tbody><tr><td>Smells Like Teen Spirit</td><td>Nirvana</td><td>1991</td></tr><tr><td>Even Flow</td><td>Pearl Jam</td><td>1992</td></tr><tr><td>Black Hole Sun</td><td>Soundgarden</td><td>1994</td></tr></tbody></table>';
 else if(item.kind==="node") resultPanel.innerHTML='<p class="output-label">SIMULATED SERVER RESPONSE</p><div class="browser-card"><span class="live-dot"></span><h3>200 OK</h3><p style="font-family:DM Mono,monospace;color:#328a66">Hello from Node.js!</p><small style="color:#8b98a9">Illustrative response · server not running</small></div>';
 else resultPanel.innerHTML='<div class="browser-card"><h3>jQuery demo</h3><p id="message">The message is waiting to be updated.</p><button id="showMessage">Update message</button></div>';
 const hello=$("#helloButton");if(hello)hello.addEventListener("click",()=>$("#message").textContent="Hello! JavaScript is working.");
 const jq=$("#showMessage");if(jq)jq.addEventListener("click",()=>$("#message").textContent="The message was updated!");
}
document.querySelectorAll("[data-topic]").forEach(el=>el.addEventListener("click",()=>{showLesson(el.dataset.topic);$("#playground").scrollIntoView({behavior:"smooth"});}));
$("#codeTab").addEventListener("click",()=>{$("#codeTab").classList.add("active");$("#resultTab").classList.remove("active");codePanel.classList.remove("hidden");resultPanel.classList.add("hidden");});
$("#resultTab").addEventListener("click",()=>{$("#resultTab").classList.add("active");$("#codeTab").classList.remove("active");codePanel.classList.add("hidden");resultPanel.classList.remove("hidden");});
$("#copyCode").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(lessons[current].code);$("#copyCode").textContent="Copied!";setTimeout(()=>$("#copyCode").textContent="Copy code",1300);}catch(e){$("#copyCode").textContent="Select code to copy";}});
$("#nextExample").addEventListener("click",()=>{const i=order.indexOf(current);showLesson(order[(i+1)%order.length]);});
$("#topicSearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase();document.querySelectorAll(".topic-card").forEach(card=>{card.hidden=!card.textContent.toLowerCase().includes(q);});});
showLesson("html");