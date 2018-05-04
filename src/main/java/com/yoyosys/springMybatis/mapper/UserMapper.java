package com.yoyosys.springMybatis.mapper;

import com.yoyosys.springMybatis.bean.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created with hzz
 * Description:
 *
 * @author: huangzhe
 * @date: 2018-05-03
 * @time: 2:33 PM
 */
@Component
public interface UserMapper {

     //@Select("select * from tb_student")
     List<User> getList();

     @Select("select * from tb_student")
     List<User> getList1();
}
