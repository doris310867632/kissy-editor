/**
 * format formatting,modified from ckeditor
 * @modifier:yiminghe@gmail.com
 */
KISSY.Editor.add("format", function(editor) {
    var KE = KISSY.Editor,
        S = KISSY,
        Node = S.Node;

    if (!KE.Format) {
        (function() {
            var
                FORMAT_SELECTION_HTML = "<select title='��ʽ'>",
                FORMATS = {
                    "���� / ���":"p",
                    "����1":"h1",
                    "����2":"h2",
                    "����3":"h3",
                    "����4":"h4",
                    "����5":"h5",
                    "����6":"h6"
                },FORMAT_STYLES = {},KEStyle = KE.Style;

            for (var p in FORMATS) {
                if (FORMATS[p]) {
                    FORMAT_STYLES[FORMATS[p]] = new KEStyle({
                        element:FORMATS[p]
                    });
                    FORMAT_SELECTION_HTML += "<option value='" + FORMATS[p] + "'>" + p + "</option>"
                }
            }
            FORMAT_SELECTION_HTML += "</select>";
            function Format(cfg) {
                Format.superclass.constructor.call(this, cfg);
                var self = this;
                self.el = new Node(FORMAT_SELECTION_HTML);
                this._init();
            }

            Format.ATTRS = {
                v:{
                    value:"p"
                },
                editor:{}
            };

            S.extend(Format, S.Base, {

                _init:function() {
                    var editor = this.get("editor"),toolBarDiv = editor.toolBarDiv,
                        el = this.el;
                    var self = this;
                    toolBarDiv[0].appendChild(this.el[0]);
                    el.on("change", this._change, this);
                    editor.on("selectionChange", this._selectionChange, this);
                    this.on("afterVChange", this._vChange, this);
                },

                _vChange:function(ev) {
                    var editor = this.get("editor"),v = ev.newVal;//,pre = ev.preVal;
                    editor.focus();
                    editor.fire("save");
                    FORMAT_STYLES[v].apply(editor.document);
                    editor.fire("save");
                    editor.fire("formatChange", this.get("v"));
                },
                _change:function() {
                    var el = this.el;
                    this.set("v", el.val());
                },

                _selectionChange:function(ev) {
                    var editor = this.get("editor");
                    var currentValue = this.get("v");
                    var elementPath = ev.path;
                    // For each element into the elements path.

                    // Check if the element is removable by any of
                    // the styles.
                    for (var value in FORMAT_STYLES) {
                        if (FORMAT_STYLES[ value ].checkActive(elementPath)) {
                            if (value != currentValue) {
                                this._set("v", value);
                                this.el.val(value);
                            }
                            return;
                        }
                    }

                    //Ĭ��Ϊ��ͨ��
                    this._set("v", "p");
                    this.el.val("p");

                }
            });
            KE.Format = Format;
        })();
    }

    editor.addPlugin(function() {
        new KE.Format({
            editor:editor
        });
    });

});