package com.jhh.jhs.loan.service.impl;

import com.jhh.jhs.loan.dao.CommissionSummaryMapper;
import com.jhh.jhs.loan.service.CommissionSummaryService;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 佣金汇总业务逻辑实现
 * @author xingmin
 */
@Service
@Log4j
public class CommissionSummaryServiceImpl implements CommissionSummaryService {

    @Autowired
    private CommissionSummaryMapper commissionSummaryMapper;

    @Override
    public int doBussiness() {
        long start = System.currentTimeMillis();
        int count = commissionSummaryMapper.updateCommissionSummary();
        log.info(String.format("-----------> 佣金汇总任务执行完成, 耗时【%s】, 更新【%s】条记录", System.currentTimeMillis() - start, count));
        return count;
    }
}
