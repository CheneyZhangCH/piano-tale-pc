export const zero2TwentyEnum = [
    { label: 0, value: 0 },
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 },
    { label: 7, value: 7 },
    { label: 8, value: 8 },
    { label: 9, value: 9 },
    { label: 10, value: 10 },
    { label: 11, value: 11 },
    { label: 12, value: 12 },
    { label: 13, value: 13 },
    { label: 14, value: 14 },
    { label: 15, value: 15 },
    { label: 16, value: 16 },
    { label: 17, value: 17 },
    { label: 18, value: 18 },
    { label: 19, value: 19 },
    { label: 20, value: 20 }
]

export const newHouseTradeStatus = [
    { label: '认购审批中', value: 'subscriptionInAudit' },
    { label: '已认购', value: 'subscriptionConfirm' },
    { label: '认购已驳回', value: 'subscriptionReject' },
    { label: '认购解约中', value: 'subscriptionRetreating' },
    { label: '认购已退', value: 'subscriptionRetreated' },
    { label: '认购已取消', value: 'subscriptionCancel' },
    { label: '签约审批中', value: 'signingInAudit' },
    { label: '签约确认', value: 'signingConfirm' },
    { label: '签约已驳回', value: 'signingReject' },
    { label: '签约解约中', value: 'signingRetreating' },
    { label: '已解约', value: 'signingRetreated' },
    { label: '签约已取消', value: 'signingCancel' },
    { label: '业绩审批中', value: 'achievementInAudit' },
    { label: '业绩审批通过', value: 'achievementConfirm' },
    { label: '业绩审批驳回', value: 'achievementReject' },
    { label: '会签中', value: 'distributionPlanInAudit' },
    { label: '分成已确认', value: 'distributionPlanConfirm' },
    { label: '分成已驳回', value: 'distributionPlanReject' },
    { label: '收款确认中', value: 'receiveEditing' },
    { label: '收款审批中', value: 'receiveInAudit' },
    { label: '已到账', value: 'receiveConfirm' },
    { label: '收款已驳回', value: 'receiveReject' },
    { label: '作废审批中', value: 'receiveCancelInAudit' },
    { label: '作废已驳回', value: 'receiveCancelReject' },
    { label: '已作废', value: 'receiveCancelConfirm' },
    { label: '付款审批中', value: 'payInAudit' },
    { label: '付款已驳回', value: 'payReject' },
    { label: '付款成功', value: 'payConfirm' },
    { label: '付款失败', value: 'payFailed' },
    { label: '付款已作废', value: 'payCancelConfirm' },
]

// 附件类型
export const AFFIX_TYPE_CFG_UUID_MAPS = {
    houseCertFile: 'txAffixType-houseCert', // 产证
    customerCertificateFileList: 'txAffixType-customerCert', // 客户证件
    ownerCertificateFileList: 'txAffixType-proprietorCert', // 业主证件
    productionAdjustmentFile: 'txAffixType-productionAdjustment', // 产调
    notarizationAffix: 'txAffixType-notarizationAffix', // 合同 ? 需确认
    salesContractNotarizationAffix: 'txAffixType-salesContractNotarization', // 买卖合同 ？ 需确认

    intentionAgreeAffix: 'txAffixType-intentionAgree', // 意向协议
    intermediaryAgreeAffix: 'txAffixType-intermediaryAgree', // 居间协议
    discountAffix: 'txAffixType-discountAffix', // 折佣申请表
    authorizationAffix: 'txAffixType-authorizationAffix', // 委托书
    entrustingAffix: 'txAffixType-entrustingAffix', // 受托方证件
    riskAffix: 'txAffixType-riskAffix', // 风险告知书
    fundCustodyAbortAffix: 'txAffixType-fundCustodyAbortAffix', // 放弃资金托管声明书
    largestAmountAffix: 'txAffixType-largestAmountAffix', // 最高额数额承诺书
    relocationAffix: 'txAffixType-relocationAffix', // 动迁协议
    factIntroductionAffix: 'txAffixType-factIntroductionAffix', // 情况说明
    purchaseRestrictionAffix: 'txAffixType-purchaseRestrictionAffix', // 限购告知书
    subscriptionAgreeAffix: 'txAffixType-subscriptionAgree', // 认购合同
    inspectConfirmSheetAffix: 'txAffixType-inspectConfirmSheet', // 带看确认单
    agreementOfCommissionOutCome: 'txAffixType-agreementOfCommissionOutCome', // 返佣协议
    breakAgree: 'txAffixType-breakAgree', // 解约协议
    leaseContractAffix: 'txAffixType-leaseContract', // 租赁合同
    propertyDeliveryAffix: 'txAffixType-propertyDeliveryList', // 物业交割清单
    preSaleAffix: 'txAffixType-preSaleAffix', // 预售合同
    handOverAffix: 'txAffixType-handOverAffix', // 物业交割清单
    invoiceAffix: 'txAffixType-invoiceAffix', // 购房发票
    middleRentAffix: 'txAffixType-middleRentAffix', // 二房东租赁合同
    commissionConfirmationForCust: 'txAffixType-commissionConfirmationForCust', // 客户佣金确认书
    commissionConfirmationForProprietor: 'txAffixType-commissionConfirmationForProprietor', // 业主佣金确认书
    caseClosedVoucherList: 'txAffixType-caseClosedVoucher', // 结案凭证
    depositAgreement: 'txAffixType-depositAgreement', // 定金协议
    caoqianAgree: 'txAffixType-caoqianAgree', // 草签合同
}

// 各节点附件类型
export const TX_PHASE_AFFIX_TYPE_MAPS = {
    rentSigning: {
        houseInfo: ['houseCertFile', 'ownerCertificateFileList', 'customerCertificateFileList'],
        signingInfo: [
            'leaseContractAffix', 'propertyDeliveryAffix', 'authorizationAffix', 'entrustingAffix', 'discountAffix',
            'riskAffix', 'relocationAffix', 'preSaleAffix', 'handOverAffix', 'invoiceAffix', 'middleRentAffix',
        ],
    },
    newSubscription: {
        houseInfo: ['customerCertificateFileList'],
        subscriptionInfo: ['subscriptionAgreeAffix', 'inspectConfirmSheetAffix'],
    },
    newSigning: {
        houseInfo: ['houseCertFile', 'ownerCertificateFileList', 'customerCertificateFileList'],
        signingInfo: ['salesContractNotarizationAffix', 'inspectConfirmSheetAffix'],
    },
    saleIntention: {
        houseInfo: ['customerCertificateFileList'],
        intentionInfo: ['intentionAgreeAffix'],
    },
    saleEarnest: {
        houseInfo: ['houseCertFile', 'productionAdjustmentFile', 'ownerCertificateFileList', 'customerCertificateFileList'],
        transformInfo: [
            'intermediaryAgreeAffix', 'purchaseRestrictionAffix', 'discountAffix', 'authorizationAffix', 'entrustingAffix',
            'riskAffix', 'fundCustodyAbortAffix', 'largestAmountAffix', 'relocationAffix', 'factIntroductionAffix', 'depositAgreement'
        ],
    },
}

// 房源详情状态对应type
export const HOUSE_STATUS_TYPE = {
    toRent: 'rent',
    rentSell: 'sell',
    toSell: 'sell',
}

// 房源详情状态对应type
export const PATH_TO_HOUSE_ACTIVE = {
    '/fangyuan/sell': 'sell',
    '/fangyuan/rent': 'lease',
    '/fangyuan/waiting': 'waiting',
    '/fangyuan/sold': 'sold',
    '/fangyuan/other': 'other',
    '/fangyuan/all': 'all',
}
