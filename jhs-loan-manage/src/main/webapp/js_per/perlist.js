var ordersOld, orders;
var userpower = "";
var setToolbar_ua = function (source) {
    checkPageEnabled("ym-ua");

    $("#tool_find").dxButton({
        hint: "查看详情",
        text: "详情",
        icon: "find",
        visible: !disableButton("ym-ua", 0),
        disabled: true,
        onClick: function () {
            var dataGrid = $('#userTable').dxDataGrid('instance');
            var selectobj = dataGrid.getSelectedRowsData();
            var himid = selectobj[0].id;
            var brroid = selectobj[0].borrow_id;
            loadwindow_userinfo(himid, brroid);
        }
    });

    $("#tool_kf").dxButton({
        hint: "查看详情",
        text: "详情(运营)",
        visible: !disableButton("ym-ua", 1),
        icon: "find",
        disabled: true,
        onClick: function () {
            var dataGrid = $('#userTable').dxDataGrid('instance');
            var selectobj = dataGrid.getSelectedRowsData();
            var himid = selectobj[0].id;
            var brroid = selectobj[0].borrow_id;
            loadwindow_userinfo_kf(himid, brroid);
        }
    });

    $("#tool_ok").dxButton({
        hint: "进黑名单",
        text: "拉黑",
        icon: "clear",
        disabled: true,
        onClick: function () {
            var dataGrid = $('#userTable').dxDataGrid('instance');
            var selectobj_param = dataGrid.getSelectedRowsData();
            var himid_list = selectobj_param[0].id;
            /*for (var i = 0; i < selectobj_param.length; i++) {
             himid_list += selectobj_param[i].id + ",";
             }*/
            $("#window_black").dxPopup({
                visible: true,
            });
            box_no_value_ua(himid_list, "0");
        }
    });
    $("#tool_no").dxButton({
        hint: "进白名单",
        text: "洗白",
        icon: "repeat",
        disabled: true,
        onClick: function () {
            var dataGrid = $('#userTable').dxDataGrid('instance');
            var selectobj_param = dataGrid.getSelectedRowsData();
            var himid_list = selectobj_param[0].id;
            /*for (var i = 0; i < selectobj_param.length; i++) {
             himid_list += selectobj_param[i].id + ",";
             }*/
            $("#window_black").dxPopup({
                visible: true,
            });
            box_no_value_ua(himid_list, "1");
        }
    });
    $("#tool_export").dxButton({
        hint : "导出",
        text : "导出",
        icon : "export",
       // disabled : true,
        onClick : function(loadOptions) {
            var dataGrid = $('#userTable').dxDataGrid('instance');
            var filter = dataGrid.getCombinedFilter();
            filter = JSON.stringify(filter) == undefined ? '' : JSON.stringify(filter);
            var url = "user/list/export.action?employ_num=" + usernum + "&filter=" + encodeURI(filter);
            exportData(url,null);
        }
    });

};
var loadtable2_ua = function () {
    DevExpress.config({
        forceIsoDateParsing: true

    });

    ordersOld = new DevExpress.data.CustomStore({
        load: function (loadOptions) {
            var deferred = $.Deferred(),
                args = {};
            args.filter = loadOptions.filter ? JSON.stringify(loadOptions.filter) : "";   // Getting filter settings
            args.sort = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";  // Getting sort settings
            args.requireTotalCount = loadOptions.requireTotalCount; // You can check this parameter on the server side  
            if (loadOptions.sort) {
                args.orderby = loadOptions.sort[0].selector;
                if (loadOptions.sort[0].desc)
                    args.orderby += " desc";
            }

            args.skip = loadOptions.skip || 0;
            args.take = loadOptions.take || 15;
            args.process = "old";
            $.ajax({
                url: 'user/getusers.action',
                data: args,
                success: function (result) {
                    result = JSON.parse(result);
                    deferred.resolve(result.list, {totalCount: result.total});
                },
                error: function () {
                    deferred.reject("Data Loading Error");
                },
                timeout: 50000
            });

            return deferred.promise();
        }
    });

    orders = new DevExpress.data.CustomStore({
        load: function (loadOptions) {
            var deferred = $.Deferred(),
                args = {};
            args.filter = loadOptions.filter ? JSON.stringify(loadOptions.filter) : "";   // Getting filter settings
            args.sort = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";  // Getting sort settings
            args.requireTotalCount = loadOptions.requireTotalCount; // You can check this parameter on the server side  
            if (loadOptions.sort) {
                args.orderby = loadOptions.sort[0].selector;
                if (loadOptions.sort[0].desc)
                    args.orderby += " desc";
            }

            args.skip = loadOptions.skip || 0;
            args.take = loadOptions.take || 15;
            args.process = "new";
            $.ajax({
                url: 'user/getusers.action',
                data: args,
                type: 'POST',
                success: function (result) {
                    result = JSON.parse(result);
                    deferred.resolve(result.list, {totalCount: result.total});
                },
                error: function () {
                    deferred.reject("Data Loading Error");
                },
                timeout: 50000
            });

            return deferred.promise();
        }
    });
    var dd = $("#userTable").dxDataGrid({
        dataSource: {
            store: orders
        },
        dateSerializationFormat: "yyyy-MM-dd HH:mm:ss",
        onContentReady: function () {
            this.clearSelection();
        },
        remoteOperations: {
            sorting: true,
            paging: true,
            filtering: true
        },
        "export" : {
            enabled : true,
            fileName : "Employees",
            allowExportSelectedData : true
        },
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        rowAlternationEnabled: true,
        showRowLines: true,
        selection: {
            mode: "multiple"
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        columnChooser: {
            title: "列选择器",
            enabled: true,
            emptyPanelText: '把你想隐藏的列拖拽到这里...'
        },
        columnFixing: {
            enabled: true
        },
        paging: {
            pageSize: 15,
            enabled: true
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 15, 30, 45, 60],
            showInfo: true,
            infoText: '第{0}页 . 共{1}页'
        },
        onSelectionChanged: function (data) {
            var flag = false;
            for (var i = 0; i < data.selectedRowsData.length; i++) {
                if (data.selectedRowsData[i].blacklist == "Y") {
                    flag = true;
                    break;
                }
            }
            var flag2 = false;
            for (var i = 0; i < data.selectedRowsData.length; i++) {
                if (data.selectedRowsData[i].blacklist != "Y") {
                    flag2 = true;
                    break;
                }
            }
            $("#tool_find").dxButton({
                disabled: (data.selectedRowsData.length != 1) || disableButton("ym-ua", 0)
            });
            $("#tool_kf").dxButton({
                disabled: (data.selectedRowsData.length != 1) || disableButton("ym-ua", 1)
            });
            $("#tool_ok").dxButton({
                disabled: data.selectedRowsData.length != 1 || flag || disableButton("ym-ua", 2),
            });
            $("#tool_no").dxButton({
                disabled: data.selectedRowsData.length != 1 || flag2 || disableButton("ym-ua", 3),
            });
        },
        columns: [{
            dataField: "phone",
            caption: "手机号码",
            alignment: "center",
            allowSorting: false,
            headerFilter: false
        }, {
            dataField: "name",
            caption: "用户姓名",
            alignment: "center",
            allowSorting: false,
            headerFilter: false
        }, {
            dataField: "card_num",
            caption: "身份证号码",
            alignment: "center",
            allowSorting: false,
            headerFilter: false
        }, {
            dataField: "blacklist",
            caption: "黑名单",
            alignment: "center",
            allowSorting: false,
            allowFiltering: false,
            lookup: {
                dataSource: [
                    {value: 'Y', format: '是'},
                    {value: 'N', format: '否'}
                ], displayExpr: 'format',valueExpr: 'value'
            }
        }, {
            dataField: "node_code",
            caption: "当前认证节点",
            alignment: "center",
            allowSorting: false,
            lookup: {
                dataSource: [
                    {value: '1', format: '身份证正面认证'},
                    {value: '2', format: '身份证反面认证'},
                    {value: '3', format: '芝麻信用'},
                    {value: '4', format: '通讯录认证'},
                    {value: '5', format: '个人认证'},
                    {value: '6', format: '人脸认证'},
                    {value: '7', format: '手机认证'},
                    {value: '8', format: '银行卡认证'}
                ],
                displayExpr: 'format',
                valueExpr: 'value'
            }
        }, {
            dataField: "node_status",
            caption: "节点状态",
            alignment: "center",
            allowSorting: false,
            lookup: {
                dataSource: [
                    {value: 'NS001', format: '未认证'},
                    {value: 'NS002', format: '已认证'},
                    {value: 'NS003', format: '认证失败'},
                    {value: 'NS004', format: '已提交'},
                    {value: 'NS005', format: '认证失败，且进黑名单'},
                ], displayExpr: 'format',valueExpr: 'value'
            }
        }, {
            dataField: "borrow_status",
            caption: "当前合同状态",
            alignment: "center",
            allowSorting: false,
            lookup: {
                dataSource: [
                    {value: 'BS001', format: '申请中'},
                    {value: 'BS002', format: '待签约'},
                    {value: 'BS003', format: '已签约'},
                    {value: 'BS004', format: '待还款'},
                    {value: 'BS005', format: '逾期未还'},
                    {value: 'BS006', format: '正常结清'},
                    {value: 'BS007', format: '已取消'},
                    {value: 'BS008', format: '审核未通过'},
                    {value: 'BS009', format: '电审未通过'},
                    {value: 'BS010', format: '逾期结清'},
                    {value: 'BS011', format: '放款中'},
                    {value: 'BS012', format: '放款失败'},
                    {value: 'BS014', format: '提前结清'}
                ], displayExpr: 'format',valueExpr: 'value'
            }

        }, {
            dataField: "source_name",
            caption: "渠道来源",
            alignment: "center",
            filterOperations: ["="],
            allowSorting: false,
            lookup: {
                dataSource: source,
                valueExpr: 'value',
                displayExpr: 'format'
            }
        }, {
            dataField: "create_date",
            caption: "注册时间",
            alignment: "center",
            format: "yyyy-MM-dd",
            dataType: "date",
            headerFilter: false
        }, {
            dataField: "description",
            caption: "认证说明",
            alignment: "left",
            allowFiltering: false,
            allowSorting: false
        }]
    });
};

var window_no_ua = function () {
    $("#window_black").dxPopup({
        showTitle: true,
        maxWidth: 500,
        maxHeight: 300,
        title: '黑名单操作',
        visible: false,
        WindowScroll: true,
        resizeEnabled: true,
        onHiding: function () {
            setToolbar_ua();
            loadtable2_ua();
        }
    });
};
var box_no_value_ua = function (himid_list, type) {
    var reason = "";

    $("#reason").dxTextArea({
        placeholder: "必填",
        height: 100,
        value: reason,
        showClearButton: false,
        onValueChanged: function (data) {
            reason = data.value;
        }
    });


    // 增加保存按钮
    $("#submit_no").dxButton({
        text: "确定",
        hint: "确认发送",
        icon: "todo",
        disabled: false,
        onClick: function () {
            if (reason == '') {
                showMessage("必须填写理由！");
                return;
            }
            $.ajax({
                type: "POST",
                url: "user/black.action",
                data: {
                    himid_list: himid_list,
                    operator: username,
                    reason: reason,
                    usernum: usernum,
                    type: type,
                },
                success: function (msg) {
                    if (msg.code != 200) {
                        showMessage(msg.msg);
                    } else {
                        showMessage("操作成功！");
                        setToolbar_ua();
                        loadtable2_ua();
                        $("#window_black").dxPopup({
                            visible: false,
                        });
                    }
                }
            });
        }
    });
};


var perlist = function () {
    setToolbar_ua();
    loadtable2_ua();
    window_no_ua();
};