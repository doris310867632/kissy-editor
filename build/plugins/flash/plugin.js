KISSY.Editor.add("flash", function(editor) {
    var KE = KISSY.Editor,
        S = KISSY,
        Node = S.Node,
        TripleButton = KE.TripleButton,
        Overlay = KE.SimpleOverlay,
        flashFilenameRegex = /\.swf(?:$|\?)/i,
        dataProcessor = KE.HtmlDataProcessor,
        MUSIC_PLAYER = "niftyplayer.swf",
        CLS_FLASH = 'ke_flash',
        CLS_MUSIC = 'ke_music',
        TYPE_FLASH = 'flash',
        TYPE_MUSIC = 'music',
        //htmlFilter = dataProcessor && dataProcessor.htmlFilter,
        dataFilter = dataProcessor && dataProcessor.dataFilter;
    if (!KE.Flash) {

        (function() {

            function isFlashEmbed(element) {
                var attributes = element.attributes;
                return (
                    attributes.type == 'application/x-shockwave-flash'
                        ||
                        flashFilenameRegex.test(attributes.src || '')
                    );
            }

            function music(src) {
                return src.indexOf(MUSIC_PLAYER) != -1;
            }


            dataFilter && dataFilter.addRules({
                elements : {
                    'object' : function(element) {
                        var attributes = element.attributes,i,
                            classId = attributes.classid && String(attributes.classid).toLowerCase();
                        var cls = CLS_FLASH,type = TYPE_FLASH;
                        if (!classId) {
                            // Look for the inner <embed>
                            for (i = 0; i < element.children.length; i++) {
                                if (element.children[ i ].name == 'embed') {
                                    if (!isFlashEmbed(element.children[ i ]))
                                        return null;
                                    if (music(element.children[ i ].attributes.src)) {
                                        cls = CLS_MUSIC;
                                        type = TYPE_MUSIC;
                                    }
                                    return dataProcessor.createFakeParserElement(element, cls, type, true);
                                }
                            }
                            return null;
                        }

                        for (i = 0; i < element.children.length; i++) {
                            var c = element.children[ i ];
                            if (c.name == 'param' && c.attributes.name == "movie") {
                                if (music(c.attributes.value)) {
                                    cls = CLS_MUSIC;
                                    type = TYPE_MUSIC;
                                    break;
                                }
                            }
                        }
                        return dataProcessor.createFakeParserElement(element, cls, type, true);
                    },

                    'embed' : function(element) {
                        if (!isFlashEmbed(element))
                            return null;
                        var cls = CLS_FLASH,type = TYPE_FLASH;
                        if (music(element.attributes.src)) {
                            cls = CLS_MUSIC;
                            type = TYPE_MUSIC;
                        }
                        return dataProcessor.createFakeParserElement(element, cls, type, true);
                    }
                }}, 5);

            var html = "<div style='margin:10px;'><p><label>地址：" +
                "<input class='ke-flash-url' style='width:280px' /></label></p>" +
                "<p style='margin:5px 0'><label>宽度：" +
                "<input class='ke-flash-width' style='width:120px' /></label>" +
                "&nbsp;&nbsp;<label>高度：<input class='ke-flash-height' " +
                "style='width:110px' /></label></p>" +

                "<p style='margin:5px 0;text-align:right;'><button>确定</button></p></div>";

            function Flash(editor) {
                this.editor = editor;
                this._init();
            }

            S.augment(Flash, {
                _init:function() {
                    var self = this,editor = self.editor;
                    self.el = new TripleButton({
                        container:editor.toolBarDiv,
                        contentCls:"ke-toolbar-flash",
                        //text:"flash",
                        title:"Flash"
                    });

                    self.el.on("click", self._showConfig, this);
                    KE.Utils.lazyRun(this, "_prepareShow", "_realShow");
                },
                _prepareShow:function() {
                    var self = this;
                    self.d = new Overlay({
                        title:"编辑flash",
                        width:"350px",
                        mask:true
                    });
                    self.d.body.html(html);
                    self._initD();
                },
                _realShow:function() {
                    this.d.show();
                },
                _showConfig:function() {
                    this._prepareShow();
                },
                _initD:function() {
                    var self = this,editor = self.editor,d = self.d;
                    self.dHeight = d.el.one(".ke-flash-height");
                    self.dWidth = d.el.one(".ke-flash-width");
                    self.dUrl = d.el.one(".ke-flash-url");
                    var action = d.el.one("button");
                    action.on("click", self._gen, self);
                },

                _gen: function() {
                    var self = this,editor = self.editor;
                    var url = self.dUrl.val();
                    if (!url)return;
                    var real = new Node('<object ' +
                        (parseInt(self.dWidth.val()) ? " width='" + parseInt(self.dWidth.val()) + "' " : ' ') +
                        (parseInt(self.dHeight.val()) ? " height='" + parseInt(self.dHeight.val()) + "' " : ' ') +
                        'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ' +
                        'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0">' +
                        '<param name="quality" value="high" />' +
                        '<param name="movie" value="' + url + '" />' +
                        '<embed ' +
                        (parseInt(self.dWidth.val()) ? " width='" + parseInt(self.dWidth.val()) + "' " : ' ') +
                        (parseInt(self.dHeight.val()) ? " height='" + parseInt(self.dHeight.val()) + "' " : ' ') + 'pluginspage="http://www.macromedia.com/go/getflashplayer" quality="high" ' +
                        'src="' + url + '" ' +
                        'type="application/x-shockwave-flash">' +
                        '</embed>' +
                        '</object>', null, editor.document);
                    var substitute = editor.createFakeElement ? editor.createFakeElement(real, CLS_FLASH, TYPE_FLASH, true) : real;
                    editor.insertElement(substitute);
                    self.d.hide();
                }
            });
            KE.Flash = Flash;
        })();
    }
    editor.addPlugin(function() {
        new KE.Flash(editor);
    });

});
