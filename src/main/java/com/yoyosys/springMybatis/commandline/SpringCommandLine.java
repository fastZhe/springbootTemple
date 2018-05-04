package com.yoyosys.springMybatis.commandline;

import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Created with hzz
 * Description:
 *
 * @author: huangzhe
 * @date: 2018-05-04
 * @time: 1:54 PM
 */
@Component
@Order(0)
public class SpringCommandLine implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        System.out.println(StringUtils.join(args," ::: "));
    }
}
