package com.yoyosys.springMybatis.mapper;

import com.yoyosys.springMybatis.bean.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created with hzz
 * Description:
 *
 * @author: huangzhe
 * @date: 2018-05-04
 * @time: 9:52 AM
 */
@Mapper
public interface UserMapperByAno {

    @Select("select * from tb_student")
    List<User> getList();

}
