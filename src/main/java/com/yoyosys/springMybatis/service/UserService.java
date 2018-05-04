package com.yoyosys.springMybatis.service;

import com.github.pagehelper.PageHelper;
import com.yoyosys.springMybatis.bean.User;
import com.yoyosys.springMybatis.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created with hzz
 * Description:
 *
 * @author: huangzhe
 * @date: 2018-05-03
 * @time: 2:36 PM
 */
@Service
public class UserService {

    @Autowired
    private UserMapper mapper;


    @Transactional
    public List<User> getUserList(){
        PageHelper.startPage(1, 2);
        return mapper.getList();
    }

}
