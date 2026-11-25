'use strict';
/* ============ UTIL ============ */
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const yen=n=>Math.round(n).toLocaleString('ja-JP');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const isMobile=matchMedia('(pointer:coarse)').matches;

/* ============ LAYOUT CONSTANTS ============ */
const KDOOR=2.6,DOOR={x:5.6,z:4.95};
const COUNTER_SEATS=[-4.3,-3.4,-2.5,-1.6,-0.7];
const TABLE_SLOTS=[{x:-3.2,z:2.75},{x:-0.4,z:2.75},{x:2.4,z:2.75},{x:-1.8,z:4.15},{x:-7,z:1.7},{x:-7,z:3.7},{x:-5.4,z:4.25}];
const ZASHIKI=[{x:-4.4,z:-2.4},{x:-1.0,z:-2.4},{x:2.4,z:-2.4},{x:-4.4,z:2.3},{x:-1.0,z:2.3},{x:2.4,z:2.3}];
const STAIR={x0:-8.5,x1:-7.3,z0:-4.42,z1:.62},SB={x:-7.9,z:.8},ST={x:-7.9,z:-4.55},SL={x:-6.4,z:-4.55};
const KEN={x:4.15,z:4.5};
const inStair=(x,z)=>x>=STAIR.x0&&x<=STAIR.x1&&z>=STAIR.z0&&z<=STAIR.z1;
const stairY=z=>clamp(-z/4.2,0,1)*3;
const groundY=(x,z,y)=>inStair(x,z)?stairY(z):(y>1.5?3:0);
const lvl=p=>p.y>1.5?1:0;
function minX(){return SV.up.expand?-8.85:-4.85}
const has2F=()=>SV.up.floor2>0;

/* ============ TEXTURES ============ */
function cv(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return c}
function tx(c,rep,srgb){const t=new THREE.CanvasTexture(c);if(srgb!==false)t.encoding=THREE.sRGBEncoding;t.anisotropy=8;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}return t}
function ctex(w,h,draw,rep){return tx(cv(w,h,draw),rep)}
const FONT=(px,f)=>px+'px '+(f||'"Dela Gothic One","Zen Kaku Gothic New",serif');
const FONTB=(px)=>'900 '+px+'px "Zen Kaku Gothic New","Noto Sans JP",sans-serif';
function grain(g,w,h,col,n,amp,a0,a1){for(let i=0;i<n;i++){g.strokeStyle=col;g.globalAlpha=rnd(a0||.05,a1||.22);g.lineWidth=rnd(.6,2.4);g.beginPath();const y=rnd(0,h),a=rnd(1,amp),f=rnd(.004,.02),ph=rnd(0,6);for(let x=0;x<=w;x+=6){const yy=y+Math.sin(x*f+ph)*a+Math.sin(x*f*3.1+ph)*a*.3;x?g.lineTo(x,yy):g.moveTo(x,yy)}g.stroke()}g.globalAlpha=1}
function speck(g,w,h,n,c,a0,a1,s0,s1){for(let i=0;i<n;i++){g.fillStyle=c;g.globalAlpha=rnd(a0,a1);const s=rnd(s0,s1);g.fillRect(rnd(0,w),rnd(0,h),s,s)}g.globalAlpha=1}
/* plank floor: rows along x */
function plankSet(w,h,n,hue,l0,l1,sat){const ph=h/n,L=[];for(let i=0;i<n;i++){const cuts=[rnd(0,w)];if(Math.random()<.6)cuts.push((cuts[0]+w*rnd(.35,.65))%w);L.push({y:i*ph,cuts,l:rnd(l0,l1),s:rnd(sat[0],sat[1]),h:hue+rnd(-4,4)})}
 const col=cv(w,h,g=>{L.forEach(p=>{g.fillStyle=`hsl(${p.h},${p.s}%,${p.l}%)`;g.fillRect(0,p.y,w,ph);g.save();g.beginPath();g.rect(0,p.y,w,ph);g.clip();g.translate(0,p.y);grain(g,w,ph,'#1a0c04',18,2.5);grain(g,w,ph,'#ffe0b0',6,2,.03,.08);g.restore()});g.fillStyle='rgba(18,9,3,.9)';L.forEach(p=>{g.fillRect(0,p.y,w,2);p.cuts.forEach(c=>g.fillRect(c,p.y,2,ph))});speck(g,w,h,500,'#000',.02,.08,1,3)});
 const bmp=cv(w,h,g=>{g.fillStyle='#9a9a9a';g.fillRect(0,0,w,h);L.forEach(p=>{g.save();g.beginPath();g.rect(0,p.y,w,ph);g.clip();g.translate(0,p.y);grain(g,w,ph,'#6a6a6a',14,2.5,.2,.5);g.restore()});g.fillStyle='#202020';L.forEach(p=>{g.fillRect(0,p.y,w,3);p.cuts.forEach(c=>g.fillRect(c,p.y,3,ph))})});
 return [col,bmp]}
function tileSet(w,h,s,base,var0,grout,gw){const col=cv(w,h,g=>{g.fillStyle=grout;g.fillRect(0,0,w,h);for(let y=0;y<h;y+=s)for(let x=0;x<w;x+=s){const l=rnd(-var0,var0);g.fillStyle=base(l);g.fillRect(x+gw,y+gw,s-gw*2,s-gw*2);speck(g,0,0,0)}speck(g,w,h,800,'#000',.02,.06,1,2);speck(g,w,h,300,'#fff',.02,.06,1,2)});
 const bmp=cv(w,h,g=>{g.fillStyle='#202020';g.fillRect(0,0,w,h);g.fillStyle='#b0b0b0';for(let y=0;y<h;y+=s)for(let x=0;x<w;x+=s)g.fillRect(x+gw,y+gw,s-gw*2,s-gw*2);speck(g,w,h,1500,'#fff',.05,.2,1,2)});return [col,bmp]}

const M={};const std=o=>new THREE.MeshStandardMaterial(o);
const basic=o=>new THREE.MeshBasicMaterial(o);
function pair(set,rep,o,bs){const m=std(Object.assign({map:tx(set[0],rep),bumpMap:tx(set[1],rep,false),bumpScale:bs||.015},o));return m}
function signTex(text,sub,bg,fg,w,h,vert,font){return ctex(w,h,g=>{g.fillStyle=bg;g.fillRect(0,0,w,h);g.fillStyle='rgba(0,0,0,.12)';for(let i=0;i<60;i++)g.fillRect(rnd(0,w),rnd(0,h),rnd(10,60),1);g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';if(vert){const sz=Math.min(w*.62,(h*(sub?.7:.86))/text.length);g.font=FONT(sz,font);[...text].forEach((ch,i)=>g.fillText(ch,w/2,h*.07+sz*(i+.5)));if(sub){g.font=FONTB(w*.22);g.fillText(sub,w/2,h*.9)}}else{g.font=FONT(h*(sub?.42:.58),font);g.fillText(text,w/2,h*(sub?.4:.53));if(sub){g.font=FONTB(h*.18);g.fillText(sub,w/2,h*.8)}}})}
function signM(text,sub,bg,fg,w,h,vert,o){return std(Object.assign({map:signTex(text,sub,bg,fg,w,h,vert),roughness:.75},o||{}))}
function facade(cols,rows,base,frame,litP,seed){const W=512,H=512;let wins=[];const cw=W/cols,rh=H/rows;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)wins.push({x:c*cw+cw*.18,y:r*rh+rh*.22,w:cw*.64,h:rh*.56,on:Math.random()<litP,col:pick(['#ffd79a','#ffe9c2','#cfe6ff','#ffcf8a','#fff3dd'])});
 const map=cv(W,H,g=>{g.fillStyle=base;g.fillRect(0,0,W,H);speck(g,W,H,2500,'#000',.03,.12,1,3);for(let r=1;r<rows;r++){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,r*rh-3,W,4)}wins.forEach(w=>{g.fillStyle=frame;g.fillRect(w.x-3,w.y-3,w.w+6,w.h+6);g.fillStyle=w.on?w.col:'#1a2230';g.fillRect(w.x,w.y,w.w,w.h);if(w.on&&Math.random()<.5){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(w.x,w.y,w.w*rnd(.2,.5),w.h)}g.fillStyle='rgba(255,255,255,.08)';g.fillRect(w.x+w.w/2-1,w.y,2,w.h)})});
 const em=cv(W,H,g=>{g.fillStyle='#000';g.fillRect(0,0,W,H);wins.forEach(w=>{if(w.on){g.fillStyle=w.col;g.fillRect(w.x,w.y,w.w,w.h)}})});
 return std({map:tx(map),emissiveMap:tx(em),emissive:0xffffff,emissiveIntensity:.9,roughness:.85})}

function mats(){
M.floorWood=pair(plankSet(512,512,7,26,22,32,[32,44]),[2.2,2.2],{roughness:.5,metalness:0},.02);
M.floorTile=pair(tileSet(512,512,64,l=>`hsl(160,5%,${46+l}%)`,4,'#3c3f3d',3),[6,3],{roughness:.42},.03);
M.concrete=pair(tileSet(512,512,256,l=>`hsl(30,4%,${50+l}%)`,3,'#3a3836',3),[10,2],{roughness:.9},.02);
M.wall=pair([cv(256,256,(g,w,h)=>{g.fillStyle='#ebe1cc';g.fillRect(0,0,w,h);speck(g,w,h,3000,'#8a7a60',.03,.09,1,3);speck(g,w,h,800,'#fff',.05,.12,1,3)}),cv(256,256,(g,w,h)=>{g.fillStyle='#888';g.fillRect(0,0,w,h);speck(g,w,h,5000,'#fff',.05,.25,1,3);speck(g,w,h,4000,'#000',.05,.25,1,3)})],[3,2],{roughness:.92},.01);
M.wains=pair([cv(256,256,(g,w,h)=>{const n=8,bw=w/n;for(let i=0;i<n;i++){g.fillStyle=`hsl(24,${rnd(30,38)}%,${rnd(20,26)}%)`;g.fillRect(i*bw,0,bw,h);g.save();g.translate(i*bw,0);g.rotate(Math.PI/2);grain(g,h,bw,'#120804',12,2);g.restore();g.fillStyle='#120803';g.fillRect(i*bw,0,2,h)}}),cv(256,256,(g,w,h)=>{g.fillStyle='#999';g.fillRect(0,0,w,h);g.fillStyle='#111';for(let i=0;i<8;i++)g.fillRect(i*w/8,0,3,h)})],[4,1],{roughness:.55},.03);
M.wallTile=pair(tileSet(256,256,32,l=>`hsl(170,6%,${90+l}%)`,2,'#9aa4a0',1.5),[8,3],{roughness:.18,metalness:0},.02);
M.tatami=pair([cv(512,512,(g,w,h)=>{g.fillStyle='#b9b07a';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=4){g.fillStyle=`rgba(${rnd(90,120)},${rnd(100,120)},60,${rnd(.15,.35)})`;g.fillRect(0,y,w,2)}g.fillStyle='#24321f';g.fillRect(0,0,w,14);g.fillRect(0,h-14,w,14);g.fillStyle='#3a4d2f';g.fillRect(0,4,w,4);g.fillRect(0,h-8,w,4)}),cv(512,512,(g,w,h)=>{g.fillStyle='#888';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=4){g.fillStyle='#bbb';g.fillRect(0,y,w,2)}g.fillStyle='#333';g.fillRect(0,0,w,3);g.fillRect(0,h-3,w,3)})],[4,8],{roughness:.85},.02);
M.ceil=pair([cv(256,256,(g,w,h)=>{g.fillStyle='#c9a77a';g.fillRect(0,0,w,h);grain(g,w,h,'#7a5430',40,4);g.fillStyle='#5a3a20';for(let y=0;y<h;y+=64)g.fillRect(0,y,w,4)}),cv(256,256,(g,w,h)=>{g.fillStyle='#999';g.fillRect(0,0,w,h);g.fillStyle='#222';for(let y=0;y<h;y+=64)g.fillRect(0,y,w,5)})],[5,5],{roughness:.8,emissive:0x8a6a48,emissiveIntensity:.32},.02);
M.wood=std({map:ctex(256,256,(g,w,h)=>{g.fillStyle='#9a6a3e';g.fillRect(0,0,w,h);grain(g,w,h,'#4a2a12',70,6)}),roughness:.45});
M.woodLight=std({map:ctex(512,128,(g,w,h)=>{g.fillStyle='#d7b48a';g.fillRect(0,0,w,h);grain(g,w,h,'#9a6a3e',90,3);grain(g,w,h,'#fff2dc',20,2,.05,.12)},[1,1]),roughness:.32});
M.woodDark=std({map:ctex(256,256,(g,w,h)=>{g.fillStyle='#4a2e19';g.fillRect(0,0,w,h);grain(g,w,h,'#1f1108',60,5)}),roughness:.55});
M.woodBlack=std({color:0x2a1c12,roughness:.4});
M.steel=std({map:ctex(256,256,(g,w,h)=>{g.fillStyle='#b8bcc0';g.fillRect(0,0,w,h);for(let i=0;i<500;i++){g.fillStyle=`rgba(${Math.random()<.5?255:60},${Math.random()<.5?255:60},${Math.random()<.5?255:60},${rnd(.03,.09)})`;g.fillRect(0,rnd(0,h),w,1)}}),metalness:.9,roughness:.32});
M.steelDark=std({color:0x6e7378,metalness:.85,roughness:.4});
M.chrome=std({color:0xe6e8ea,metalness:1,roughness:.12});
M.black=std({color:0x161618,roughness:.45,metalness:.25});
M.rubber=std({color:0x1e1e20,roughness:.95});
M.iron=std({color:0x2a2a2c,roughness:.6,metalness:.7});
M.glass=std({color:0xcfe4ee,roughness:.04,metalness:.1,transparent:true,opacity:.16,depthWrite:false});
M.glassBottle=std({color:0x6a3a10,roughness:.1,metalness:.1,transparent:true,opacity:.75});
M.screen=std({color:0x0a1a2a,emissive:0x5aa6ff,emissiveIntensity:.9,roughness:.2});
M.red=std({color:0xb0141e,roughness:.35});
M.redVinyl=std({color:0x9a121a,roughness:.3});
M.white=std({color:0xf4efe6,roughness:.4});
M.plastic=std({color:0xe8e4da,roughness:.35});
M.cream=std({color:0xf3ece0,roughness:.18});
M.panel=basic({color:0xfff4e0});
M.bulb=std({color:0xffe6b0,emissive:0xffb35a,emissiveIntensity:2});
M.flame=basic({color:0x4a8aff,transparent:true,opacity:.85});
M.paper=std({color:0xf6f0e2,roughness:.9,emissive:0xffd9a0,emissiveIntensity:.25,side:THREE.DoubleSide});
M.shoji=std({map:ctex(256,256,(g,w,h)=>{g.fillStyle='#f4ecd8';g.fillRect(0,0,w,h);g.fillStyle='#6a4a2a';for(let x=0;x<=w;x+=64)g.fillRect(x-3,0,6,h);for(let y=0;y<=h;y+=42)g.fillRect(0,y-3,w,6)}),emissive:0xffe1b0,emissiveMap:null,emissiveIntensity:.18,roughness:.9});
M.cardboard=std({map:ctex(128,128,(g,w,h)=>{g.fillStyle='#b88a55';g.fillRect(0,0,w,h);speck(g,w,h,400,'#5a3a1a',.05,.15,1,2);g.fillStyle='#d9c69a';g.fillRect(w*.44,0,w*.12,h);g.fillStyle='#3a2a1a';g.font='bold 18px sans-serif';g.fillText('麺',8,30)}),roughness:.9});
M.soy=std({color:0x1a0a04,roughness:.1});M.chili=std({color:0xb8200a,roughness:.15});M.capR=std({color:0xc8102e,roughness:.4});M.capW=std({color:0xf5f2ea,roughness:.4});M.pepper=std({color:0xe9e2d0,roughness:.6});
M.water=std({color:0x8fb0a8,roughness:.05,transparent:true,opacity:.8});
M.waterBlue=std({color:0x9cc7e6,roughness:.05,transparent:true,opacity:.55});
M.stock=std({map:ctex(128,128,(g,w,h)=>{g.fillStyle='#e6d2a6';g.fillRect(0,0,w,h);for(let i=0;i<60;i++){g.fillStyle=`rgba(255,220,140,${rnd(.2,.5)})`;g.beginPath();g.arc(rnd(0,w),rnd(0,h),rnd(1,5),0,7);g.fill()}}),roughness:.1,emissive:0x5a3a10,emissiveIntensity:.15});
M.bone=std({color:0xe8dcc4,roughness:.7});
M.noodle=std({map:ctex(256,256,(g,w,h)=>{g.fillStyle='#d9a63c';g.fillRect(0,0,w,h);for(let i=0;i<70;i++){g.strokeStyle=pick(['#f6d98a','#eec468','#fbe6a8']);g.lineWidth=rnd(3,5);g.beginPath();let x=rnd(0,w),y=rnd(0,h);g.moveTo(x,y);for(let k=0;k<6;k++){x+=rnd(-40,40);y+=rnd(-40,40);g.quadraticCurveTo(x+rnd(-20,20),y+rnd(-20,20),x,y)}g.stroke()}}),roughness:.38});
M.chashu=std({map:ctex(128,128,(g,w,h)=>{const r=g.createRadialGradient(64,64,10,64,64,64);r.addColorStop(0,'#e7a894');r.addColorStop(.7,'#c8765f');r.addColorStop(.86,'#f3dcc8');r.addColorStop(1,'#7a3a1a');g.fillStyle=r;g.fillRect(0,0,w,h);speck(g,w,h,200,'#f6d2c0',.1,.3,2,4)}),roughness:.5});
M.naruto=std({map:ctex(128,128,(g,w,h)=>{g.fillStyle='#fbf6ee';g.fillRect(0,0,w,h);g.strokeStyle='#e0568a';g.lineWidth=7;g.beginPath();for(let a=0;a<14;a+=.1){const r=a*4.2;const x=64+Math.cos(a)*r,y=64+Math.sin(a)*r;a?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}),roughness:.4});
M.egg=std({color:0xf2a33a,roughness:.25});M.eggW=std({color:0xf7eee0,roughness:.35});M.eggS=std({color:0xc98a4a,roughness:.4});
M.nori=std({color:0x16221b,roughness:.75,side:THREE.DoubleSide});M.negi=std({color:0x7cc552,roughness:.45});M.menma=std({color:0xc89a4a,roughness:.5});
M.beer=std({color:0xe8a020,roughness:.08,transparent:true,opacity:.88,emissive:0x5a3000,emissiveIntensity:.25});M.foam=std({color:0xfffaf0,roughness:.8});
M.gyoza=std({color:0xeed6aa,roughness:.55});M.gyozaB=std({color:0xa8662a,roughness:.5});
M.bowlOut=std({map:ctex(512,128,(g,w,h)=>{g.fillStyle='#f6f1e8';g.fillRect(0,0,w,h);g.fillStyle='#b3121c';g.fillRect(0,h*.78,w,h*.22);g.strokeStyle='#b3121c';g.lineWidth=5;const s=32;for(let x=0;x<w;x+=s){g.beginPath();g.moveTo(x+4,h*.74);g.lineTo(x+4,h*.5);g.lineTo(x+s-4,h*.5);g.lineTo(x+s-4,h*.66);g.lineTo(x+12,h*.66);g.lineTo(x+12,h*.58);g.stroke()}g.fillStyle='#b3121c';g.fillRect(0,0,w,h*.06)}),roughness:.18});
M.bowlBlack=std({color:0x1b1210,roughness:.2});
M.broth={};
M.skin=[0xf1c9a5,0xe0ac7e,0xc68c5a,0x9a6440,0xf6d5bd,0xd9a27a].map(c=>std({color:c,roughness:.55}));
M.hair=[0x14100c,0x2b1d14,0x4a3020,0x7a5a3a,0x0d0d0d,0x8a8a8a,0x5a2e1a].map(c=>std({color:c,roughness:.75}));
M.cloth=[0x2b4a7a,0x7a2b2b,0x2f5e3f,0x3a3a46,0xc29a4a,0x5a3a6e,0xd8d2c4,0x1f2f3a,0xb85a2a,0x6e7f8a,0x8a9a5a,0xe8e2d6,0x40506a].map(c=>std({color:c,roughness:.85}));
M.pants=[0x22262e,0x3a3226,0x1c2a3a,0x4a4a4a,0x2a3a5a,0x5a4a3a].map(c=>std({color:c,roughness:.9}));
M.shoe=std({color:0x1a1614,roughness:.5});M.shoeW=std({color:0xe8e6e0,roughness:.6});
M.eyeW=std({color:0xf8f6f0,roughness:.3});M.eye=std({color:0x0e0c0a,roughness:.2});M.lip=std({color:0x8a3a3a,roughness:.5});
M.towel=std({color:0xf2efe6,roughness:.9});M.towelB=std({color:0x1c2b4a,roughness:.9});
M.lantern=std({map:ctex(256,256,(g,w,h)=>{g.fillStyle='#d4141e';g.fillRect(0,0,w,h);g.strokeStyle='#7a0a10';g.lineWidth=3;for(let y=8;y<h;y+=14){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}g.fillStyle='#1a0a05';g.font=FONT(96);g.textAlign='center';g.textBaseline='middle';g.fillText('ら',w*.25,h/2);g.fillText('ら',w*.75,h/2)}),emissive:0xff3a1a,emissiveIntensity:.9,roughness:.6});
M.asphalt=pair([cv(512,512,(g,w,h)=>{g.fillStyle='#232327';g.fillRect(0,0,w,h);speck(g,w,h,9000,'#555',.1,.4,1,2);speck(g,w,h,3000,'#000',.1,.3,1,3)}),cv(512,512,(g,w,h)=>{g.fillStyle='#777';g.fillRect(0,0,w,h);speck(g,w,h,12000,'#fff',.1,.5,1,2);speck(g,w,h,12000,'#000',.1,.5,1,2)})],[10,4],{roughness:.92},.03);
M.lineW=std({color:0xd8d6cc,roughness:.8});M.lineY=std({color:0xd8a020,roughness:.8});
M.steam=new THREE.SpriteMaterial({map:ctex(128,128,(g)=>{const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(.4,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128)}),transparent:true,depthWrite:false,opacity:.2});
M.plant=std({color:0x2f6b35,roughness:.7});M.plant2=std({color:0x3f8a40,roughness:.7});M.pot=std({color:0x7a4a2a,roughness:.7});M.potW=std({color:0xd8d2c4,roughness:.5});
M.marker=basic({color:0xf2a541,transparent:true,opacity:.55,depthWrite:false});
M.cushion=[0x7a1420,0x1c2b4a,0x3a5a2a,0x6a3a1a].map(c=>std({color:c,roughness:.85}));
M.noren=std({map:ctex(512,160,(g,w,h)=>{g.fillStyle='#1c2b4a';g.fillRect(0,0,w,h);g.fillStyle='rgba(255,255,255,.05)';for(let y=0;y<h;y+=3)g.fillRect(0,y,w,1);g.fillStyle='#f6ead7';g.font=FONT(92);g.textAlign='center';g.textBaseline='middle';g.fillText('らーめん',w/2,h*.52);g.fillStyle='#c8102e';g.beginPath();g.arc(w*.92,h*.2,14,0,7);g.fill()}),roughness:.9,side:THREE.DoubleSide});
M.norenK=signM('ひなた',null,'#7a1418','#f6ead7',256,128,false,{side:THREE.DoubleSide,roughness:.9});
M.vend=std({map:ctex(256,512,(g,w,h)=>{g.fillStyle='#f4f4f4';g.fillRect(0,0,w,h);g.fillStyle='#c8102e';g.fillRect(0,0,w,70);g.fillStyle='#fff';g.font=FONTB(34);g.textAlign='center';g.fillText('つめた〜い',w/2,48);g.fillStyle='#dfe8ee';g.fillRect(14,84,w-28,260);for(let r=0;r<4;r++)for(let c=0;c<6;c++){g.fillStyle=pick(['#2b7ad8','#d82b2b','#f2c12e','#2bb36a','#8a5a2a','#f28a2e','#ffffff','#111']);g.fillRect(24+c*36,96+r*62,22,44);g.fillStyle='#2a2';g.fillRect(24+c*36,144+r*62,22,6)}g.fillStyle='#222';g.fillRect(30,380,w-60,80);g.fillStyle='#555';g.fillRect(w-70,360,30,40)}),emissive:0xffffff,emissiveMap:null,emissiveIntensity:.55,roughness:.4});
M.vend.emissiveMap=M.vend.map;
M.ken=std({map:ctex(256,512,(g,w,h)=>{g.fillStyle='#d9d9d4';g.fillRect(0,0,w,h);g.fillStyle='#1a1a1a';g.fillRect(16,20,w-32,330);const items=[['醤油','800'],['塩','800'],['味噌','900'],['豚骨','950'],['チャーシュー','1250'],['味玉','100'],['大盛','150'],['餃子','480'],['ビール','600'],['ライス','150']];items.forEach((it,i)=>{const c=i%2,r=Math.floor(i/2);const x=24+c*106,y=30+r*62;g.fillStyle=i<5?'#f2d27a':'#fff';g.fillRect(x,y,98,52);g.fillStyle='#1a1a1a';g.font=FONTB(it[0].length>4?14:20);g.textAlign='center';g.fillText(it[0],x+49,y+24);g.font=FONTB(13);g.fillText(it[1]+'円',x+49,y+44)});g.fillStyle='#111';g.fillRect(40,380,80,40);g.fillStyle='#3a8ad8';g.fillRect(150,372,70,56);g.fillStyle='#222';g.fillRect(30,450,w-60,40);g.fillStyle='#c8102e';g.font=FONTB(22);g.textAlign='center';g.fillText('食券',w/2,476)}),emissive:0xffffff,emissiveMap:null,emissiveIntensity:.45,roughness:.4});
M.ken.emissiveMap=M.ken.map;
M.clock=std({map:ctex(256,256,(g,w,h)=>{g.fillStyle='#f6f2ea';g.beginPath();g.arc(128,128,124,0,7);g.fill();g.fillStyle='#222';for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.fillRect(128+Math.sin(a)*100-3,128-Math.cos(a)*100-8,6,16)}g.strokeStyle='#222';g.lineWidth=8;g.beginPath();g.moveTo(128,128);g.lineTo(128+60,128-30);g.stroke();g.lineWidth=5;g.beginPath();g.moveTo(128,128);g.lineTo(128-20,128-95);g.stroke()}),roughness:.4,transparent:true});
M.tv=std({map:ctex(256,144,(g,w,h)=>{const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#2a6a3a');gr.addColorStop(1,'#1a3a6a');g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle='#4a9a4a';g.fillRect(0,h*.55,w,h*.45);g.fillStyle='#fff';g.beginPath();g.arc(w*.6,h*.62,5,0,7);g.fill();g.fillStyle='rgba(0,0,0,.6)';g.fillRect(8,8,70,18);g.fillStyle='#fff';g.font='bold 12px sans-serif';g.fillText('LIVE 2-1',12,21)}),emissive:0xffffff,emissiveMap:null,emissiveIntensity:.8,roughness:.2});
M.tv.emissiveMap=M.tv.map;
M.calli=signM('一杯入魂',null,'#f4efe2','#141414',128,420,true,{roughness:.9});
M.scroll=signM('麺心',null,'#efe6cf','#1a1a1a',128,380,true,{roughness:.9});
M.poster=std({map:ctex(256,360,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#1a3a8a');gr.addColorStop(1,'#0a1a4a');g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle='#f2a520';g.fillRect(70,110,116,170);g.fillStyle='#fff8e6';g.fillRect(64,90,128,34);g.fillStyle='#fff';g.font=FONT(46);g.textAlign='center';g.fillText('生ビール',w/2,60);g.font=FONTB(36);g.fillStyle='#f2d27a';g.fillText('¥600',w/2,330)}),roughness:.6});
M.menuBoard=std({map:ctex(512,320,(g,w,h)=>{g.fillStyle='#3a2414';g.fillRect(0,0,w,h);grain(g,w,h,'#1a0c04',40,3);g.fillStyle='#f6ead7';g.font=FONT(40);g.textAlign='center';g.fillText('お品書き',w/2,50);const it=[['醤油らーめん','800'],['塩らーめん','800'],['味噌らーめん','900'],['豚骨らーめん','950'],['チャーシュー麺','1250'],['餃子（六個）','480'],['瓶ビール','600']];g.font=FONTB(26);it.forEach((x,i)=>{g.textAlign='left';g.fillText(x[0],40,100+i*31);g.textAlign='right';g.fillStyle='#f2d27a';g.fillText(x[1]+'円',w-40,100+i*31);g.fillStyle='#f6ead7'})}),roughness:.7});
M.strip=[['醤油','八〇〇円'],['塩','八〇〇円'],['味噌','九〇〇円'],['豚骨','九五〇円'],['餃子','四八〇円'],['麦酒','六〇〇円'],['味玉','百円'],['大盛','百五十円']].map(s=>signM(s[0],s[1],'#f1e6c8','#1a1208',96,360,true,{roughness:.9,side:THREE.DoubleSide}));
M.kanban=std({map:ctex(1024,200,(g,w,h)=>{g.fillStyle='#1d1209';g.fillRect(0,0,w,h);grain(g,w,h,'#000',40,3);g.strokeStyle='#c49a4a';g.lineWidth=8;g.strokeRect(10,10,w-20,h-20);g.fillStyle='#f2d27a';g.font=FONT(120);g.textAlign='center';g.textBaseline='middle';g.fillText('麺屋ひなた',w/2,h*.52)}),emissive:0xffd27a,emissiveMap:null,emissiveIntensity:.35,roughness:.6});
M.kanban.emissiveMap=M.kanban.map;
M.aboard=signM('本日のおすすめ','味噌らーめん','#1e2a1e','#f6ead7',256,300,false,{roughness:.8});
M.shopSign=['#c8102e','#1f5fbf','#2a8a4a','#d88a1a','#7a2a8a'].map((c,i)=>std({map:signTex(['居酒屋','薬局','コンビニ','焼き鳥','カラオケ'][i],null,c,'#fff',512,128),emissive:0xffffff,emissiveIntensity:.7,roughness:.5}));
M.shopSign.forEach(m=>m.emissiveMap=m.map);
M.facades=[facade(5,6,'#6a6458','#2a2622',.45),facade(4,5,'#4a4e56','#1a1c20',.35),facade(6,8,'#7a6a5a','#3a2e22',.5),facade(3,4,'#5a4a44','#221a16',.4)];
M.roof=std({color:0x2a2826,roughness:.9});
M.alley=std({color:0x1a1a1c,roughness:.95});
['shoyu','shio','miso','tonkotsu','chashumen'].forEach(k=>{const c=new THREE.Color(RAMEN[k].c);M.broth[k]=std({map:ctex(128,128,(g,w,h)=>{g.fillStyle='#'+c.getHexString();g.fillRect(0,0,w,h);for(let i=0;i<50;i++){g.fillStyle=`rgba(255,${rnd(200,240)|0},120,${rnd(.15,.45)})`;g.beginPath();g.arc(rnd(0,w),rnd(0,h),rnd(1.5,6),0,7);g.fill()}}),roughness:.08,emissive:RAMEN[k].c,emissiveIntensity:.08})});
}

/* ============ GEOMETRY HELPERS ============ */
const gBox=new THREE.BoxGeometry(1,1,1),gSph=new THREE.SphereGeometry(1,20,14),gDisc=new THREE.CircleGeometry(1,28),gCylU=new THREE.CylinderGeometry(1,1,1,22);
const GC={};function geoCyl(r1,r2,h,s){const k='c'+r1+'|'+r2+'|'+h+'|'+(s||14);return GC[k]||(GC[k]=new THREE.CylinderGeometry(r1,r2,h,s||14))}
function bx(p,w,h,d,m,x,y,z,cast){const o=new THREE.Mesh(gBox,m);o.scale.set(w,h,d);o.position.set(x,y,z);o.castShadow=cast!==false;o.receiveShadow=true;p.add(o);return o}
function cy(p,r,h,m,x,y,z,cast,r2,seg){const o=new THREE.Mesh(r2!=null||seg?geoCyl(r,r2!=null?r2:r,h,seg||20):gCylU,m);if(r2==null&&!seg)o.scale.set(r,h,r);o.position.set(x,y,z);o.castShadow=cast!==false;o.receiveShadow=true;p.add(o);return o}
function sp(p,r,m,x,y,z,cast){const o=new THREE.Mesh(gSph,m);o.scale.setScalar(r);o.position.set(x,y,z);o.castShadow=cast!==false;p.add(o);return o}
function pl(p,w,h,m,x,y,z,ry,rx){const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);o.position.set(x,y,z);if(ry)o.rotation.y=ry;if(rx)o.rotation.x=rx;o.receiveShadow=true;p.add(o);return o}
const RBC={};
function rbGeo(w,h,d,r){const k=[w,h,d,r].map(v=>v.toFixed(3)).join('|');if(RBC[k])return RBC[k];const bs=Math.min(r*.6,h/3,w/4,d/4);const iw=w/2-bs,id=d/2-bs,rr=Math.max(.002,Math.min(r,iw,id)-bs*.2);const s=new THREE.Shape();s.moveTo(-iw+rr,-id);s.lineTo(iw-rr,-id);s.quadraticCurveTo(iw,-id,iw,-id+rr);s.lineTo(iw,id-rr);s.quadraticCurveTo(iw,id,iw-rr,id);s.lineTo(-iw+rr,id);s.quadraticCurveTo(-iw,id,-iw,id-rr);s.lineTo(-iw,-id+rr);s.quadraticCurveTo(-iw,-id,-iw+rr,-id);
 const g=new THREE.ExtrudeGeometry(s,{depth:Math.max(.002,h-2*bs),bevelEnabled:true,bevelThickness:bs,bevelSize:bs,bevelSegments:2,curveSegments:3});g.rotateX(-Math.PI/2);g.computeBoundingBox();const b=g.boundingBox;g.translate(-(b.min.x+b.max.x)/2,-(b.min.y+b.max.y)/2,-(b.min.z+b.max.z)/2);
 const uv=g.attributes.uv;for(let i=0;i<uv.count;i++){uv.setXY(i,uv.getX(i)*.6,uv.getY(i)*.6)}RBC[k]=g;return g}
function rb(p,w,h,d,r,m,x,y,z,cast){const o=new THREE.Mesh(rbGeo(w,h,d,r),m);o.position.set(x,y,z);o.castShadow=cast!==false;o.receiveShadow=true;p.add(o);return o}
function tube(p,pts,r,m,cast){const c=new THREE.CatmullRomCurve3(pts.map(a=>new THREE.Vector3(a[0],a[1],a[2])));const o=new THREE.Mesh(new THREE.TubeGeometry(c,Math.max(8,pts.length*6),r,8,false),m);o.castShadow=cast!==false;p.add(o);return o}
function noShadow(o){o.traverse(c=>{c.castShadow=false});return o}

/* ============ DISHES ============ */
const bowlProf=[[.06,0],[.066,.004],[.092,.02],[.126,.05],[.152,.085],[.168,.115],[.174,.126],[.17,.128]].map(p=>new THREE.Vector2(p[0],p[1]));
const gBowl=new THREE.LatheGeometry(bowlProf,28),gBowlIn=new THREE.LatheGeometry(bowlProf.map(v=>new THREE.Vector2(Math.max(0,v.x-.008),v.y+.006)).reverse(),28);
const gHalf=new THREE.SphereGeometry(1,16,10,0,Math.PI*2,0,Math.PI/2);
const gArc=new THREE.TorusGeometry(.03,.006,5,10,Math.PI);
function dish(kind,type){const g=new THREE.Group();
if(kind==='ramen'||kind==='dirty'||kind==='noodle'||kind==='bowl'){const o=new THREE.Mesh(gBowl,M.bowlOut);o.castShadow=true;g.add(o);const ii=new THREE.Mesh(gBowlIn,M.cream);g.add(ii);
 if(kind==='ramen'){const b=new THREE.Mesh(gDisc,M.broth[type]);b.rotation.x=-Math.PI/2;b.scale.setScalar(.155);b.position.y=.09;g.add(b);const n=new THREE.Mesh(gDisc,M.noodle);n.rotation.x=-Math.PI/2;n.scale.setScalar(.09);n.position.set(.02,.093,.025);g.add(n);
  for(let i=0;i<5;i++){const t=new THREE.Mesh(gArc,M.noodle);t.position.set(rnd(-.04,.06),.093,rnd(-.02,.07));t.rotation.set(-Math.PI/2+rnd(-.3,.3),0,rnd(0,6));g.add(t)}
  const nc=type==='chashumen'?4:1;for(let i=0;i<nc;i++){const a=-2.3+i*.8;const ch=cy(g,.046,.012,M.chashu,Math.cos(a)*.085,.1+i*.003,Math.sin(a)*.085,false);ch.rotation.set(rnd(-.25,-.1),0,rnd(-.2,.2))}
  if(RAMEN[type].rec.egg){[-1,1].forEach(s=>{const e=new THREE.Mesh(gHalf,M.eggW);e.scale.set(.026,.022,.032);e.rotation.x=Math.PI/2*0;e.position.set(.07+s*.025,.093,.04);g.add(e);const y=new THREE.Mesh(gDisc,M.egg);y.rotation.x=-Math.PI/2;y.scale.setScalar(.014);y.position.set(.07+s*.025,.116,.04);g.add(y)})}
  if(RAMEN[type].rec.nori){[0,1].forEach(i=>{const nr=bx(g,.075,.1,.003,M.nori,-.02+i*.05,.13,-.115+i*.01,false);nr.rotation.set(-.35,i*.15,0)})}
  const nar=cy(g,.025,.008,M.naruto,-.08,.1,.06,false);nar.rotation.x=-.15;
  for(let i=0;i<4;i++){const m=bx(g,.012,.006,.05,M.menma,rnd(.02,.06),.098,rnd(-.08,-.04),false);m.rotation.y=rnd(-.6,.6)}
  for(let i=0;i<12;i++){const t=cy(g,.007,.004,M.negi,rnd(-.03,.03),.1,rnd(-.02,.05),false)}}
 if(kind==='noodle'){const n=new THREE.Mesh(gDisc,M.noodle);n.rotation.x=-Math.PI/2;n.scale.setScalar(.13);n.position.y=.07;g.add(n)}
 if(kind==='dirty'){const b=new THREE.Mesh(gDisc,M.dirty||(M.dirty=std({color:0x8a6a40,roughness:.4,transparent:true,opacity:.65})));b.rotation.x=-Math.PI/2;b.scale.setScalar(.09);b.position.y=.03;g.add(b);const cs=bx(g,.24,.006,.008,M.woodLight,.02,.13,0,false);cs.rotation.y=.4}}
else if(kind==='beer'){const gl=cy(g,.04,.16,M.glass,0,.08,0,false);cy(g,.036,.13,M.beer,0,.068,0,false);cy(g,.038,.03,M.foam,0,.148,0,false);const h=new THREE.Mesh(new THREE.TorusGeometry(.03,.007,6,12,Math.PI),M.glass);h.position.set(.045,.085,0);h.rotation.z=-Math.PI/2;g.add(h);const bt=cy(g,.032,.2,M.glassBottle,.11,.1,0,false);cy(g,.012,.06,M.glassBottle,.11,.23,0,false);bx(g,.05,.06,.002,M.capW,.11,.1,.033,false)}
else if(kind==='gyoza'){const pl2=cy(g,.12,.012,M.white,0,.006,0);pl2.scale.set(.12,.012,.08);for(let i=0;i<6;i++){const q=new THREE.Mesh(gHalf,M.gyoza);q.scale.set(.017,.022,.042);q.rotation.z=0;q.position.set(-.07+i*.028,.012,0);q.castShadow=true;g.add(q);const b=bx(g,.03,.004,.07,M.gyozaB,-.07+i*.028,.014,0,false)}const sc=cy(g,.03,.015,M.white,.1,.008,.07,false);cy(g,.026,.004,M.soy,.1,.016,.07,false)}
return g}

/* ============ PEOPLE ============ */
const gHairCap=new THREE.SphereGeometry(1,18,12,0,Math.PI*2,0,Math.PI*.56);
function person(o){const g=new THREE.Group(),body=new THREE.Group();g.add(body);
const skin=o.skin||pick(M.skin),hair=o.hairM||pick(M.hair),top=o.top,pants=o.pants||pick(M.pants),shoe=o.shoe||M.shoe,sleeve=o.sleeve||top;
const legs=[],knees=[];[-1,1].forEach(s=>{const hip=new THREE.Group();hip.position.set(s*.085,.92,0);body.add(hip);const th=new THREE.Mesh(geoCyl(.074,.06,.46,12),pants);th.position.y=-.23;th.castShadow=true;hip.add(th);const kn=new THREE.Group();kn.position.y=-.46;hip.add(kn);const sh=new THREE.Mesh(geoCyl(.057,.045,.42,12),o.skirt?skin:pants);sh.position.y=-.21;sh.castShadow=true;kn.add(sh);const ft=new THREE.Mesh(gSph,shoe);ft.scale.set(.055,.042,.115);ft.position.set(0,-.43,.045);ft.castShadow=true;kn.add(ft);legs.push(hip);knees.push(kn)});
const pel=new THREE.Mesh(geoCyl(.155,.14,.16,14),pants);pel.scale.z=.74;pel.position.y=.95;pel.castShadow=true;body.add(pel);
if(o.skirt){const sk=new THREE.Mesh(geoCyl(.15,.25,.4,16),o.skirt);sk.scale.z=.78;sk.position.y=.78;sk.castShadow=true;body.add(sk)}
const tor=new THREE.Mesh(geoCyl(.178,.152,.5,16),top);tor.scale.z=.66;tor.position.y=1.2;tor.castShadow=true;body.add(tor);
const ch=new THREE.Mesh(gSph,top);ch.scale.set(.185,.085,.12);ch.position.y=1.43;body.add(ch);
if(o.jacketOpen){bx(body,.07,.4,.01,o.jacketOpen,0,1.25,.118,false)}
if(o.tie){const t=bx(body,.035,.3,.012,o.tie,0,1.24,.12,false)}
if(o.apron){bx(body,.32,.62,.016,o.apron,0,.98,.123,false);bx(body,.36,.025,.24,o.apron,0,1.2,0,false);if(o.apronTop)bx(body,.22,.22,.016,o.apron,0,1.33,.125,false)}
if(o.happi){bx(body,.38,.5,.02,o.happi,0,1.12,.115,false);bx(body,.04,.5,.022,M.white,-.06,1.12,.122,false);bx(body,.04,.5,.022,M.white,.06,1.12,.122,false)}
const arms=[],elbows=[];[-1,1].forEach(s=>{const sh=new THREE.Group();sh.position.set(s*.218,1.4,0);body.add(sh);const sb=new THREE.Mesh(gSph,sleeve);sb.scale.setScalar(.06);sh.add(sb);const ua=new THREE.Mesh(geoCyl(.052,.045,.29,10),sleeve);ua.position.y=-.145;ua.castShadow=true;sh.add(ua);const el=new THREE.Group();el.position.y=-.29;sh.add(el);const fa=new THREE.Mesh(geoCyl(.043,.035,.26,10),o.short?skin:sleeve);fa.position.y=-.13;fa.castShadow=true;el.add(fa);const hd=new THREE.Mesh(gSph,skin);hd.scale.set(.04,.058,.03);hd.position.y=-.29;el.add(hd);arms.push(sh);elbows.push(el)});
const nk=new THREE.Mesh(geoCyl(.048,.052,.1,10),skin);nk.position.y=1.5;body.add(nk);
const head=new THREE.Group();head.position.y=1.63;body.add(head);
const hm=new THREE.Mesh(gSph,skin);hm.scale.set(.108,.125,.115);hm.castShadow=true;head.add(hm);
const jaw=new THREE.Mesh(gSph,skin);jaw.scale.set(.085,.06,.09);jaw.position.set(0,-.06,.018);head.add(jaw);
[-1,1].forEach(s=>{const e=sp(head,1,skin,s*.105,0,0,false);e.scale.set(.018,.03,.014);
 const ew=sp(head,1,M.eyeW,s*.04,.012,.1,false);ew.scale.set(.019,.012,.008);const pu=sp(head,1,M.eye,s*.04,.012,.106,false);pu.scale.set(.009,.01,.005);
 const br=bx(head,.034,.007,.006,hair,s*.04,.04,.104,false);br.rotation.z=s*-.12});
const ns=sp(head,1,skin,0,-.012,.115,false);ns.scale.set(.016,.024,.016);
bx(head,.032,.005,.004,M.lip,0,-.055,.103,false);
const style=o.hairStyle||pick(['short','short','long','bun','buzz','side']);
const cap=new THREE.Mesh(gHairCap,hair);cap.scale.set(.118,.13,.124);cap.position.set(0,.012,-.008);cap.rotation.x=-.32;cap.castShadow=true;head.add(cap);
if(style==='buzz'){cap.scale.set(.112,.128,.118)}
if(style==='long'){rb(head,.22,.3,.07,.03,hair,0,-.14,-.075);}
if(style==='bun'){sp(head,.055,hair,0,.1,-.09)}
if(style==='side'){const f=sp(head,1,hair,.04,.08,.07,false);f.scale.set(.08,.03,.05);f.rotation.z=-.3}
if(o.towel){const t=new THREE.Mesh(new THREE.TorusGeometry(.118,.02,6,20),o.towel);t.rotation.x=Math.PI/2;t.position.y=.05;t.scale.z=1.05;head.add(t);const k=sp(head,.025,o.towel,.06,.06,-.1,false)}
if(o.cap){cy(head,.12,.07,o.cap,0,.1,-.005,true,.115);const br=cy(head,.09,.012,o.cap,0,.07,.1,false);br.scale.z=.055}
if(o.tall){cy(head,.12,.2,o.tall,0,.18,0)}
if(o.glasses){[-1,1].forEach(s=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.024,.004,5,14),M.black);r.position.set(s*.04,.012,.112);head.add(r)});bx(head,.03,.004,.004,M.black,0,.014,.114,false)}
g.userData={legs,knees,arms,elbows,body,head,hand:null,phase:rnd(0,6)};return g}
function animPerson(p,speed,dt,mode){const u=p.userData;u.phase+=dt*Math.max(speed,0)*7;const sw=Math.min(speed,1);
if(mode==='chair'||mode==='stool'||mode==='seiza'){const seiza=mode==='seiza';u.legs.forEach(l=>{l.rotation.x=seiza?-1.35:-1.5});u.knees.forEach(k=>{k.rotation.x=seiza?2.75:1.5});u.body.position.y=u.sitOff!=null?u.sitOff:-.4;u.body.position.z=seiza?-.05:0;u.arms.forEach((a,i)=>{a.rotation.x=-.65;a.rotation.z=(i?-1:1)*.1});u.elbows.forEach(e=>e.rotation.x=-.9);u.head.rotation.x=.12+Math.sin(u.phase*.1+performance.now()*.0007)*.05;u.phase+=dt;return}
u.body.position.z=0;
if(mode==='wave'){u.body.position.y=0;u.legs.forEach(l=>l.rotation.x=0);u.knees.forEach(k=>k.rotation.x=0);const t=performance.now()*.006;u.arms[1].rotation.x=-2.6;u.arms[1].rotation.z=-.3+Math.sin(t)*.35;u.elbows[1].rotation.x=-.3;u.arms[0].rotation.x=0;u.elbows[0].rotation.x=-.2;return}
u.body.position.y=Math.abs(Math.sin(u.phase))*.028*sw;u.legs.forEach((l,i)=>{const s=Math.sin(u.phase+i*Math.PI);l.rotation.x=s*.55*sw});u.knees.forEach((k,i)=>{const s=Math.sin(u.phase+i*Math.PI+1.2);k.rotation.x=Math.max(0,s)*.7*sw});
if(u.hand){u.arms.forEach(a=>{a.rotation.x=-.75;a.rotation.z=0});u.elbows.forEach(e=>e.rotation.x=-.75)}else{u.arms.forEach((a,i)=>{a.rotation.x=Math.sin(u.phase+(1-i)*Math.PI)*.42*sw;a.rotation.z=(i?-1:1)*.06});u.elbows.forEach(e=>e.rotation.x=-.15-.25*sw)}
u.head.rotation.x=0}
function setHand(p,item){const u=p.userData;if(u.handMesh){u.body.remove(u.handMesh);u.handMesh=null}u.hand=item;if(item){const m=dish(item.kind==='dirty'?'dirty':item.kind,item.type);m.position.set(0,1.02,.4);if(item.kind==='dirty'&&item.n>1){for(let i=1;i<Math.min(item.n,5);i++){const d=new THREE.Mesh(gBowl,M.bowlOut);d.position.y=i*.05;m.add(d)}}u.body.add(m);u.handMesh=m}}

/* ============ ENVIRONMENT MAP ============ */
function makeEnv(renderer){try{const es=new THREE.Scene();es.background=new THREE.Color(0x1a120c);const room=new THREE.Mesh(new THREE.BoxGeometry(20,8,20),basic({color:0x5a4634,side:THREE.BackSide}));es.add(room);[[0,3.9,0,14,.2,8,0xfff1d8],[0,-3.9,0,20,.2,20,0x6a5440],[-6,2,-9.9,4,2,.2,0xffd9a0],[6,2,-9.9,4,2,.2,0xffe6c0],[0,2.5,9.9,8,2,.2,0x6a8aff],[-9.9,2,0,.2,2,6,0xffb070],[9.9,2,0,.2,2,6,0xfff0dc]].forEach(a=>{const m=new THREE.Mesh(new THREE.BoxGeometry(a[3],a[4],a[5]),basic({color:a[6]}));m.position.set(a[0],a[1],a[2]);es.add(m)});const pm=new THREE.PMREMGenerator(renderer);const t=pm.fromScene(es,.04).texture;pm.dispose();return t}catch(e){return null}}
