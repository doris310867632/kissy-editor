/**
 * maximize editor
 * @author:yiminghe@gmail.com
 * @note:firefox ������ȫ�군�ˣ�����ȫ�����firefox
 */
KISSY.Editor.add("maximize", function(editor) {
    var KE = KISSY.Editor,
        S = KISSY,
        UA = S.UA,
        Node = S.Node,
        Event = S.Event,
        TripleButton = KE.TripleButton,
        DOM = S.DOM,
        iframe;

    if (!KE.Maximize) {
        (function() {
            function Maximize(editor) {

                this.editor = editor;
                this._init();
            }

            Maximize.init = function() {
                iframe = new Node("<iframe style='position:absolute;top:-9999px;left:-9999px;' frameborder='0'>" +
                    "</iframe>");
                document.body.appendChild(iframe[0]);
                Maximize.init = null;
            };
            S.augment(Maximize, {
                _init:function() {
                    var self = this,editor = self.editor;
                    self.el = new TripleButton({
                        container:editor.toolBarDiv,
                        cls:"ke-tool-editor-source",
                        title:"ȫ��",
                        contentCls:"ke-toolbar-maximize"
                        //text:"maximize"
                    });

                    self.el.on("offClick", self.maximize, self);
                    self.el.on("onClick", self.restore, self);
                    KE.Utils.lazyRun(this, "_prepare", "_real");
                },
                restore:function() {
                    var self = this,
                        editor = self.editor;
                    Event.remove(window, "resize", self._maximize, self);
                    //editor.focus();
                    //console.log(editor.iframeFocus);

                    this._saveEditorStatus();
                    editor.wrap.css({
                        height:self.iframeHeight
                    });
                    new Node(document.body).css({
                        width:"",
                        height:"",
                        overflow:""
                    });
                    editor.editorWrap.css({
                        position:"static",
                        width:self.editorWrapWidth
                    });
                    iframe.css({
                        left:"-99999px",
                        top:"-99999px"
                    });
                    window.scrollTo(self.scrollLeft, self.scrollTop);
                    self.el.set("state", TripleButton.OFF);
                    //firefox ����timeout
                    setTimeout(function() {
                        //editor.focus();
                        self._restoreEditorStatus();
                    }, 30);
                },

                _saveSate:function() {
                    var self = this,
                        editor = self.editor;
                    self.iframeHeight = editor.wrap._4e_style("height");
                    self.editorWrapWidth = editor.editorWrap._4e_style("width");
                    //�����ڹ�����ҲҪ����Ŷ
                    self.scrollLeft = DOM.scrollLeft();
                    self.scrollTop = DOM.scrollTop();
                    window.scrollTo(0, 0);
                },
                //firefox������iframe layout�仯ʱ��range����
                _saveEditorStatus:function() {
                    var self = this,
                        editor = self.editor;
                    if (!UA.gecko || !editor.iframeFocus) return;
                    var sel = editor.getSelection();
                    //firefox ��궪ʧbug,λ�ö�ʧ���������ﱣ����
                    self.savedRanges = sel && sel.getRanges();
                },

                _restoreEditorStatus:function() {
                    var self = this,
                        editor = self.editor;
                    var sel;

                    //firefox����bug
                    if (UA.gecko && editor.iframeFocus) {

                        //ԭ���Ǿ۽�������ˢ��designmode
                        sel = editor.getSelection();
                        //firefox ��ʧȥ�������
                        self.el.el[0].focus();
                        editor.focus();
                        if (self.savedRanges && sel) {
                            sel.selectRanges(self.savedRanges);
                        }

                    }
                    //firefox �н���ʱ�����¾۽�


                    if (editor.iframeFocus && sel) {
                        var element = sel.getStartElement();
                        //ʹ��ԭ�����еģ���ʹ�����ڹ���
                        //element[0] && element[0].scrollIntoView(true);
                        element && element[0] && element.scrollIntoView(editor.document, false);
                    }

                    //firefox����bug
                    if (UA.gecko) {
                        //ԭ�����۽�
                        if (!editor.iframeFocus) {
                            //�Ƶ�����mousedown�ж�
                            //ˢ��designmode
                            //editor.focus();
                            //����ϳ�
                            //editor.blur();
                        }
                    }

                },
                _maximize:function() {
                    var self = this,
                        editor = self.editor;
                    var viewportHeight = DOM.viewportHeight(),
                        viewportWidth = DOM.viewportWidth(),
                        statusHeight = editor.statusDiv ? editor.statusDiv.height() : 0,
                        toolHeight = editor.toolBarDiv.height();

                    if (!UA.ie)
                        new Node(document.body).css({
                            width:0,
                            height:0,
                            overflow:"hidden"
                        });
                    else
                        document.body.style.overflow = "hidden";
                    editor.editorWrap.css({
                        position:"absolute",
                        zIndex:9999,
                        width:viewportWidth + "px"
                    });
                    iframe.css({
                        zIndex:9998,
                        height:viewportHeight + "px",
                        width:viewportWidth + "px"
                    });
                    editor.editorWrap.offset({
                        left:0,
                        top:0
                    });
                    iframe.css({
                        left:0,
                        top:0
                    });
                    editor.wrap.css({
                        height:(viewportHeight - statusHeight - toolHeight - 14) + "px"
                    });
                },
                _real:function() {
                    var self = this,
                        editor = self.editor;
                    //editor.focus();
                    this._saveEditorStatus();
                    this._saveSate();
                    this._maximize();
                    //firefox��һ�����bug������һ��
                    if (true || UA.gecko) {
                        this._maximize();
                    }
                    Event.on(window, "resize", self._maximize, self);
                    this.el.set("state", TripleButton.ON);
                    //if (editor.iframeFocus)

                    setTimeout(function() {
                        self._restoreEditorStatus();
                    }, 30);
                },
                _prepare:function() {
                    Maximize.init && Maximize.init();
                },
                maximize:function() {
                    this._prepare();
                }
            });

            KE.Maximize = Maximize;
        })();
    }
    editor.addPlugin(function() {
        new KE.Maximize(editor);
    });

});