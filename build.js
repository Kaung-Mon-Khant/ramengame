'use strict';
/* ============ SHOP BUILDER ============ */
const G={};const G3={};
let seats=[],stations={},colliders=[],targets=[],passSlots=[];
function floorRect(p,xa,xb,za,zb,y,m){const o=new THREE.Mesh(new THREE.PlaneGeometry(xb-xa,zb-za),m);o.rotation.x=-Math.PI/2;o.position.set((xa+xb)/2,y,(za+zb)/2);o.receiveShadow=true;p.add(o);return o}
function ceilRect(p,xa,xb,za,zb,y,m){const o=new THREE.Mesh(new THREE.PlaneGeometry(xb-xa,zb-za),m);o.rotation.x=Math.PI/2;o.position.set((xa+xb)/2,y,(za+zb)/2);p.add(o);return o}
function station(id,x,z,label,r,sx,sz){stations[id]={id,x,z,sx:sx!=null?sx:x,sz:sz!=null?sz:z+.95,label,r:r||1.05};colliders.push({x,z,r:.62,l:0})}
function plight(c,i,d,x,y,z){const l=new THREE.PointLight(c,i,d,2);l.position.set(x,y,z);G.lights.add(l);return l}

function buildAll(){['room','furn','up','face','fp','lights'].forEach(k=>{if(G[k])scene.remove(G[k]);G[k]=new THREE.Group();scene.add(G[k])});G.dyn2=new THREE.Group();G.up.add(G.dyn2);
stations={};colliders=[];seats=[];passSlots=[];G3.lanterns=[];
buildRoom();buildExterior();buildKitchen();buildDining();if(SV.up.expand)buildStorage();if(has2F())build2F();
targets=[];Object.values(stations).forEach(s=>targets.push({kind:s.id,x:s.sx,z:s.sz,r:s.r,ref:s,l:0}));targets.push({kind:'pass',x:-1.9,z:.75,r:2.7,ref:stations.pass,l:0});seats.forEach(s=>targets.push({kind:'seat',x:s.x,z:s.z,r:1.0,ref:s,l:s.l}));
updateBowlStack()}

/* ---------- ROOM SHELL ---------- */
function buildRoom(){const R=G.room,F=G.face,ex=SV.up.expand,x0=ex?-9:-5,x1=6.5,H=3;
floorRect(R,x0,x1,0,5,0,M.floorWood);floorRect(R,-5,x1,-5,0,0,M.floorTile);
// walls
bx(R,11.7,H,.2,M.wallTile,.75,H/2,-5.1,false);bx(R,.2,H,5.2,M.wallTile,-5.1,H/2,-2.5,false);
bx(R,.2,H,5,M.wallTile,6.6,H/2,-2.5,false);bx(R,.2,H,5.1,M.wall,6.6,H/2,2.55,false);bx(R,.02,.95,5,M.wains,6.49,.475,2.5,false);
bx(R,.2,H,5.2,M.wall,x0-.1,H/2,2.5,false);bx(R,.02,.95,5,M.wains,x0+.01,.475,2.5,false);
bx(R,.02,.06,5,M.woodDark,6.48,.97,2.5,false);bx(R,.02,.06,5,M.woodDark,x0+.02,.97,2.5,false);
if(ex){bx(R,4.2,H,.2,M.wall,-7,H/2,-5.1,false);bx(R,.2,H,5.2,M.wall,-9.1,H/2,-2.5,false);
 if(has2F()){bx(R,.45,H,.2,M.wall,-8.78,H/2,-.1,false);bx(R,2.2,H,.2,M.wall,-6.15,H/2,-.1,false);bx(R,.2,H,4.9,M.wall,-7.15,H/2,-2.6,false);bx(R,1.3,.35,.2,M.wall,-7.9,H-.175,-.1,false)}
 else bx(R,4,H,.2,M.wall,-7,H/2,-.1,false);
 bx(R,4,.95,.02,M.wains,-7,.475,0.01,false)}
// ceilings (1F)
ceilRect(R,-5,x1,-5,0,2.95,M.ceil);ceilRect(R,x0,x1,0,5.05,2.95,M.ceil);if(ex)ceilRect(R,has2F()?-7.05:-9,-5,-5,-.1,2.95,M.ceil);
[-3.4,-1.2,1,3.2,5.2].forEach(x=>{const pn=new THREE.Mesh(gBox,M.panel);pn.scale.set(1.3,.03,.18);pn.position.set(x,2.93,-2.7);G.fp.add(pn);const pn2=pn.clone();pn2.position.z=-1.2;G.fp.add(pn2)});
// front facade (1F)
const fx0=x0,fx1=DOOR.x-.6;
rb(R,fx1-fx0,.9,.22,.02,M.woodDark,(fx0+fx1)/2,.45,5.06);bx(R,fx1-fx0+.04,.05,.3,M.woodLight,(fx0+fx1)/2,.92,5.06);
rb(R,.4,.9,.22,.02,M.woodDark,6.4,.45,5.06);
pl(R,fx1-fx0,1.7,M.glass,(fx0+fx1)/2,1.8,5.06);
for(let x=fx0;x<=fx1+.01;x+=Math.max(.9,(fx1-fx0)/Math.round((fx1-fx0)/1.2)))bx(R,.07,1.72,.09,M.woodBlack,x,1.81,5.06);
bx(R,fx1-fx0,.08,.12,M.woodBlack,(fx0+fx1)/2,2.68,5.06);
[DOOR.x-.6,DOOR.x+.6].forEach(x=>bx(R,.12,2.7,.14,M.woodBlack,x,1.35,5.06));bx(R,1.32,.12,.16,M.woodBlack,DOOR.x,2.68,5.06);
// sliding doors (open, stacked right)
[0,1].forEach(i=>{const d=new THREE.Group();bx(d,.62,2.3,.04,M.woodBlack,0,1.15,0);pl(d,.5,2.1,M.glass,0,1.18,.025);bx(d,.5,.04,.02,M.woodBlack,0,1.6,.03,false);d.position.set(DOOR.x+.32+i*.04,0,5.0-i*.05);R.add(d)});
for(let i=0;i<3;i++){const p=pl(R,.38,.5,M.noren,DOOR.x-.39+i*.39,2.35,5.16);const t=p.material.map.clone();p.material=p.material.clone();p.material.map=t;t.needsUpdate=true;t.repeat.set(1/3,1);t.offset.set(i/3,0);p.castShadow=false}
cy(R,.015,1.3,M.woodBlack,DOOR.x,2.62,5.16,false).rotation.z=Math.PI/2;
// upper facade band + kanban + awning (hidden in top view on 1F)
bx(F,x1-x0+.2,.3,.24,M.woodBlack,(x0+x1)/2,2.85,5.08,false);
const kb=rb(F,6.4,.75,.14,.03,M.woodBlack,DOOR.x-3.2,3.42,5.24,false);pl(F,6.2,.65,M.kanban,DOOR.x-3.2,3.42,5.315);
const aw=new THREE.Group();for(let i=0;i<14;i++){const t=cy(aw,.07,1.3,M.roof,0,0,0,false);t.rotation.x=Math.PI/2;t.position.set(-1.95+i*.3,0,0)}bx(aw,4.3,.05,1.3,M.woodDark,0,-.06,0,false);aw.position.set(DOOR.x-.4,2.98,5.6);aw.rotation.x=.28;F.add(aw);
// outside lanterns
[DOOR.x-1.05,DOOR.x+.95].forEach(x=>{const g=new THREE.Group();const l=sp(g,1,M.lantern,0,0,0,false);l.scale.set(.2,.28,.2);cy(g,.13,.05,M.black,0,.29,0,false);cy(g,.13,.05,M.black,0,-.29,0,false);cy(g,.006,.3,M.black,0,.45,0,false);g.position.set(x,2.15,5.45);R.add(g);G3.lanterns.push(g)});
plight(0xff7a3a,.85,4.5,DOOR.x,2.1,5.6);
// kitchen noren + door frame
const kn=pl(R,1,.55,M.norenK,KDOOR,2.15,0);kn.castShadow=false;[KDOOR-.52,KDOOR+.52].forEach(x=>bx(R,.1,2.95,.12,M.woodDark,x,1.475,0));bx(R,1.14,.1,.14,M.woodDark,KDOOR,2.45,0);
// wall decor
pl(R,1.4,.88,M.menuBoard,6.48,2.15,2.8,-Math.PI/2);rb(R,.04,.96,1.48,.01,M.woodBlack,6.5,2.15,2.8,false);
pl(R,.5,.7,M.poster,6.48,1.75,4.3,-Math.PI/2);
pl(R,.32,1.05,M.calli,x0+.02,1.85,1.25,Math.PI/2);bx(R,.02,1.12,.38,M.woodBlack,x0+.005,1.85,1.25,false);
const ck=new THREE.Mesh(gDisc,M.clock);ck.scale.setScalar(.22);ck.position.set(x0+.03,2.45,2.65);ck.rotation.y=Math.PI/2;R.add(ck);cy(R,.235,.04,M.woodBlack,x0+.015,2.45,2.65,false).rotation.z=Math.PI/2;
const tvg=new THREE.Group();rb(tvg,.9,.53,.05,.01,M.black,0,0,0,false);pl(tvg,.84,.47,M.tv,0,0,.027);bx(tvg,.1,.1,.25,M.black,0,0,-.14,false);tvg.position.set(x0+.3,2.4,3.9);tvg.rotation.y=Math.PI/2+.25;tvg.rotation.x=.1;R.add(tvg);
// kitchen corkboard
const cb=ctex(256,160,(g,w,h)=>{g.fillStyle='#b8925a';g.fillRect(0,0,w,h);speck(g,w,h,600,'#6a4a2a',.1,.3,1,3);for(let i=0;i<9;i++){g.fillStyle=pick(['#fff','#ffe98a','#bfe6ff','#ffc8d8']);g.save();g.translate(rnd(20,w-50),rnd(15,h-45));g.rotate(rnd(-.15,.15));g.fillRect(0,0,rnd(30,50),rnd(30,40));g.fillStyle='#c8102e';g.beginPath();g.arc(12,4,4,0,7);g.fill();g.restore()}});
pl(R,1,.62,std({map:cb,roughness:.9}),5.3,1.65,-4.99);
// dining indoor lanterns (decor)
const nl=SV.up.decor;const lx=(nl>=1?[-4.2,-1.4,1.4]:[]).concat(nl>=2?[3.9,ex?-7:-4.5]:[]);lx.forEach((x,i)=>{const g=new THREE.Group();const l=sp(g,1,M.lantern,0,0,0,false);l.scale.set(.18,.25,.18);cy(g,.11,.04,M.black,0,.26,0,false);cy(g,.11,.04,M.black,0,-.26,0,false);g.position.set(x,2.55,i<3?1.7:(i===3?3.8:2.9));R.add(g);G3.lanterns.push(g)});
// lights
plight(0xf4f6ff,.75,9,-2,2.75,-3);plight(0xf4f6ff,.6,8,3,2.75,-3);plight(0xffc785,.6,6,-2.5,2.6,1.1);plight(0xffc27a,.55,7,.6,2.6,3.2);if(ex)plight(0xffc27a,.45,6,-7,2.6,2.6);
}

/* ---------- EXTERIOR ---------- */
function bldg(p,xa,xb,za,zb,h,fm,faceDir){const w=xb-xa,d=zb-za;const side=std({color:0x3a3632,roughness:.9});const mats=[side,side,M.roof,M.roof,side,side];if(faceDir==='+z')mats[4]=fm;if(faceDir==='-z')mats[5]=fm;const fm2=fm.clone();fm2.map=fm.map.clone();fm2.map.needsUpdate=true;fm2.map.wrapS=fm2.map.wrapT=THREE.RepeatWrapping;fm2.map.repeat.set(Math.max(1,Math.round(w/5)),Math.max(1,Math.round(h/6)));if(fm2.emissiveMap){fm2.emissiveMap=fm.emissiveMap.clone();fm2.emissiveMap.needsUpdate=true;fm2.emissiveMap.wrapS=fm2.emissiveMap.wrapT=THREE.RepeatWrapping;fm2.emissiveMap.repeat.copy(fm2.map.repeat)}if(faceDir==='+z')mats[4]=fm2;if(faceDir==='-z')mats[5]=fm2;
 const o=new THREE.Mesh(gBox,mats);o.scale.set(w,h,d);o.position.set((xa+xb)/2,h/2,(za+zb)/2);o.receiveShadow=true;p.add(o);
 for(let i=0;i<Math.floor(w/3);i++){if(Math.random()<.5)bx(p,.8,.5,.6,M.steelDark,xa+1+i*3+rnd(0,1),h+.25,za+rnd(.6,d-.6),false)}if(Math.random()<.5)cy(p,.6,1.2,M.steelDark,xa+w*rnd(.2,.8),h+.6,za+d*rnd(.3,.7),false);return o}
function buildExterior(){const R=G.room,F=G.face,x0=SV.up.expand?-9.2:-5.2;
floorRect(R,-24,20,5.16,7.2,.01,M.concrete);bx(R,44,.14,.18,M.concrete,-2,.07,7.2,false);
floorRect(R,-24,20,7.2,15.6,0,M.asphalt);
for(let x=-22;x<19;x+=3){bx(R,1.6,.01,.12,M.lineW,x,.006,11.4,false)}bx(R,44,.01,.1,M.lineW,-2,.006,7.6,false);bx(R,44,.01,.1,M.lineW,-2,.006,15.2,false);
for(let i=0;i<7;i++)bx(R,.45,.01,3,M.lineW,-11+i*.8,.007,11.4,false);
floorRect(R,-24,20,15.6,17.2,.01,M.concrete);
// opposite street buildings with lit shop signs
let x=-22;let k=0;while(x<19){const w=rnd(5,8),h=rnd(7,13);bldg(R,x,x+w-.2,17.4,23,h,M.facades[k%4],'-z');const s=pl(R,Math.min(w-1.2,4),.9,M.shopSign[k%5],x+w/2,3.2,17.3,Math.PI);s.castShadow=false;const aw=bx(R,w-.6,.08,1,pick([M.red,M.woodDark,M.steelDark]),x+w/2,2.6,16.95,false);aw.rotation.x=-.25;pl(R,w-1.4,2,std({color:0xffe2b0,emissive:0xffcf8a,emissiveIntensity:.6,roughness:.4}),x+w/2,1.2,17.38,Math.PI);x+=w;k++}
// behind shop
floorRect(R,-24,20,-7.2,-5.2,.005,M.alley);x=-22;k=1;while(x<19){const w=rnd(5,9),h=rnd(6.5,12);bldg(R,x,x+w-.3,-14,-7.3,h,M.facades[k%4],'+z');x+=w;k++}
// sides
bldg(R,-24,x0-.15,-7,5.1,8.5,M.facades[2],'+z');bldg(R,6.95,20,-7,5.1,9.5,M.facades[1],'+z');
pl(R,3.6,.8,M.shopSign[3],x0-2.4,3.2,5.12).castShadow=false;pl(R,3.2,.8,M.shopSign[1],9.2,3.2,5.12).castShadow=false;
pl(R,3,2,std({color:0xffe2b0,emissive:0xffcf8a,emissiveIntensity:.5}),x0-2.4,1.2,5.11);pl(R,2.6,2,std({color:0xdff0ff,emissive:0xcfe6ff,emissiveIntensity:.55}),9.4,1.2,5.11);
// vending machine
const vm=new THREE.Group();const vb=[M.white,M.white,M.white,M.white,M.vend,M.white];const vmo=new THREE.Mesh(gBox,vb);vmo.scale.set(.95,1.85,.75);vmo.position.y=.925;vmo.castShadow=true;vm.add(vmo);vm.position.set(7.45,0,5.65);R.add(vm);
const vm2=vm.clone();vm2.position.x=8.5;R.add(vm2);
// bicycle
const bk=new THREE.Group();[-.5,.5].forEach(o=>{const w=new THREE.Mesh(new THREE.TorusGeometry(.32,.025,6,24),M.rubber);w.position.set(o,.34,0);bk.add(w);cy(bk,.02,.64,M.chrome,o,.34,0,false).rotation.x=Math.PI/2});tube(bk,[[-.5,.34,0],[-.1,.75,0],[.4,.75,0],[.5,.34,0]],.022,M.red);tube(bk,[[-.1,.75,0],[.05,.34,0],[-.5,.34,0]],.02,M.red);cy(bk,.07,.03,M.black,-.12,.85,0,false);tube(bk,[[.4,.75,0],[.42,.98,0]],.02,M.chrome);cy(bk,.015,.5,M.black,.42,.98,0,false).rotation.x=Math.PI/2;bx(bk,.3,.18,.25,M.steelDark,.6,.9,0,false);bk.position.set(-1.6,0,6.3);bk.rotation.y=.2;R.add(bk);
// A-board
const ab=new THREE.Group();[1,-1].forEach(s=>{const p=pl(ab,.55,.75,M.aboard,0,.45,s*.12,s<0?Math.PI:0);p.rotation.x=s*.17});ab.position.set(3.6,0,5.85);R.add(ab);
// plants by entrance
[[4.75,5.5],[6.45,5.5]].forEach(p=>{cy(R,.2,.42,M.potW,p[0],.21,p[1],true,.16);for(let i=0;i<6;i++){const l=sp(R,1,i%2?M.plant:M.plant2,p[0]+rnd(-.12,.12),.6+rnd(0,.5),p[1]+rnd(-.12,.12));l.scale.set(.12,.22,.12)}});
// street lamp + utility pole (face group: hidden in top view)
cy(F,.07,5,M.steelDark,.5,2.5,7.05);tube(F,[[.5,5,7.05],[.5,5.2,7.3],[.5,5.1,7.9]],.05,M.steelDark);const lh=bx(F,.25,.1,.5,M.bulb,.5,5.03,7.9,false);
plight(0xffd9a0,.65,11,.5,4.8,7.8);
cy(F,.13,8,M.concrete,-4.5,4,7.05);bx(F,1.4,.08,.08,M.woodDark,-4.5,7.3,7.05);
[[-4.5,7.3,7.05,12,7.6,7.3],[-4.5,7.3,7.05,-22,7.4,7.3],[-4.5,6.8,7.05,12,7.1,7.4]].forEach(w=>tube(F,[[w[0],w[1],w[2]],[(w[0]+w[3])/2,w[1]-.6,(w[2]+w[5])/2],[w[3],w[4],w[5]]],.012,M.black,false));
}

/* ---------- KITCHEN ---------- */
function cabinetDoors(p,x,y,z,w,h,n){for(let i=0;i<n;i++){const cx=x-w/2+w/n*(i+.5);bx(p,w/n-.03,h,.01,M.steelDark,cx,y,z,false);bx(p,.12,.02,.025,M.chrome,cx,y+h/2-.08,z+.015,false)}}
function buildKitchen(){const F=G.furn;
// --- stove + stock pot
rb(F,1.1,.42,.75,.03,M.steelDark,-4.3,.21,-4.5);cabinetDoors(F,-4.3,.2,-4.12,1,.3,2);
const ring=new THREE.Mesh(new THREE.TorusGeometry(.26,.03,8,24),M.iron);ring.rotation.x=Math.PI/2;ring.position.set(-4.3,.45,-4.5);F.add(ring);
const fl=new THREE.Mesh(new THREE.TorusGeometry(.2,.018,6,24),M.flame);fl.rotation.x=Math.PI/2;fl.position.set(-4.3,.44,-4.5);F.add(fl);G3.flame=fl;
[0,1,2,3].forEach(i=>{const a=i/4*Math.PI*2+.4;bx(F,.05,.06,.3,M.iron,-4.3+Math.cos(a)*.18,.47,-4.5+Math.sin(a)*.18).rotation.y=-a});
const potM=M.steel.clone();potM.side=THREE.DoubleSide;const pot=new THREE.Mesh(new THREE.CylinderGeometry(.37,.36,.64,28,1,true),potM);pot.position.set(-4.3,.82,-4.5);pot.castShadow=true;F.add(pot);
const pb=new THREE.Mesh(gDisc,M.steelDark);pb.rotation.x=-Math.PI/2;pb.scale.setScalar(.36);pb.position.set(-4.3,.505,-4.5);F.add(pb);
const rim=new THREE.Mesh(new THREE.TorusGeometry(.37,.015,6,32),M.steel);rim.rotation.x=Math.PI/2;rim.position.set(-4.3,1.14,-4.5);F.add(rim);
[-1,1].forEach(s=>{const h=new THREE.Mesh(new THREE.TorusGeometry(.06,.012,6,12,Math.PI),M.steel);h.position.set(-4.3+s*.38,1.04,-4.5);h.rotation.set(0,s>0?0:Math.PI,Math.PI/2*s);F.add(h)});
G3.potSurf=new THREE.Group();const ps=new THREE.Mesh(gDisc,M.stock);ps.rotation.x=-Math.PI/2;ps.scale.setScalar(.355);G3.potSurf.add(ps);for(let i=0;i<7;i++){const b=cy(G3.potSurf,.025,.16,M.bone,rnd(-.22,.22),.005,rnd(-.22,.22),false);b.rotation.set(Math.PI/2,0,rnd(0,3));sp(G3.potSurf,.035,M.bone,b.position.x+.07,.01,b.position.z,false)}
for(let i=0;i<3;i++){const v=sp(G3.potSurf,.04,std({color:0xd8c89a,roughness:.6}),rnd(-.2,.2),.01,rnd(-.2,.2),false);v.scale.y=.4}
G3.potSurf.position.set(-4.3,1.0,-4.5);F.add(G3.potSurf);
tube(F,[[-4.0,1.14,-4.62],[-3.98,1.3,-4.62],[-4.1,.9,-4.62]],.012,M.steel);sp(F,.05,M.steel,-4.1,.88,-4.62);
const sp2=new THREE.Mesh(new THREE.CylinderGeometry(.16,.15,.22,20,1,true),potM);sp2.position.set(-3.85,.58,-4.75);F.add(sp2);
station('stove',-4.3,-4.5,'スープ');
// --- noodle boiler
rb(F,1.2,.92,.75,.03,M.steel,-2.75,.46,-4.5);cabinetDoors(F,-2.75,.4,-4.12,1.1,.55,2);
bx(F,1.04,.02,.6,M.steelDark,-2.75,.925,-4.52,false);
for(let i=0;i<3;i++)cy(F,.025,.03,M.black,-3.1+i*.15,.8,-4.11,false).rotation.x=Math.PI/2;
const n4=[2,4,6][SV.up.boiler];G3.baskets=[];for(let i=0;i<n4;i++){const x=-2.75+(i-(n4-1)/2)*(n4===2?.48:n4===4?.26:.172);const w=new THREE.Mesh(gDisc,M.water);w.rotation.x=-Math.PI/2;w.scale.setScalar(.11);w.position.set(x,.94,-4.5);F.add(w);
 const bk=new THREE.Group();const wm=std({color:0x9aa0a6,metalness:.8,roughness:.4,wireframe:true});cy(bk,.095,.2,wm,0,0,0,false);const r=new THREE.Mesh(new THREE.TorusGeometry(.095,.008,5,18),M.steel);r.rotation.x=Math.PI/2;r.position.y=.1;bk.add(r);const h=cy(bk,.012,.42,M.woodDark,0,.26,.17,false);h.rotation.x=.85;
 const nd=new THREE.Mesh(gDisc,M.noodle);nd.rotation.x=-Math.PI/2;nd.scale.setScalar(.085);nd.position.y=.04;bk.add(nd);nd.visible=false;bk.userData.nd=nd;bk.position.set(x,1.12,-4.5);F.add(bk);G3.baskets.push(bk)}
station('boiler',-2.75,-4.5,'茹で麺機');
// --- prep table with toppings
rb(F,1.4,.9,.75,.03,M.steel,-.95,.45,-4.5);cabinetDoors(F,-.95,.4,-4.12,1.3,.55,2);
const pans=[[-1.48,'chashu'],[-1.2,'negi'],[-.92,'nori'],[-.64,'egg'],[-.36,'menma']];pans.forEach(([x,k])=>{bx(F,.26,.07,.3,M.steel,x,.94,-4.72,false);const c=new THREE.Group();c.position.set(x,.975,-4.72);F.add(c);
 if(k==='chashu')for(let i=0;i<6;i++){const d=cy(c,.045,.012,M.chashu,(i%2)*.06-.03,i*.004,-.06+i*.022,false);d.rotation.x=-.5}
 if(k==='negi'){const d=bx(c,.22,.012,.26,M.negi,0,0,0,false);for(let i=0;i<15;i++)cy(c,.008,.006,std({color:0xa8e070,roughness:.5}),rnd(-.09,.09),.008,rnd(-.11,.11),false)}
 if(k==='nori')for(let i=0;i<5;i++)bx(c,.18,.003,.2,M.nori,rnd(-.01,.01),i*.004,rnd(-.01,.01),false);
 if(k==='egg')for(let i=0;i<4;i++){const e=new THREE.Mesh(gHalf,M.eggW);e.scale.set(.03,.024,.038);e.position.set((i%2)*.08-.04,0,Math.floor(i/2)*.1-.05);c.add(e);const y=new THREE.Mesh(gDisc,M.egg);y.rotation.x=-Math.PI/2;y.scale.setScalar(.017);y.position.set(e.position.x,.025,e.position.z);c.add(y)}
 if(k==='menma')for(let i=0;i<10;i++){const m=bx(c,.014,.012,.07,M.menma,rnd(-.08,.08),.005,rnd(-.1,.1),false);m.rotation.y=rnd(-.5,.5)}});
[-1.45,-1.25].forEach((x,i)=>{cy(F,.06,.12,M.steel,x,.98,-4.35,false);const t=new THREE.Mesh(gDisc,i?M.soy:std({color:0x5a3a1a,roughness:.1}));t.rotation.x=-Math.PI/2;t.scale.setScalar(.055);t.position.set(x,1.035,-4.35);F.add(t)});
bx(F,.4,.02,.28,M.white,-.5,.92,-4.3,false);const kn=bx(F,.22,.004,.04,M.steel,-.45,.935,-4.3,false);kn.rotation.y=.4;bx(F,.1,.015,.025,M.black,-.6,.935,-4.25,false);
for(let i=0;i<3;i++){const b=new THREE.Mesh(gBowl,M.bowlOut);b.position.set(-1.0,.92+i*.05,-4.3);b.castShadow=true;F.add(b)}
// utensil rail over prep
bx(F,1.4,.02,.02,M.steel,-.95,1.55,-4.97,false);for(let i=0;i<5;i++){const x=-1.5+i*.28;cy(F,.008,.42,M.steel,x,1.33,-4.95,false);sp(F,.045,M.steel,x,1.1,-4.93,false).scale.y=.5}
station('prep',-.95,-4.5,'盛り付け台');
// --- sink
rb(F,1.3,.9,.75,.03,M.steel,.75,.45,-4.5);cabinetDoors(F,.75,.4,-4.12,1.2,.55,2);bx(F,.82,.04,.5,M.black,.6,.905,-4.5,false);
tube(F,[[.6,.92,-4.82],[.6,1.28,-4.8],[.6,1.32,-4.66],[.6,1.18,-4.56]],.016,M.chrome);cy(F,.025,.04,M.chrome,.72,.95,-4.8,false);
bx(F,.09,.04,.06,std({color:0xf2d23a,roughness:.8}),.32,.94,-4.3,false);bx(F,.09,.015,.06,std({color:0x2a8a3a,roughness:.8}),.32,.97,-4.3,false);
cy(F,.04,.18,std({color:0x3ac0e0,roughness:.3}),.95,1.0,-4.78,false);
G3.stack=new THREE.Group();G3.stack.position.set(1.2,.92,-4.4);F.add(G3.stack);
bx(F,1.3,.03,.3,M.steel,.75,1.75,-4.86);for(let i=0;i<5;i++){for(let j=0;j<4;j++){const b=new THREE.Mesh(gBowl,M.bowlOut);b.scale.setScalar(.85);b.position.set(.25+i*.25,1.765+j*.045,-4.86);F.add(b)}}
station('sink',.75,-4.5,'洗い場');
// --- fridges
const fridge=(x)=>{rb(F,1,2.05,.75,.03,M.steel,x,1.03,-4.55);bx(F,.008,1.6,.01,M.steelDark,x,1.15,-4.17,false);[-1,1].forEach(s=>bx(F,.03,.5,.04,M.chrome,x+s*.08,1.3,-4.15,false));bx(F,.3,.1,.01,M.screen,x,1.92,-4.17,false);bx(F,.9,.06,.01,M.black,x,.12,-4.17,false)};fridge(2.45);if(SV.up.fridge)fridge(3.5);
station('fridge',SV.up.fridge?2.95:2.45,-4.55,'冷蔵庫');
for(let i=0;i<3;i++){const b=rb(F,.5,.32,.4,.01,M.cardboard,4.35+(i===2?.05:0),.16+(i===2?.32:0),-4.7+(i===1?.42:0));b.rotation.y=rnd(-.15,.15)}
// --- office desk
rb(F,1.3,.04,.7,.01,M.woodLight,5.3,.74,-4.4);[[-.6,-.3],[.6,-.3],[-.6,.3],[.6,.3]].forEach(([a,b])=>bx(F,.04,.72,.04,M.steelDark,5.3+a,.36,-4.4+b));
rb(F,.6,.36,.03,.01,M.black,5.3,1.05,-4.6);bx(F,.56,.32,.005,M.screen,5.3,1.05,-4.583,false);cy(F,.025,.2,M.black,5.3,.84,-4.62);bx(F,.2,.01,.15,M.black,5.3,.75,-4.62);
bx(F,.42,.015,.14,M.black,5.3,.765,-4.28,false);bx(F,.06,.02,.09,M.black,5.62,.765,-4.28,false);bx(F,.2,.01,.28,M.white,4.85,.76,-4.4,false).rotation.y=.2;cy(F,.04,.1,M.white,5.85,.8,-4.55,false);
const ch=new THREE.Group();rb(ch,.48,.08,.46,.03,M.black,0,.48,0);rb(ch,.46,.5,.06,.03,M.black,0,.82,.22);cy(ch,.03,.42,M.chrome,0,.24,0);for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const l=bx(ch,.03,.03,.28,M.black,Math.sin(a)*.14,.04,Math.cos(a)*.14);l.rotation.y=a;sp(ch,.028,M.black,Math.sin(a)*.27,.028,Math.cos(a)*.27)}ch.position.set(5.3,0,-3.75);ch.rotation.y=Math.PI+.2;F.add(ch);
station('pc',5.3,-4.4,'発注PC');
// --- hood
rb(F,5.4,.42,1.05,.02,M.steel,-2.35,2.4,-4.55,false);bx(F,5.3,.02,.95,M.steelDark,-2.35,2.18,-4.55,false);for(let i=0;i<8;i++)bx(F,.6,.008,.85,M.steel,-4.8+i*.7,2.17,-4.55,false);
cy(F,.25,.4,M.steel,-2.4,2.8,-4.7,false);bx(F,5,.025,.04,M.panel,-2.35,2.165,-4.15,false);
// floor mats
bx(F,3.8,.012,.6,M.rubber,-1.9,.006,-3.75,false);bx(F,1.1,.012,.6,M.rubber,.75,.006,-3.75,false);
// pass shelf under-shelf bowls (kitchen side)
bx(F,6.8,.03,.32,M.steel,-1.45,.55,-.38,false);for(let i=0;i<8;i++){for(let j=0;j<3;j++){const b=new THREE.Mesh(gBowl,M.bowlOut);b.scale.setScalar(.8);b.position.set(-4.6+i*.85,.565+j*.04,-.38);F.add(b)}}
// gyoza griddle
if(SV.up.gyoza){rb(F,1,.88,.7,.03,M.steelDark,-4.6,.44,-2.1);cabinetDoors(F,-4.6,.4,-1.74,.9,.5,1);bx(F,.9,.04,.6,M.iron,-4.6,.9,-2.1,false);const lid=sp(F,1,M.steel,-4.85,1.0,-2.3,false);lid.scale.set(.2,.08,.2);G3.gyoza=new THREE.Group();G3.gyoza.position.set(-4.6,.93,-2.1);F.add(G3.gyoza);stations.gyoza={id:'gyoza',x:-4.6,z:-2.1,sx:-3.7,sz:-2.1,label:'餃子',r:1.05};colliders.push({x:-4.6,z:-2.1,r:.6,l:0})}else G3.gyoza=null;
// trash
cy(F,.22,.62,std({color:0x2a3a5a,roughness:.5}),-4.4,.31,-1.0,true,.2);cy(F,.23,.05,M.black,-4.4,.64,-1.0,false);cy(F,.18,.55,std({color:0x3a7a3a,roughness:.5}),-4.4,.275,-.45,true,.17);
stations.trash={id:'trash',x:-4.4,z:-1.0,sx:-3.8,sz:-1.0,label:'ゴミ箱',r:.8};colliders.push({x:-4.4,z:-.75,r:.45,l:0});
// pass slots
for(let i=0;i<6;i++)passSlots.push({x:-4.4+i*1.0,z:-.08,dish:null,mesh:null});stations.pass={id:'pass',x:-1.9,z:0,sx:-1.9,sz:-.75,label:'パス台',r:2.7};
}

/* ---------- DINING ---------- */
function condiments(p,x,y,z,ry){const g=new THREE.Group();rb(g,.28,.015,.12,.01,M.woodBlack,0,.008,0,false);cy(g,.022,.11,M.glassBottle,-.09,.07,0,false);cy(g,.018,.03,M.capR,-.09,.14,0,false);cy(g,.02,.08,M.chili,-.035,.055,0,false);cy(g,.016,.025,M.capW,-.035,.11,0,false);cy(g,.018,.075,M.pepper,.02,.05,0,false);cy(g,.019,.02,M.steel,.02,.1,0,false);rb(g,.08,.09,.1,.01,M.woodLight,.095,.05,0,false);for(let i=0;i<6;i++)cy(g,.004,.06,M.woodLight,.075+(i%3)*.02,.12,(i>2?.02:-.02),false);g.position.set(x,y,z);g.rotation.y=ry||0;p.add(g);return g}
function stool(p,x,z){const g=new THREE.Group();cy(g,.2,.03,M.chrome,0,.015,0,true,.22);cy(g,.03,.62,M.chrome,0,.33,0);const s=cy(g,.19,.08,M.redVinyl,0,.66,0,true,.18);const t=sp(g,1,M.redVinyl,0,.7,0);t.scale.set(.185,.03,.185);const r=new THREE.Mesh(new THREE.TorusGeometry(.15,.012,6,18),M.chrome);r.rotation.x=Math.PI/2;r.position.y=.3;g.add(r);g.position.set(x,0,z);p.add(g)}
function chair(p,x,z,ry){const g=new THREE.Group();rb(g,.42,.05,.42,.02,M.woodDark,0,.45,0);rb(g,.38,.04,.36,.02,M.redVinyl,0,.49,.01);[[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]].forEach(([a,b])=>bx(g,.035,.45,.035,M.woodDark,a,.225,b));[-.17,.17].forEach(a=>bx(g,.035,.5,.035,M.woodDark,a,.72,.19));rb(g,.4,.16,.035,.015,M.woodDark,0,.88,.19);bx(g,.36,.03,.03,M.woodDark,0,.66,.19);g.position.set(x,0,z);g.rotation.y=ry;p.add(g)}
function pendant(p,x,y,z,col,ceil){ceil=ceil||2.95;const sh=new THREE.Mesh(new THREE.LatheGeometry([[.03,0],[.06,.02],[.2,-.18],[.21,-.2]].map(a=>new THREE.Vector2(a[0],a[1])),20),std({color:col||0x2a1a10,roughness:.5,side:THREE.DoubleSide}));sh.position.set(x,y,z);sh.castShadow=false;p.add(sh);sp(p,.055,M.bulb,x,y-.13,z,false);cy(p,.004,ceil-y,M.black,x,(ceil+y)/2,z,false)}
function buildDining(){const F=G.furn,FP=G.fp,ex=SV.up.expand,x0=ex?-9:-5;
// divider counter
rb(F,7.1,1.02,.45,.02,M.woodDark,-1.45,.51,0);pl(F,7.08,.98,M.wains,-1.45,.5,.228);rb(F,7.2,.06,.76,.02,M.woodLight,-1.45,1.06,.12);
rb(F,7.1,.04,.3,.01,M.steel,-1.45,1.36,-.08,false);for(let x=-4.9;x<=2;x+=1.15)cy(F,.012,.28,M.chrome,x,1.21,-.08,false);
rb(F,3.4,1.02,.45,.02,M.woodDark,4.8,.51,0);pl(F,3.38,.98,M.wains,4.8,.5,.228);rb(F,3.5,.06,.7,.02,M.woodLight,4.8,1.06,.1);
cy(F,.018,7,M.chrome,-1.45,.22,.4,false).rotation.z=Math.PI/2;
COUNTER_SEATS.forEach((x,i)=>{stool(F,x,.82);seats.push({id:seats.length,label:'C'+(i+1),x,z:.82,y:0,l:0,rot:Math.PI,cust:null,dirty:0,claim:null,sitY:.71,mode:'stool',tableY:1.1,mx:x,mz:.38})});
[-3.85,-2.05,-.25].forEach(x=>condiments(F,x,1.09,.4));
cy(F,.06,.22,M.glass,-4.75,1.2,.35,false);cy(F,.055,.16,M.waterBlue,-4.75,1.17,.35,false);for(let i=0;i<4;i++)cy(F,.032,.09,M.glass,-4.55+(i%2)*.07,1.14+Math.floor(i/2)*.0,.3+Math.floor(i/2)*.07,false);
// FP-only: beam with menu strips & pendant lamps
bx(FP,7.3,.16,.14,M.woodBlack,-1.4,2.82,.05,false);M.strip.forEach((m,i)=>{const s=pl(FP,.15,.56,m,-4.7+i*.82,2.45,.12);s.castShadow=false});
[-3.85,-2.05,-.25].forEach(x=>pendant(FP,x,2.25,.55,0x1a1a1a));
// tables
const nT=Math.min(SV.up.table+1,ex?7:4);for(let t=0;t<nT;t++){const s=TABLE_SLOTS[t];const g=new THREE.Group();rb(g,.95,.05,.75,.02,M.woodLight,0,.74,0);cy(g,.05,.68,M.iron,0,.37,0);[0,1].forEach(r=>{const b=bx(g,.6,.03,.06,M.iron,0,.02,0);b.rotation.y=r*Math.PI/2});
 condiments(g,.28,.765,-.22,Math.PI/2);rb(g,.12,.1,.08,.01,M.white,-.3,.81,-.25,false);
 g.position.set(s.x,0,s.z);F.add(g);colliders.push({x:s.x,z:s.z,r:.55,l:0});
 [-1,1].forEach(sd=>{chair(F,s.x,s.z+sd*.62,sd<0?Math.PI:0)});
 pendant(F,s.x,2.3,s.z,0x3a2414);
 [-1,1].forEach(sd=>seats.push({id:seats.length,label:'T'+(t+1)+(sd<0?'a':'b'),x:s.x,z:s.z+sd*.62,y:0,l:0,rot:sd<0?0:Math.PI,cust:null,dirty:0,claim:null,sitY:.5,mode:'chair',tableY:.77,mx:s.x,mz:s.z+sd*.2}))}
// register with maneki-neko
rb(F,1.3,1,.6,.03,M.woodDark,5.6,.5,2.8);rb(F,1.36,.05,.66,.02,M.woodLight,5.6,1.02,2.8);
rb(F,.34,.08,.3,.01,M.black,5.55,1.09,2.85);const st=bx(F,.03,.2,.03,M.black,5.55,1.2,2.9,false);const scr=rb(F,.3,.2,.02,.01,M.black,5.55,1.32,2.88,false);scr.rotation.x=-.35;const sc2=bx(F,.27,.17,.005,M.screen,5.55,1.32,2.868,false);sc2.rotation.x=-.35;
bx(F,.14,.1,.16,M.white,5.95,1.1,2.95,false);bx(F,.07,.02,.12,M.black,5.2,1.055,2.7,false);
const neko=new THREE.Group();sp(neko,1,M.white,0,.07,0).scale.set(.06,.07,.055);sp(neko,.05,M.white,0,.16,0);[-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.ConeGeometry(.018,.035,6),M.white);e.position.set(s*.03,.205,0);neko.add(e)});const paw=sp(neko,1,M.white,.045,.2,.02);paw.scale.set(.018,.035,.018);bx(neko,.05,.012,.02,M.red,0,.12,.045,false);sp(neko,.012,std({color:0xf2c12e,metalness:.6,roughness:.3}),0,.1,.055,false);neko.position.set(6.1,1.045,2.62);neko.rotation.y=Math.PI;F.add(neko);
const rs=pl(F,.5,.17,signM('お会計',null,'#c8102e','#ffffff',256,86),5.6,1.5,3.13);rs.castShadow=false;bx(F,.02,.3,.02,M.chrome,5.6,1.2,3.12,false);
stations.register={id:'register',x:5.6,z:2.8,sx:5.6,sz:2.1,label:'レジ',r:1.2};colliders.push({x:5.6,z:2.8,r:.7,l:0});
// beer
if(SV.up.beer){rb(F,.5,.5,.35,.03,M.steel,4.4,1.35,.05);[-.12,0,.12].forEach(o=>{cy(F,.018,.16,M.chrome,4.4+o,1.66,.15,false);bx(F,.03,.08,.02,M.black,4.4+o,1.77,.15,false)});pl(F,.4,.2,signM('生',null,'#c8102e','#fff',128,64),4.4,1.4,.226);
 rb(F,.92,1.95,.62,.03,M.black,6.08,.975,1.2);pl(F,.8,1.7,std({color:0xfff6e6,emissive:0xfff0d8,emissiveIntensity:.7}),6.08,1.0,.89).rotation.y=Math.PI;pl(F,.8,1.7,M.glass,6.08,1.0,.88).rotation.y=Math.PI;
 for(let r=0;r<4;r++)for(let c=0;c<4;c++){cy(F,.034,.24,M.glassBottle,5.8+c*.19,.3+r*.42,1.08,false);cy(F,.012,.06,M.glassBottle,5.8+c*.19,.45+r*.42,1.08,false)}
 pl(F,.82,.18,signM('BEER',null,'#c8102e','#fff',256,56),6.08,1.86,.885).rotation.y=Math.PI;
 stations.beer={id:'beer',x:4.4,z:.05,sx:4.4,sz:.85,label:'ビールサーバー',r:1.1};colliders.push({x:6.1,z:1.2,r:.6,l:0})}
// ticket machine
if(SV.up.kenbaiki){const kb=new THREE.Mesh(gBox,[M.steelDark,M.steelDark,M.steelDark,M.steelDark,M.steelDark,M.ken]);kb.scale.set(.72,1.75,.45);kb.position.set(KEN.x,.875,KEN.z+.2);kb.castShadow=true;F.add(kb);colliders.push({x:KEN.x,z:KEN.z+.2,r:.42,l:0})}
// water server, umbrella stand, plants
const wx=x0+.35;rb(F,.34,1.0,.34,.03,M.white,wx,.5,4.55);cy(F,.13,.4,M.waterBlue,wx,1.2,4.55,true,.12);cy(F,.02,.05,M.capW,wx,1.42,4.55,false);bx(F,.05,.05,.04,M.capR,wx-.06,.75,4.37,false);bx(F,.05,.05,.04,M.steelDark,wx+.06,.75,4.37,false);colliders.push({x:wx,z:4.55,r:.3,l:0});
cy(F,.12,.45,M.steelDark,4.85,.225,4.72,true,.11);for(let i=0;i<3;i++){const u=cy(F,.012,.8,pick([M.black,M.red,std({color:0x1f3a6a})]),4.85+rnd(-.05,.05),.55,4.72+rnd(-.05,.05),false);u.rotation.set(rnd(-.15,.15),0,rnd(-.15,.15))}
const plantAt=(x,z,s)=>{cy(F,.18*s,.38*s,M.potW,x,.19*s,z,true,.14*s);for(let i=0;i<9;i++){const l=sp(F,1,i%2?M.plant:M.plant2,x+rnd(-.15,.15)*s,(.5+rnd(0,.7))*s,z+rnd(-.15,.15)*s);l.scale.set(.1*s,.24*s,.1*s);l.rotation.z=rnd(-.5,.5)}colliders.push({x,z,r:.3*s,l:0})};plantAt(6.2,4.62,1.2);if(ex)plantAt(-5.3,.5,1);
bx(F,1.1,.012,.6,M.rubber,DOOR.x,.006,4.5,false);
}

/* ---------- STORAGE (expanded wing back room) ---------- */
function buildStorage(){const F=G.furn,x0=has2F()?-7:-8.9;floorRect(F,has2F()?-7.05:-9,-5,-5,-.1,.002,M.concrete);
const rack=(x,z)=>{[[-.55,-.2],[.55,-.2],[-.55,.2],[.55,.2]].forEach(([a,b])=>bx(F,.04,2,.04,M.steelDark,x+a,1,z+b));for(let i=0;i<4;i++){bx(F,1.15,.03,.45,M.steel,x,.15+i*.6,z);for(let j=0;j<3;j++)if(Math.random()<.8){const b=rb(F,.32,.3,.36,.01,M.cardboard,x-.38+j*.38,.32+i*.6,z);b.rotation.y=rnd(-.1,.1)}}};
rack(-6.1,-4.6);rack(-6.1,-3.3);if(!has2F())rack(-8.3,-4.6);
for(let i=0;i<4;i++){const s=sp(F,1,std({color:0xe8e0cc,roughness:.95}),-5.5+(i%2)*.4,.15+Math.floor(i/2)*.25,-1.0);s.scale.set(.25,.13,.18)}
cy(F,.25,.7,std({color:0x2a5a9a,roughness:.5}),-6.6,.35,-.6);cy(F,.25,.7,std({color:0x2a5a9a,roughness:.5}),-6.1,.35,-.6)}

/* ---------- 2F ZASHIKI ---------- */
function build2F(){const U=G.up,F=G.face,Y=3;
// slab (top at 3.0)
const slab=(xa,xb,za,zb,m)=>{const o=bx(U,xb-xa,.06,zb-za,M.woodDark,(xa+xb)/2,Y-.03,(za+zb)/2,false);o.receiveShadow=true;floorRect(U,xa,xb,za,zb,Y+.002,m)};
slab(-7.2,6.5,-5,5,M.tatami);slab(-9,-8.6,-5,5,M.floorWood);slab(-8.6,-7.2,-5,-4.3,M.floorWood);slab(-8.6,-7.2,.05,5,M.floorWood);
// walls 2F (back/left/right) + wainscot
const H2=2.8,cyw=Y+H2/2;bx(U,15.7,H2,.2,M.wall,-1.25,cyw,-5.1,false);bx(U,.2,H2,10.2,M.wall,-9.1,cyw,0,false);bx(U,.2,H2,10.2,M.wall,6.6,cyw,0,false);
bx(U,15.5,.8,.02,M.wains,-1.25,Y+.4,-4.99,false);bx(U,.02,.8,10,M.wains,6.49,Y+.4,0,false);
// shoji on right wall
for(let i=0;i<4;i++){pl(U,1.1,1.3,M.shoji,6.48,Y+1.6,-3.3+i*2.2,-Math.PI/2);bx(U,.03,1.36,1.16,M.woodBlack,6.485,Y+1.6,-3.3+i*2.2,false)}
// front wall 2F (face group: visible from street too)
const fx0=-9;rb(F,15.6,.9,.22,.02,M.woodDark,-1.25,Y+.45,5.06);pl(F,15.5,1.9,M.glass,-1.25,Y+1.85,5.06);for(let x=fx0;x<=6.5;x+=1.3)bx(F,.07,1.9,.09,M.woodBlack,x,Y+1.85,5.06,false);bx(F,15.6,.1,.12,M.woodBlack,-1.25,Y+2.8,5.06,false);
// railing / fusuma around stairwell
bx(U,.08,.9,4.35,M.woodBlack,-7.15,Y+.45,-2.1,false);for(let z=-4.2;z<0;z+=.55)bx(U,.04,.9,.04,M.woodBlack,-7.15,Y+.45,z,false);bx(U,.1,.05,4.4,M.woodLight,-7.15,Y+.92,-2.1,false);
bx(U,1.45,.9,.08,M.woodBlack,-7.9,Y+.45,.05,false);bx(U,1.5,.05,.1,M.woodLight,-7.9,Y+.92,.05,false);
for(let i=0;i<4;i++){const f=pl(U,1.2,2.6,std({map:ctex(128,256,(g,w,h)=>{g.fillStyle='#e8dcc0';g.fillRect(0,0,w,h);speck(g,w,h,300,'#a08a60',.05,.15,1,3);g.strokeStyle='#8a6a3a';g.lineWidth=2;g.beginPath();g.arc(w*.5,h*.4,22,0,7);g.stroke();g.fillStyle='#2a1a10';g.fillRect(w*.8,h*.5,8,24)}),roughness:.9}),-7.13,Y+1.3,.65+i*1.2,Math.PI/2)}
bx(U,.06,2.7,4.9,M.woodBlack,-7.17,Y+1.35,2.5,false);
// 2F ceiling
ceilRect(U,-9,6.5,-5,5,Y+2.75,M.ceil);[-4,0,4].forEach(x=>bx(G.fp,.14,.12,10,M.woodDark,x,Y+2.69,0,false));
// tokonoma
rb(U,1.9,.15,.55,.02,M.woodBlack,5.45,Y+.075,-4.72);pl(U,.36,1.1,M.scroll,5.45,Y+1.25,-4.98);cy(U,.012,.42,M.woodBlack,5.45,Y+1.82,-4.97,false).rotation.z=Math.PI/2;
cy(U,.09,.24,std({color:0x2a3a5a,roughness:.3}),5.95,Y+.27,-4.72,true,.07);for(let i=0;i<4;i++){tube(U,[[5.95,Y+.38,-4.72],[5.95+rnd(-.15,.15),Y+.6,-4.72+rnd(-.1,.1)],[5.95+rnd(-.25,.25),Y+.85,-4.72+rnd(-.1,.1)]],.006,M.plant);sp(U,.04,std({color:pick([0xe8507a,0xf6f0e2,0xf2c12e]),roughness:.6}),5.95+rnd(-.2,.2),Y+.82+rnd(0,.08),-4.72+rnd(-.08,.08))}
colliders.push({x:5.45,z:-4.6,r:.5,l:1});
// andon lamps
[[6.1,4.5],[-6.6,4.5],[-6.6,-4.5]].forEach(p=>{bx(U,.28,.5,.28,M.paper,p[0],Y+.35,p[1],false);bx(U,.32,.04,.32,M.woodBlack,p[0],Y+.62,p[1],false);bx(U,.32,.1,.32,M.woodBlack,p[0],Y+.05,p[1],false)});
// shoe shelf on landing
rb(U,.9,.7,.32,.02,M.woodDark,-7.9,Y+.35,-4.86);for(let i=0;i<4;i++){const s=rb(U,.1,.06,.24,.02,pick([M.black,M.white,std({color:0x8a5a2a})]),-8.2+i*.18,Y+.03,-4.55,false)}
// low tables + zabuton
const n2=Math.min(3+SV.up.zashiki,6);for(let t=0;t<n2;t++){const s=ZASHIKI[t];const g=new THREE.Group();rb(g,1.1,.05,.75,.02,std({color:0x3a1e10,roughness:.25}),0,.33,0);[[-.48,-.3],[.48,-.3],[-.48,.3],[.48,.3]].forEach(([a,b])=>bx(g,.06,.3,.06,M.woodBlack,a,.15,b));condiments(g,.36,.355,-.22,Math.PI/2);g.position.set(s.x,Y,s.z);U.add(g);colliders.push({x:s.x,z:s.z,r:.55,l:1});
 [-1,1].forEach(sd=>{rb(U,.5,.08,.5,.04,M.cushion[(t+sd+2)%4],s.x,Y+.04,s.z+sd*.66,false);seats.push({id:seats.length,label:'Z'+(t+1)+(sd<0?'a':'b'),x:s.x,z:s.z+sd*.66,y:Y,l:1,rot:sd<0?0:Math.PI,cust:null,dirty:0,claim:null,sitY:.1,mode:'seiza',tableY:Y+.36,mx:s.x,mz:s.z+sd*.2})});
 pendant(U,s.x,Y+2.2,s.z,0x6a4a2a,Y+2.75)}
plight(0xffd09a,.6,10,-2.5,Y+2.4,-1.5);plight(0xffd09a,.55,10,2.5,Y+2.4,1.8);
// stairs (visible from both floors)
const Fu=G.furn;floorRect(Fu,-9,-7.25,-5,-.1,.002,M.floorWood);for(let i=0;i<14;i++){const top=(i+1)*3/14;rb(Fu,1.2,top,.3,.01,M.woodDark,-7.9,top/2,-(i+.5)*.3);bx(Fu,1.2,.025,.32,M.woodLight,-7.9,top+.012,-(i+.5)*.3,false)}
tube(Fu,[[-7.27,.95,.1],[-7.27,3.95,-4.3]],.025,M.woodLight);for(let i=0;i<4;i++){const z=-.4-i*1.1;cy(Fu,.012,.12,M.chrome,-7.22,.9+(-z/4.2)*3,z,false).rotation.z=Math.PI/2}
}

function updateBowlStack(){if(!G3.stack)return;while(G3.stack.children.length)G3.stack.remove(G3.stack.children[0]);const n=Math.min(SV.bowls,14);for(let i=0;i<n;i++){const d=new THREE.Mesh(gBowl,M.bowlOut);d.scale.setScalar(.9);d.position.set((i%2)*.2-.1,Math.floor(i/2)*.05,0);d.castShadow=true;G3.stack.add(d)}}
