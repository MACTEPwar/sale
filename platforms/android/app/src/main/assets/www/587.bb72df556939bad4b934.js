"use strict";(self.webpackChunksale=self.webpackChunksale||[]).push([[587],{6587:function(g,c,i){i.r(c),i.d(c,{ServiceModule:function(){return y}});var f=i(1116),l=i(2132),e=i(4107),u=i(2693),d=function(){function t(n){this.httpClient=n}return t.prototype.doCashIn=function(n){return this.waitTime(2e3)},t.prototype.doCashOut=function(n){return this.waitTime(2e3)},t.prototype.doZReport=function(){return this.waitTime(2e3)},t.prototype.waitTime=function(n){return(0,l.H)(n)},t.\u0275fac=function(o){return new(o||t)(e.LFG(u.eN))},t.\u0275prov=e.Yz7({token:t,factory:t.\u0275fac}),t}(),r=i(529),s=function(){function t(n){this.httpClient=n}return t.prototype.doCashIn=function(n){return this.httpClient.get(r.N.apiUrl+"/api/service/doCashIn/"+n)},t.prototype.doCashOut=function(n){return this.httpClient.get(r.N.apiUrl+"/api/service/doCashIn/"+n)},t.prototype.doZReport=function(){return this.httpClient.get(r.N.apiUrl+"/api/service/doZReport")},t.\u0275fac=function(o){return new(o||t)(e.LFG(u.eN))},t.\u0275prov=e.Yz7({token:t,factory:t.\u0275fac}),t}(),h=i(2290),a=i(6726),m=function(){function t(n,o){this.serviceService=n,this.messageService=o}return t.prototype.ngOnInit=function(){},t.prototype.doCashIn=function(){var n=this,o=prompt("\u0412\u0432\u0435\u0434i\u0442\u044c \u0441\u0443\u043c\u0443");null!==o&&this.serviceService.doCashIn(+o).subscribe(function(p){n.messageService.add({severity:"info",summary:"I\u043d\u0444\u043e",detail:"\u0412\u0438\u043a\u043e\u043d\u0430\u043d\u043e \u0432\u043d\u0435\u0441\u0435\u043d\u043d\u044f"})})},t.\u0275fac=function(o){return new(o||t)(e.Y36(s),e.Y36(h.ez))},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-service"]],features:[e._Bn([{provide:s,useClass:d}])],decls:7,vars:0,consts:[[1,"p-d-flex"],[1,"p-col"],["label","\u0412\u043d\u043e\u0441",3,"onClick"],["label","\u0412\u044b\u043d\u043e\u0441"],["label","z-\u043e\u0442\u0447\u0435\u0442"]],template:function(o,p){1&o&&(e.TgZ(0,"div",0),e.TgZ(1,"div",1),e.TgZ(2,"p-button",2),e.NdJ("onClick",function(){return p.doCashIn()}),e.qZA(),e.qZA(),e.TgZ(3,"div",1),e._UZ(4,"p-button",3),e.qZA(),e.TgZ(5,"div",1),e._UZ(6,"p-button",4),e.qZA(),e.qZA())},directives:[a.zx],styles:[""]}),t}(),v=i(1269),S=[{path:"",component:m}],C=function(){function t(){}return t.\u0275fac=function(o){return new(o||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[[v.Bz.forChild(S)],v.Bz]}),t}(),y=function(){function t(){}return t.\u0275fac=function(o){return new(o||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[[f.ez,C,a.hJ]]}),t}()}}]);