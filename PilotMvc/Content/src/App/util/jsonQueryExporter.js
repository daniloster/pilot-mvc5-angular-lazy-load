(function(){ 
    var JsonQuery = null;
    define([], function () {
        if (JsonQuery === null) {
            var isBrowserIE = function () {

                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");

                return (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
            };

            JsonQuery = function (datasource) {
                var self = this, ds = typeof datasource != 'object' && typeof datasource != typeof [] ? JSON.parse(datasource) : datasource,
                    Events = {
                        GetHeader: 'getHeader',
                        GetSelection: 'getSelection',
                        Filters: 'filters',
                        Order: 'order'
                    },
                    result = [],
                    header = [],
                    footer = [],
                    evts = [],

                on = function (eventName, eventHandler) {
                    if (!!eventHandler) {
                        evts[eventName] = eventHandler;
                    } else {
                        return evts[eventName];
                    }
                },

                call = function (eventName, args) {
                    return on(eventName).apply(self, args);
                },

                isValid = function (item) {
                    var filters = on(Events.Filters) || [],
                        valid = true;
                    filters.forEach(function (validator) {
                        valid = valid && validator(item);
                    });
                    return valid;
                },
                
                asArray = function (isExporting) {
                    isExporting = !!isExporting;

                    var newArray = [];
                    if (isExporting) {
                        //Setting report title
                        newArray.push(title);
                        newArray.push('\r\n\n');
                        //Generating the header
                        newArray.push(call(Events.GetHeader, [ds[0]]).join(','));
                        newArray.push('\r\n');
                    }

                    ds.sort(on(Events.Order));

                    var rowData = [], currentRowData = null;
                    ds.forEach(function (item, idx) {
                        if (isValid(item)) {
                            currentRowData = call(Events.GetSelection, [item]).join(',');
                            rowData.push(currentRowData);
                            newArray.push(currentRowData);
                            newArray.push('\r\n');
                        }
                    });
                    return newArray;
                };

                self.headedBy = function (getHeader) {
                    on(Events.GetHeader, getHeader);
                    return self;
                };

                self.select = function (getSelection) {
                    on(Events.GetSelection, function (item) {
                        var row = [],
                            partials = getSelection(item);
                        partials.forEach(function (val) {
                            row.push('"' + val + '"');
                        });
                        return row;
                    });
                    return self;
                };

                self.where = function (filter) {
                    var filters = on(Events.Filters);
                    if (!filters) {
                        filters = [];
                    }
                    filters.push(filter);
                    on(Events.Filters, filters);
                    return self;
                };

                self.orderBy = function (order) {
                    on(Events.Order, order);
                    return self;
                };

                self.saveAs = function (title, fileName) {
                    JSONToCSVConvertor(title, fileName)
                };

                self.toArray = function () {
                    return asArray(false);
                };

                on(Events.Order, function (obj1, obj2) { return 0; });

                on(Events.GetHeader, function (first) {
                    var row = [];
                    for (var index in first) {
                        row.push(index);
                    }
                    return row;
                });

                on(Events.GetSelection, function (item) {
                    var row = [];
                    for (var index in item) {
                        row.push('"' + item[index] + '"');
                    }
                    return row;
                });

                var JSONToCSVConvertor = function (title, fileName) {
                    var CSV = asArray(true);

                    if (rowData.join('').length == 0) {
                        alert("Invalid data");
                        return;
                    }

                    if (!fileName) {
                        fileName = "Report_";
                        fileName += title.replace(/ /g, "_");
                    }

                    /*
                    References for tag A
                    http://www.w3schools.com/tags/tag_a.asp
                    */
                    downloadCSV(CSV.join(''), fileName + ".csv");
                },
                downloadCSV = function (data, fileName) {
                    var isIE = isBrowserIE();
                    if (!isIE) {
                        data = escape(data);
                        //Initialize file format you want csv or xls
                        var uriCommon = 'data:text/csv;charset=utf-8,' + data,
                            link = document.createElement("a");
                        link.href = uriCommon;
                        link.download = fileName;
                        //set the visibility hidden so it will not effect on your web-layout
                        link.style = "visibility:hidden";
                        //this part will append the anchor tag and remove it after automatic click
                        document.body.appendChild(link);
                        link.onclick = function () {
                            document.body.removeChild(this);
                        };
                        link.click();
                    } else {
                        data = decodeURIComponent(data);
                        var uriIE = 'sep=,\r\n' + data;

                        var iframe = document.createElement('iframe');
                        document.body.appendChild(iframe);
                        iframe = iframe.contentWindow || iframe.contentDocument;

                        iframe.document.open("text/csv", "replace");
                        iframe.DocumentType = "text/csv";
                        iframe.document.write(uriIE);
                        iframe.document.close();
                        iframe.focus();
                        iframe.document.execCommand('SaveAs', true, fileName);
                        document.body.removeChild(iframe);
                    }
                };

            };
        }
        return JsonQuery;
    });
})();