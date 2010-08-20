/**
 * contextmenu for kissy editor
 * @author:yiminghe@gmail.com
 */
KISSY.Editor.add("contextmenu", function(editor) {
    var KE = KISSY.Editor,
        S = KISSY,
        Node = S.Node,
        //DOM = S.DOM,
        Event = S.Event;
    var HTML = "<div class='ke-contextmenu'></div>";


    function ContextMenu(config) {
        this.cfg = S.clone(config);
        KE.Utils.lazyRun(this, "_prepareShow", "_realShow");
    }

    var global_tags = [];
    /**
     * ��˵�����
     */
    ContextMenu.register = function(doc, cfg) {

        var cm = new ContextMenu(cfg);

        global_tags.push({
            doc:doc,
            tags:cfg.tags,
            instance:cm
        });

        if (!doc.ke_contextmenu) {
            doc.ke_contextmenu = 1;
            Event.on(doc, "mousedown", ContextMenu.hide);
            Event.on(doc, "contextmenu", function(ev) {
                ContextMenu.hide.call(this);
                var t = new Node(ev.target);
                while (t) {
                    var name = t._4e_name(),stop = false;
                    if (name == "body")break;
                    for (var i = 0; i < global_tags.length; i++) {
                        var tags = global_tags[i].tags,
                            instance = global_tags[i].instance,
                            doc2 = global_tags[i].doc;
                        if (doc === doc2 && S.inArray(name, tags)) {
                            ev.preventDefault();
                            stop = true;
                            instance.show(KE.Utils.getXY(ev.pageX, ev.pageY, doc, document));
                            break;
                        }
                    }
                    if (stop) break;
                    t = t.parent();
                }
            });
        }
        return cm;
    };
    ContextMenu.hide = function() {
        var doc = this;
        for (var i = 0; i < global_tags.length; i++) {
            var instance = global_tags[i].instance,doc2 = global_tags[i].doc;
            if (doc === doc2)
                instance.hide();
        }
    };

    var Overlay = KE.SimpleOverlay;
    S.augment(ContextMenu, {
        /**
         * �������ù����Ҽ��˵�����
         */
        _init:function() {
            var self = this,cfg = self.cfg,funcs = cfg.funcs;
            self.elDom = new Node(HTML);
            var el = self.elDom;
            el.css("width", cfg.width);
            document.body.appendChild(el[0]);
            //ʹ���߱� overlay ����������ʵ���ﲢ����ʵ�廯
            self.el = new Overlay({el:el});

            for (var f in funcs) {
                var a = new Node("<a href='#'>" + f + "</a>");
                el[0].appendChild(a[0]);
                (function(a, func) {
                    a.on("click", function(ev) {
                        func();
                        self.hide();
                        ev.halt();
                    });
                })(a, funcs[f]);
            }

        },

        hide : function() {
            this.el && this.el.hide();
        },
        _realShow:function(offset) {
            this.el.show(offset);
        },
        _prepareShow:function() {
            this._init();
        },
        show:function(offset) {
            this._prepareShow(offset);
        }
    });


    KE.ContextMenu = ContextMenu;
    console.log("contexmenu loaded!");
});