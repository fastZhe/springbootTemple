package com.yoyosys.springMybatis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with hzz
 * Description:
 *
 * @author: huangzhe
 * @date: 2018-05-03
 * @time: 4:21 PM
 */
@Controller
public class IndexController {
    Logger logger= LoggerFactory.getLogger(IndexController.class);

    @RequestMapping("/")
    public String indexHtml() {
        logger.info("hello world");
        //return "pages/index/index.html";
        return "主页.html";
    }

}
