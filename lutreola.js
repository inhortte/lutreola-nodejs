db.collection.insert({_id:3,name:"Mink One",en:"Many minks!",ee:""})
db.collection.insert({_id:4,name:"mink three",en:"More minks!",ee:""})
db.collection.insert({_id:5,name:"mink seven",en:"A few of the more popular minks.",ee:""})

db.collection_photo.insert({_id:1,photo_id:10,collection_id:3})
db.collection_photo.insert({_id:1,photo_id:11,collection_id:3})
db.collection_photo.insert({_id:1,photo_id:12,collection_id:5})
db.collection_photo.insert({_id:1,photo_id:13,collection_id:5})
db.collection_photo.insert({_id:1,photo_id:14,collection_id:4})
db.collection_photo.insert({_id:1,photo_id:15,collection_id:4})

db.entry.insert({_id:2,title:"Intro Page",type:"Page",role:null,url:"",en:"### English Section\r\n\r\nWelcome to the English pages.",ee:"Tervist!",main_menu:4})
db.entry.insert({_id:3,title:"Who We Are",type:"Page",role:null,url:"",en:"### Who we are\r\n                  \r\n                  Overview of employees/volunteers.",ee:"Yus!",main_menu:9})
db.entry.insert({_id:4,title:"gallery",type:"Link",role:null,url:"/gallery",en:"",ee:"",main_menu:4})
db.entry.insert({_id:5,title:"Sissejuhatav Leht",type:"Page",role:null,url:"",en:"### Mission",ee:"Minu naarits on must.",main_menu:7})
db.entry.insert({_id:6,title:"Projektid",type:"Page",role:null,url:"",en:"Projects",ee:"Projektid",main_menu:6})
db.entry.insert({_id:7,title:"Meedia Kajastused",type:"Page",role:null,url:"",en:"Media",ee:"Media",main_menu:6})
db.entry.insert({_id:8,title:"home",type:"Page",role:null,url:"",en:"This is Foundation Lutreola!",ee:"Yup.",main_menu:3})
db.entry.insert({_id:9,title:"partners",type:"Page",role:null,url:"",en:"### Partners\r\n\r\nOur partners...",ee:"\r\n",main_menu:4})
db.entry.insert({_id:10,title:"conservation",type:"Page",role:null,url:"",en:"### Conservation of the European Mink\r\n                  \r\nOverview.",ee:"",main_menu:8})
db.entry.insert({_id:11,title:"tiit maran",type:"Page",role:null,url:"",en:"### Tiit Maran",ee:"",main_menu:9})
db.entry.insert({_id:12,title:"madis põdra",type:"Page",role:null,url:"",en:"### Madis Põdra",ee:"",main_menu:9})
db.entry.insert({_id:13,title:"selve pitsal",type:"Page",role:null,url:"",en:"### Selve Pitsal",ee:"",main_menu:9})
db.entry.insert({_id:14,title:"riina lillemäe",type:"Page",role:null,url:"",en:"### Riina Lillemäe",ee:"",main_menu:9})
db.entry.insert({_id:15,title:"gennadi kotsur",type:"Page",role:null,url:"",en:"### Gennadi Kotsur",ee:"",main_menu:9})
db.entry.insert({_id:16,title:"ex situ",type:"Page",role:null,url:"",en:"### Ex situ",ee:"",main_menu:8})
db.entry.insert({_id:17,title:"emink elsewhere",type:"Page",role:null,url:"",en:"### The European Mink on Other Websites\r\n",ee:"",main_menu:8})
db.entry.insert({_id:18,title:"emink status",type:"Page",role:null,url:"",en:"### Status of the European Mink",ee:"",main_menu:8})
db.entry.insert({_id:19,title:"in situ",type:"Page",role:null,url:"",en:"### In Situ",ee:"",main_menu:8})
db.entry.insert({_id:20,title:"research topics",type:"Page",role:null,url:"",en:"### Research Topics",ee:"",main_menu:4})
db.entry.insert({_id:21,title:"supporters",type:"Page",role:null,url:"",en:"### Supporters",ee:"",main_menu:4})
db.entry.insert({_id:22,title:"webcams",type:"Page",role:null,url:"",en:"### Webcams",ee:"",main_menu:4})
db.entry.insert({_id:23,title:"news",type:"Link",role:null,url:"/news",en:"",ee:"",main_menu:3})
db.entry.insert({_id:24,title:"old site",type:"Link",role:null,url:"http://www.lutreola.ee/",en:"",ee:"",main_menu:3})
db.entry.insert({_id:25,title:"estionian",type:"Page",role:null,url:"",en:"### Estonian site",ee:"",main_menu:6})
db.entry.insert({_id:26,title:"goals",type:"Page",role:null,url:"",en:"### Goals",ee:"",main_menu:7})
db.entry.insert({_id:27,title:"history",type:"Page",role:null,url:"",en:"### History (estonian)",ee:"",main_menu:7})

db.entry_menu.insert({ordr:2,menu_id:3,entry_id:2,title:"english"})
db.entry_menu.insert({ordr:4,menu_id:3,entry_id:4,title:"gallery"})
db.entry_menu.insert({ordr:1,menu_id:3,entry_id:8,title:"Home"})
db.entry_menu.insert({ordr:5,menu_id:3,entry_id:23,title:"news"})
db.entry_menu.insert({ordr:6,menu_id:3,entry_id:24,title:"old site"})
db.entry_menu.insert({ordr:1,menu_id:3,entry_id:25,title:"estonian"})
db.entry_menu.insert({ordr:1,menu_id:4,entry_id:2,title:"intro"})
db.entry_menu.insert({ordr:1,menu_id:4,entry_id:3,title:"who we are"})
db.entry_menu.insert({ordr:1,menu_id:4,entry_id:9,title:"partners"})
db.entry_menu.insert({ordr:1,menu_id:4,entry_id:10,title:"conservation"})
db.entry_menu.insert({ordr:1,menu_id:4,entry_id:20,title:"research topics"})
db.entry_menu.insert({ordr:1,menu_id:4,entry_id:21,title:"supporters"})
db.entry_menu.insert({ordr:1,menu_id:4,entry_id:22,title:"webcams"})
db.entry_menu.insert({ordr:1,menu_id:6,entry_id:5,title:"Sissejuhatav Leht"})
db.entry_menu.insert({ordr:3,menu_id:6,entry_id:6,title:"projektid"})
db.entry_menu.insert({ordr:4,menu_id:6,entry_id:7,title:"Meedia Kajastused"})
db.entry_menu.insert({ordr:1,menu_id:6,entry_id:25,title:"intro"})
db.entry_menu.insert({ordr:1,menu_id:7,entry_id:5,title:"mission"})
db.entry_menu.insert({ordr:1,menu_id:7,entry_id:26,title:"goals"})
db.entry_menu.insert({ordr:1,menu_id:7,entry_id:27,title:"history"})
db.entry_menu.insert({ordr:1,menu_id:8,entry_id:10,title:"conservation"})
db.entry_menu.insert({ordr:1,menu_id:8,entry_id:16,title:"ex situ"})
db.entry_menu.insert({ordr:1,menu_id:8,entry_id:17,title:"emink elsewhere"})
db.entry_menu.insert({ordr:1,menu_id:8,entry_id:18,title:"emink status"})
db.entry_menu.insert({ordr:1,menu_id:8,entry_id:19,title:"in situ"})
db.entry_menu.insert({ordr:1,menu_id:9,entry_id:3,title:"who we are"})
db.entry_menu.insert({ordr:2,menu_id:9,entry_id:11,title:"tiit maran"})
db.entry_menu.insert({ordr:3,menu_id:9,entry_id:12,title:"madis põdra"})
db.entry_menu.insert({ordr:1,menu_id:9,entry_id:13,title:"selve pitsal"})
db.entry_menu.insert({ordr:1,menu_id:9,entry_id:14,title:"riina lillemäe"})
db.entry_menu.insert({ordr:1,menu_id:9,entry_id:15,title:"gennadi kotsur"})

db.member.insert({_id:5,username:"lemur",email:"lemur@lemur.net",encrypted_password:"9439232acc08d139df3d0cf36a6a1126e94d8e7ce51d574eb025e12ccb75ee36",salt:"9804aefaaf1ad0b0d66c520453f10942d78f98053a4db9f8a7818bb8654c6aa2",type:"Member",auth_token:"kQ91LmgTPUjQefoJ7lg",active:0,last_action:null,created_at:"2012-06-11 02:37:21"})
db.member.insert({_id:6,username:"inhortte",email:"inhortte@gmail.com",encrypted_password:"a930800a5202ad31c49aacddccf1c6213316a809a6276c26b1f2d3abe9315ca8",salt:"f20a997fd324202990abeb58126fe7e394e88e4017def883486b9faac7350507",type:"Admin",auth_token:"uvazmYCcoJmggr9Xbhc",active:0,last_action:null,created_at:"2012-06-11 17:54:08"})
db.member.insert({_id:7,username:"tiit",email:"maran.tiit@gmail.com",encrypted_password:"fd8ba4ea0f881c8736a94294d9391e272da5ecb1c16ec196903d913290302d7a",salt:"8aa28f12f222f5db310d41d0622993eaee012c8123893351ec2d98f078fc8b56",type:"Admin",auth_token:"5cZhOOuriaGFHoArNu2",active:1,last_action:null,created_at:"2012-07-24 14:35:52"});

db.menu.insert({_id:3,name:"home",default_page_id:8,parent_id:null})
db.menu.insert({_id:4,name:"english",default_page_id:2,parent_id:3})
db.menu.insert({_id:6,name:"estonian",default_page_id:25,parent_id:3})
db.menu.insert({_id:7,name:"Sissejuhatav Leht",default_page_id:5,parent_id:6})
db.menu.insert({_id:8,name:"conservation",default_page_id:10,parent_id:4})
db.menu.insert({_id:9,name:"who we are",default_page_id:11,parent_id:4})

db.photo.insert({_id:10,name:"honza",ee:"",en:"A mink in a cage! Imagine that.",taken:null,image:"04.jpg",photographer_id:1})
db.photo.insert({_id:11,name:"travelling",ee:"",en:"This mink is hanging.",taken:null,image:"21.jpg",photographer_id:1})
db.photo.insert({_id:12,name:"freedom",ee:"",en:"A mink contemplating the great outdoors.",taken:null,image:"29.jpg",photographer_id:1})
db.photo.insert({_id:13,name:"curious",ee:"",en:"Here we go....",taken:null,image:"38.jpg",photographer_id:1})
db.photo.insert({_id:14,name:"collared",ee:"",en:"He likes this.",taken:null,image:"22.jpg",photographer_id:1})
db.photo.insert({_id:15,name:"swimming",ee:"",en:"naarits ujub.",taken:null,image:"28.jpg",photographer_id:1})

db.photographer.insert({_id:1,name:"Mr Lutreola",en:"I photograph minks!",member_id:null,ee:null})
