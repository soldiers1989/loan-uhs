package com.jhh.jhs.loan.service;

public interface TimerService {
	/**
	 * 还款短信
	 */
	void smsAlert();

	/**
	 * 逾期短信
	 */
	void smsOverdue();

}
