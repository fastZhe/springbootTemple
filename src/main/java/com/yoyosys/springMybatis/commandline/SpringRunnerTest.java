package com.yoyosys.springMybatis.commandline;

import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Created with hzz
 * Description:
 *
 * @author: huangzhe
 * @date: 2018-05-04
 * @time: 2:10 PM
 */
@Component
@Order(1)
public class SpringRunnerTest implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) throws Exception {

    }
}
