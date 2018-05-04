package com.yoyosys;

import com.yoyosys.springMybatis.mapper.UserMapper;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Created with hzz
 * Description:
 *
 * @author: huangzhe
 * @date: 2018-05-03
 * @time: 11:40 AM
 */
@SpringBootApplication
@MapperScan("com.yoyosys")
public class SpringMybatisStart {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 默认使用内嵌数据库做演示，也就是test环境，如果需要接入mysql，请改变对应的主配置文件的生产环境为dev，并注释此方法，
     * @param repo
     * @return
     */
    @Bean
    InitializingBean saveData(UserMapper repo){

        return ()->{
            jdbcTemplate.execute("create table tb_student(id int,age int,name varchar(100))");
            jdbcTemplate.execute("insert into tb_student values(1,12,'hello world')");
            jdbcTemplate.execute("insert into tb_student values(3,34,'hello world2')");
            jdbcTemplate.execute("insert into tb_student values(4,54,'hello world3')");
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringMybatisStart.class,args);
    }
}
