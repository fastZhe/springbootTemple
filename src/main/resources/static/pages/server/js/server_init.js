/*
    @remark: 服务器初始化参数配置模块
    @comment：在模态框中通过选择不同数据源，模态框中展示不同数据字段。
    该模块中定义各个数据源中所需属性，通过属性名称的数组集合去server_model中initObj返回的所有属性数组中过滤，找到匹配的属性的对象集合
    再通过该集合绘制前端dom
*/

define(['jquery'], function($){
    return {
        getType: function (dictCode) {  //文件类型映射表,
            var baseUrl = location.origin;//当前基地址
            var rootUrl = '../../pages/server/html/';
            var url = 'baseInfo/base.html';// default url
            switch (dictCode) {
                case "base" :
                    url = 'baseInfo/base.html';
                    break;
                case "mysql" :
                    url = 'dataBase/mysql/mysql.html';
                    break;   //mysql
                case "db2" :
                	url = 'dataBase/db2/db2.html';
                    break;   //db2
                case "hbase" :
                	url = 'dataBase/hbase/hbase.html';
                    break;   //Hbase
                case "oracle" :
                	url = 'dataBase/oracle/oracle.html';
                    break;   //oracle
                case "kingbase" :
                	url = 'dataBase/kingbase/kingbase.html';
                    break;   //kingbase
                case "sqlserver" :
                	url = 'dataBase/sqlserver/sqlserver.html';
                    break;   //sqlserver
                case "postgresql" :
                	url = 'dataBase/postgresql/postgresql.html';
                    break;   //postgresql
                case "gbase" :
                	url = 'dataBase/gbase/gbase.html';
                    break;   //GBase
                case "mongodb" :
                	url = 'dataBase/mongodb/mongodb.html';
                    break;   //mongodb
                case "datacelldb" :
                	url = 'dataBase/datacelldb/datacelldb.html';
                    break;   //友友分布式数据库
                case "emr" :
                	url = 'dataBase/emr/emr.html';
                    break;   //航天科工的定制开发
                case "dameng" :
                	url = 'dataBase/dameng/dameng.html';
                    break;   //达梦数据库
                case "dqe" :
                	url = 'dataBase/dqe/dqe.html';
                    break;   //DataCell QueryEngine
                case "hive" :
                	url = 'dataBase/hive/hive.html';
                    break;  //hive
                case "dap"  :
                	url = 'dataBase/dap/dap.html';
                    break; //dap
                case "kunlun" :
                	url = 'dataBase/kunlun/kunlun.html';
                    break;   //昆仑数据库
                case "shentong" :
                	url = 'dataBase/shentong/shentong.html';
                    break;   //神通数据库
                case "xml_file" :   //
                	url = 'dataBase/xml_file/xml_file.html';
                    break;   //XML文件
                case "ftp_text_file" :  //权限认证必须为是
                	url = 'fileProcess/ftp_text_file/ftp_text_file.html';
                    break;   //ftp文本文件
                case "sftp_text_file" : //权限认证必须为是
                	url = 'fileProcess/sftp_text_file/sftp_text_file.html';
                    break;   //sftp文本文件
                case "local_text_file" ://没有权限认证，也没有ip和端口
                	url = 'fileProcess/local_text_file/local_text_file.html';
                    break;   //local文本文件
                case "hdfs_text_file" : //权限认证必须为是
                	url = 'fileProcess/hdfs_text_file/hdfs_text_file.html';
                    break;   //hdfs文本文件
                case "101010301" :
                    break;   //META
                case "101010401" :
                    break;   //KAFA
                case "101010402" ://db 叫Service 没有auth
                    break;   //bitsFlow
                case "local_file" :// 没有auth
                	url = 'fileTransfer/local_file/local_file.html';
                    break;   //local文件
                case "datacell_file" :
                	url = 'fileTransfer/datacell_file/datacell_file.html';
                    break;   //datacell_fs
            }
            return baseUrl.concat( rootUrl ).concat( url ) ;
        }
    };//end of return
});