/**
 * modified from ckeditor,process malform html for kissyeditor
 * @modifier:yiminghe@gmail.com
 */
KISSY.Editor.add("htmldataprocessor", function(
    //editor
    ) {
    var KE = KISSY.Editor;
    if (KE.HtmlDataProcessor) return;
    var
        S = KISSY,
        UA = S.UA,
        HtmlParser = KE.HtmlParser,
        htmlFilter = new HtmlParser.Filter(),
        dataFilter = new HtmlParser.Filter();
    var defaultHtmlFilterRules = {
        elementNames : [
            // Remove script,iframe style,link,meta
            [ ( /^script$/ ), '' ],
            [ ( /^iframe$/ ), '' ],
            [ ( /^style$/ ), '' ],
            [ ( /^link$/ ), '' ],
            [ ( /^meta$/ ), '' ],
            // Ignore <?xml:namespace> tags.
            [ ( /^\?xml:namespace$/ ), '' ]
        ],
        elements : {
            embed : function(element) {
                var parent = element.parent;
                // If the <embed> is child of a <object>, copy the width
                // and height attributes from it.
                if (parent && parent.name == 'object') {
                    var parentWidth = parent.attributes.width,
                        parentHeight = parent.attributes.height;
                    parentWidth && ( element.attributes.width = parentWidth );
                    parentHeight && ( element.attributes.height = parentHeight );
                }
            },
            // Restore param elements into self-closing.
            param : function(param) {
                param.children = [];
                param.isEmpty = true;
                return param;
            },
            // Remove empty link but not empty anchor.(#3829)
            a : function(element) {
                if (!( element.children.length ||
                    element.attributes.name )) {
                    return false;
                }
            }
        },
        attributes :  {
            //��ֹword������class��ȫ��ɱ�����ˣ�������ke_��ͷ�ı༭������class
            'class' : function(value
                // , element
                ) {
                if (/ke_/.test(value)) return value;
                return false;
            }
        }
    };
    if (UA.ie) {
        // IE outputs style attribute in capital letters. We should convert
        // them back to lower case.
        defaultHtmlFilterRules.attributes.style = function(value
            // , element
            ) {
            return value.toLowerCase();
        };
    }

    htmlFilter.addRules(defaultHtmlFilterRules);
    dataFilter.addRules(defaultHtmlFilterRules);

    KE.HtmlDataProcessor = {
        htmlFilter:htmlFilter,
        dataFilter:dataFilter,
        //�༭��html���ⲿhtml
        toHtml:function(html, fixForBody) {
            //fixForBody = fixForBody || "p";
            // Now use our parser to make further fixes to the structure, as
            // well as apply the filter.
            var writer = new HtmlParser.HtmlWriter(),
                fragment = HtmlParser.Fragment.FromHtml(html, fixForBody);
            fragment.writeHtml(writer, htmlFilter);
            return writer.getHtml(true);
        },
        //�ⲿhtml����༭��
        toDataFormat : function(html, fixForBody) {
            //fixForBody = fixForBody || "p";
            var writer = new HtmlParser.HtmlWriter(),
                fragment = HtmlParser.Fragment.FromHtml(html, fixForBody);
            writer.reset();
            fragment.writeHtml(writer, dataFilter);
            return writer.getHtml(true);
        }
    };
});