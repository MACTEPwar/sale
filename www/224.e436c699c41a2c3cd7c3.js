"use strict";(self.webpackChunksale=self.webpackChunksale||[]).push([[224],{3224:function(x,c,o){o.r(c),o.d(c,{SaleModule:function(){return U}});var p=o(1116),l=o(9892),d=o(1644),g=o(1269),s=o(9996),t=o(4107),v=o(8662),A=o(2290);function T(u,i){1&u&&(t.TgZ(0,"tr"),t.TgZ(1,"th"),t._uU(2,"\u041d\u0430\u0439\u043c\u0435\u043d\u0443\u0432\u0430\u043d\u043d\u044f"),t.qZA(),t.TgZ(3,"th"),t._uU(4,"\u041a\u043e\u0434"),t.qZA(),t.TgZ(5,"th"),t._uU(6,"\u0426i\u043d\u0430"),t.qZA(),t._UZ(7,"th"),t.qZA())}function m(u,i){if(1&u){var e=t.EpF();t.TgZ(0,"tr"),t.TgZ(1,"td"),t._uU(2),t.qZA(),t.TgZ(3,"td"),t._uU(4),t.qZA(),t.TgZ(5,"td"),t._uU(6),t.qZA(),t.TgZ(7,"td"),t.TgZ(8,"button",16),t.NdJ("click",function(){var r=t.CHM(e).$implicit;return t.oxw().addProductToReceipt(r)}),t._uU(9,"add"),t.qZA(),t.qZA(),t.qZA()}if(2&u){var n=i.$implicit;t.xp6(2),t.Oqu(n.name),t.xp6(2),t.Oqu(n.code),t.xp6(2),t.Oqu(n.price)}}function q(u,i){if(1&u){var e=t.EpF();t.TgZ(0,"div",9),t.TgZ(1,"div",2),t._uU(2),t.qZA(),t.TgZ(3,"div",2),t._uU(4),t.qZA(),t.TgZ(5,"div",2),t._uU(6),t.qZA(),t.TgZ(7,"div",2),t.TgZ(8,"button",16),t.NdJ("click",function(){var r=t.CHM(e).$implicit;return t.oxw().dropProductFromReceipt(r.id)}),t._uU(9," x "),t.qZA(),t.qZA(),t.qZA()}if(2&u){var n=i.$implicit;t.xp6(2),t.Oqu(n.name),t.xp6(2),t.Oqu(n.amount),t.xp6(2),t.hij(" ",n.price*n.amount," ")}}var h=[{path:"",component:function(){function u(i){this.saleService=i,this.test=[],this.productList=this.saleService.productList.pipe((0,s.U)(function(e){return null!=e?e:[]})),this.receiptProducts=this.saleService.receipt.products,this.totalSum=this.saleService.receipt.totalSum}return u.prototype.ngOnInit=function(){},u.prototype.addProductToReceipt=function(i){var e,n=null!==(e=prompt("\u0412\u0432\u0435\u0434i\u0442\u044c \u043ai\u043b\u044c\u043ai\u0441\u0442\u044c:"))&&void 0!==e?e:0;this.saleService.addProductToReceipt(i,+n)},u.prototype.dropProductFromReceipt=function(i){this.saleService.dropProductFromReceipt(i)},u.\u0275fac=function(e){return new(e||u)(t.Y36(v.F))},u.\u0275cmp=t.Xpm({type:u,selectors:[["app-sale"]],decls:50,vars:9,consts:[[1,"container"],[1,"p-grid","title","p-m-0"],[1,"p-col"],[1,"p-grid","sale","p-m-0"],[1,"p-grid","sale-search"],[1,"p-inputgroup"],["type","text","pInputText","","placeholder","\u041f\u043e\u0448\u0443\u043a \u043f\u043e \u043a\u0430\u0442\u0430\u043b\u043e\u0433\u0443 \u0442\u043e\u0432\u0430\u0440i\u0432"],[1,"p-inputgroup-addon"],[1,"pi","pi-search"],[1,"p-grid"],["responsiveLayout","scroll",3,"value"],["pTemplate","header"],["pTemplate","body"],[1,"p-grid","receipt"],["class","p-grid",4,"ngFor","ngForOf"],["type","email"],[3,"click"]],template:function(e,n){1&e&&(t.TgZ(0,"div",0),t.TgZ(1,"div",1),t.TgZ(2,"div",2),t.TgZ(3,"span"),t._uU(4,"\u041f\u0440\u043e\u0434\u0430\u0436 \u0442\u043e\u0432\u0430\u0440\u0443"),t.qZA(),t.qZA(),t.qZA(),t.TgZ(5,"div",3),t.TgZ(6,"div",2),t.TgZ(7,"div",4),t.TgZ(8,"div",2),t.TgZ(9,"div",5),t._UZ(10,"input",6),t.TgZ(11,"span",7),t._UZ(12,"i",8),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.TgZ(13,"div",9),t.TgZ(14,"div",2),t.TgZ(15,"p-table",10),t.ALo(16,"async"),t.YNc(17,T,8,0,"ng-template",11),t.YNc(18,m,10,3,"ng-template",12),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.TgZ(19,"div",2),t.TgZ(20,"div",13),t.TgZ(21,"div",2),t.TgZ(22,"div",9),t.TgZ(23,"div",2),t.TgZ(24,"span"),t._uU(25,"\u0427\u0435\u043a"),t.qZA(),t.qZA(),t.qZA(),t._UZ(26,"hr"),t.YNc(27,q,10,3,"div",14),t.ALo(28,"async"),t._UZ(29,"hr"),t.TgZ(30,"div",9),t.TgZ(31,"div",2),t.TgZ(32,"span"),t._uU(33),t.ALo(34,"async"),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.TgZ(35,"div",9),t.TgZ(36,"div",2),t.TgZ(37,"label"),t._uU(38,"\u0412i\u0434\u043f\u0440\u0430\u0432\u0438\u0442\u0438 \u043d\u0430 email"),t.qZA(),t._UZ(39,"input",15),t.qZA(),t.qZA(),t.TgZ(40,"div",9),t.TgZ(41,"div",2),t.TgZ(42,"button"),t._uU(43,"\u0413\u043e\u0442i\u0432\u043a\u0430"),t.qZA(),t.qZA(),t.TgZ(44,"div",2),t.TgZ(45,"button"),t._uU(46,"\u041a\u0430\u0440\u0442\u0430"),t.qZA(),t.qZA(),t.TgZ(47,"div",2),t.TgZ(48,"button"),t._uU(49,"I\u043d\u0448\u0435"),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.qZA()),2&e&&(t.xp6(15),t.Q6J("value",t.lcZ(16,3,n.productList)),t.xp6(12),t.Q6J("ngForOf",t.lcZ(28,5,n.receiptProducts)),t.xp6(6),t.hij("\u0421\u0443\u043c\u043c\u0430 \u0440\u0430\u0437\u043e\u043c: ",t.lcZ(34,7,n.totalSum),""))},directives:[l.o,d.iA,A.jx,p.sg],pipes:[p.Ov],styles:[".title[_ngcontent-%COMP%]{color:#555;font-size:20px}"]}),u}()}],S=function(){function u(){}return u.\u0275fac=function(e){return new(e||u)},u.\u0275mod=t.oAB({type:u}),u.\u0275inj=t.cJS({imports:[[g.Bz.forChild(h)],g.Bz]}),u}(),U=function(){function u(){}return u.\u0275fac=function(e){return new(e||u)},u.\u0275mod=t.oAB({type:u}),u.\u0275inj=t.cJS({imports:[[p.ez,S,l.j,d.U$]]}),u}()}}]);