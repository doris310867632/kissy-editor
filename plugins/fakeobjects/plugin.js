/**
 * fakeobjects for music ,video,flash
 * @author:yiminghe@gmail.com
 */
KISSY.Editor.add("fakeobjects", function(editor) {
    var KE = KISSY.Editor,
        S = KISSY,
        Node = S.Node,
        KEN = KE.NODE,
        HtmlParser = KE.HtmlParser,
        Editor = S.Editor,
        dataProcessor = KE.HtmlDataProcessor,
        htmlFilter = dataProcessor && dataProcessor.htmlFilter,
        dataFilter = dataProcessor && dataProcessor.dataFilter;

    if (!KE.FakeObjects) {

        (function() {
            var htmlFilterRules = {
                elements : {
                    /**
                     * ��������htmlʱ���ӱ༭��htmlת����fake�滻Ϊ��ʵ������style��width,height�㵽������ȥ
                     * @param element
                     */
                    $ : function(element) {
                        var attributes = element.attributes,
                            realHtml = attributes && attributes._ke_realelement,
                            realFragment = realHtml && new HtmlParser.Fragment.FromHtml(decodeURIComponent(realHtml)),
                            realElement = realFragment && realFragment.children[ 0 ];

                        // If we have width/height in the element, we must move it into
                        // the real element.
                        if (realElement && element.attributes._ke_resizable) {
                            var style = element.attributes.style;
                            if (style) {
                                // Get the width from the style.
                                var match = /(?:^|\s)width\s*:\s*(\d+)/i.exec(style),
                                    width = match && match[1];
                                // Get the height from the style.
                                match = /(?:^|\s)height\s*:\s*(\d+)/i.exec(style);
                                var height = match && match[1];

                                if (width)
                                    realElement.attributes.width = width;

                                if (height)
                                    realElement.attributes.height = height;
                            }
                        }
                        return realElement;
                    }
                }
            };


            if (htmlFilter)
                htmlFilter.addRules(htmlFilterRules);


            if (dataProcessor) {
                S.mix(dataProcessor, {

                    /**
                     * �������ʵ��html��תΪΪ�༭������֧�ֵ��滻Ԫ��
                     * @param realElement
                     * @param className
                     * @param realElementType
                     * @param isResizable
                     */
                    createFakeParserElement:function(realElement, className, realElementType, isResizable) {
                        var html;

                        var writer = new HtmlParser.BasicWriter();
                        realElement.writeHtml(writer);
                        html = writer.getHtml();
                        var style = realElement.attributes.style;
                        if (realElement.attributes.width) {
                            style = "width:" + realElement.attributes.width + "px;" + style;
                        }
                        if (realElement.attributes.height) {
                            style = "height:" + realElement.attributes.height + "px;" + style;
                        }
                        var attributes = {
                            'class' : className,
                            src : KE.Config.base + 'assets/spacer.gif',
                            _ke_realelement : encodeURIComponent(html),
                            _ke_real_node_type : realElement.type,
                            style:style,
                            align : realElement.attributes.align || ''
                        };

                        if (realElementType)
                            attributes._ke_real_element_type = realElementType;

                        if (isResizable)
                            attributes._ke_resizable = isResizable;

                        return new HtmlParser.Element('img', attributes);
                    }
                });
            }
            KE.FakeObjects = 1;
        })();
    }

    S.augment(Editor, {
        createFakeElement:function(realElement, className, realElementType, isResizable) {
            var style = realElement.attr("style") || '';
            if (realElement.attr("width")) {
                style = "width:" + realElement.attr("width") + "px;" + style;
            }
            if (realElement.attr("height")) {
                style = "height:" + realElement.attr("height") + "px;" + style;
            }
            var self = this,attributes = {
                'class' : className,
                src : KE.Config.base + 'assets/spacer.gif',
                _ke_realelement : encodeURIComponent(realElement._4e_outerHtml()),
                _ke_real_node_type : realElement[0].nodeType,
                align : realElement.attr("align") || '',
                style:style
            };
            

            if (realElementType)
                attributes._ke_real_element_type = realElementType;

            if (isResizable)
                attributes._ke_resizable = isResizable;
            return new Node("<img/>", attributes, self.document);
        },

        restoreRealElement:function(fakeElement) {
            if (fakeElement.attr('_ke_real_node_type') != KEN.NODE_ELEMENT)
                return null;
            return new Node(
                decodeURIComponent(fakeElement.attr('_ke_realelement')),
                this.document);
        }
    });

});