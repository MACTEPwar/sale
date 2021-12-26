"use strict";(self.webpackChunksale=self.webpackChunksale||[]).push([[201],{8201:function(C,p,r){r.r(p),r.d(p,{ReportModule:function(){return Z}});var s=r(1116),t=r(4107),i=r(1269),l=function(){function e(){}return e.prototype.ngOnInit=function(){},e.\u0275fac=function(o){return new(o||e)},e.\u0275cmp=t.Xpm({type:e,selectors:[["app-report"]],decls:1,vars:0,template:function(o,a){1&o&&t._UZ(0,"router-outlet")},directives:[i.lC],styles:[""]}),e}(),h=r(2693),u=function(){function e(n){this.http=n,this.status=["OUTOFSTOCK","INSTOCK","LOWSTOCK"],this.productNames=["Bamboo Watch","Black Watch","Blue Band","Blue T-Shirt","Bracelet","Brown Purse","Chakra Bracelet","Galaxy Earrings","Game Controller","Gaming Set","Gold Phone Case","Green Earbuds","Green T-Shirt","Grey T-Shirt","Headphones","Light Green T-Shirt","Lime Band","Mini Speakers","Painted Phone Case","Pink Band","Pink Purse","Purple Band","Purple Gemstone Necklace","Purple T-Shirt","Shoes","Sneakers","Teal T-Shirt","Yellow Earbuds","Yoga Mat","Yoga Set"]}return e.prototype.getProductsSmall=function(){return this.http.get("assets/receipts.json").toPromise().then(function(n){return n.data}).then(function(n){return n})},e.prototype.getProducts=function(){return this.http.get("assets/products.json").toPromise().then(function(n){return n.data}).then(function(n){return n})},e.prototype.getProductsWithOrdersSmall=function(){return this.http.get("assets/products-orders-small.json").toPromise().then(function(n){return n.data}).then(function(n){return n})},e.prototype.generatePrduct=function(){var n={id:this.generateId(),name:this.generateName(),description:"Product Description",price:this.generatePrice(),quantity:this.generateQuantity(),category:"Product Category",inventoryStatus:this.generateStatus(),rating:this.generateRating()};return n.image=n.name.toLocaleLowerCase().split(/[ ,]+/).join("-")+".jpg",n},e.prototype.generateId=function(){for(var n="",o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",a=0;a<5;a++)n+=o.charAt(Math.floor(Math.random()*o.length));return n},e.prototype.generateName=function(){return this.productNames[Math.floor(Math.random()*Math.floor(30))]},e.prototype.generatePrice=function(){return Math.floor(Math.random()*Math.floor(299)+1)},e.prototype.generateQuantity=function(){return Math.floor(Math.random()*Math.floor(75)+1)},e.prototype.generateStatus=function(){return this.status[Math.floor(Math.random()*Math.floor(3))]},e.prototype.generateRating=function(){return Math.floor(Math.random()*Math.floor(5)+1)},e.\u0275fac=function(o){return new(o||e)(t.LFG(h.eN))},e.\u0275prov=t.Yz7({token:e,factory:e.\u0275fac}),e}(),c=r(1644),f=r(2290);function m(e,n){1&e&&(t.TgZ(0,"tr"),t.TgZ(1,"th"),t._uU(2,"Code"),t.qZA(),t.TgZ(3,"th"),t._uU(4,"Name"),t.qZA(),t.TgZ(5,"th"),t._uU(6,"Category"),t.qZA(),t.TgZ(7,"th"),t._uU(8,"Quantity"),t.qZA(),t.qZA())}function d(e,n){if(1&e&&(t.TgZ(0,"tr"),t.TgZ(1,"td"),t._uU(2),t.qZA(),t.TgZ(3,"td"),t._uU(4),t.qZA(),t.TgZ(5,"td"),t._uU(6),t.qZA(),t.TgZ(7,"td"),t._uU(8),t.qZA(),t.qZA()),2&e){var o=n.$implicit;t.xp6(2),t.Oqu(o.code),t.xp6(2),t.Oqu(o.name),t.xp6(2),t.Oqu(o.category),t.xp6(2),t.Oqu(o.quantity)}}var v=[{path:"",component:l,children:[{path:"receipts",component:function(){function e(n){this.receiptService=n,this.products=[]}return e.prototype.ngOnInit=function(){var n=this;this.receiptService.getProductsSmall().then(function(o){return n.products=o})},e.\u0275fac=function(o){return new(o||e)(t.Y36(u))},e.\u0275cmp=t.Xpm({type:e,selectors:[["app-receipts"]],features:[t._Bn([u])],decls:5,vars:1,consts:[[3,"value"],["pTemplate","header"],["pTemplate","body"]],template:function(o,a){1&o&&(t.TgZ(0,"h2"),t._uU(1,"\u0427\u0435\u043a\u0438:"),t.qZA(),t.TgZ(2,"p-table",0),t.YNc(3,m,9,0,"ng-template",1),t.YNc(4,d,9,4,"ng-template",2),t.qZA()),2&o&&(t.xp6(2),t.Q6J("value",a.products))},directives:[c.iA,f.jx],styles:[""]}),e}()},{path:"z-reports",component:function(){function e(){}return e.prototype.ngOnInit=function(){},e.\u0275fac=function(o){return new(o||e)},e.\u0275cmp=t.Xpm({type:e,selectors:[["app-z-reports"]],decls:2,vars:0,template:function(o,a){1&o&&(t.TgZ(0,"p"),t._uU(1,"z-reports works!"),t.qZA())},styles:[""]}),e}()}]}],T=function(){function e(){}return e.\u0275fac=function(o){return new(o||e)},e.\u0275mod=t.oAB({type:e}),e.\u0275inj=t.cJS({imports:[[i.Bz.forChild(v)],i.Bz]}),e}(),Z=function(){function e(){}return e.\u0275fac=function(o){return new(o||e)},e.\u0275mod=t.oAB({type:e}),e.\u0275inj=t.cJS({imports:[[s.ez,T,c.U$]]}),e}()}}]);