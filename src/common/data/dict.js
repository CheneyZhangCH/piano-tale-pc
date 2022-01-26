const dict = {
    // direction 朝向：1东2南3西4北5东南6东北7西南8西北9南北10东西
    direction: [
        {
            value: 1,
            label: '东'
        },
        {
            value: 2,
            label: '南'
        },
        {
            value: 3,
            label: '西'
        },
        {
            value: 4,
            label: '北'
        },
        {
            value: 5,
            label: '东南'
        },
        {
            value: 6,
            label: '东北'
        },
        {
            value: 7,
            label: '西南'
        },
        {
            value: 8,
            label: '西北'
        },
        {
            value: 9,
            label: '南北'
        },
        {
            value: 10,
            label: '东西'
        }
    ],

    // decoration 装修情况：1毛坯2简单装修4精装修6高端装修
    decoration: [
        {
            value: 1,
            label: '毛坯'
        },
        {
            value: 2,
            label: '简单装修'
        },
        {
            value: 2,
            label: '简装'
        },
        {
            value: 4,
            label: '精装修'
        },
        {
            value: 4,
            label: '精装'
        },
        {
            value: 6,
            label: '高端装修'
        }
    ],

    // usageTypeId 用途：1普通住宅2别墅4公寓5平房6其他7新里洋房8老公房9四合院10排屋
    usageTypeId: [
        {
            value: '1',
            label: '普通住宅'
        },
        {
            value: '1',
            label: '住宅'
        },
        {
            value: '2',
            label: '别墅'
        },
        {
            value: '7',
            label: '新里洋房'
        },
        {
            value: '4',
            label: '酒店公寓'
        },
        {
            value: '11',
            label: '写字楼'
        },
        {
            value: '12',
            label: '商铺'
        },
        {
            value: '13',
            label: '商办'
        },
        {
            value: '14',
            label: '其他'
        }
    ],

    // 用户入职状态
    userStatus: [
        {
            value: '正式',
            label: '正式'
        },
        {
            value: '试用',
            label: '试用'
        },
        // {
        //     value: '待离职',
        //     label: '待离职'
        // },
        {
            value: '已离职',
            label: '已离职'
        }
    ],

    // status 入职申请状态：1：申请中；2待入职；3：已入职：4：已拒绝；5：已取消；6：失效
    userApplyStatus: [
        {
            value: 1,
            label: '申请中'
        },
        {
            value: 2,
            label: '待入职'
        },
        {
            value: 3,
            label: '已入职'
        },
        {
            value: 4,
            label: '已拒绝'
        },
        {
            value: 5,
            label: '已取消'
        },
        {
            value: 6,
            label: '已失效'
        },
        {
            value: 9,
            label: '已终止'
        }
    ],

    // 岗前培训状态
    preJobTrainingStatus: [
        {
            value: '1',
            label: '未培训'
        },
        {
            value: '2',
            label: '未通过'
        },
        {
            value: '3',
            label: '已通过'
        }
    ],

    // 背调通过情况
    backgroundIvPassState: [
        {
            value: '1',
            label: '通过'
        },
        {
            value: '0',
            label: '不通过'
        }
    ],

    // 离职状态
    dimissionStatus: [
        {
            value: 1,
            label: '审批中'
        },
        {
            value: 2,
            label: '待离职'
        },
        {
            value: 3,
            label: '已离职'
        },
        {
            value: 4,
            label: '临时离职'
        },
        {
            value: 5,
            label: '已复职'
        },
        {
            value: 6,
            label: '已拒绝'
        },
        {
            value: 7,
            label: '已取消'
        },
        {
            value: 8,
            label: '已失效'
        },
        {
            value: 9,
            label: '已终止'
        }
    ],

    // 离职类型
    dimissionType: [
        {
            value: 1,
            label: '主动离职'
        },
        {
            value: 2,
            label: '被动离职'
        }
        // {
        //     value: 3,
        //     label: '特权操作离职'
        // }
    ],

    // 异动类型
    changeType: [
        {
            value: 1,
            label: '部门调整'
        },
        {
            value: 2,
            label: '职位调整'
        },
        {
            value: 3,
            label: '职级调整'
        }
    ],

    // 异动状态
    changeStatus: [
        {
            value: 1,
            label: '审批中'
        }, {
            value: 2,
            label: '待生效'
        }, {
            value: 3,
            label: '已拒绝'
        }, {
            value: 4,
            label: '先行生效'
        }, {
            value: 5,
            label: '已生效'
        }, {
            value: 6,
            label: '已失效'
        }, {
            value: 7,
            label: '已取消'
        },
        {
            value: 8,
            label: '已终止'
        }
    ],

    // 转正类型
    bafmType: [
        {
            value: 1,
            label: '自动转正'
        },
        {
            value: 2,
            label: '考核转正'
        }
    ],

    // 转正状态
    bafmStatus: [
        {
            value: 1,
            label: '已发起'
        },
        {
            value: 2,
            label: '主管评估'
        },
        {
            value: 3,
            label: '审批中'
        },
        {
            value: 4,
            label: '待转正'
        },
        {
            value: 5,
            label: '已转正'
        },
        {
            value: 6,
            label: '已拒绝'
        }
        // {
        //     value: 7,
        //     label: '已取消'
        // }
        // {
        //     value: 8,
        //     label: '已失效'
        // },
        // {
        //     value: 9,
        //     label: '已终止'
        // }
    ],

    // 菜单类型（1：pc导航菜单 2：功能按钮 3：导航按钮 4：手机导航）
    menuType: [
        {
            value: 1,
            label: '导航菜单'
        },
        {
            value: 2,
            label: '功能按钮'
        },
        {
            value: 3,
            label: '导航按钮'
        },
        {
            value: 4,
            label: '手机导航'
        },
        {
            value: 5,
            label: '多应用功能按钮'
        },
        {
            value: 6,
            label: '多应用导航按钮'
        }
    ],

    // 楼盘编号大写英文枚举
    buildingLetterList: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((item, index) => {
        return {
            label: item,
            value: index
        }
    }),

    // 产权年限
    ownYearList: [{
        value: '70',
        label: 70
    }, {
        value: '50',
        label: 50
    }, {
        value: '40',
        label: 40
    }],

    // 楼栋是否
    buildingBoolList: [{
        value: true,
        label: '有'
    }, {
        value: false,
        label: '无'
    }],

    // 楼栋名后缀
    buildingSuffixList: [{
        value: '栋',
        label: '栋'
    }, {
        value: '座',
        label: '座'
    }, {
        value: '号',
        label: '号'
    }, {
        value: '幢',
        label: '幢'
    }, {
        value: '号楼',
        label: '号楼'
    }],
    /** ------- 业务薪资 ------**/
    taskStatus: [
        {
            value: 0,
            label: '计算中', // 实际状态是未开始，文案与1相同
        },
        {
            value: 1,
            label: '计算中'
        },
        {
            value: 2,
            label: '计算完成'
        },
        {
            value: 3,
            label: '计算失败'
        },
        {
            value: 4,
            label: '已发布'
        },
        {
            value: 5,
            label: '预发布'
        },
    ],
    // 计算类型
    taskType: [
        {
            value: 0,
            label: '试算',
        },
        {
            value: 1,
            label: '正式计算'
        },
    ],

    /** ------- 门店系统 ------**/
    // 付款状态
    payStatus: [
        {
            value: 0,
            label: '到期未付'
        },
        {
            value: 1,
            label: '未付清'
        },
        {
            value: 2,
            label: '结清'
        },
        {
            value: 3,
            label: '未到期'
        },
    ],

    /** ------- 门店装修工程 ------**/
    // 付款状态
    engStatus: [
        {
            value: 1,
            label: '准备中'
        },
        {
            value: 2,
            label: '进行中'
        },
        {
            value: 3,
            label: '已验收'
        },
        {
            value: 4,
            label: '已付款'
        },
        {
            value: 5,
            label: '结清'
        },
    ],

    /** ------- 门店资产 ------**/
    // 持有类型
    ownType: [
        {
            value: 1,
            label: '自购'
        },
        {
            value: 2,
            label: '租赁'
        },
    ],
    // 盘点状态
    checkStatus: [
        {
            value: 1,
            label: '暂存'
        },
        {
            value: 2,
            label: '未开始'
        },
        {
            value: 3,
            label: '完成'
        },
    ],

    /** ------- 异步文件下载 ------**/
    // 付款状态
    downloadStatus: [
        {
            value: 1,
            label: '导出中'
        },
        {
            value: 2,
            label: '导出完成'
        },
        {
            value: 3,
            label: '导出失败'
        }
    ],

    // 带看类型
    inspectType: [
        {
            value: 'keInspectType-buy',
            label: '二手'
        },
        {
            value: 'keInspectType-rent',
            label: '租赁'
        },
        {
            value: 'keInspectType-newHouse',
            label: '新房'
        },
    ],

    // 带看审批
    workflowStatus: [
        {
            value: 'keInspectProcess-approved',
            label: '带看审批通过',
            color: '#3DCA2E'
        },
        {
            value: 'keInspectProcess-approving',
            label: '带看审批中',
            color: '#FEAD14'
        },
        {
            value: 'keInspectProcess-unCommit',
            label: '未提交',
            color: '#3686FE'
        },
        {
            value: 'keInspectProcess-rejected',
            label: '带看审批驳回',
            color: '#F44A45'
        },
        {
            value: 'keInspectProcess-obsoleted',
            label: '带看作废',
            color: '#979B9E'
        },
        {
            value: 'keInspectProcess-cancel',
            label: '带看取消',
            color: '#979B9E'
        },
    ],

    // 签约审批状态
    signingStatus: [
        {
            value: 'signingInAudit',
            label: '签约审批中',
            color: '#FEAD14',
            icon: 'iconfont-spz'
        },
        {
            value: 'signingConfirm',
            label: '签约确认',
            color: '#3DCA2E',
            icon: 'iconfont-yqy'
        },
        {
            value: 'signingReject',
            label: '签约已驳回',
            color: '#F44A45',
            icon: 'iconfont-bh'
        },
        {
            value: 'signingRetreating',
            label: '签约解约中',
            color: '#F44A45',
            icon: 'iconfont-qyjyz'
        },
        {
            value: 'signingRetreated',
            label: '已解约',
            color: '#979B9E',
            icon: 'iconfont-yjy'
        },
        {
            value: 'signingCancel',
            label: '签约已取消',
            color: '#979B9E',
            icon: 'iconfont-yqx'
        },
    ],
}

export default dict
