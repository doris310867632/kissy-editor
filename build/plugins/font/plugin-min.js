KISSY.Editor.add("font",function(g){var d=KISSY.Editor,j=KISSY,h=d.Style,o=d.TripleButton,v=j.Node,e=["8px","10px","12px","14px","18px","24px","36px","48px","60px","72px","84px","96px","108px"],r={},p="<select title='\u5927\u5c0f' style='width:110px;height:21px;'><option value=''>\u5927\u5c0f / \u6e05\u9664</option>",w={element:"span",styles:{"font-size":"#(size)"},overrides:[{element:"font",attributes:{size:null}}]},s=["\u5b8b\u4f53","\u9ed1\u4f53","\u96b6\u4e66","\u6977\u4f53_GB2312","\u5fae\u8f6f\u96c5\u9ed1",
"Georgia","Times New Roman","Impact","Courier New","Arial","Verdana","Tahoma"],t={},q="<select title='\u5b57\u4f53' ><option value=''>\u5b57\u4f53 / \u6e05\u9664</option>",x={element:"span",styles:{"font-family":"#(family)"},overrides:[{element:"font",attributes:{face:null}}]},f;for(f=0;f<e.length;f++){var l=e[f];r[l]=new h(w,{size:l});p+="<option value='"+l+"'>"+l+"</option>"}p+="</select>";for(f=0;f<s.length;f++){e=s[f];t[e]=new h(x,{family:e});q+="<option style='font-family:"+e+"'  value='"+e+
"'>"+e+"</option>"}q+="</select>";d.Font||function(){function k(a){k.superclass.constructor.call(this,a);this._init()}function m(a){m.superclass.constructor.call(this,a);this._init()}k.ATTRS={v:{value:""},html:{},styles:{},editor:{}};j.extend(k,j.Base,{_init:function(){var a=this.get("editor"),b=a.toolBarDiv,c=this.get("html");this.el=new v(c);b[0].appendChild(this.el[0]);this.el.on("change",this._change,this);a.on("selectionChange",this._selectionChange,this);this.on("afterVChange",this._vChange,
this)},_vChange:function(a){var b=this.get("editor"),c=a.newVal;a=a.preVal;var i=this.get("styles");b.focus();b.fire("save");if(c)i[c].apply(b.document);else{c=a;i[c].remove(b.document)}b.fire("save")},_change:function(){this.set("v",this.el.val())},_selectionChange:function(a){this.get("editor");var b=this.get("v");a=a.path.elements;for(var c=this.get("styles"),i=0,u;i<a.length;i++){u=a[i];for(var n in c)if(c[n].checkElementRemovable(u,true)){if(n!=b){this._set("v",n);this.el.val(n)}return}}if(b!=
""){this._set("v","");this.el.val("")}}});m.ATTRS={editor:{},text:{},contentCls:{},title:{},style:{}};j.extend(m,j.Base,{_init:function(){var a=this.get("editor"),b=this.get("text");this.get("style");var c=this.get("title");this.el=new o({text:b,title:c,contentCls:this.get("contentCls"),container:a.toolBarDiv});this.el.on("offClick",this._on,this);this.el.on("onClick",this._off,this);a.on("selectionChange",this._selectionChange,this)},_on:function(){var a=this.get("editor");this.get("text");var b=
this.get("style");this.get("title");b.apply(a.document);a.notifySelectionChange();a.focus()},_off:function(){var a=this.get("editor");this.get("text");var b=this.get("style");this.get("title");b.remove(a.document);a.notifySelectionChange();a.focus()},_selectionChange:function(a){this.get("editor");this.get("text");var b=this.get("style");this.get("title");b.checkActive(a.path)?this.el.set("state",o.ON):this.el.set("state",o.OFF)}});k.SingleFont=m;d.Font=k}();g.addPlugin(function(){new d.Font({editor:g,
styles:r,html:p});new d.Font({editor:g,styles:t,html:q});new d.Font.SingleFont({contentCls:"ke-toolbar-bold",title:"\u7c97\u4f53",editor:g,style:new h({element:"strong"})});new d.Font.SingleFont({contentCls:"ke-toolbar-italic",title:"\u659c\u4f53",editor:g,style:new h({element:"em"})});new d.Font.SingleFont({contentCls:"ke-toolbar-underline",title:"\u4e0b\u5212\u7ebf",editor:g,style:new h({element:"u"})});new d.Font.SingleFont({contentCls:"ke-toolbar-strikeThrough",title:"\u5220\u9664\u7ebf",editor:g,
style:new h({element:"del"})})})});
