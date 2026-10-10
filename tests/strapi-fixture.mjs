import http from "node:http";
const origin='http://localhost:3016';
let mode='normal';
const data=Array.from({length:14},(_,i)=>({documentId:`fixture-${i}`,slug:`test-fixture-${i}`,title:`Test fixture ${i}`,locale:'en',publishedAt:'2026-01-01T00:00:00Z',updatedAt:'2026-01-02T00:00:00Z',projectType:['Enterprise','Government','Personal'][i%3],featured:i<3,displayOrder:i,shortDescription:'Synthetic test data only. Never portfolio seed content.',description:[{type:'paragraph',children:[{type:'text',text:'Test overview content.'}]}],businessProblem:i===0?[{type:'paragraph',children:[{type:'text',text:'Test challenge.'}]}]:[],solution:[],myRole:i===0?'Test role':null,features:i===0?[{title:'Test feature',description:'Test feature content.',displayOrder:0}]:[],responsibilities:i===0?[{description:'Test responsibility.',displayOrder:0}]:[],technologies:[{documentId:'angular',name:'Angular',slug:'angular',displayOrder:0}],coverImage:i===0?{url:origin+'/tiny.png',alternativeText:'Test image fixture',width:1,height:1}:null,gallery:i===0?[{url:origin+'/tiny.png',alternativeText:'Test gallery fixture',width:1,height:1}]:[],seo:i===0?{metaTitle:'Test metadata title',metaDescription:'Test metadata description.'}:null,localizations:[{locale:'ar',slug:`test-fixture-${i}`,publishedAt:'2026-01-01'}]}));
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,origin);
 if(url.pathname==='/mode'&&req.method==='POST'){mode=url.searchParams.get('value')||'normal';res.end('ok');return;}
 if(url.pathname==='/tiny.png'){res.setHeader('Content-Type','image/png');res.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6G1sAAAAASUVORK5CYII=','base64'));return;}
 res.setHeader('Content-Type','application/json');
 if(url.pathname!='/api/projects'){res.writeHead(404);res.end('{}');return;}
 if(req.headers.authorization!=='Bearer fixture-read-token'){res.writeHead(403);res.end('{}');return;}
 if(url.searchParams.get('status')!=='published'){res.writeHead(400);res.end('{}');return;}
 if(mode==='outage'){res.writeHead(503);res.end('{}');return;}
 if(mode==='malformed'){res.end(JSON.stringify({data:'invalid'}));return;}
 const locale=url.searchParams.get('locale');
 let rows=mode==='empty'?[]:data.map(p=>locale==='ar'?{...p,locale:'ar',title:`مشروع اختبار ${p.displayOrder}`,shortDescription:'بيانات اختبار مصطنعة وليست محتوى للمحفظة.',localizations:[{locale:'en',slug:p.slug,publishedAt:'2026-01-01'}]}:p);
 const slug=url.searchParams.get('filters[slug][$eq]');if(slug)rows=rows.filter(p=>p.slug===slug);
 const type=url.searchParams.get('filters[projectType][$eq]');if(type)rows=rows.filter(p=>p.projectType===type);
 if(url.searchParams.get('filters[featured][$eq]')==='true')rows=rows.filter(p=>p.featured);
 const exclude=url.searchParams.get('filters[documentId][$ne]');if(exclude)rows=rows.filter(p=>p.documentId!==exclude);
 if(mode==='missing-translation'&&locale==='ar')rows=[];
 const page=Number(url.searchParams.get('pagination[page]')||1),pageSize=Number(url.searchParams.get('pagination[pageSize]')||12),total=rows.length;
 res.end(JSON.stringify({data:rows.slice((page-1)*pageSize,page*pageSize),meta:{pagination:{page,pageSize,pageCount:Math.ceil(total/pageSize),total}}}));
});
server.listen(3016,'127.0.0.1',()=>console.log('Test-only Strapi fixture server ready'));
