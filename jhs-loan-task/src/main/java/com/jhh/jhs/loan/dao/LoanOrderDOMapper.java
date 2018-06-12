package com.jhh.jhs.loan.dao;

import com.jhh.jhs.loan.entity.app.BorrowList;
import com.jhh.jhs.loan.entity.loan.BorrowDeductions;
import com.jhh.jhs.loan.model.LoanOrderDO;
import com.jhh.jhs.loan.model.LoanOrderDOExample;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface LoanOrderDOMapper {
    int countByExample(LoanOrderDOExample example);

    int deleteByExample(LoanOrderDOExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(LoanOrderDO record);

    int insertSelective(LoanOrderDO record);

    List<LoanOrderDO> selectByExample(LoanOrderDOExample example);

    LoanOrderDO selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") LoanOrderDO record, @Param("example") LoanOrderDOExample example);

    int updateByExample(@Param("record") LoanOrderDO record, @Param("example") LoanOrderDOExample example);

    int updateByPrimaryKeySelective(LoanOrderDO record);

    int updateByPrimaryKey(LoanOrderDO record);
    /**
     * 查询当天催收人催收逾期八天的还款金额
     * @return
     */
    String selectRepaymentAmountOverdueEightFiveOclock(Map map);
    /**
     * 查询昨天催收人催收逾期八天的还款金额
     * @return
     */
    String selectRepaymentAmountOverdueEightNineOclock(Map map);

    /**
     *
     /**
     * 查询逾期未还的合同的一天内的最近一笔订单状态和订单失败的原因
     *
     * @return
     */
    List<BorrowDeductions> selectOverDueOrderStatus();

    List<BorrowDeductions> selectBankCardError();

    List<LoanOrderDO> selectOrderByDeduct();

    List<LoanOrderDO> selectOrderByBatchDeduct();
}