/* Shared mock data (demo only). Exposed as globals: customers, appointments, services, ... */
const pick=(a,i)=>a[i%a.length];
const names=["Priya Sharma","Rahul Verma","Ananya Iyer","Vikram Singh","Neha Kulkarni","Arjun Mehta","Sneha Patil","Rohan Deshmukh","Kavya Nair","Aditya Joshi","Pooja Reddy","Karan Malhotra","Isha Gupta","Siddharth Rao","Meera Bhatt","Amit Choudhary","Divya Menon","Nikhil Pandey","Riya Kapoor","Manish Jain"];
const statuses=["New","Active","VIP","Inactive","Lost"],sources=["Instagram","Walk-in","Referral","Google","Facebook","Website"];
const dt=(m,d)=>`2026-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const customers=names.map((n,i)=>({id:i+1,name:n,mobile:`98${(76543210+i*37911)%100000000}`.slice(0,10),email:n.toLowerCase().replace(' ','.')+'@example.in',
  dob:`199${i%10}-${String(i%12+1).padStart(2,'0')}-${String(i%27+1).padStart(2,'0')}`,gender:i%4===1||i%4===3&&i%3===0?'Male':'Female',
  anniversary:i%3===0?dt(i%12+1,i%27+1):'—',status:pick(statuses,i*2+i%3),source:pick(sources,i),lastVisit:dt(9-i%9||1,i%27+1)}));
const services=[["Swedish Massage",60,2200],["Deep Tissue Massage",60,2800],["Aromatherapy",75,3200],["Hair Spa",60,1800],["Signature Facial",60,2500],["Manicure",45,900],["Pedicure",50,1100],["Body Scrub & Wrap",90,3800],["Haircut & Styling",45,800],["Bridal Makeup",120,12000]]
  .map((s,i)=>({id:i+1,name:s[0],duration:s[1],price:s[2],category:i<3||i==7?'Spa':i==9?'Makeup':'Salon'}));
const packages=[["Relax & Rejuvenate",["Swedish Massage","Signature Facial"],4200],["Bridal Glow",["Bridal Makeup","Hair Spa","Manicure"],14500],["Couple's Retreat",["Aromatherapy x2"],5800],["Monthly Hair Care",["Hair Spa x3"],4500],["Mani-Pedi Duo",["Manicure","Pedicure"],1800]]
  .map((p,i)=>({id:i+1,name:p[0],includes:p[1],price:p[2],validityDays:i==3?90:60}));
const staff=[["Anjali Desai","Admin"],["Rajesh Khanna","Manager"],["Sunita Pillai","Receptionist"],["Deepak Yadav","Therapist"],["Lakshmi Narayan","Therapist"],["Farah Shaikh","Therapist"]]
  .map((s,i)=>({id:i+1,name:s[0],role:s[1],mobile:`97${(65432100+i*11111)%100000000}`.slice(0,10),status:i==5?'On leave':'Available',rating:(4.2+i%5/10).toFixed(1)}));
const appointments=Array.from({length:15},(_,i)=>({id:i+1,customer:pick(names,i*3),service:pick(services,i).name,staff:pick(staff.slice(3),i).name,date:dt(10,6+i%5),time:`${10+i%8}:${i%2?'30':'00'}`,status:pick(["Booked","Confirmed","Completed","Cancelled","No-show"],i)}));
const memberships=Array.from({length:10},(_,i)=>({id:i+1,customer:pick(names,i),plan:pick(["Silver","Gold","Platinum"],i),start:dt(i%9+1,5),expiry:dt(12,i+10),balance:1000*(i+2),status:i%5==4?'Expired':'Active'}));
const invoices=Array.from({length:10},(_,i)=>({id:`INV-${1001+i}`,customer:pick(names,i*2),amount:pick(services,i).price,gst:Math.round(pick(services,i).price*.18),mode:pick(["UPI","Card","Cash"],i),status:i%4==3?'Pending':'Paid',date:dt(10,i+1)}));
const products=[["Argan Hair Oil","L'Oréal"],["Lavender Massage Oil","Forest Essentials"],["Vitamin C Serum","Lakmé"],["Keratin Shampoo","Wella"],["Gel Nail Polish","OPI"],["Aloe Face Mask","Biotique"],["Body Scrub","Kama Ayurveda"],["Hair Colour Cream","Schwarzkopf"],["Wax Strips","Rica"],["Clay Mask","VLCC"],["Towels (pack)","Welspun"],["Sandalwood Oil","Khadi Natural"]]
  .map((p,i)=>({id:i+1,name:p[0],supplier:p[1],stock:[4,25,12,3,40,18,9,22,6,30,50,15][i],reorderLevel:10,expiry:dt(i%12+1,28).replace('2026',i<6?'2027':'2026')}));
const leads=Array.from({length:10},(_,i)=>({id:i+1,name:pick(names,i+10),mobile:`99${(88776655+i*13579)%100000000}`.slice(0,10),source:pick(sources,i),interest:pick(services,i+2).name,stage:pick(["New","Contacted","Interested","Converted","Lost"],i)}));
const followups=leads.map((l,i)=>({id:i+1,lead:l.name,dueDate:dt(10,7+i%6),mode:pick(["Call","WhatsApp","Visit"],i),note:"Share offer and confirm slot",done:i%4==0}));
const campaigns=[["Diwali Glow Offer","WhatsApp"],["Monsoon Hair Spa","SMS"],["Birthday Month Treat","Email"],["Refer & Earn","WhatsApp"],["Bridal Season Preview","Instagram"],["Win-back Lost Clients","SMS"]]
  .map((c,i)=>({id:i+1,name:c[0],channel:c[1],sent:300+i*220,conversions:20+i*13,status:i<2?'Running':i==5?'Draft':'Completed'}));
const feedback=Array.from({length:10},(_,i)=>({id:i+1,customer:pick(names,i*2),service:pick(services,i).name,rating:[5,4,5,3,5,4,2,5,4,5][i],comment:pick(["Very relaxing, loved it!","Great service, slightly delayed.","Therapist was excellent.","Waiting time was long.","Will visit again."],i),date:dt(10,i+1)}));
const kpis={todayAppointments:12,todayRevenue:48500,monthRevenue:742000,newCustomers:34,activeMemberships:8,lowStockItems:products.filter(p=>p.stock<=p.reorderLevel).length,avgRating:4.5,pendingFollowups:followups.filter(f=>!f.done).length};
const fmtINR=n=>'₹'+Number(n).toLocaleString('en-IN');

/* ---- Dashboard datasets ---- */
// KPI values + trend % per date range [value, trend%]
const dashRange={
  today:{appts:[12,8.2],revenue:[48500,5.4],newCust:[3,-12.5],repeat:[9,4.1]},
  week:{appts:[74,6.7],revenue:[312000,9.1],newCust:[14,3.2],repeat:[52,5.5]},
  month:{appts:[298,4.3],revenue:[742000,11.8],newCust:[34,-2.1],repeat:[212,7.9]}
};
const revenueTrend={labels:['May','Jun','Jul','Aug','Sep','Oct'],values:[512000,548000,601000,655000,698000,742000]};
const leadSourcePerformance={labels:['Google','Instagram','Facebook','WhatsApp','Referral','Walk-in','Website','Justdial','Ads'],values:[42,58,31,36,27,24,19,14,22]};
const topServices={labels:services.slice(0,7).map(s=>s.name),values:[96,64,41,88,102,77,59]};
const newVsRepeat={labels:revenueTrend.labels,newC:[28,31,26,35,30,34],repeat:[120,134,148,160,185,212]};

/* ---- Customer extras (spend, visits, preferences) + helpers shared by customers/profile pages ---- */
const therapists=staff.filter(s=>s.role==='Therapist').map(s=>s.name);
function enrichCustomer(c,i){
  const n=c.id||i+1;
  Object.assign(c,{
    spend:c.spend??(n*5300%48000+2500), visits:c.visits??(n*7%22+1), points:c.points??(n*130%2400),
    since:c.since??`202${n%3+3}-${String(n%12+1).padStart(2,'0')}-${String(n%27+1).padStart(2,'0')}`,
    address:c.address??`${n+11}, MG Road, Pune, Maharashtra`,
    prefService:c.prefService??services[n%10].name, prefTherapist:c.prefTherapist??therapists[n%3],
    prefTime:c.prefTime??['Morning','Afternoon','Evening'][n%3], prefProducts:c.prefProducts??[products[n%12].name,products[(n+4)%12].name]
  });
  return c;
}
customers.forEach(enrichCustomer);
// Customers added in the UI are kept in sessionStorage so the profile page can find them
try{JSON.parse(sessionStorage.getItem('crmExtraCustomers')||'[]').forEach(c=>customers.push(c))}catch(e){}
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const initialsOf=n=>n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
const avatarColor=n=>['bg-teal-600','bg-emerald-600','bg-sky-600','bg-violet-600','bg-amber-600','bg-rose-600'][[...n].reduce((a,c)=>a+c.charCodeAt(0),0)%6];
const fmtDate=d=>d&&d!=='—'?new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'—';

/* ---- Services & packages extras (categories, status, package items, sales) ---- */
const SERVICE_CATS=['Massage','Facial','Hair','Nails','Body Spa','Others'];
const addDaysISO=(s,n)=>{const[y,m,d]=s.split('-').map(Number),x=new Date(y,m-1,d+n);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`};
(function(){
  const cat={'Swedish Massage':'Massage','Deep Tissue Massage':'Massage','Aromatherapy':'Massage','Hair Spa':'Hair','Signature Facial':'Facial','Manicure':'Nails','Pedicure':'Nails','Body Scrub & Wrap':'Body Spa','Haircut & Styling':'Hair','Bridal Makeup':'Others'};
  const desc={Massage:'Relaxing hands-on therapy to ease muscle tension.',Facial:'Deep cleansing and nourishing skin treatment.',Hair:'Professional hair care and styling.',Nails:'Nail shaping, care and polish.','Body Spa':'Full-body exfoliation and hydration.',Others:'Special-occasion service.'};
  const use={Massage:'Massage oil ~15 ml, 2 towels',Facial:'Cleanser, serum and mask ~10 g each',Hair:'Shampoo ~20 ml, hair mask ~30 g','Nails':'Polish, cuticle oil, 1 file','Body Spa':'Body scrub ~50 g, wrap sheet',Others:'As per client requirement'};
  services.forEach((s,i)=>{s.category=cat[s.name]||'Others';s.active=i!==8;s.description=desc[s.category];s.consumption=use[s.category]});
  packages.forEach(p=>{
    p.items=p.includes.map(t=>{const m=t.match(/^(.*) x(\d+)$/);return{service:m?m[1]:t,qty:m?+m[2]:1}});
    const list=p.items.reduce((a,i)=>a+i.qty*(services.find(s=>s.name===i.service)?.price||0),0);
    p.sessions=p.items.reduce((a,i)=>a+i.qty,0); p.discount=list?Math.max(0,Math.round((1-p.price/list)*100)):0; p.status='Active';
  });
})();
const packageSales=Array.from({length:6},(_,i)=>{const p=packages[i%5],d=dt(i<4?10:9,i+1);return{id:i+1,customer:names[i*3%20],package:p.name,start:d,expiry:addDaysISO(d,p.validityDays),price:p.price,mode:['UPI','Card','Cash'][i%3],date:d}});

/* ---- Retail prices for products (used by billing) ---- */
[650,1200,899,750,450,350,799,550,399,299,1500,1350].forEach((p,i)=>{if(products[i])products[i].price=p});

/* ---- Membership extras (sessions + usage history) ----
   Rebuilds `memberships` in place with dates RELATIVE TO TODAY so the page always has
   active / expiring-soon / expired / completed examples. Status is computed on the page. */
(function(){
  const T=addDaysISO(new Date().toISOString().slice(0,10),0);
  // [package index, start offset (days from today), total sessions, used sessions]
  const spec=[[0,-30,8,3],[3,-84,6,4],[4,-68,4,2],[2,-20,6,1],[0,-56,8,5],[1,-55,3,3],[3,-45,6,5],[4,-90,4,1],[2,-10,6,0],[3,-20,6,2]];
  memberships.length=0;
  spec.forEach(([pi,off,total,used],i)=>{
    const p=packages[pi], start=addDaysISO(T,off), step=Math.max(1,Math.floor(-off/(used+1)));
    const svc=p.items.map(x=>x.service);
    memberships.push({id:i+1,customer:names[(i*2+1)%20],plan:p.name,package:p.name,start,expiry:addDaysISO(start,p.validityDays),
      total,used,price:p.price,balance:p.price,
      history:Array.from({length:used},(_,k)=>({date:addDaysISO(start,Math.min(-off,(k+1)*step)),service:svc[k%svc.length],therapist:therapists[(i+k)%therapists.length]}))});
  });
  kpis.activeMemberships=memberships.filter(m=>m.used<m.total&&m.expiry>=T).length;
})();