/**
 * font formatting for kissy editor
 * @author: yiminghe@gmail.com
 */
KISSY.Editor.add("font", function(editor) {
    var KE = KISSY.Editor,
        S = KISSY,
        KEStyle = KE.Style,
        TripleButton = KE.TripleButton,
        Node = S.Node;
    var
        FONT_SIZES = ["8px","10px","12px",
            "14px","18px","24px","36px","48px","60px","72px","84px","96px","108px"],
        FONT_SIZE_STYLES = {},
        FONT_SIZE_SELECTION_HTML = "<select title='大小' style='width:110px;height:21px;'><option value=''>大小 / 清除</option>",
        fontSize_style = {
            element        : 'span',
            styles        : { 'font-size' : '#(size)' },
            overrides    : [
                { element : 'font', attributes : { 'size' : null } }
            ]
        },
        FONT_FAMILIES = ["宋体","黑体","隶书",
            "楷体_GB2312","微软雅黑","Georgia","Times New Roman",
            "Impact","Courier New","Arial","Verdana","Tahoma"],
        FONT_FAMILY_STYLES = {},
        FONT_FAMILY_SELECTION_HTML = "<select title='字体' >" +
            "<option value=''>字体 / 清除</option>",
        fontFamily_style = {
            element        : 'span',
            styles        : { 'font-family' : '#(family)' },
            overrides    : [
                { element : 'font', attributes : { 'face' : null } }
            ]
        },i;

    for (i = 0; i < FONT_SIZES.length; i++) {
        var size = FONT_SIZES[i];
        FONT_SIZE_STYLES[size] = new KEStyle(fontSize_style, {
            size:size
        });
        FONT_SIZE_SELECTION_HTML += "<option value='" + size + "'>" + size + "</option>"
    }
    FONT_SIZE_SELECTION_HTML += "</select>";

    for (i = 0; i < FONT_FAMILIES.length; i++) {
        var family = FONT_FAMILIES[i];
        FONT_FAMILY_STYLES[family] = new KEStyle(fontFamily_style, {
            family:family
        });
        FONT_FAMILY_SELECTION_HTML += "<option style='font-family:"
            + family + "'  value='" + family + "'>" + family + "</option>"
    }
    FONT_FAMILY_SELECTION_HTML += "</select>";

    if (!KE.Font) {
        (function() {


            function Font(cfg) {
                Font.superclass.constructor.call(this, cfg);
                var self = this;
                self._init();
            }

            Font.ATTRS = {
                v:{
                    value:""
                },
                html:{},
                styles:{},
                editor:{}
            };

            S.extend(Font, S.Base, {

                _init:function() {
                    var editor = this.get("editor"),
                        toolBarDiv = editor.toolBarDiv,
                        html = this.get("html");
                    var self = this;
                    self.el = new Node(html);
                    toolBarDiv[0].appendChild(this.el[0]);
                    self.el.on("change", this._change, this);
                    editor.on("selectionChange", this._selectionChange, this);
                    this.on("afterVChange", this._vChange, this);
                },

                _vChange:function(ev) {
                    var editor = this.get("editor"),
                        v = ev.newVal,
                        pre = ev.preVal,
                        styles = this.get("styles");
                    editor.focus();
                    editor.fire("save");
                    if (!v) {
                        v = pre;
                        styles[v].remove(editor.document);
                    } else {
                        styles[v].apply(editor.document);
                    }
                    editor.fire("save");
                    editor.notifySelectionChange();
                },

                _change:function() {
                    var el = this.el;
                    this.set("v", el.val());
                },

                _selectionChange:function(ev) {
                    var editor = this.get("editor");
                    var currentValue = this.get("v");
                    var elementPath = ev.path,
                        elements = elementPath.elements,
                        styles = this.get("styles");
                    // For each element into the elements path.
                    for (var i = 0, element; i < elements.length; i++) {
                        element = elements[i];
                        // Check if the element is removable by any of
                        // the styles.
                        for (var value in styles) {
                            if (styles[ value ].checkElementRemovable(element, true)) {
                                if (value != currentValue) {
                                    this._set("v", value);
                                    this.el.val(value);
                                }
                                return;
                            }
                        }
                    }

                    // If no styles match, just empty it.
                    if (currentValue != '') {
                        this._set("v", '');
                        this.el.val("");
                    }

                }
            });

            function SingleFont(cfg) {
                SingleFont.superclass.constructor.call(this, cfg);
                var self = this;
                self._init();
            }

            SingleFont.ATTRS = {
                editor:{},
                text:{},
                contentCls:{},
                title:{},
                style:{}
            };

            S.extend(SingleFont, S.Base, {
                _init:function() {
                    var self = this,
                        editor = self.get("editor"),
                        text = self.get("text"),
                        style = self.get("style"),
                        title = self.get("title");
                    self.el = new TripleButton({
                        text:text,
                        title:title,
                        contentCls:this.get("contentCls"),
                        container:editor.toolBarDiv
                    });
                    self.el.on("offClick", self._on, self);
                    self.el.on("onClick", self._off, self);
                    editor.on("selectionChange", self._selectionChange, self);
                },
                _on:function() {
                    var self = this,
                        editor = self.get("editor"),
                        text = self.get("text"),
                        style = self.get("style"),
                        title = self.get("title");
                    editor.fire("save");
                    style.apply(editor.document);
                    editor.fire("save");
                    editor.notifySelectionChange();
                    editor.focus();
                },
                _off:function() {
                    var self = this,
                        editor = self.get("editor"),
                        text = self.get("text"),
                        style = self.get("style"),
                        title = self.get("title");
                    editor.fire("save");
                    style.remove(editor.document);
                    editor.fire("save");
                    editor.notifySelectionChange();
                    editor.focus();
                },
                _selectionChange:function(ev) {
                    var self = this,
                        editor = self.get("editor"),
                        text = self.get("text"),
                        style = self.get("style"),
                        title = self.get("title"),
                        elementPath = ev.path;
                    if (style.checkActive(elementPath)) {
                        self.el.set("state", TripleButton.ON);
                    } else {
                        self.el.set("state", TripleButton.OFF);
                    }

                }
            });
            Font.SingleFont = SingleFont;
            KE.Font = Font;
        })();
    }
    editor.addPlugin(function() {
        new KE.Font({
            editor:editor,
            styles:FONT_SIZE_STYLES,
            html:FONT_SIZE_SELECTION_HTML
        });

        new KE.Font({
            editor:editor,
            styles:FONT_FAMILY_STYLES,
            html:FONT_FAMILY_SELECTION_HTML
        });

        new KE.Font.SingleFont({
            contentCls:"ke-toolbar-bold",
            title:"粗体",
            editor:editor,
            style:new KEStyle({
                element        : 'span',
                styles        : { 'font-weight' : 'bold' },
                overrides    : [
                    { element : 'b' },
                    
                    { strong : 'strong'}
                ]
            })
        });

        new KE.Font.SingleFont({
            contentCls:"ke-toolbar-italic",
            title:"斜体",
            editor:editor,
            style:new KEStyle({
                element        : 'span',
                styles        : { 'font-style' : 'italic' },
                overrides    : [
                    { element : 'i' },
                    { strong : 'em' }
                ]
            })
        });

        new KE.Font.SingleFont({
            contentCls:"ke-toolbar-underline",
            title:"下划线",
            editor:editor,
            style:new KEStyle({
                element        : 'span',
                styles        : { 'text-decoration' : 'underline' },
                overrides    : [
                    { element : 'u' }
                ]
            })
        });

        new KE.Font.SingleFont({
            contentCls:"ke-toolbar-strikeThrough",
            title:"删除线",
            editor:editor,
            style:new KEStyle({
                element        : 'span',
                styles        : { 'text-decoration' : 'line-through' },
                overrides    : [
                    { element : 'del' },
                    { element : 's' }
                ]
            })
        });

    });

});
