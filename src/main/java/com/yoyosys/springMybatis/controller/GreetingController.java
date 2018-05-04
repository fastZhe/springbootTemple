package com.yoyosys.springMybatis.controller;

import com.yoyosys.springMybatis.bean.User;
import com.yoyosys.springMybatis.mapper.UserMapper;
import com.yoyosys.springMybatis.mapper.UserMapperByAno;
import com.yoyosys.springMybatis.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with hzz
 * Description:
 *
 * @author: huangzhe
 * @date: 2018-05-03
 * @time: 11:47 AM
 */
@RestController
@RequestMapping("/hello")
public class GreetingController {

    private static Logger logger= LoggerFactory.getLogger(GreetingController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    private final  UserMapperByAno userMapperByAno;

    @Autowired//通过构造函数注入
    public GreetingController(UserMapperByAno userMapperByAno){
        this.userMapperByAno=userMapperByAno;
    }

    @RequestMapping(path = "/greet",method = {RequestMethod.POST})
    @ResponseBody
    public Map greeting(){
        Map<String,String> map=new HashMap<>(2);
        map.put("1","2");
        map.put("hello","world");
        return map;
    }

    @PostMapping("/greeting")
    @ResponseBody
    public List greeting3(){
        Map<String,String> map=new HashMap<>(2);
        map.put("1234","s1212");
        map.put("hello","world");
        return userMapper.getList1();
    }


    @RequestMapping(path = "/greeting1",method = {RequestMethod.POST})
    @ResponseBody
    public List<User> greeting(HttpServletRequest request){
        logger.info(request.getParameter("jsonStr"));
        Map<String,String> map=new HashMap<>(2);
        map.put("1","8");
        map.put("hello","world");
        logger.info("hello");
        return userMapperByAno.getList();
    }

    @CrossOrigin(origins = {"https://www.baidu.com"})
    @RequestMapping(path = "/greeting2",method = {RequestMethod.POST})
    @ResponseBody
    public List<User> greeting2(){
        logger.info("hello  ok");
        return userService.getUserList();
    }


    @RequestMapping(path = "/greeting3",method = {RequestMethod.POST})
    @ResponseBody
    public List<User> greeting2(@RequestBody String msg){
        logger.info(msg);
        return userService.getUserList();
    }

}
