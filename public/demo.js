/* Browser-local demo transport. The repository's Node server remains the real backend. */
window.SITEPROOF_DEMO = true;
const storageKey = 'siteproof-operations-demo-v2';
const day = offset => {const d=new Date();d.setUTCDate(d.getUTCDate()+offset);return d.toISOString().slice(0,10);};
const token = () => Array.from(crypto.getRandomValues(new Uint8Array(24)),n=>n.toString(16).padStart(2,'0')).join('');
const now = () => new Date().toISOString().replace('T',' ').slice(0,19);
const members = [
  {id:1,name:'Sandesh Joshi',email:'admin@siteproof.ae',role:'admin'},
  {id:2,name:'Ahmed Hassan',email:'tech@siteproof.ae',role:'technician'},
  {id:3,name:'Rohan Thapa',email:'rohan@example.com',role:'technician'},
  {id:4,name:'Fatima Ali',email:'fatima@example.com',role:'technician'},
  {id:5,name:'Arjun Sharma',email:'arjun@example.com',role:'technician'}
];
const sampleJobs = [
  ['CCTV system installation','Marina Heights','Dubai Marina','Dubai','CCTV & security',4850,'In progress',0,2,'Install 8 IP cameras with NVR recording, configure remote access and verify coverage of all agreed common areas. Hand over device credentials through the client’s secure channel.'],
  ['Office network commissioning','Al Noor Properties','Al Reem Island','Abu Dhabi','IT & networking',7200,'Awaiting approval',0,3,'Commission the office network: patch panel termination, VLAN configuration, access point testing and labelled port handover. Confirm wired and wireless connectivity at each designated workstation.'],
  ['Quarterly AC maintenance','Palm Residence','Jumeirah Village Circle','Dubai','AC maintenance',1350,'Scheduled',1,4,'Inspect and service 4 AC units. Clean filters, check drainage and document the condition of each unit before and after servicing.'],
  ['Access control installation','Horizon Business Centre','Business Bay','Dubai','CCTV & security',3600,'Completed',-2,2,'Install access readers at two entrances, configure authorised access schedules, test emergency egress and provide an operator handover.'],
  ['Wireless coverage survey','Emirates Creative Studio','Khalifa City','Abu Dhabi','IT & networking',1850,'Scheduled',2,3,'Survey the current wireless coverage, identify weak zones and provide a documented access point placement recommendation.'],
  ['Server cabinet remediation','Creekside Offices','Deira','Dubai','IT & networking',950,'Issue reported',-1,5,'Reorganise patch leads, verify power distribution and label equipment. Client reported an intermittent port connection after the original visit; investigate and document the resolution.'],
  ['Lobby security camera upgrade','Vista Tower Management','Downtown Dubai','Dubai','CCTV & security',6400,'In progress',0,5,'Replace legacy lobby cameras with IP cameras. Retain coverage during the changeover and verify night-mode recording and retention settings.'],
  ['Meeting room AV setup','Northstar Consulting','Al Maryah Island','Abu Dhabi','IT & networking',4200,'Awaiting approval',-1,4,'Install and commission the meeting room display and conferencing hardware. Verify audio, video and screen sharing with the client’s existing software.'],
  ['Structured cabling — floor 02','Atlas Commercial','DIFC','Dubai','IT & networking',12800,'Scheduled',3,3,'Install and label 48 data points on floor 02. Test cable runs and provide a port schedule and completion record.'],
  ['Electrical safety inspection','Seaview Hospitality','Corniche','Abu Dhabi','Electrical',2400,'Completed',-3,4,'Inspect agreed distribution boards and accessible outlets, record observations and submit the completed inspection checklist.'],
  ['Warehouse network extension','Gulf Logistics','Mussafah','Abu Dhabi','IT & networking',5600,'In progress',1,5,'Extend the warehouse network to the dispatch area. Install protected cable runs, configure the switch and test handheld-device connectivity.'],
  ['Retail CCTV preventive service','Central Retail Group','Al Barsha','Dubai','CCTV & security',1750,'Scheduled',4,2,'Check 12 cameras, clean accessible lenses, verify recording retention and document any equipment requiring replacement.' ]
];
function seed() {return {team:members,jobs:sampleJobs.map(([title,client,location,city,category,amount,status,offset,technician,scope],i)=>{
 const complete=['Completed','Awaiting approval'].includes(status),active=status==='In progress',issue=status==='Issue reported';
 const tasks=['Site inspection & safety check','Complete agreed scope of work','Test system functionality','Capture completion evidence'].map((label,n)=>({id:n+1,label,done:complete||issue||active&&n<(i%2+1)?1:0}));
 const evidence=[];if(complete||issue||active)evidence.push({id:1,kind:'Before',note:'Sample site record: existing equipment and work area checked before the planned installation. This is illustrative demonstration data.',image:'',created:day(offset)+' 05:20:00'});
 if(complete||issue)evidence.push({id:2,kind:'Inspection',note:'Sample inspection record: installation checks completed, the agreed components tested and the work area reviewed. Illustrative data for this portfolio demo.',image:'',created:day(offset)+' 10:35:00'});
 const approvals=status==='Completed'?[{name:'Demo client representative',decision:'approve',comment:'Sample sign-off: agreed work reviewed and accepted.',created:day(offset)+' 12:30:00'}]:issue?[{name:'Demo client representative',decision:'issue',comment:'Intermittent connection reported at port 07. Please revisit and verify the cable termination. Illustrative client issue.',created:day(offset)+' 13:10:00'}]:[];
 const variations=i===1?[{id:1,description:'Additional shielded patch leads requested during commissioning',amount:450,status:'Pending'}]:i===3?[{id:1,description:'Additional exit button at secondary entrance',amount:250,status:'Approved'}]:[];
 const activity=[{actor:'System',message:'Illustrative work order created',created:day(offset)+' 04:00:00'}];if(active||complete||issue)activity.unshift({actor:members.find(m=>m.id===technician).name,message:'Site inspection recorded',created:day(offset)+' 05:20:00'});if(complete||issue)activity.unshift({actor:members.find(m=>m.id===technician).name,message:'Work submitted for client review',created:day(offset)+' 10:40:00'});if(approvals.length)activity.unshift({actor:approvals[0].name,message:status==='Completed'?'Client approved handover':'Client reported an issue',created:approvals[0].created});
 return {id:i+1,title,client,email:'',phone:'',location,city,category,amount,status,date:day(offset),technician,technician_name:members.find(m=>m.id===technician).name,scope,token:token(),created:day(offset)+' 04:00:00',tasks,evidence,approvals,variations,activity};})};}
let data;try{data=JSON.parse(localStorage.getItem(storageKey));}catch{}if(!data)data=seed();
const save = () => {try{localStorage.setItem(storageKey,JSON.stringify(data));}catch{throw Error('Browser storage is full. Choose a smaller image or reset the demo.');}};
const log = (job,message,actor) => job.activity.unshift({actor:actor||currentUser().name,message,created:now()});
const currentUser = () => data.team.find(m=>m.id===+(sessionStorage.getItem('sp-demo-user')||1))||data.team[0];
const requireAdmin = () => {if(currentUser().role!=='admin')throw Error('Administrator access required.');};
const findJob = id => {const job=data.jobs.find(j=>j.id===+id);if(!job)throw Error('Work order not found.');if(currentUser().role!=='admin'&&job.technician!==currentUser().id)throw Error('Access denied.');return job;};
const fetchOriginal=window.fetch.bind(window);
window.fetch=async function(input,options={}) {
 const url=String(input);if(!url.startsWith('/api'))return fetchOriginal(input,options);
 const path=url.slice(4);let body=options.body?JSON.parse(options.body):null,result,status=200;
 try {
  if(path==='/me')result=currentUser();
  else if(path==='/login'){const member=data.team.find(m=>m.email===body.email);if(!member)throw Error('Use a demo account listed in the interface.');sessionStorage.setItem('sp-demo-user',String(member.id));result=member;}
  else if(path==='/logout'){sessionStorage.removeItem('sp-demo-user');result={ok:true};}
  else if(path==='/team'){if(body){requireAdmin();if(data.team.some(m=>m.email===body.email))throw Error('Email already exists.');const {password,...member}=body;data.team.push({...member,id:Date.now()});save();result={ok:true};}else result=data.team;}
  else if(path==='/jobs'){
   if(body){requireAdmin();const job={...body,id:Math.max(0,...data.jobs.map(j=>j.id))+1,amount:+body.amount,technician:+body.technician,technician_name:data.team.find(m=>m.id===+body.technician)?.name,status:'Scheduled',token:token(),created:now(),tasks:['Site inspection & safety check','Complete agreed scope of work','Test system functionality','Capture completion evidence'].map((label,i)=>({id:i+1,label,done:0})),evidence:[],variations:[],approvals:[],activity:[]};log(job,'Work order created');data.jobs.unshift(job);save();result=job;}
   else result=data.jobs.filter(j=>currentUser().role==='admin'||j.technician===currentUser().id).map(j=>({...j,evidence_count:j.evidence.length}));
  }
  else if(path.startsWith('/jobs/')){
   const [,,id,action]=path.split('/'),job=findJob(id);
   if(body){
    if(action==='status'){if(!['Scheduled','In progress','Awaiting approval'].includes(body.status))throw Error('Use the client portal to record completion.');if(body.status==='Awaiting approval'&&(job.tasks.some(t=>!t.done)||!job.evidence.length))throw Error('Complete all checklist items and add site evidence first.');job.status=body.status;log(job,'Status changed to '+body.status);}
    else if(action==='task'){if(['Completed','Awaiting approval'].includes(job.status))throw Error('Reopen the work order before editing.');const task=job.tasks.find(t=>t.id===+body.id);if(!task)throw Error('Checklist item not found.');task.done=body.done?1:0;}
    else if(action==='evidence'){if(['Completed','Awaiting approval'].includes(job.status))throw Error('Reopen the work order before editing.');if(!body.note?.trim())throw Error('Add a site note.');job.evidence.unshift({...body,id:Date.now(),created:now()});log(job,'Added '+body.kind.toLowerCase()+' evidence');}
    else if(action==='variation'){requireAdmin();if(['Completed','Awaiting approval'].includes(job.status))throw Error('Reopen the work order before adding changes.');if(!body.description?.trim()||+body.amount<=0)throw Error('Provide a description and positive scope value.');job.variations.push({...body,amount:+body.amount,id:Date.now(),status:'Pending'});log(job,'Scope change requested');}
    else if(action==='share'){requireAdmin();job.token=token();log(job,'Client portal link rotated');}
    save();
   }
   result=job;
  }
  else if(path.startsWith('/public/')){
   const [,,jobToken,action]=path.split('/');const job=data.jobs.find(j=>j.token===jobToken);if(!job)throw Error('This demo link is unavailable. Open it in the same browser as the workspace.');
   if(body){if(!body.name?.trim())throw Error('Enter your full name.');if(action==='decision'){if(job.status!=='Awaiting approval')throw Error('This work order is not awaiting approval.');if(!['approve','issue'].includes(body.decision))throw Error('Choose a valid decision.');if(body.decision==='approve'&&job.variations.some(v=>v.status==='Pending'))throw Error('Decide pending scope changes before approving completion.');job.status=body.decision==='approve'?'Completed':'Issue reported';job.approvals.push({...body,created:now()});log(job,body.decision==='approve'?'Client approved handover':'Client reported an issue',body.name);}
   else if(action==='variation'){const variation=job.variations.find(v=>v.id===+body.id);if(!variation||variation.status!=='Pending')throw Error('Change request is no longer pending.');if(!['Approved','Declined'].includes(body.status))throw Error('Invalid decision.');variation.status=body.status;log(job,'Scope change '+body.status.toLowerCase(),body.name);}save();}
   result=job;
  }
  else {status=404;result={error:'Route not found.'};}
 }catch(error){status=400;result={error:error.message};}
 return new Response(JSON.stringify(result),{status,headers:{'Content-Type':'application/json'}});
};
save();
const notice=document.createElement('div');notice.className='demo-banner';notice.innerHTML='<b>INTERACTIVE DEMO</b><span>Sample records · Browser-only changes</span><a href="https://github.com/sandesh1664/SiteProof-UAE" target="_blank" rel="noreferrer">Source code ↗</a><select class="demo-role" aria-label="Demo role"><option value="1">Admin view</option><option value="2">Technician view</option></select><button id="reset-demo">Reset</button>';document.body.prepend(notice);
notice.querySelector('.demo-role').value=String(currentUser().id===1?1:2);notice.querySelector('.demo-role').onchange=event=>{sessionStorage.setItem('sp-demo-user',event.target.value);location.href='/';};
notice.querySelector('#reset-demo').onclick=()=>{localStorage.removeItem(storageKey);sessionStorage.removeItem('sp-demo-user');location.href='/';};
const resizeNotice=()=>document.documentElement.style.setProperty('--demo-height',notice.offsetHeight+'px');new ResizeObserver(resizeNotice).observe(notice);resizeNotice();
