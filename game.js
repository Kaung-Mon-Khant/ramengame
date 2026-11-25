'use strict';
/* ================= DATA ================= */
const RAMEN={shoyu:{n:'醤油ラーメン',s:'醤油',p:800,c:0x5a2e12,rec:{noodle:1,soup:1,chashu:1,negi:1,nori:1}},
shio:{n:'塩ラーメン',s:'塩',p:800,c:0xd8b25a,rec:{noodle:1,soup:1,chashu:1,negi:1,nori:1}},
miso:{n:'味噌ラーメン',s:'味噌',p:900,c:0xa86a2c,rec:{noodle:1,soup:1,chashu:1,negi:1,egg:1}},
tonkotsu:{n:'豚骨ラーメン',s:'豚骨',p:950,c:0xeadbbd,rec:{noodle:1,soup:1,chashu:1,negi:1,egg:1,nori:1}},
chashumen:{n:'チャーシュー麺',s:'チャーシュー',p:1250,c:0x6a3816,rec:{noodle:1,soup:1,chashu:4,negi:1,nori:1},lock:'chashumen'}};
const ITEMS={noodle:{n:'生麺',my:'ခေါက်ဆွဲ',pack:10,cost:900,unit:'食'},gara:{n:'豚骨・鶏ガラ',my:'ဟင်းရည်အတွက် အရိုး (ဟင်းရည် 20 ပွဲ)',pack:1,cost:1500,unit:'袋'},chashu:{n:'チャーシュー',my:'ဝက်သားပြား',pack:20,cost:1600,unit:'枚'},egg:{n:'味玉',my:'ကြက်ဥ',pack:10,cost:500,unit:'個'},negi:{n:'ねぎ',my:'ကြက်သွန်မြိတ်',pack:30,cost:400,unit:'杯分'},nori:{n:'のり',my:'ပင်လယ်ရေညှိ',pack:30,cost:350,unit:'枚'},beer:{n:'瓶ビール',my:'ဘီယာ',pack:24,cost:4800,unit:'本',need:'beer'},gyoza:{n:'冷凍餃子',my:'ဂျိုဇာ (6 ခုစီ)',pack:30,cost:1200,unit:'個',need:'gyoza'},bowl:{n:'ラーメン丼',my:'ပန်းကန် (ဆေးပြီး ပြန်သုံး)',pack:5,cost:2500,unit:'個'}};
const PRICE={beer:600,gyoza:480};
const UPG={
table:{n:'テーブル席を追加',my:'စားပွဲ 1 လုံး (ထိုင်ခုံ 2)',cost:[6000,8000,10000,12000,14000,16000],max:()=>SV.up.expand?6:3},
expand:{n:'店舗拡張（左ウィング）',my:'ဆိုင်ကို ဘယ်ဘက်ချဲ့ (စားပွဲ 3 လုံးထပ်ထည့်လို့ရ + နောက်ခန်း သိုလှောင်ရုံ)',cost:[30000],max:()=>1},
floor2:{n:'2階 座敷を増築',my:'လှေကားနဲ့ ၂ ထပ် 座敷 (ဖိနပ်ချွတ် ကြမ်းပြင်ထိုင်) ခန်း · စားပွဲပု 3 လုံး (ထိုင်ခုံ 6)',cost:[60000],max:()=>1,req:()=>SV.up.expand?'':'ဆိုင်ချဲ့ပြီးမှ ဆောက်လို့ရ'},
zashiki:{n:'座敷テーブル追加',my:'၂ ထပ်မှာ စားပွဲပု 1 လုံး (ထိုင်ခုံ 2)',cost:[12000,14000,16000],max:()=>3,req:()=>SV.up.floor2?'':'၂ ထပ် ဆောက်ပြီးမှ'},
kenbaiki:{n:'券売機（食券機）',my:'ဧည့်သည် ဝင်လာရင် 食券 ကိုယ်တိုင်ဝယ်လို့ အော်ဒါ အလိုအလျောက်ဝင်',cost:[15000],max:()=>1},
boiler:{n:'茹で麺機を増設',my:'ခေါက်ဆွဲ တစ်ခါတည်း ပြုတ်နိုင်တာ 2 → 4 → 6 ပွဲ',cost:[7000,15000],max:()=>2},
beer:{n:'ビールサーバー＆冷蔵ケース',my:'ဘီယာ ရောင်းလို့ရ (¥600)',cost:[9000],max:()=>1},
gyoza:{n:'餃子焼き器',my:'ဂျိုဇာ ရောင်းလို့ရ (¥480)',cost:[12000],max:()=>1},
fridge:{n:'業務用冷蔵庫',my:'သိုလှောင်နိုင်မှု 150 → 400',cost:[9000],max:()=>1},
chashumen:{n:'新メニュー：チャーシュー麺',my:'¥1,250 menu အသစ်',cost:[5000],max:()=>1},
decor:{n:'内装・ちょうちん',my:'ဆိုင်လှလာပြီး ဧည့်သည် ပိုလာ၊ ပိုစိတ်ရှည်',cost:[5000,9000],max:()=>2}};
const STAFF={
cook:{n:'調理スタッフ',my:'ခေါက်ဆွဲပြုတ်၊ ပန်းကန်ပြင်ပြီး パス台 ပေါ်တင်',wage:4500,hire:3000,max:()=>3},
prep:{n:'仕込み担当',my:'ဟင်းရည်ချက်၊ ဂျိုဇာကင်',wage:3500,hire:2500,max:()=>1},
hall:{n:'ホールスタッフ',my:'အော်ဒါယူ၊ ကျွေး၊ ဘီယာ (၂ ထပ်ကိုလည်း တက်ကျွေး)',wage:4000,hire:3000,max:()=>2+(SV.up.floor2?2:0)},
dish:{n:'洗い場スタッフ',my:'စားပွဲက ပန်းကန်သိမ်းပြီး ဆေး',wage:3000,hire:2000,max:()=>2},
cashier:{n:'レジ係',my:'ငွေကောင်တာမှာ ငွေရှင်း',wage:3000,hire:2000,max:()=>1},
manager:{n:'店長',my:'ပစ္စည်းနည်းရင် အလိုအလျောက်မှာ၊ ဝန်ထမ်းအားလုံး 15% ပိုမြန်',wage:6000,hire:8000,max:()=>1},
barker:{n:'呼び込み',my:'ဆိုင်ရှေ့ လမ်းပေါ်မှာ ဧည့်သည်ခေါ် (ဧည့်သည် ~35% ပိုလာ)',wage:2500,hire:2000,max:()=>1}};
const NAMES=['田中','佐藤','鈴木','高橋','伊藤','渡辺','山本','中村','小林','加藤','吉田','山田','松本','井上'];
const staffName=(role,i)=>NAMES[(Object.keys(STAFF).indexOf(role)*2+i)%NAMES.length];
const RENT=3000,DAYLEN=300,FRIDGE=[150,400];
const QP=[[4.4,2.8],[4.4,3.35],[4.4,3.9],[3.8,3.9],[3.2,3.9],[3.2,3.35],[2.6,3.35],[2.6,3.9]];const qpos=i=>{const q=QP[Math.min(i,QP.length-1)];return {x:q[0],z:q[1]}};

/* ================= SAVE ================= */
const KEY='ramen-hinata-sim-v1';
const fresh=()=>({money:40000,day:1,rating:3,inv:{noodle:20,soup:20,gara:2,chashu:30,egg:10,negi:40,nori:30,beer:0,gyoza:0},bowls:12,up:{table:0,expand:0,floor2:0,zashiki:0,kenbaiki:0,boiler:0,beer:0,gyoza:0,fridge:0,chashumen:0,decor:0},staff:{cook:0,prep:0,hall:0,dish:0,cashier:0,manager:0,barker:0},view:'top',sound:true,best:0,seen:false});
let SV=fresh();
try{const r=localStorage.getItem(KEY);if(r){const p=JSON.parse(r);if(p&&p.inv&&p.up){const f=fresh();SV=Object.assign(f,p);SV.inv=Object.assign(fresh().inv,p.inv);SV.up=Object.assign(fresh().up,p.up);SV.staff=Object.assign(fresh().staff,p.staff)}}}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(SV))}catch(e){}};
try{if(!localStorage.getItem('rh-v2-clean')){localStorage.setItem('rh-v2-clean','1');if(SV.day===5&&SV.up.zashiki===3&&SV.staff.hall===4&&SV.up.boiler===2&&SV.staff.barker===1){SV=fresh();save()}}}catch(e){}
const invTotal=()=>['noodle','chashu','egg','negi','nori','beer','gyoza'].reduce((a,k)=>a+(SV.inv[k]||0),0)+SV.inv.gara*10;
const fridgeCap=()=>FRIDGE[SV.up.fridge];

/* ================= AUDIO ================= */
let AC=null;
function sfx(t){if(!SV.sound)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const n=AC.currentTime;const o=(f,d,s,v,w)=>{const a=AC.createOscillator(),g=AC.createGain();a.type=w||'sine';a.frequency.value=f;g.gain.setValueAtTime(0,n+s);g.gain.linearRampToValueAtTime(v,n+s+.01);g.gain.exponentialRampToValueAtTime(.0001,n+s+d);a.connect(g);g.connect(AC.destination);a.start(n+s);a.stop(n+s+d+.05)};
({tap:()=>o(660,.07,0,.07,'triangle'),cash:()=>{o(1320,.12,0,.1,'square');o(1760,.25,.08,.08,'square')},bad:()=>o(150,.3,0,.13,'sawtooth'),door:()=>{o(988,.4,0,.07);o(1319,.6,.12,.06)},ding:()=>o(1047,.3,0,.1,'triangle'),pour:()=>o(220,.5,0,.05,'sine'),wash:()=>o(300,.2,0,.05,'triangle')})[t]()}catch(e){}}
let jv=null;function speak(s){if(!SV.sound||!('speechSynthesis' in window))return;try{if(!jv)jv=speechSynthesis.getVoices().find(v=>/^ja/i.test(v.lang))||null;const u=new SpeechSynthesisUtterance(s);u.lang='ja-JP';if(jv)u.voice=jv;u.rate=1.1;speechSynthesis.speak(u)}catch(e){}}

/* ================= THREE SETUP ================= */
const canvas=$('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,isMobile?1.6:2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.physicallyCorrectLights=false;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0c0a10);scene.fog=new THREE.Fog(0x0c0a10,22,48);
const camera=new THREE.PerspectiveCamera(42,1,.1,90);
function lights(){scene.add(new THREE.HemisphereLight(0xffe6c8,0x2a1a10,.5));
const sun=new THREE.DirectionalLight(0xfff0dc,.72);sun.position.set(3,14,7);sun.target.position.set(-1,0,0);sun.castShadow=true;sun.shadow.mapSize.set(isMobile?1024:2048,isMobile?1024:2048);const sc=sun.shadow.camera;sc.left=-13;sc.right=11;sc.top=10;sc.bottom=-10;sc.near=1;sc.far=34;sun.shadow.bias=-.0005;sun.shadow.normalBias=.02;scene.add(sun);scene.add(sun.target)}

/* ================= STEAM ================= */
const steam=[];function emit(x,y,z,sp2,sc,par){if(steam.length>80)return;const s=new THREE.Sprite(M.steam.clone());s.position.set(x+rnd(-sp2,sp2),y,z+rnd(-sp2,sp2));s.userData={life:0,max:rnd(1.6,2.6),sc:sc||.3};s.scale.setScalar(.1);(par||scene).add(s);steam.push(s)}
function updSteam(dt){for(let i=steam.length-1;i>=0;i--){const s=steam[i],u=s.userData;u.life+=dt;const k=u.life/u.max;s.position.y+=dt*.35;s.scale.setScalar(u.sc*(.4+k*1.6));s.material.opacity=Math.sin(Math.min(k,1)*Math.PI)*.22;if(k>=1){s.parent&&s.parent.remove(s);s.material.dispose();steam.splice(i,1)}}}
const addDyn=(m)=>{(m.position.y>2?G.dyn2:scene).add(m);return m};
const rm=m=>{if(m&&m.parent)m.parent.remove(m)};

/* ================= GAME STATE ================= */
const W={phase:'prep',t:0,cust:[],tickets:[],tid:1,boil:[],gyoza:{st:'idle',t:0},queue:[],stats:{sales:0,tips:0,served:0,left:0,dash:0,perfect:0,cost:0},staff:[],spawnT:3,mgrT:4};
let player=null;let pLevel=0;
function resetDay(){W.t=0;W.cust.forEach(c=>{rm(c.mesh);rm(c.foodMesh)});W.cust=[];W.tickets=[];W.queue=[];W.boil=[];const n=[2,4,6][SV.up.boiler];for(let i=0;i<n;i++)W.boil.push({on:false,t:0});W.gyoza={st:'idle',t:0};passSlots.forEach(p=>{rm(p.mesh);p.dish=null;p.mesh=null});seats.forEach(s=>{s.cust=null;s.dirty=0;s.claim=null;rm(s.dirtyMesh);s.dirtyMesh=null});W.stats={sales:0,tips:0,served:0,left:0,dash:0,perfect:0,cost:0};W.spawnT=3;renderTickets()}
const HOMES={cook:[{x:-2.2,z:-3.3},{x:-.6,z:-3.2},{x:-3.6,z:-3.2}],prep:[{x:-3.9,z:-3.5}],hall:[{x:3.6,z:1.5},{x:1.0,z:1.6},{x:-1.5,z:3.6},{x:4.0,z:3.9}],dish:[{x:1.5,z:-3.3},{x:.2,z:-3.3}],cashier:[{x:6.1,z:2.8}],manager:[{x:5.3,z:-3.7}],barker:[{x:4.1,z:6.4}]};
function staffLook(role){const S=c=>std({color:c,roughness:.8});switch(role){
case 'cook':return {top:S(0x1a1a1c),short:true,towel:M.towel,apron:S(0x2a1a10),hairStyle:'short'};
case 'prep':return {top:S(0x2a2a2e),short:true,towel:M.towelB,apron:S(0x4a3220),hairStyle:'buzz'};
case 'hall':return {top:S(0x1c2b4a),towel:M.red,apron:S(0x151515),hairStyle:pick(['bun','short','long'])};
case 'dish':return {top:S(0x6a6a6e),short:true,cap:S(0x1c2b4a),apron:M.rubber,apronTop:true,hairStyle:'short'};
case 'cashier':return {top:S(0x1f3a5f),apron:S(0x2a1a10),hairStyle:'bun'};
case 'manager':return {top:S(0xf0eee8),jacketOpen:M.white,tie:M.red,glasses:true,hairStyle:'side',pants:M.pants[0],sleeve:S(0xf0eee8),happi:S(0x1a1a1c)};
case 'barker':return {top:M.white,happi:M.red,sleeve:M.red,towel:M.towel,hairStyle:'short'}}}
function spawnStaff(){W.staff.forEach(s=>rm(s.mesh));W.staff=[];seats.forEach(x=>{x.claim=null;if(x.cust)x.cust.claim=null});Object.keys(STAFF).forEach(role=>{for(let i=0;i<SV.staff[role];i++){const m=person(staffLook(role));const H=HOMES[role],home=H[i%H.length];m.position.set(home.x,0,home.z);scene.add(m);W.staff.push({role,mesh:m,path:[],busy:null,home,claim:null,wait:Math.random(),name:staffName(role,i)})}})}
const spdF=()=>W.staff.some(s=>s.role==='manager')?1.15:1;

/* ================= NAV ================= */
const Z0=()=>[{x0:-4.85,x1:6.25,z0:-3.85,z1:-.42},{x0:minX(),x1:6.25,z0:.48,z1:4.75},{x0:KDOOR-.42,x1:KDOOR+.42,z0:-.6,z1:.6},{x0:DOOR.x-.5,x1:DOOR.x+.5,z0:4.5,z1:8}];
const Z1=[{x0:-6.95,x1:6.25,z0:-4.75,z1:4.75},{x0:-8.45,x1:-6.9,z0:-4.75,z1:-4.32}];
const inZ=(x,z,zs)=>zs.some(q=>x>=q.x0&&x<=q.x1&&z>=q.z0&&z<=q.z1);
function walkable(x,z,y){if(has2F()&&inStair(x,z))return true;return inZ(x,z,y>1.5?Z1:Z0())}
function r0(from,to){const pts=[];const fs=has2F()&&inStair(from.x,from.z);const fk=from.z<0&&!fs,tk=to.z<0;const fo=from.z>4.9,to2=to.z>4.9;if(fo&&!to2)pts.push({x:DOOR.x,z:4.4});if(fk!==tk){pts.push({x:KDOOR,z:fk?-.6:.6});pts.push({x:KDOOR,z:fk?.6:-.6})}if(!fo&&to2)pts.push({x:DOOR.x,z:4.4});pts.push({x:to.x,z:to.z});return pts}
function r1(from,to){const pts=[];if(from.x<-6.9)pts.push(SL);if(to.x<-6.9)pts.push(SL);pts.push({x:to.x,z:to.z});return pts}
function route(from,to){const fl=from.y>1.5?1:0,tl=to.l||0;if(fl===tl)return tl?r1(from,to):r0(from,to);
 if(fl===0)return r0(from,SB).concat([ST]).concat(r1(ST,to));
 return r1(from,SL).concat([ST,SB]).concat(r0({x:SB.x,z:SB.z,y:0},to))}
function moveAlong(e,dt,speed){if(!e.path.length)return 0;const p=e.mesh.position,t=e.path[0];const dx=t.x-p.x,dz=t.z-p.z,d=Math.hypot(dx,dz);if(d<.05){e.path.shift();return e.path.length?speed:0}const st=Math.min(d,speed*dt);p.x+=dx/d*st;p.z+=dz/d*st;p.y=groundY(p.x,p.z,p.y);const a=Math.atan2(dx,dz);let da=a-e.mesh.rotation.y;while(da>Math.PI)da-=Math.PI*2;while(da<-Math.PI)da+=Math.PI*2;e.mesh.rotation.y+=da*Math.min(1,dt*12);return speed}
const goTo=(e,x,z,l)=>{e.path=route(e.mesh.position,{x,z,l:l||0})};
const face=(e,x,z)=>{e.mesh.rotation.y=Math.atan2(x-e.mesh.position.x,z-e.mesh.position.z)};

/* ================= CORE ACTIONS ================= */
function demandRamen(){let need=0;W.tickets.forEach(t=>t.items.forEach(i=>{if(i.kind==='ramen'&&!i.made)need++}));let have=W.boil.filter(b=>b.on).length;[player].concat(W.staff.map(s=>s.mesh)).forEach(h=>{const it=h.userData.hand;if(it&&it.kind==='noodle')have++});have+=W.staff.filter(s=>s.intent==='boil').length;return need-have}
function demandGyoza(){let need=0;W.tickets.forEach(t=>t.items.forEach(i=>{if(i.kind==='gyoza'&&!i.served)need++}));let have=(W.gyoza.st!=='idle'?1:0);[player].concat(W.staff.map(s=>s.mesh)).forEach(h=>{const it=h.userData.hand;if(it&&it.kind==='gyoza')have++});passSlots.forEach(p=>{if(p.dish&&p.dish.kind==='gyoza')have++});return need-have}
function act_boilStart(){const i=W.boil.findIndex(b=>!b.on);if(i<0)return '茹で麺機がいっぱい';if(SV.inv.noodle<=0)return '生麺の在庫がありません';SV.inv.noodle--;W.boil[i]={on:true,t:0};return true}
function act_boilTake(who){const rd=W.boil.map((b,i)=>[b,i]).filter(x=>x[0].on&&x[0].t>=6).sort((a,b)=>b[0].t-a[0].t);if(!rd.length)return false;const [b,i]=rd[0];const q=b.t<=13?'good':'over';W.boil[i]={on:false,t:0};setHand(who,{kind:'noodle',q});return true}
function act_assemble(who){const h=who.userData.hand;if(!h||h.kind!=='noodle')return 'no';let tgt=null;for(const t of W.tickets){for(const it of t.items){if(it.kind==='ramen'&&!it.made){tgt={t,it};break}}if(tgt)break}if(!tgt)return '作る注文がありません';const rec=RAMEN[tgt.it.type].rec;for(const k in rec){if(k==='noodle')continue;const have=k==='soup'?SV.inv.soup:SV.inv[k];if(have<rec[k])return (k==='soup'?'スープ':ITEMS[k].n)+'が足りません'}if(SV.bowls<=0)return 'きれいな丼がありません（洗い場へ）';for(const k in rec){if(k==='noodle')continue;if(k==='soup')SV.inv.soup-=rec[k];else SV.inv[k]-=rec[k]}SV.bowls--;updateBowlStack();tgt.it.made=true;setHand(who,{kind:'ramen',type:tgt.it.type,tid:tgt.t.id,q:h.q});return true}
function act_passPlace(who){const h=who.userData.hand;const x=who.position.x;const s=passSlots.filter(p=>!p.dish).sort((a,b)=>Math.abs(a.x-x)-Math.abs(b.x-x))[0];if(!s)return 'パス台がいっぱい';s.dish=h;const m=dish(h.kind,h.type);m.position.set(s.x,1.38,s.z);scene.add(m);s.mesh=m;setHand(who,null);return true}
function act_passTake(who,filter){const x=who.position.x;const s=passSlots.filter(p=>p.dish&&(!filter||filter(p.dish))).sort((a,b)=>Math.abs(a.x-x)-Math.abs(b.x-x))[0];if(!s)return false;setHand(who,s.dish);rm(s.mesh);s.dish=null;s.mesh=null;return true}
function seatNeeds(seat,item){const c=seat.cust;if(!c||c.st!=='waitFood'||!c.ticket||!item)return null;return c.ticket.items.find(i=>!i.served&&i.kind===item.kind&&(item.kind!=='ramen'||i.type===item.type))||null}
function act_serve(who,seat){const h=who.userData.hand;const need=seatNeeds(seat,h);if(!need)return false;if(h.kind==='ramen'){if(!need.made){need.made=true;if(h.tid&&h.tid!==seat.cust.ticket.id){const ot=W.tickets.find(t=>t.id===h.tid);if(ot){const oi=ot.items.find(i=>i.kind==='ramen'&&i.type===h.type&&i.made&&!i.served);if(oi)oi.made=false}}}if(h.q==='over')seat.cust.mood-=.25}need.served=true;setHand(who,null);sfx('ding');const c=seat.cust;
 if(c.ticket.items.every(i=>i.served)){c.st='eat';c.t=0;c.foodWait=c.pat/c.patMax;W.tickets=W.tickets.filter(t=>t!==c.ticket);c.bowls=c.ticket.items.filter(i=>i.kind==='ramen').length;const m=new THREE.Group();c.ticket.items.forEach((it,k)=>{const d=dish(it.kind,it.type);d.position.set((k-.5*(c.ticket.items.length-1))*.28,0,0);m.add(d)});m.position.set(seat.mx,seat.tableY,seat.mz);addDyn(m);c.foodMesh=m}renderTickets();return true}
function act_takeOrder(seat){const c=seat.cust;if(!c||c.st!=='waitOrder')return false;const menu=Object.keys(RAMEN).filter(k=>!RAMEN[k].lock||SV.up[RAMEN[k].lock]);const items=[{kind:'ramen',type:pick(menu),made:false,served:false}];if(Math.random()<.22)items.push({kind:'ramen',type:pick(menu),made:false,served:false});if(SV.up.beer&&Math.random()<.35)items.push({kind:'beer',served:false});if(SV.up.gyoza&&Math.random()<.35)items.push({kind:'gyoza',served:false});const t={id:W.tid++,seat:(seat.l?'2F·':'')+seat.label,seatRef:seat,items,t0:W.t};W.tickets.push(t);c.ticket=t;c.st='waitFood';c.pat=c.patMax=patience()*1.6+(seat.l?15:0);c.claim=null;renderTickets();sfx('tap');return true}
function act_pay(){const c=W.queue[0];if(!c)return false;W.queue.shift();const base=c.bill;const tip=Math.round(base*.15*clamp(c.mood,0,1)*clamp(c.foodWait||.5,0,1)/10)*10;SV.money+=base+tip;W.stats.sales+=base;W.stats.tips+=tip;W.stats.served++;floatAt(c.mesh.position,'+¥'+yen(base+tip));sfx('cash');if(Math.random()<.6)speak('ありがとうございました');SV.rating=clamp(SV.rating+(c.mood>.8?.06:c.mood>.5?.02:-.08),1,5);if(c.mood>.8)W.stats.perfect++;leave(c);W.queue.forEach((q,i)=>{const p=qpos(i);goTo(q,p.x,p.z)});save();return true}
function act_bus(who,seat){if(!seat.dirty)return false;const h=who.userData.hand;const n=seat.dirty;if(h&&h.kind!=='dirty')return false;const tot=(h?h.n:0)+n;setHand(who,{kind:'dirty',n:tot});seat.dirty=0;rm(seat.dirtyMesh);seat.dirtyMesh=null;seat.claim=null;return true}
function act_wash(who){const h=who.userData.hand;if(!h||h.kind!=='dirty')return false;SV.bowls+=h.n;setHand(who,null);updateBowlStack();sfx('wash');return true}
function act_stock(){if(SV.inv.gara<=0)return '豚骨・鶏ガラの在庫がありません';if(SV.inv.soup>60)return 'スープは十分あります';SV.inv.gara--;SV.inv.soup+=20;return true}
function act_beer(who){if(SV.inv.beer<=0)return 'ビールの在庫がありません';SV.inv.beer--;setHand(who,{kind:'beer'});sfx('pour');return true}
function act_gyozaStart(){if(W.gyoza.st!=='idle')return false;if(SV.inv.gyoza<6)return '冷凍餃子が足りません';SV.inv.gyoza-=6;W.gyoza={st:'cook',t:0};return true}
function act_gyozaTake(who){if(W.gyoza.st!=='ready')return false;W.gyoza={st:'idle',t:0};setHand(who,{kind:'gyoza'});return true}
function autoOrder(){const mg=W.staff.find(s=>s.role==='manager');if(!mg)return;const th={noodle:20,chashu:20,egg:10,negi:20,nori:15,gara:1,beer:10,gyoza:12};let spent=0;for(const k in th){const it=ITEMS[k];if(it.need&&!SV.up[it.need])continue;if(k==='gara'&&SV.inv.soup>40)continue;if(SV.inv[k]<th[k]&&SV.money>=it.cost+3000&&invTotal()+(k==='gara'?10:it.pack)<=fridgeCap()){SV.money-=it.cost;SV.inv[k]+=it.pack;spent+=it.cost;W.stats.cost+=it.cost}}const totalBowls=SV.bowls+seats.reduce((a,s)=>a+(s.dirty||0),0);if(totalBowls<8&&SV.money>=ITEMS.bowl.cost+3000){SV.money-=ITEMS.bowl.cost;SV.bowls+=ITEMS.bowl.pack;spent+=ITEMS.bowl.cost;W.stats.cost+=ITEMS.bowl.cost;updateBowlStack()}if(spent){floatAt(mg.mesh.position,'店長が発注 −¥'+yen(spent));save()}}

/* ================= CUSTOMERS ================= */
const patience=()=>(45+SV.up.decor*8)*(1+(SV.rating-3)*.06);
function freeSeat(){const fs=seats.filter(s=>!s.cust&&!s.dirty);return fs.length?pick(fs):null}
function custLook(){const r=Math.random();if(r<.28)return {top:pick(M.suit),tie:pick([M.red,M.towelB,M.cloth[5]]),jacketOpen:M.white,sleeve:null,hairStyle:pick(['short','side','buzz']),glasses:Math.random()<.35,pants:M.pants[0]};
 if(r<.48)return {top:pick(M.cloth),skirt:pick(M.cloth),hairStyle:pick(['long','bun','long']),shoe:pick([M.shoe,M.shoeW]),glasses:Math.random()<.15};
 return {top:pick(M.cloth),hairStyle:pick(['short','long','bun','side','buzz']),short:Math.random()<.4,cap:Math.random()<.15?pick(M.cloth):null,glasses:Math.random()<.15,shoe:pick([M.shoe,M.shoeW])}}
function spawnCustomer(){const s=freeSeat();if(!s)return;const m=person(custLook());m.position.set(DOOR.x+rnd(-.3,.3),0,9);scene.add(m);const c={mesh:m,path:[],seat:s,st:'walkIn',pat:0,patMax:0,mood:1,t:0};s.cust=c;
 if(SV.up.kenbaiki){c.st='toKen';c.path=route(m.position,{x:KEN.x,z:KEN.z-.45,l:0})}else c.path=route(m.position,{x:s.x,z:s.z,l:s.l});W.cust.push(c);sfx('door');if(Math.random()<.5)speak('いらっしゃいませ')}
function sitDown(c){const s=c.seat,m=c.mesh;m.position.set(s.x,s.y,s.z);m.rotation.y=s.rot;m.userData.sitOff=s.mode==='seiza'?-.6:s.sitY+.06-.92;c.st='waitOrder';c.pat=c.patMax=patience()+(s.l?12:0);if(c.pre)act_takeOrder(s)}
function leave(c,angry){if(c.seat&&c.seat.cust===c){c.seat.cust=null;rm(c.foodMesh);c.foodMesh=null}c.st='leave';c.path=route(c.mesh.position,{x:DOOR.x,z:9.5,l:0});if(angry){SV.rating=clamp(SV.rating-.25,1,5);W.stats.left++;floatAt(c.mesh.position,'評判↓',true);sfx('bad')}const qi=W.queue.indexOf(c);if(qi>=0)W.queue.splice(qi,1);if(c.ticket)W.tickets=W.tickets.filter(t=>t!==c.ticket);renderTickets()}
function updCustomers(dt){W.cust.forEach(c=>{const m=c.mesh;let spd=0;
if(c.st==='toKen'){spd=moveAlong(c,dt,1.6);if(!c.path.length){c.st='ken';c.t=0;face(c,KEN.x,KEN.z+1)}}
else if(c.st==='ken'){c.t+=dt;if(c.t>1.6){c.pre=true;c.st='walkIn';c.path=route(m.position,{x:c.seat.x,z:c.seat.z,l:c.seat.l});sfx('tap')}}
else if(c.st==='walkIn'){spd=moveAlong(c,dt,1.6);if(!c.path.length)sitDown(c)}
else if(c.st==='waitOrder'||c.st==='waitFood'){c.pat-=dt;if(c.pat<=0){leave(c,true)}}
else if(c.st==='eat'){c.t+=dt;if(Math.random()<dt*2&&c.foodMesh){const fp=c.foodMesh.position;emit(fp.x,fp.y+.2,fp.z,.05,.18,fp.y>2?G.dyn2:scene)}if(c.t>14){c.bill=c.ticket.items.reduce((a,i)=>a+(i.kind==='ramen'?RAMEN[i.type].p:PRICE[i.kind]),0);const s=c.seat;s.dirty=c.bowls;rm(c.foodMesh);c.foodMesh=null;if(c.bowls){const dm=new THREE.Group();for(let i=0;i<c.bowls;i++){const d=dish('dirty');d.position.x=i*.25;dm.add(d)}dm.position.set(s.mx,s.tableY,s.mz);addDyn(dm);s.dirtyMesh=dm}s.cust=null;c.seat=null;c.st='toPay';W.queue.push(c);c.pat=c.patMax=45;{const qp=qpos(W.queue.length-1);c.path=route(m.position,{x:qp.x,z:qp.z,l:0})}}}
else if(c.st==='toPay'){spd=moveAlong(c,dt,1.5);if(!c.path.length){if(W.queue[0]===c)face(c,5.6,2.8);else{const qi=W.queue.indexOf(c);const pp=qpos(Math.max(0,qi-1));face(c,pp.x,pp.z)}}c.pat-=dt;if(c.pat<=0){W.stats.dash++;leave(c,true)}}
else if(c.st==='leave'){spd=moveAlong(c,dt,1.7);if(!c.path.length){c.gone=true;rm(m)}}
const sitting=c.st==='waitOrder'||c.st==='waitFood'||c.st==='eat';animPerson(m,spd/1.6,dt,sitting?c.seat.mode:false)});W.cust=W.cust.filter(c=>!c.gone)}

/* ================= STAFF AI ================= */
function busyStart(e,dur,label,fn){e.busy={t:0,dur:dur/spdF(),label,fn}}
function staffThink(s){const m=s.mesh,h=m.userData.hand,P=m.position,R=s.role;
const go=(x,z,then,l)=>{goTo(s,x,z,l);s.then=then};
const home=()=>{if(dist(P,s.home)>.3||lvl(P)!==0)return go(s.home.x,s.home.z,null);s.wait=1};
const hasRole=r=>W.staff.some(x=>x.role===r);
if(R==='barker'){if(dist(P,s.home)>.3)return go(s.home.x,s.home.z,null);face(s,s.home.x+.5,9);s.wait=2;return}
if(R==='manager'){if(dist(P,s.home)>.3)return go(s.home.x,s.home.z,null);face(s,5.3,-4.4);s.wait=1;return}
if(R==='cashier'){if(dist(P,s.home)>.3)return go(s.home.x,s.home.z,null);face(s,5.6,2.8);if(W.queue.length&&W.queue[0].path.length===0)return busyStart(s,1.2,'pay',()=>act_pay());s.wait=.5;return}
if(R==='prep'){if(h){if(h.kind==='gyoza'){const fs=passSlots.find(p=>!p.dish);if(fs)return go(fs.x,-.75,()=>{if(act_passPlace(m)!==true)s.wait=1});s.wait=1;return}return go(stations.trash.sx,stations.trash.sz,()=>setHand(m,null))}
 if(G3.gyoza&&W.gyoza.st==='ready')return go(stations.gyoza.sx,stations.gyoza.sz,()=>act_gyozaTake(m));
 if(SV.inv.soup<30&&SV.inv.gara>0)return go(stations.stove.sx,stations.stove.sz,()=>busyStart(s,3,'stock',()=>act_stock()));
 if(G3.gyoza&&demandGyoza()>0&&W.gyoza.st==='idle'&&SV.inv.gyoza>=6)return go(stations.gyoza.sx,stations.gyoza.sz,()=>busyStart(s,.8,'gyoza',()=>act_gyozaStart()));
 return home()}
if(R==='cook'){if(!h){if(W.boil.some(b=>b.on&&b.t>=6))return go(stations.boiler.sx+rnd(-.3,.3),stations.boiler.sz,()=>act_boilTake(m));
  if(G3.gyoza&&!hasRole('prep')&&W.gyoza.st==='ready')return go(stations.gyoza.sx,stations.gyoza.sz,()=>act_gyozaTake(m));
  if(demandRamen()>0&&W.boil.filter(b=>!b.on).length>W.staff.filter(x=>x.intent==='boil').length&&SV.inv.noodle>0){s.intent='boil';return go(stations.boiler.sx+rnd(-.3,.3),stations.boiler.sz,()=>busyStart(s,.8,'boil',()=>{s.intent=null;act_boilStart()}))}
  if(G3.gyoza&&!hasRole('prep')&&demandGyoza()>0&&W.gyoza.st==='idle'&&SV.inv.gyoza>=6)return go(stations.gyoza.sx,stations.gyoza.sz,()=>busyStart(s,.8,'gyoza',()=>act_gyozaStart()));
  if(!hasRole('prep')&&SV.inv.soup<12&&SV.inv.gara>0)return go(stations.stove.sx,stations.stove.sz,()=>busyStart(s,3,'stock',()=>act_stock()));
  return home()}
 if(h.kind==='noodle')return go(stations.prep.sx+rnd(-.35,.35),stations.prep.sz,()=>busyStart(s,1.5,'prep',()=>{const r=act_assemble(m);if(r!==true){if(r==='作る注文がありません')setHand(m,null);else s.wait=2}}));
 if(h.kind==='ramen'||h.kind==='gyoza'){const fs=passSlots.filter(p=>!p.dish).sort((a,b)=>Math.abs(a.x-P.x)-Math.abs(b.x-P.x))[0];if(!fs){s.wait=1;return}return go(fs.x,-.75,()=>{if(act_passPlace(m)!==true)s.wait=1})}
 return go(stations.trash.sx,stations.trash.sz,()=>setHand(m,null))}
if(R==='dish'){if(!h){const ds=seats.find(x=>x.dirty&&!x.claim);if(ds){ds.claim=s;return go(ds.x,ds.z,()=>{act_bus(m,ds);ds.claim=null},ds.l)}if(SV.bowls<4&&seats.some(x=>x.dirty))return home();return home()}
 if(h.kind==='dirty'){const more=seats.find(x=>x.dirty&&!x.claim&&x.l===lvl(P)&&dist(x,P)<4&&h.n<5);if(more){more.claim=s;return go(more.x,more.z,()=>{act_bus(m,more);more.claim=null},more.l)}return go(stations.sink.sx,stations.sink.sz,()=>busyStart(s,2,'wash',()=>act_wash(m)))}
 return go(stations.trash.sx,stations.trash.sz,()=>setHand(m,null))}
if(R==='hall'){if(!h){if(!hasRole('cashier')&&W.queue.length&&W.queue[0].path.length===0&&!W.staff.some(x=>x!==s&&x.claim==='reg')){s.claim='reg';return go(stations.register.sx,stations.register.sz,()=>busyStart(s,1.2,'pay',()=>{act_pay();s.claim=null}))}
  const wo=seats.find(x=>x.cust&&x.cust.st==='waitOrder'&&!x.cust.claim);if(wo){wo.cust.claim=s;return go(wo.x,wo.z+(wo.l===0&&wo.label[0]==='C'?.0:0),()=>{if(wo.cust&&wo.cust.st==='waitOrder')busyStart(s,1.2,'order',()=>act_takeOrder(wo));else if(wo.cust)wo.cust.claim=null},wo.l)}
  const pd=passSlots.find(p=>p.dish&&seats.some(se=>seatNeeds(se,p.dish))&&!W.staff.some(x=>x!==s&&x.claimPass===p));if(pd){s.claimPass=pd;return go(pd.x,.75,()=>{s.claimPass=null;act_passTake(m,d=>seats.some(se=>seatNeeds(se,d)))})}
  const bn=seats.find(x=>x.cust&&x.cust.st==='waitFood'&&x.cust.ticket.items.some(i=>i.kind==='beer'&&!i.served))&&!W.staff.some(x=>x!==s&&x.claim==='beer');if(bn&&stations.beer&&SV.inv.beer>0){s.claim='beer';return go(stations.beer.sx,stations.beer.sz,()=>busyStart(s,1.5,'beer',()=>{act_beer(m);s.claim=null}))}
  if(!hasRole('dish')){const ds=seats.find(x=>x.dirty&&!x.claim);if(ds){ds.claim=s;return go(ds.x,ds.z,()=>{act_bus(m,ds);ds.claim=null},ds.l)}}
  return home()}
 if(h.kind==='dirty')return go(stations.sink.sx,stations.sink.sz,()=>busyStart(s,2,'wash',()=>act_wash(m)));
 const tgt=seats.find(x=>seatNeeds(x,h));if(tgt)return go(tgt.x,tgt.z,()=>{if(!act_serve(m,tgt))s.wait=.5},tgt.l);
 if(h.kind==='beer'){s.wait=1;return}
 const fs=passSlots.find(p=>!p.dish);if(fs)return go(fs.x,.75,()=>{if(act_passPlace(m)!==true)s.wait=1});s.wait=1}}
function updStaff(dt){const sp=2.3*spdF();W.staff.forEach(s=>{const m=s.mesh;let spd=0;if(s.busy){s.busy.t+=dt;if(s.busy.t>=s.busy.dur){const f=s.busy.fn;s.busy=null;f&&f()}}else if(s.path.length){spd=moveAlong(s,dt,sp);if(!s.path.length&&s.then){const f=s.then;s.then=null;f()}}else if(s.wait>0){s.wait-=dt}else if(W.phase==='open'||W.phase==='closing'||s.role==='cook'||s.role==='prep'||s.role==='manager'||s.role==='barker'){staffThink(s)}
 const atHome=!s.path.length&&!s.busy&&dist(m.position,s.home)<.35;animPerson(m,spd/2.3,dt,s.role==='barker'&&atHome&&W.phase!=='summary'?'wave':false)})}

/* ================= PLAYER & INTERACTION ================= */
const input={x:0,z:0,keys:{}};let yaw=0,pitch=-.12;const FP=()=>SV.view==='fp';const angD=(a,b)=>{let d=a-b;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return d};
let tapPath=[];let near=null,pBusy=null;
function aimPt(t){if(t.kind==='pass')return {x:clamp(player.position.x,-4.4,.6),z:0};const r=t.ref;if(r&&r.x!=null)return {x:r.x,z:r.z};return t}
function nearest(){const P=player.position,fp=FP(),pl2=lvl(P);let best=null,bd=9;targets.forEach(t=>{if((t.l||0)!==pl2)return;const d=Math.hypot(P.x-t.x,P.z-t.z);if(d>=t.r)return;let sc=d;if(fp){const ap=aimPt(t),ad=Math.hypot(ap.x-P.x,ap.z-P.z);const ang=Math.abs(angD(Math.atan2(ap.x-P.x,ap.z-P.z),yaw));if(ang>1.15&&ad>.5)return;sc=d+ang*1.2}if(sc<bd){const l=labelFor(t);if(l&&(l.on||!best||!best.l.on)){bd=sc;best={t,l}}}});return best}
function labelFor(t){const h=player.userData.hand,k=t.kind,s=t.ref;
switch(k){
case 'stove':return {t:'スープ仕込み',s:'スープ '+SV.inv.soup+'杯 · ガラ '+SV.inv.gara,on:SV.inv.gara>0&&SV.inv.soup<=60&&!h};
case 'boiler':{if(h)return {t:'茹で麺機',s:'手がふさがっています',on:false};const rd=W.boil.some(b=>b.on&&b.t>=6);if(rd)return {t:'麺を上げる',s:'ခေါက်ဆွဲ ကျက်ပြီ',on:true};const fr=W.boil.some(b=>!b.on);return {t:'麺を茹でる',s:'生麺 '+SV.inv.noodle+'食',on:fr&&SV.inv.noodle>0}}
case 'prep':return h&&h.kind==='noodle'?{t:'盛り付け',s:'丼 '+SV.bowls+'個',on:true}:{t:'盛り付け台',s:'茹で麺を持ってきて',on:false};
case 'sink':return h&&h.kind==='dirty'?{t:'洗う',s:h.n+'個',on:true}:{t:'洗い場',s:'きれいな丼 '+SV.bowls,on:false};
case 'fridge':return {t:'在庫を見る',s:invTotal()+' / '+fridgeCap(),on:true};
case 'pc':return {t:'発注・改装',s:'ပစ္စည်းမှာ · ဝန်ထမ်း · ဆိုင်ချဲ့',on:true};
case 'trash':return h?{t:'捨てる',s:'',on:true}:null;
case 'pass':if(h&&(h.kind==='ramen'||h.kind==='gyoza'))return {t:'パス台に置く',s:'',on:passSlots.some(p=>!p.dish)};{const n=passSlots.filter(p=>p.dish).length;return {t:'受け取る',s:'パス台 '+n+'皿',on:!h&&n>0}}
case 'beer':return h?{t:'ビール',s:'手がふさがっています',on:false}:{t:'ビールを注ぐ',s:'在庫 '+SV.inv.beer+'本',on:SV.inv.beer>0};
case 'gyoza':if(h)return {t:'餃子',s:'',on:false};if(W.gyoza.st==='ready')return {t:'餃子を取る',s:'',on:true};return {t:'餃子を焼く',s:W.gyoza.st==='cook'?'焼いています…':'在庫 '+SV.inv.gyoza+'個',on:W.gyoza.st==='idle'&&SV.inv.gyoza>=6};
case 'register':return {t:'会計',s:'待ち '+W.queue.filter(q=>!q.path.length).length+'人',on:W.queue.length>0&&W.queue[0].path.length===0&&!h};
case 'seat':{const c=s.cust;const lab=(s.l?'2F ':'')+s.label+'席';if(c&&c.st==='waitOrder'&&!h)return {t:'注文を聞く',s:lab,on:true};if(h&&h.kind!=='dirty'&&h.kind!=='noodle'&&seatNeeds(s,h))return {t:'提供する',s:lab,on:true};if(s.dirty&&(!h||h.kind==='dirty'))return {t:'片付ける',s:lab+' · '+s.dirty+'個',on:true};return null}}
return null}
function doAct(){if(!near||!near.l.on||pBusy)return;const t=near.t,k=t.kind,h=player.userData.hand;let r=true;const busy=(d,fn,lbl)=>{pBusy={t:0,dur:d,fn,lbl}};
switch(k){
case 'stove':busy(2.5,()=>res(act_stock()),'仕込み中');return;
case 'boiler':if(W.boil.some(b=>b.on&&b.t>=6)){act_boilTake(player);sfx('tap')}else{r=act_boilStart();if(r===true)sfx('tap')}break;
case 'prep':busy(1.2,()=>res(act_assemble(player)),'盛り付け中');return;
case 'sink':busy(1.5,()=>res(act_wash(player)),'洗っています');return;
case 'fridge':openFridge();return;
case 'pc':openPC();return;
case 'trash':setHand(player,null);sfx('tap');break;
case 'pass':if(h)r=act_passPlace(player);else r=act_passTake(player);break;
case 'beer':busy(1.4,()=>res(act_beer(player)),'注いでいます');return;
case 'gyoza':if(W.gyoza.st==='ready')act_gyozaTake(player);else r=act_gyozaStart();break;
case 'register':busy(.8,()=>res(act_pay()),'会計中');return;
case 'seat':{const s=t.ref;if(s.cust&&s.cust.st==='waitOrder'&&!h){busy(1,()=>res(act_takeOrder(s)),'注文を聞いています');return}if(h&&seatNeeds(s,h)){r=act_serve(player,s);break}if(s.dirty){r=act_bus(player,s);sfx('tap');break}}}
res(r)}
function res(r){if(r!==true&&r){toast(r);sfx('bad')}updHand()}
function updPlayer(dt){if(pBusy){pBusy.t+=dt;if(pBusy.t>=pBusy.dur){const f=pBusy.fn;pBusy=null;f()}animPerson(player,0,dt,false);return}
const fp=FP(),K=input.keys;if(fp)yaw+=((K.arrowleft?1:0)-(K.arrowright?1:0))*dt*2.4;
let ix=input.x+((K.d||(!fp&&K.arrowright))?1:0)-((K.a||(!fp&&K.arrowleft))?1:0),iz=input.z+((K.s||K.arrowdown)?1:0)-((K.w||K.arrowup)?1:0);
const P=player.position;let mv=Math.hypot(ix,iz);
if(mv>.08){tapPath=[];if(mv>1){ix/=mv;iz/=mv;mv=1}if(fp){const fx=Math.sin(yaw),fz=Math.cos(yaw),wx=fx*(-iz)-fz*ix,wz=fz*(-iz)+fx*ix;ix=wx;iz=wz}}
else if(!fp&&tapPath.length){const t=tapPath[0];const dx=t.x-P.x,dz=t.z-P.z,d=Math.hypot(dx,dz);if(d<.08){tapPath.shift()}else{ix=dx/d;iz=dz/d;mv=1}}
if(mv>.08){const sp2=3.2*mv*dt;const nx=P.x+ix*sp2,nz=P.z+iz*sp2;if(walkable(nx,nz,P.y)){P.x=nx;P.z=nz}else if(walkable(nx,P.z,P.y))P.x=nx;else if(walkable(P.x,nz,P.y))P.z=nz;else if(!tapPath.length||Math.random()<.02)tapPath=[];
 P.y=groundY(P.x,P.z,P.y);const pl2=lvl(P);
 colliders.forEach(c=>{if((c.l||0)!==pl2)return;const dx=P.x-c.x,dz=P.z-c.z,d=Math.hypot(dx,dz),m=c.r+.22;if(d<m&&d>.001){const qx=c.x+dx/d*m,qz=c.z+dz/d*m;if(walkable(qx,qz,P.y)){P.x=qx;P.z=qz}}});
 if(!fp){const a=Math.atan2(ix,iz);let da=a-player.rotation.y;while(da>Math.PI)da-=Math.PI*2;while(da<-Math.PI)da+=Math.PI*2;player.rotation.y+=da*Math.min(1,dt*14)}}
if(fp)player.rotation.y=yaw;
animPerson(player,mv,dt,false)}

/* ================= UI ================= */
const tmpV=new THREE.Vector3();
function proj(x,y,z){tmpV.set(x,y,z).project(camera);return [(tmpV.x*.5+.5)*innerWidth,(-tmpV.y*.5+.5)*innerHeight,tmpV.z<1&&tmpV.z>-1]}
function toast(t){const e=$('toast');e.innerHTML=t;e.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('on'),2000)}
function floatAt(p,txt,bad){if(lvl(p)!==pLevel&&!FP())return;const [x,y,v]=proj(p.x,p.y+2.1,p.z);if(!v)return;const d=document.createElement('div');d.className='lb'+(bad?' w':'');d.style.cssText='left:'+x+'px;top:'+y+'px;font-size:15px;transition:all 1.4s ease-out';d.textContent=txt;$('labels').appendChild(d);requestAnimationFrame(()=>{d.style.top=(y-50)+'px';d.style.opacity='0'});setTimeout(()=>d.remove(),1500)}
const HN={noodle:'茹で麺',ramen:'',beer:'ビール',gyoza:'餃子',dirty:'汚れた丼'};
function updHand(){const h=player.userData.hand,e=$('hand');if(!h){e.hidden=true;return}e.hidden=false;e.textContent='手: '+(h.kind==='ramen'?RAMEN[h.type].n:HN[h.kind])+(h.kind==='dirty'?' ×'+h.n:'')+(h.kind==='noodle'&&h.q==='over'?'（伸びた）':'')}
function renderTickets(){$('tickets').innerHTML=W.tickets.map(t=>'<div class="tk'+(t.seatRef.l?' up':'')+'"><b>'+t.seat+'<em>#'+t.id+'</em></b>'+t.items.map(i=>'<i class="'+(i.served?'d':'')+'">'+(i.kind==='ramen'?RAMEN[i.type].s+(i.made&&!i.served?' ✓':''):i.kind==='beer'?'ビール':'餃子')+'</i>').join('')+'<u><s data-tk="'+t.id+'"></s></u></div>').join('')}
const lbPool={};function lbl(id,x,y,z,txt,warn,lev){let e=lbPool[id];if(!e){e=document.createElement('div');e.className='lb';$('labels').appendChild(e);lbPool[id]=e}const [sx,sy,v]=proj(x,y,z);if(!v||!txt||(lev||0)!==pLevel){e.style.display='none';return}e.style.display='block';e.style.left=sx+'px';e.style.top=sy+'px';if(e._t!==txt){e.textContent=txt;e._t=txt}e.classList.toggle('w',!!warn)}
const bubPool=[];function drawUI(){let bi=0;
const bub=(p,txt,pr,col)=>{let e=bubPool[bi];if(!e){e=document.createElement('div');e.className='bub';e.innerHTML='<span></span>';$('labels').appendChild(e);bubPool.push(e)}bi++;const [sx,sy,v]=proj(p.x,p.y+1.85,p.z);if(!v){e.style.display='none';return}e.style.display='grid';e.style.left=sx+'px';e.style.top=sy+'px';e.style.background='conic-gradient('+col+' '+(pr*100)+'%,#ffffff33 0)';const s=e.firstChild;if(s._t!==txt){s.textContent=txt;s._t=txt}};
let other={o:0,f:0,d:0};
W.cust.forEach(c=>{const need=c.st==='waitOrder'||c.st==='waitFood'||(c.st==='toPay'&&!c.path.length);if(!need)return;const cl=lvl(c.mesh.position);if(cl!==pLevel){if(c.st==='waitOrder')other.o++;else if(c.st==='waitFood')other.f++;return}const p=c.pat/c.patMax;bub(c.mesh.position,c.st==='waitOrder'?'注文':c.st==='waitFood'?(c.ticket?'#'+c.ticket.id:'…'):'会計',p,p>.5?'#5fd18b':p>.25?'#f2a541':'#ff6b5b')});
seats.forEach(s=>{if(s.dirty&&s.l!==pLevel)other.d++});
for(;bi<bubPool.length;bi++)bubPool[bi].style.display='none';
const fc=$('floorChip');if(has2F()&&(other.o||other.f||other.d)){fc.hidden=false;fc.textContent=(pLevel?'1階':'2階')+(other.o?' 注文'+other.o:'')+(other.f?' 待ち'+other.f:'')+(other.d?' 片付け'+other.d:'');fc.classList.toggle('w',other.o+other.f>0)}else fc.hidden=true;
const bs=W.boil.map(b=>!b.on?'○':b.t<6?'◔':b.t<=13?'●':'✕').join('');lbl('boil',stations.boiler.x,1.75,stations.boiler.z,bs,W.boil.some(b=>b.on&&b.t>13));
lbl('soup',stations.stove.x,1.6,stations.stove.z,'スープ '+SV.inv.soup,SV.inv.soup<5);
const dirty=seats.reduce((a,s)=>a+(s.dirty||0),0);lbl('bowls',stations.sink.x,1.5,stations.sink.z,'丼 '+SV.bowls+(dirty?' · 汚れ '+dirty:''),SV.bowls<2);
if(stations.gyoza)lbl('gy',stations.gyoza.x,1.4,stations.gyoza.z,W.gyoza.st==='cook'?'焼き中 '+Math.ceil(10-W.gyoza.t):W.gyoza.st==='ready'?'焼けた！':'',W.gyoza.st==='ready');
const q=W.queue.filter(c=>!c.path.length).length;lbl('reg',stations.register.x,1.75,stations.register.z,q?'会計待ち '+q:'',q>0);
document.querySelectorAll('[data-tk]').forEach(e=>{const t=W.tickets.find(x=>x.id==e.dataset.tk);if(t&&t.seatRef.cust){const c=t.seatRef.cust;e.style.width=(c.pat/c.patMax*100)+'%'}});
const b=$('act');if(pBusy){b.disabled=true;$('actT').textContent=pBusy.lbl;$('actS').textContent='';b.style.setProperty('--p',(pBusy.t/pBusy.dur*100)+'%')}else{b.style.setProperty('--p','0%');if(near){b.disabled=!near.l.on;$('actT').textContent=near.l.t;$('actS').textContent=near.l.s}else{b.disabled=true;$('actT').textContent='—';$('actS').textContent=FP()?(isMobile?'ညာဘက်ကို ဆွဲပြီး လှည့်ကြည့်':'ドラッグで見回す · E で操作'):(isMobile?'ဘယ်ဘက် joystick နဲ့ လျှောက်':'WASD で移動 · E で操作')}}
$('money').textContent=yen(SV.money);$('day').textContent=SV.day+'日目';const st=Math.round(SV.rating);$('stars').textContent='★'.repeat(st)+'☆'.repeat(5-st);
if(W.phase==='prep'){$('clock').textContent='準備中';$('openBtn').hidden=false}else{const mm=Math.floor(Math.min(W.t,DAYLEN)/DAYLEN*600);$('clock').textContent=(11+Math.floor(mm/60))+':'+String(mm%60).padStart(2,'0')+(W.phase==='closing'?' 閉店':'');$('openBtn').hidden=true}}

/* ================= PANELS ================= */
function modal(html){const m=$('modal');m.hidden=false;m.innerHTML='<div class="card">'+html+'</div>';return m}
function closeModal(){$('modal').hidden=true}
let pcTab='order';
function openPC(){const tabs='<div class="tabs"><button data-tab="order" aria-pressed="'+(pcTab==='order')+'">発注</button><button data-tab="shop" aria-pressed="'+(pcTab==='shop')+'">改装</button><button data-tab="staff" aria-pressed="'+(pcTab==='staff')+'">スタッフ</button></div>';let body='';
if(pcTab==='order'){body='<p class="my">ပစ္စည်းတွေ ချက်ချင်း ရေခဲသေတ္တာထဲ ရောက်ပါတယ်။ ရေခဲသေတ္တာ: <b>'+invTotal()+' / '+fridgeCap()+'</b>'+(W.staff.some(s=>s.role==='manager')?' · 店長 က နည်းလာရင် အလိုအလျောက် မှာပေးနေပါတယ်။':'')+'</p><div class="list">'+Object.keys(ITEMS).map(k=>{const it=ITEMS[k];const lock=it.need&&!SV.up[it.need];const have=k==='bowl'?SV.bowls:SV.inv[k];return '<button class="it" data-buy="'+k+'"'+(lock||SV.money<it.cost?' disabled':'')+'><b>'+it.n+' ×'+it.pack+it.unit+'</b><small class="my">'+it.my+' · 在庫 '+have+(lock?' · 設備が必要':'')+'</small><em>¥'+yen(it.cost)+'</em></button>'}).join('')+'</div>'}
else if(pcTab==='shop'){const pre=W.phase==='prep';body='<p class="my">ဆိုင်ကို ချဲ့ပြီး စက်ပစ္စည်းအသစ် ထည့်ပါ။'+(pre?'':' <b style="color:var(--bad)">ဆိုင်ပိတ်ထားချိန် (準備中) မှာပဲ ပြင်လို့ရပါတယ်။</b>')+'</p><div class="list">'+Object.keys(UPG).map(k=>{const u=UPG[k],lv=SV.up[k],max=u.max();const done=lv>=max;const cost=done?0:u.cost[Math.min(lv,u.cost.length-1)];const req=u.req?u.req():'';return '<button class="it" data-up="'+k+'"'+(done||SV.money<cost||!pre||req?' disabled':'')+'><b>'+u.n+(max>1?' ('+lv+'/'+max+')':'')+'</b><small class="my">'+u.my+(req?' · <b>'+req+'</b>':'')+(k==='table'&&!SV.up.expand&&lv>=3?' · ဆိုင်ချဲ့မှ ထပ်ထည့်လို့ရ':'')+'</small><em>'+(done?'済':'¥'+yen(cost))+'</em></button>'}).join('')+'</div>'}
else{const total=Object.keys(STAFF).reduce((a,k)=>a+STAFF[k].wage*SV.staff[k],0);body='<p class="my">ဝန်ထမ်းငှားရင် ကိုယ့်ဘာသာ အလုပ်လုပ်ပေးပါတယ်။ လစာကို နေ့တိုင်း ဆိုင်ပိတ်ချိန်မှာ ပေးရပါတယ်။ ယခု လစာစုစုပေါင်း <b style="color:var(--gold)">¥'+yen(total)+'/日</b></p><div class="list">'+Object.keys(STAFF).map(k=>{const d=STAFF[k],n=SV.staff[k],max=d.max();const names=[];for(let i=0;i<n;i++)names.push(staffName(k,i));return '<button class="it" data-hire="'+k+'"'+(n>=max||SV.money<d.hire?' disabled':'')+'><b>'+d.n+' ('+n+'/'+max+')'+(names.length?' <span style="color:var(--mute);font-weight:500">'+names.join('・')+'</span>':'')+'</b><small class="my">'+d.my+' · 日給 ¥'+yen(d.wage)+'</small><em>'+(n>=max?'満員':'¥'+yen(d.hire))+'</em></button>'+(n?'<button class="ghost sm" data-fire="'+k+'">'+staffName(k,n-1)+'さん（'+d.n+'）を解雇</button>':'')}).join('')+'</div>'}
const m=modal('<h2>発注PC</h2><p style="margin:-4px 0 8px">所持金 <b style="color:var(--gold)">¥'+yen(SV.money)+'</b></p>'+tabs+body+'<button class="ghost" id="cls">閉じる</button>');
m.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{pcTab=b.dataset.tab;openPC()});
m.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const k=b.dataset.buy,it=ITEMS[k];if(SV.money<it.cost)return;if(k!=='bowl'&&invTotal()+(k==='gara'?10:it.pack)>fridgeCap()){toast('冷蔵庫がいっぱいです · ရေခဲသေတ္တာ ပြည့်နေပြီ');sfx('bad');return}SV.money-=it.cost;W.stats.cost+=it.cost;if(k==='bowl'){SV.bowls+=it.pack;updateBowlStack()}else SV.inv[k]+=it.pack;sfx('cash');save();openPC()});
m.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const k=b.dataset.up,lv=SV.up[k],c=UPG[k].cost[Math.min(lv,UPG[k].cost.length-1)];if(SV.money<c||W.phase!=='prep')return;SV.money-=c;SV.up[k]++;sfx('cash');save();rebuild();openPC();toast(UPG[k].n+' 完了！')});
m.querySelectorAll('[data-hire]').forEach(b=>b.onclick=()=>{const k=b.dataset.hire;if(SV.money<STAFF[k].hire)return;SV.money-=STAFF[k].hire;SV.staff[k]++;save();spawnStaff();sfx('cash');openPC();toast(staffName(k,SV.staff[k]-1)+'さん（'+STAFF[k].n+'）を雇いました')});
m.querySelectorAll('[data-fire]').forEach(b=>b.onclick=()=>{const k=b.dataset.fire;SV.staff[k]=Math.max(0,SV.staff[k]-1);save();spawnStaff();openPC()});
$('cls').onclick=closeModal}
function openFridge(){const rows=['noodle','gara','chashu','egg','negi','nori','beer','gyoza'].map(k=>'<div class="it"><b>'+ITEMS[k].n+'</b><small class="my">'+ITEMS[k].my+'</small><em>'+SV.inv[k]+ITEMS[k].unit+'</em></div>').join('');const m=modal('<h2>冷蔵庫</h2><p class="my">သိုလှောင်ထားတာ: '+invTotal()+' / '+fridgeCap()+'<span class="bar"><i style="width:'+(invTotal()/fridgeCap()*100)+'%"></i></span></p><div class="list"><div class="it"><b>スープ（仕込み済み）</b><small class="my">ချက်ပြီးသား ဟင်းရည်</small><em>'+SV.inv.soup+'杯</em></div><div class="it"><b>きれいな丼</b><small class="my">သန့်ပြီးသား ပန်းကန်</small><em>'+SV.bowls+'個</em></div>'+rows+'</div><p class="my" style="margin-top:10px">ပစ္စည်း မှာချင်ရင် ညာဘက်ထောင့်က 発注PC ကို သွားပါ။</p><button class="ghost" id="cls">閉じる</button>');$('cls').onclick=closeModal}
function howTo(){return '<ul class="steps my"><li><b>1</b><span><strong>開店する</strong> နှိပ်ရင် ဧည့်သည် ဝင်လာပါမယ်။ ထိုင်ပြီး <strong>注文</strong> ပေါ်ရင် သွားပြီး <strong>注文を聞く</strong>။</span></li><li><b>2</b><span>စားဖိုချောင် (နောက်ဘက်) က <strong>茹で麺機</strong> မှာ ခေါက်ဆွဲပြုတ်ပါ။ ● ဖြစ်ရင် <strong>麺を上げる</strong> (✕ ဆိုရင် ပွသွားပြီ)။</span></li><li><b>3</b><span><strong>盛り付け台</strong> မှာ ပန်းကန်ပြင်ပြီး ဧည့်သည်ဆီ ယူသွား <strong>提供する</strong>။ ဘီယာ၊ ဂျိုဇာ မှာရင်လည်း ယူပေးပါ။</span></li><li><b>4</b><span>စားပြီးရင် <strong>レジ</strong> မှာ ငွေရှင်း၊ ပန်းကန်ကို <strong>片付ける</strong> ပြီး <strong>洗い場</strong> မှာ ဆေး။</span></li><li><b>5</b><span>ဟင်းရည် ကုန်ရင် <strong>スープ仕込み</strong>။ ပစ္စည်းမှာ၊ ဝန်ထမ်း 7 မျိုးငှား၊ ဆိုင်ချဲ့၊ <strong>၂ ထပ် 座敷</strong> ဆောက်တာကို <strong>発注PC</strong> မှာ လုပ်ပါ။</span></li><li><b>👁</b><span>အပေါ်က <strong>1人称</strong> ခလုတ် (ကီးဘုတ် V) နဲ့ ကိုယ့်မျက်လုံးနဲ့ မြင်တဲ့ view ကို ပြောင်းလို့ရ။ မျက်နှာပြင်ကို ဆွဲရင် လှည့်ကြည့်၊ တစ်ချက်နှိပ်ရင် လုပ်ဆောင်။</span></li></ul>'}
function openMenu(){const m=modal('<h2>メニュー</h2><h3>ကစားပုံ</h3>'+howTo()+'<h3>設定</h3><button class="ghost" id="snd">音: '+(SV.sound?'ON':'OFF')+'</button><button class="ghost" id="rs">အစကနေ ပြန်စမယ်</button><button class="big" id="cls">ゲームに戻る</button>');$('cls').onclick=closeModal;$('snd').onclick=()=>{SV.sound=!SV.sound;save();openMenu()};let arm=false;$('rs').onclick=()=>{if(!arm){arm=true;$('rs').textContent='သေချာလား? ထပ်နှိပ်ရင် အကုန်ပျက်မယ်';return}SV=fresh();save();location.reload()}}
function showStart(){modal('<h1>麺屋<em>ひなた</em></h1><p class="my">ကိုယ်ပိုင် ရာမင်ဆိုင်လေးကို စီမံပါ။ ချက်ပြုတ်၊ ကျွေး၊ ငွေရှင်း၊ ပစ္စည်းမှာ၊ ဝန်ထမ်းငှား၊ ဆိုင်ချဲ့ပြီး ၂ ထပ်ဆိုင်ကြီး ဖြစ်အောင် လုပ်ပါ။</p>'+howTo()+'<button class="big" id="go">'+(SV.seen?SV.day+'日目 から続ける':'はじめる')+'</button><p class="my" style="margin:10px 0 0;font-size:12px">ကွန်ပျူတာ: WASD/မြှား = လျှောက်၊ E/Space = လုပ်ဆောင်၊ V = view ပြောင်း။ ဖုန်း: ဘယ်ဘက် joystick (သို့) ကြမ်းပြင်ကို နှိပ်ရင် လျှောက်သွားပါမယ်။</p>');$('go').onclick=()=>{SV.seen=true;save();closeModal();try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();AC.resume()}catch(e){}sfx('door');toast('準備中 · ပြင်ဆင်ပြီးရင် <b>開店する</b> နှိပ်ပါ')}}
function openShop(){if(W.phase!=='prep')return;W.t=0;W.spawnT=3;W.phase='open';sfx('door');speak('開店です');toast('開店！ ဧည့်သည်တွေ လာပါတော့မယ်')}
function endDay(){W.phase='summary';const wages=Object.keys(STAFF).reduce((a,k)=>a+STAFF[k].wage*SV.staff[k],0);SV.money-=wages+RENT;const s=W.stats,profit=s.sales+s.tips-wages-RENT-s.cost;if(s.sales>SV.best)SV.best=s.sales;save();
modal('<h2>'+SV.day+'日目 終了</h2><div class="stat"><div><span>売上</span><b>¥'+yen(s.sales)+'</b></div><div><span>チップ</span><b>¥'+yen(s.tips)+'</b></div><div><span>人件費＋家賃</span><b class="neg">−¥'+yen(wages+RENT)+'</b></div><div><span>仕入れ</span><b class="neg">−¥'+yen(s.cost)+'</b></div><div><span>本日の利益</span><b class="'+(profit<0?'neg':'')+'">¥'+yen(profit)+'</b></div><div><span>来店／帰った客</span><b>'+s.served+' / '+s.left+'</b></div></div><p class="my">所持金 ¥'+yen(SV.money)+' · 評判 '+SV.rating.toFixed(1)+' ★'+(s.dash?' · 食い逃げ '+s.dash+'人':'')+'</p>'+(SV.money<0?'<p class="my" style="color:var(--bad)">ငွေ အနုတ်ဖြစ်နေပါပြီ။ ပစ္စည်းကို ချွေတာပြီး ဝန်ထမ်း လျှော့ကြည့်ပါ။</p>':'')+'<button class="big" id="nx">'+(SV.day+1)+'日目へ</button>');
$('nx').onclick=()=>{SV.day++;save();closeModal();W.phase='prep';resetDay();spawnStaff();player.position.set(-.8,0,-2.8);toast('準備中 · 発注PC で仕入れ、スープを仕込んでから 開店')}}
function rebuild(){buildAll();const n=[2,4,6][SV.up.boiler];while(W.boil.length<n)W.boil.push({on:false,t:0});spawnStaff()}

/* ================= FIRST PERSON ================= */
let vmKey='';
function updVM(T){if(!G3.vm){G3.vm=new THREE.Group();camera.add(G3.vm)}G3.vm.visible=true;const h=player.userData.hand,k=h?(h.kind+(h.type||'')+(h.n||'')):'';if(k!==vmKey){vmKey=k;while(G3.vm.children.length)G3.vm.remove(G3.vm.children[0]);if(h){const d=dish(h.kind,h.type);if(h.kind==='dirty'&&h.n>1){for(let i=1;i<Math.min(h.n,4);i++){const b=new THREE.Mesh(gBowl,M.bowlOut);b.position.y=i*.05;d.add(b)}}d.traverse(o=>{o.castShadow=false;o.receiveShadow=false});d.rotation.x=.35;G3.vm.add(d)}}const mv=Math.hypot(input.x,input.z)>.1||['w','a','s','d'].some(q=>input.keys[q]);G3.vm.position.set(.17,-.3+(mv?Math.sin(T*9)*.012:0),-.5)}
function setView(v){SV.view=v;save();if(v==='fp'){yaw=player.rotation.y;pitch=-.12;tapPath=[];if(marker)marker.visible=false}$('viewBtn').textContent=v==='fp'?'🗺 3人称':'👁 1人称';resize();toast(v==='fp'?'1人称 · '+(isMobile?'ညာဘက်ကို ဆွဲပြီး လှည့်ကြည့်ပါ':'ドラッグで見回す · クリックで操作'):'3人称 · အပေါ်စီး view')}

/* ================= INPUT ================= */
addEventListener('keydown',e=>{const k=e.key.toLowerCase();input.keys[k]=true;if(!$('modal').hidden)return;if(k==='e'||k===' '){e.preventDefault();doAct()}if(k==='v')setView(FP()?'top':'fp')});
addEventListener('keyup',e=>{input.keys[e.key.toLowerCase()]=false});
addEventListener('blur',()=>{input.keys={}});
$('act').addEventListener('click',doAct);$('openBtn').onclick=openShop;$('menuBtn').onclick=openMenu;$('viewBtn').onclick=()=>setView(FP()?'top':'fp');
{const j=$('joy'),k=j.firstElementChild;let id=null;const R2=50;const set=(e)=>{const r=j.getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const d=Math.hypot(dx,dy);if(d>R2){dx=dx/d*R2;dy=dy/d*R2}k.style.transform='translate('+dx+'px,'+dy+'px)';input.x=dx/R2;input.z=dy/R2};
j.addEventListener('pointerdown',e=>{id=e.pointerId;j.setPointerCapture(id);set(e)});j.addEventListener('pointermove',e=>{if(e.pointerId===id)set(e)});const end=e=>{if(e.pointerId!==id)return;id=null;k.style.transform='';input.x=0;input.z=0};j.addEventListener('pointerup',end);j.addEventListener('pointercancel',end)}
let marker=null,markerT=0;
{const ray=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3();let down=null;
canvas.addEventListener('pointerdown',e=>{if(down)return;down={id:e.pointerId,x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY,t:performance.now()};try{canvas.setPointerCapture(e.pointerId)}catch(_){}});
canvas.addEventListener('pointermove',e=>{if(!down||e.pointerId!==down.id||!FP())return;const k=e.pointerType==='touch'?.007:.005;yaw-=(e.clientX-down.lx)*k;pitch=clamp(pitch-(e.clientY-down.ly)*k,-1.1,.9);down.lx=e.clientX;down.ly=e.clientY});
canvas.addEventListener('pointercancel',e=>{if(down&&e.pointerId===down.id)down=null});
canvas.addEventListener('pointerup',e=>{if(!down||e.pointerId!==down.id)return;const moved=Math.hypot(e.clientX-down.x,e.clientY-down.y);if(moved>12||performance.now()-down.t>500){down=null;return}down=null;if(FP()){doAct();return}
 const r=canvas.getBoundingClientRect();plane.constant=-pLevel*3;ray.setFromCamera({x:(e.clientX-r.left)/r.width*2-1,y:-(e.clientY-r.top)/r.height*2+1},camera);if(!ray.ray.intersectPlane(plane,hit))return;let tx,tz;
 if(pLevel===1){tx=clamp(hit.x,-8.4,6.2);tz=clamp(hit.z,-4.7,4.7);if(!inZ(tx,tz,Z1)&&!inStair(tx,tz))tx=Math.max(tx,-6.9)}
 else{tx=clamp(hit.x,minX()+.1,6.2);tz=clamp(hit.z,-4.4,4.7);if(has2F()&&inStair(tx,tz)){if(tz<-1.2){tapPath=route(player.position,{x:SL.x,z:SL.z,l:1});if(!marker){marker=new THREE.Mesh(new THREE.RingGeometry(.15,.24,24),M.marker);marker.rotation.x=-Math.PI/2;scene.add(marker)}marker.position.set(ST.x,3.02,ST.z);marker.visible=true;markerT=.8;return}tx=SB.x;tz=SB.z}else if(tz<-3.85&&!inZ(tx,tz,Z0()))tz=-3.85;else if(!inZ(tx,tz,Z0()))tz=tz<0?Math.min(tz,-.45):Math.max(tz,.5)}
 tapPath=route(player.position,{x:tx,z:tz,l:pLevel});if(!marker){marker=new THREE.Mesh(new THREE.RingGeometry(.15,.24,24),M.marker);marker.rotation.x=-Math.PI/2;scene.add(marker)}marker.position.set(tx,pLevel*3+.02,tz);marker.visible=true;markerT=.8})}

/* ================= LOOP ================= */
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;const fp=SV.view==='fp';camera.fov=fp?(w<h?82:68):(w<h?54:44);camera.near=fp?.04:.1;camera.updateProjectionMatrix()}
addEventListener('resize',resize);
let last=performance.now(),T=0;const camPos=new THREE.Vector3();let camLY=0;
function tick(now){requestAnimationFrame(tick);const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
const modalOpen=!$('modal').hidden;
if(!modalOpen||W.phase==='open'||W.phase==='closing')updPlayer(modalOpen?0:dt);
pLevel=lvl(player.position);
if(W.phase==='open'||W.phase==='closing'){W.t+=dt;if(W.phase==='open'){W.spawnT-=dt;if(W.spawnT<=0){spawnCustomer();const base=18-SV.rating*1.5-SV.up.decor-W.staff.length*.6-(has2F()?1.5:0)-seats.length*.05;W.spawnT=Math.max(4.2,base)*(W.staff.some(s=>s.role==='barker')?.8:1)*rnd(.75,1.25)}if(W.t>=DAYLEN){W.phase='closing';toast('閉店時間 · နောက်ဆုံး ဧည့်သည်တွေ ပြန်တဲ့အထိ ဆက်လုပ်ပါ')}}else if(!W.cust.length){endDay()}}
if(W.phase!=='summary'&&W.staff.some(s=>s.role==='manager')){W.mgrT-=dt;if(W.mgrT<=0){W.mgrT=12;autoOrder()}}
W.boil.forEach((b,i)=>{if(b.on){b.t+=dt;if(b.t>20){b.on=false;b.t=0;if(W.phase!=='summary')toast('麺が伸びすぎて捨てました')}}const bk=G3.baskets&&G3.baskets[i];if(bk){bk.position.y+=((b.on?.98+Math.sin(T*6+i)*.01:1.12)-bk.position.y)*Math.min(1,dt*8);bk.userData.nd.visible=b.on}if(b.on&&Math.random()<dt*4)emit(stations.boiler.x,1.1,stations.boiler.z,.3,.35)});
if(W.gyoza.st==='cook'){W.gyoza.t+=dt;if(Math.random()<dt*5)emit(stations.gyoza.x,1.0,stations.gyoza.z,.25,.25);if(W.gyoza.t>=10)W.gyoza.st='ready'}
if(G3.gyoza){const vis=W.gyoza.st!=='idle';if(vis&&!G3.gyoza.children.length){const d=dish('gyoza');d.scale.setScalar(1.6);G3.gyoza.add(d)}if(!vis&&G3.gyoza.children.length)G3.gyoza.remove(G3.gyoza.children[0])}
if(Math.random()<dt*3)emit(stations.stove.x,1.2,stations.stove.z,.2,.45);
if(G3.potSurf)G3.potSurf.position.y=.6+clamp(SV.inv.soup/60,0,1)*.48;if(G3.flame)G3.flame.scale.setScalar(1+Math.sin(T*30)*.03);
updCustomers(dt);updStaff(dt);updSteam(dt);
G3.lanterns&&G3.lanterns.forEach((l,i)=>l.rotation.z=Math.sin(T*.9+i*2)*.05);
if(marker&&marker.visible){markerT-=dt;marker.scale.setScalar(1+(.8-markerT));if(markerT<=0)marker.visible=false}
near=nearest();
// visibility by floor
const fp=FP();G.up.visible=pLevel===1;G.face.visible=fp||pLevel===1;G.fp.visible=fp;
const visP=m=>{const p=m.position;m.visible=lvl(p)===pLevel||(has2F()&&inStair(p.x,p.z))};W.cust.forEach(c=>visP(c.mesh));W.staff.forEach(s=>visP(s.mesh));
// camera
const P=player.position;
if(fp){player.visible=false;const ub=player.userData.body.position.y,hx=P.x+Math.sin(yaw)*.06,hz=P.z+Math.cos(yaw)*.06,hy=P.y+1.56+ub*.6;camera.position.set(hx,hy,hz);camera.lookAt(hx+Math.sin(yaw)*Math.cos(pitch),hy+Math.sin(pitch),hz+Math.cos(yaw)*Math.cos(pitch));updVM(T)}
else{player.visible=true;if(G3.vm)G3.vm.visible=false;camLY+=(P.y-camLY)*Math.min(1,dt*5);const portrait=innerWidth<innerHeight;const cx=portrait?P.x:clamp(P.x,minX()+3,3.6);const tz=Math.max(P.z,portrait?-1.1:-1.6);camPos.set(cx,(portrait?15:10.5)+camLY,tz+(portrait?6.2:7.6));camera.position.lerp(camPos,Math.min(1,dt*4));camera.lookAt(cx,.4+camLY,tz-(portrait?.2:.8))}
$('cross').hidden=!fp||modalOpen;
renderer.render(scene,camera);drawUI()}

/* ================= BOOT ================= */
function boot(){mats();M.suit=[0x23262e,0x2e3440,0x3a3a46,0x2a2f3a].map(c=>std({color:c,roughness:.7}));const env=makeEnv(renderer);if(env)scene.environment=env;lights();buildAll();resetDay();
player=person({top:std({color:0x26324a,roughness:.8}),towel:M.towel,apron:std({color:0x1c2b4a,roughness:.85}),pants:M.pants[0],hairStyle:'short'});player.position.set(-.8,0,-2.8);scene.add(player);scene.add(camera);
$('viewBtn').textContent=FP()?'🗺 3人称':'👁 1人称';yaw=player.rotation.y;spawnStaff();resize();$('loading').remove();requestAnimationFrame(tick);showStart()}
let booted=false;const once=()=>{if(booted)return;booted=true;try{boot()}catch(e){console.error(e);$('loading').textContent='Error: '+e.message}};
const fr=document.fonts&&document.fonts.ready?Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2500))]):Promise.resolve();
fr.then(()=>{try{Promise.race([document.fonts.load('40px "Dela Gothic One"'),new Promise(r=>setTimeout(r,1500))]).then(once,once)}catch(e){once()}});
